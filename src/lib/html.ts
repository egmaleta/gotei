import { Gotei } from "./ns";
import { effect } from "./state";
import {
  $HOOKS,
  OrArray,
  extractAttr,
  flatten,
  addEventListener,
  setAttribute,
  cls2Tokens,
  setCSSVar,
  setCSSProp,
  renderChildren,
} from "./utils";

const EVENT_LISTENER_PREFIX = "on-";
const CSS_VAR_PREFIX = "--";

class HTMLVNode<T extends Gotei.Tag>
  implements Gotei.VNode<HTMLElementTagNameMap[T]>
{
  constructor(
    private tag: T,
    private attrs: Gotei.Attrs<T>,
    private children: Gotei.Child[]
  ) {}
  render() {
    const el = document.createElement(this.tag);

    const bindThis = extractAttr(this.attrs, "bind-this");
    const bindValue = extractAttr(this.attrs, "bind-value");
    const use = extractAttr(this.attrs, "use");
    const classList = extractAttr(this.attrs, "class-list");
    const classRecord = extractAttr(this.attrs, "class-record");
    const styleRecord = extractAttr(this.attrs, "style-record");

    for (const name in this.attrs) {
      const attr = this.attrs[name];

      if (name.startsWith(EVENT_LISTENER_PREFIX)) {
        addEventListener(el, name.slice(EVENT_LISTENER_PREFIX.length), attr);
      } else if (typeof attr !== "function") {
        setAttribute(el, name, attr);
      } else {
        effect(() => {
          setAttribute(el, name, attr());
        });
      }
    }

    if (bindValue) {
      const [value, setValue] = bindValue;

      effect(() => {
        setAttribute(el, "value", value());
      });
      addEventListener(el, "input", (ev: any) =>
        setValue(ev.currentTarget.value)
      );
    }

    if (classList) {
      for (const cls of classList) {
        if (typeof cls !== "function") {
          el.classList.add(...cls2Tokens(cls));
        } else {
          let tokens: string[] = [];

          effect(() => {
            el.classList.remove(...tokens);
            tokens = cls2Tokens(cls());
            el.classList.add(...tokens);
          });
        }
      }
    }

    if (classRecord) {
      for (const cls in classRecord) {
        const ok = classRecord[cls];

        const tokens = cls2Tokens(cls);
        if (tokens.length === 0) continue;

        if (typeof ok !== "function") {
          ok && el.classList.add(...tokens);
        } else {
          effect(() => {
            if (ok()) {
              el.classList.add(...tokens);
            } else {
              el.classList.remove(...tokens);
            }
          });
        }
      }
    }

    if (styleRecord) {
      for (const prop in styleRecord) {
        // @ts-ignore
        const value = styleRecord[prop];

        const setFunction = prop.startsWith(CSS_VAR_PREFIX)
          ? setCSSVar
          : setCSSProp;

        if (typeof value !== "function") {
          setFunction(el, prop, value);
        } else {
          effect(() => {
            setFunction(el, prop, value());
          });
        }
      }
    }

    for (const child of renderChildren(this.children)) {
      el.appendChild(child);
    }

    const hooks = [];
    if (bindThis) {
      hooks.push(bindThis.bind(el));
    }
    if (use) {
      if (Array.isArray(use)) {
        for (const f of use) hooks.push(f.bind(el));
      } else {
        hooks.push(use.bind(el));
      }
    }
    Object.defineProperty(el, $HOOKS, { value: hooks });

    return el;
  }
}

export function html<T extends Gotei.Tag>(
  tag: T,
  attrs: Gotei.Attrs<T>,
  ...children: OrArray<Gotei.Child>[]
) {
  return new HTMLVNode(tag, attrs, flatten(children));
}

type Tags = {
  [T in Gotei.Tag]: {
    (attrs: Gotei.Attrs<T>, ...children: OrArray<Gotei.Child>[]): HTMLVNode<T>;
    (...children: OrArray<Gotei.Child>[]): HTMLVNode<T>;
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
            return html(tag, head, ...args.slice(1));
          }
        }

        return html(tag, {}, ...args);
      };
    },
  }
) as Tags;
