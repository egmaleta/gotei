var h = Object.defineProperty;
var b = (n, e, t) => e in n ? h(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var i = (n, e, t) => (b(n, typeof e != "symbol" ? e + "" : e, t), t);
let r = [];
function y(n) {
  const e = r;
  r = [];
  const t = n();
  return r = e, t;
}
class d {
  constructor(e) {
    i(this, "callback");
    this.callback = e, this.run();
  }
  run() {
    r.push(this), this.callback(y), r.pop();
  }
}
class p {
  constructor(e) {
    i(this, "value");
    i(this, "deps");
    this.value = e, this.deps = [];
  }
  sub(e) {
    this.deps.includes(e) || this.deps.push(e);
  }
  pub() {
    for (const e of this.deps)
      e.run();
  }
  get() {
    const e = r.at(-1);
    return e && this.sub(e), this.value;
  }
  set(e) {
    e !== this.value && (this.value = e, this.pub());
  }
}
function g(n) {
  const e = new p(n);
  return Object.assign(e.get.bind(e), {
    set: e.set.bind(e),
    map: (t) => e.set(t(e.get()))
  });
}
function a(n) {
  new d(n);
}
function N(n) {
  const e = new p(null);
  return new d((t) => {
    e.set(n(t));
  }), e.get.bind(e);
}
const c = Symbol();
function E(n) {
  return n[c] === "text";
}
function u(n, e, t) {
  return { [c]: n, props: e, children: t };
}
const j = new Proxy(Object.prototype, {
  get(n, e) {
    return (...t) => {
      if (e !== "text" && t.length > 0) {
        const s = t[0];
        if (typeof s == "object" && s !== null && typeof s[c] > "u")
          return u(e, s, t.slice(1));
      }
      return u(e, {}, t);
    };
  }
}), f = "on";
function x(n, e, t) {
  const s = Array.isArray(t) ? t : [t];
  for (const o of s)
    typeof o == "function" ? n.addEventListener(e, o) : n.addEventListener(e, o.handler, o.options);
}
function l(n, e, t) {
  typeof t == "string" || typeof t == "number" ? n.setAttribute(e, `${t}`) : t === !0 ? n.setAttribute(e, "") : n.removeAttribute(e);
}
function T(n) {
  if (n.children.length === 0)
    return document.createTextNode("");
  const e = n.children.map((s) => {
    if (typeof s != "function")
      return document.createTextNode(`${s}`);
    const o = document.createTextNode("");
    return a(() => o.replaceData(0, o.length, `${s()}`)), o;
  });
  if (e.length === 1)
    return e[0];
  const t = document.createElement("span");
  return t.append(...e), t;
}
function m(n) {
  if (E(n))
    return T(n);
  const e = document.createElement(n[c]);
  for (const [t, s] of Object.entries(n.props))
    t.startsWith(f) ? x(e, t.slice(f.length), s) : typeof s != "function" ? l(e, t, s) : a(() => {
      l(e, t, s());
    });
  for (const t of n.children)
    typeof t == "object" ? t && e.appendChild(m(t)) : typeof t < "u" && typeof t != "boolean" && e.appendChild(document.createTextNode(`${t}`));
  return e;
}
export {
  j as TAGS,
  N as derived,
  a as effect,
  u as h,
  m as render,
  g as signal
};
