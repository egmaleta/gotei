var h = Object.defineProperty;
var b = (n, t, e) => t in n ? h(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var c = (n, t, e) => (b(n, typeof t != "symbol" ? t + "" : t, e), e);
let r = [];
function y(n) {
  const t = r;
  r = [];
  const e = n();
  return r = t, e;
}
class p {
  constructor(t) {
    c(this, "callback");
    this.callback = t, this.run();
  }
  run() {
    r.push(this), this.callback(y), r.pop();
  }
}
class d {
  constructor(t) {
    c(this, "value");
    c(this, "deps");
    this.value = t, this.deps = [];
  }
  sub(t) {
    this.deps.includes(t) || this.deps.push(t);
  }
  pub() {
    for (const t of this.deps)
      t.run();
  }
  get() {
    const t = r.at(-1);
    return t && this.sub(t), this.value;
  }
  set(t) {
    t !== this.value && (this.value = t, this.pub());
  }
}
function g(n) {
  const t = new d(n);
  return Object.assign(t.get.bind(t), {
    set: t.set.bind(t),
    map: (e) => t.set(e(t.get()))
  });
}
function a(n) {
  new p(n);
}
function N(n) {
  const t = new d(null);
  return new p((e) => {
    t.set(n(e));
  }), t.get.bind(t);
}
const i = Symbol();
function E(n) {
  return n[i] === "text";
}
function u(n, t, e) {
  return { [i]: n, props: t, children: e };
}
const j = new Proxy(Object.prototype, {
  get(n, t) {
    return (...e) => {
      if (t !== "text" && e.length > 0) {
        const s = e[0];
        if (typeof s == "object" && s !== null && typeof s[i] > "u")
          return u(t, s, e.slice(1));
      }
      return u(t, {}, e);
    };
  }
}), f = "on";
function x(n, t, e) {
  const s = Array.isArray(e) ? e : [e];
  for (const o of s)
    typeof o == "function" ? n.addEventListener(t, o) : n.addEventListener(t, o.handler, o.options);
}
function l(n, t, e) {
  typeof e == "string" || typeof e == "number" ? n.setAttribute(t, `${e}`) : e === !0 ? n.setAttribute(t, "") : n.removeAttribute(t);
}
function T(n) {
  if (n.children.length === 0)
    return document.createTextNode("");
  const t = n.children.map((s) => {
    if (typeof s != "function")
      return document.createTextNode(`${s}`);
    const o = document.createTextNode("");
    return a(() => o.replaceData(0, o.length, `${s()}`)), o;
  });
  if (t.length === 1)
    return t[0];
  const e = document.createElement("span");
  return e.append(...t), e;
}
function m(n) {
  if (E(n))
    return T(n);
  const t = document.createElement(n[i]);
  for (const [e, s] of Object.entries(n.props))
    e.startsWith(f) ? x(t, e.slice(f.length), s) : typeof s != "function" ? l(t, e, s) : a(() => {
      l(t, e, s());
    });
  for (const e of n.children)
    typeof e == "object" ? e && t.appendChild(m(e)) : typeof e < "u" && typeof e != "boolean" && t.appendChild(document.createTextNode(`${e}`));
  return t;
}
export {
  j as TAGS,
  N as computed,
  a as effect,
  u as h,
  m as render,
  g as signal
};
