var d = Object.defineProperty;
var h = (n, e, t) => e in n ? d(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var r = (n, e, t) => (h(n, typeof e != "symbol" ? e + "" : e, t), t);
let c = [];
function b(n) {
  const e = c;
  c = [];
  const t = n();
  return c = e, t;
}
class i {
  constructor(e, t) {
    r(this, "callback");
    r(this, "isUIEffect");
    this.callback = e, this.isUIEffect = t, this.run();
  }
  run() {
    c.push(this), this.callback(b), c.pop();
  }
}
class a {
  constructor(e) {
    r(this, "value");
    r(this, "uiDeps", []);
    r(this, "deps", []);
    this.value = e;
  }
  sub(e) {
    const t = e.isUIEffect ? this.uiDeps : this.deps;
    !t.includes(e) && t.push(e);
  }
  pub() {
    for (const e of this.uiDeps)
      e.run();
    for (const e of this.deps)
      e.run();
  }
  get() {
    const e = c.at(-1);
    return e && this.sub(e), this.value;
  }
  set(e) {
    e !== this.value && (this.value = e, this.pub());
  }
}
function T(n) {
  const e = new a(n);
  return Object.assign(e.get.bind(e), {
    set: e.set.bind(e),
    map: (t) => e.set(t(e.get()))
  });
}
function N(n) {
  new i(n, !1);
}
function w(n) {
  const e = new a(null);
  return new i((t) => {
    e.set(n(t));
  }, !1), e.get.bind(e);
}
const u = Symbol();
function f(n, e, t) {
  return { [u]: n, props: e, children: t };
}
const A = new Proxy(Object.prototype, {
  get(n, e) {
    return (...t) => {
      if (e !== "text" && t.length > 0) {
        const s = t[0];
        if (typeof s == "object" && s !== null && typeof s[u] > "u")
          return f(e, s, t.slice(1));
      }
      return f(e, {}, t);
    };
  }
}), l = "on";
function y(n, e, t) {
  const s = Array.isArray(t) ? t : [t];
  for (const o of s)
    typeof o == "function" ? n.addEventListener(e, o) : n.addEventListener(e, o.handler, o.options);
}
function p(n, e, t) {
  typeof t == "string" || typeof t == "number" ? n.setAttribute(e, `${t}`) : t === !0 ? n.setAttribute(e, "") : n.removeAttribute(e);
}
function E(n) {
  if (n.children.length === 0)
    return document.createTextNode("");
  const e = n.children.map((s) => {
    if (typeof s != "function")
      return document.createTextNode(`${s}`);
    const o = document.createTextNode("");
    return new i(() => o.replaceData(0, o.length, `${s()}`), !0), o;
  });
  if (e.length === 1)
    return e[0];
  const t = document.createElement("span");
  return t.append(...e), t;
}
function m(n) {
  return n[u] === "text";
}
function x(n) {
  if (m(n))
    return E(n);
  const e = document.createElement(n[u]);
  for (const [t, s] of Object.entries(n.props))
    t.startsWith(l) ? y(e, t.slice(l.length), s) : typeof s != "function" ? p(e, t, s) : new i(() => {
      p(e, t, s());
    }, !0);
  for (const t of n.children)
    typeof t == "object" ? t && e.appendChild(x(t)) : typeof t < "u" && typeof t != "boolean" && e.appendChild(document.createTextNode(`${t}`));
  return e;
}
export {
  w as computed,
  N as effect,
  f as h,
  x as render,
  T as signal,
  A as tags
};
