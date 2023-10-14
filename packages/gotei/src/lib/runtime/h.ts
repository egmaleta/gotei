import { Effect } from "../state/effect";
import { Gotei } from "./ns";
import { OrArray, MountFunction, mount, MountContext, AnyProps } from "./utils";

const EVENT_LISTENER_PREFIX = "on:";
const CSS_VAR_PREFIX = "--";
const WHITESPACE = /\s+/;

function setCSSVar(el: HTMLElement, prop: string, value: string) {
  el.style.setProperty(prop, value);
}

function setCSSProp(el: HTMLElement, prop: any, value: string) {
  el.style[prop] = value;
}

function cls2Tokens(cls: string) {
  return cls.trim().split(WHITESPACE);
}

function addEventListener(target: EventTarget, name: string, handler: any) {
  const handlers = Array.isArray(handler) ? handler : [handler];

  for (const handler of handlers) {
    if (typeof handler === "function") {
      target.addEventListener(name, handler);
    } else {
      target.addEventListener(name, handler.handler, handler.options);
    }
  }
}

function setAttribute(el: Element, name: string, attr: any) {
  if (typeof attr === "string" || typeof attr === "number") {
    el.setAttribute(name, `${attr}`);
  } else if (attr === true) {
    el.setAttribute(name, "");
  } else {
    el.removeAttribute(name);
  }
}

function* flatten<T>(maybeArray: OrArray<T>): Generator<T> {
  if (!Array.isArray(maybeArray)) {
    yield maybeArray;
  } else {
    for (const x of maybeArray) for (const y of flatten(x)) yield y;
  }
}

function mountChildren(ctx: MountContext, children: Gotei.Child[]) {
  const nodes: Node[] = [];

  for (const child of children) {
    if (typeof child === "function") {
      const mounted = child(ctx);

      if (Array.isArray(mounted)) {
        nodes.push(...mounted);
      } else if (mounted) {
        nodes.push(mounted);
      }
    } else if (typeof child === "string" || typeof child === "number") {
      nodes.push(
        ctx.parent.appendChild(ctx.document.createTextNode(`${child}`))
      );
      ctx.childIndex++;
    }
  }

  return nodes;
}

function html<T extends Gotei.Tag>(
  tag: T,
  props: Gotei.Attrs<T>,
  children: Gotei.Child[]
): MountFunction<HTMLElementTagNameMap[T]> {
  return (ctx) => {
    const el = ctx.document.createElement(tag);

    const {
      "bind:this": bindThis,
      "bind:value": bindValue,
      use,
      "class:list": classList,
      "class:record": classRecord,
      "style:record": styleRecord,
      ...rest
    } = props;

    for (const [name, prop] of Object.entries(rest)) {
      if (name.startsWith(EVENT_LISTENER_PREFIX)) {
        addEventListener(el, name.slice(EVENT_LISTENER_PREFIX.length), prop);
      } else if (typeof prop !== "function") {
        setAttribute(el, name, prop);
      } else {
        new Effect(() => {
          setAttribute(el, name, prop());
        }, true);
      }
    }

    if (bindValue) {
      const isNumber = typeof bindValue() === "number";

      new Effect(() => {
        setAttribute(el, "value", bindValue());
      }, true);
      addEventListener(el, "input", (ev: any) => {
        const value = ev.currentTarget.value;
        // @ts-ignore
        bindValue.set(isNumber ? Number.parseFloat(value) : value);
      });
    }

    if (classList) {
      for (const cls of classList) {
        if (typeof cls !== "function") {
          el.classList.add(...cls2Tokens(cls));
        } else {
          let tokens: string[] = [];

          new Effect(() => {
            el.classList.remove(...tokens);
            tokens = cls2Tokens(cls());
            el.classList.add(...tokens);
          }, true);
        }
      }
    }

    if (classRecord) {
      for (const [cls, ok] of Object.entries(classRecord)) {
        const tokens = cls2Tokens(cls);
        if (tokens.length === 0) continue;

        if (typeof ok !== "function") {
          ok && el.classList.add(...tokens);
        } else {
          new Effect(() => {
            if (ok()) {
              el.classList.add(...tokens);
            } else {
              el.classList.remove(...tokens);
            }
          }, true);
        }
      }
    }

    if (styleRecord) {
      for (const [prop, value] of Object.entries(styleRecord)) {
        const setFunction = prop.startsWith(CSS_VAR_PREFIX)
          ? setCSSVar
          : setCSSProp;

        if (typeof value !== "function") {
          setFunction(el, prop, value);
        } else {
          new Effect(() => {
            setFunction(el, prop, value());
          }, true);
        }
      }
    }

    mount(el, ctx.parent, ctx.childIndex);
    ctx.childIndex++;

    const thisCtx = { document: ctx.document, parent: el, childIndex: 0 };
    mountChildren(thisCtx, children);

    // @ts-ignore
    bindThis?.set(el);

    if (use) {
      if (Array.isArray(use)) {
        // @ts-ignore
        for (const f of use) f(el);
      } else {
        // @ts-ignore
        use(el);
      }
    }

    return el;
  };
}

type GetProps<T extends Gotei.Tag | Gotei.Component> = T extends Gotei.Tag
  ? Gotei.Attrs<T>
  : T extends Gotei.Component<infer P>
  ? P
  : never;

function isComponent(x: Gotei.Tag | Gotei.Component): x is Gotei.Component {
  return typeof x === "function";
}

export function h<P extends AnyProps, C extends Gotei.Child>(
  fc: Gotei.Component<P, C>,
  props: P,
  children: C[]
): MountFunction<OrArray<Node>>;

export function h<T extends Gotei.Tag>(
  tag: T,
  props: Gotei.Attrs<T>,
  children: Gotei.Child[]
): MountFunction<HTMLElementTagNameMap[T]>;

export function h<T extends Gotei.Tag | Gotei.Component>(
  x: T,
  props: GetProps<T>,
  children: Gotei.Child[]
) {
  if (isComponent(x)) {
    return (ctx: MountContext) => {
      return mountChildren(ctx, [...flatten(x(props, children))]);
    };
  }
  return html(x, props, children);
}

type Tags = {
  [T in Gotei.Tag]: {
    (
      props: Gotei.Attrs<T>,
      ...children: OrArray<Gotei.Child>[]
    ): MountFunction<HTMLElementTagNameMap[T]>;
    (
      ...children: OrArray<Gotei.Child>[]
    ): MountFunction<HTMLElementTagNameMap[T]>;
  };
};

export const tags = new Proxy(
  {},
  {
    get(_, tag: any) {
      return (...args: any[]) => {
        if (args.length > 0) {
          const head = args[0];
          if (typeof head === "object" && head && !Array.isArray(head)) {
            return html(tag, head, [...flatten(args.slice(1))]);
          }
        }

        return html(tag, {}, [...flatten(args)]);
      };
    },
  }
) as Tags;
