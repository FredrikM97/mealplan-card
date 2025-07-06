var $e = (o) => {
  throw TypeError(o);
};
var be = (o, e, t) => e.has(o) || $e("Cannot " + t);
var D = (o, e, t) => (be(o, e, "read from private field"), t ? t.call(o) : e.get(o)), T = (o, e, t) => e.has(o) ? $e("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), $ = (o, e, t, s) => (be(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = globalThis, ue = ee.ShadowRoot && (ee.ShadyCSS === void 0 || ee.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, pe = Symbol(), we = /* @__PURE__ */ new WeakMap();
let Re = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ue && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = we.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && we.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ie = (o) => new Re(typeof o == "string" ? o : o + "", void 0, pe), me = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new Re(t, o, pe);
}, Le = (o, e) => {
  if (ue) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = ee.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, Ae = ue ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ie(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ze, defineProperty: Be, getOwnPropertyDescriptor: Ve, getOwnPropertyNames: qe, getOwnPropertySymbols: We, getPrototypeOf: Je } = Object, w = globalThis, Ee = w.trustedTypes, Ge = Ee ? Ee.emptyScript : "", re = w.reactiveElementPolyfillSupport, B = (o, e) => o, te = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Ge : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, fe = (o, e) => !ze(o, e), xe = { attribute: !0, type: String, converter: te, reflect: !1, useDefault: !1, hasChanged: fe };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let R = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = xe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Be(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = Ve(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const r = i == null ? void 0 : i.call(this);
      n == null || n.call(this, a), this.requestUpdate(e, r, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? xe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const e = Je(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const t = this.properties, s = [...qe(t), ...We(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(Ae(i));
    } else e !== void 0 && t.push(Ae(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Le(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) == null ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) == null ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    var n;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const a = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : te).toAttribute(t, s.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, a;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), l = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : te;
      this._$Em = i, this[i] = l.fromAttribute(t, r.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, a = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? fe)(a, t) || s.useDefault && s.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: n }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, a] of i) {
        const { wrapped: r } = a, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, a, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[B("elementProperties")] = /* @__PURE__ */ new Map(), R[B("finalized")] = /* @__PURE__ */ new Map(), re == null || re({ ReactiveElement: R }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, se = V.trustedTypes, Se = se ? se.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Ue = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, Fe = "?" + b, Ke = `<${Fe}>`, O = document, q = () => O.createComment(""), W = (o) => o === null || typeof o != "object" && typeof o != "function", ge = Array.isArray, Ze = (o) => ge(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", le = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ce = /-->/g, Me = />/g, C = RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ke = /'/g, Oe = /"/g, He = /^(?:script|style|textarea|title)$/i, Ye = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), p = Ye(1), I = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), Pe = /* @__PURE__ */ new WeakMap(), M = O.createTreeWalker(O, 129);
function Ne(o, e) {
  if (!ge(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Se !== void 0 ? Se.createHTML(e) : e;
}
const Qe = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = z;
  for (let r = 0; r < t; r++) {
    const l = o[r];
    let c, d, h = -1, u = 0;
    for (; u < l.length && (a.lastIndex = u, d = a.exec(l), d !== null); ) u = a.lastIndex, a === z ? d[1] === "!--" ? a = Ce : d[1] !== void 0 ? a = Me : d[2] !== void 0 ? (He.test(d[2]) && (i = RegExp("</" + d[2], "g")), a = C) : d[3] !== void 0 && (a = C) : a === C ? d[0] === ">" ? (a = i ?? z, h = -1) : d[1] === void 0 ? h = -2 : (h = a.lastIndex - d[2].length, c = d[1], a = d[3] === void 0 ? C : d[3] === '"' ? Oe : ke) : a === Oe || a === ke ? a = C : a === Ce || a === Me ? a = z : (a = C, i = void 0);
    const g = a === C && o[r + 1].startsWith("/>") ? " " : "";
    n += a === z ? l + Ke : h >= 0 ? (s.push(c), l.slice(0, h) + Ue + l.slice(h) + b + g) : l + b + (h === -2 ? r : g);
  }
  return [Ne(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class J {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const r = e.length - 1, l = this.parts, [c, d] = Qe(e, t);
    if (this.el = J.createElement(c, s), M.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = M.nextNode()) !== null && l.length < r; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(Ue)) {
          const u = d[a++], g = i.getAttribute(h).split(b), P = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: n, name: P[2], strings: g, ctor: P[1] === "." ? et : P[1] === "?" ? tt : P[1] === "@" ? st : oe }), i.removeAttribute(h);
        } else h.startsWith(b) && (l.push({ type: 6, index: n }), i.removeAttribute(h));
        if (He.test(i.tagName)) {
          const h = i.textContent.split(b), u = h.length - 1;
          if (u > 0) {
            i.textContent = se ? se.emptyScript : "";
            for (let g = 0; g < u; g++) i.append(h[g], q()), M.nextNode(), l.push({ type: 2, index: ++n });
            i.append(h[u], q());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Fe) l.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(b, h + 1)) !== -1; ) l.push({ type: 7, index: n }), h += b.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = O.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(o, e, t = o, s) {
  var a, r;
  if (e === I) return e;
  let i = s !== void 0 ? (a = t._$Co) == null ? void 0 : a[s] : t._$Cl;
  const n = W(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((r = i == null ? void 0 : i._$AO) == null || r.call(i, !1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = L(o, i._$AS(o, e.values), i, s)), e;
}
class Xe {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? O).importNode(t, !0);
    M.currentNode = i;
    let n = M.nextNode(), a = 0, r = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let c;
        l.type === 2 ? c = new X(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new it(n, this, e)), this._$AV.push(c), l = s[++r];
      }
      a !== (l == null ? void 0 : l.index) && (n = M.nextNode(), a++);
    }
    return M.currentNode = O, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class X {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = L(this, e, t), W(e) ? e === f || e == null || e === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : e !== this._$AH && e !== I && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ze(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== f && W(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = J.createElement(Ne(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const a = new Xe(i, this), r = a.u(this.options);
      a.p(t), this.T(r), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = Pe.get(e.strings);
    return t === void 0 && Pe.set(e.strings, t = new J(e)), t;
  }
  k(e) {
    ge(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new X(this.O(q()), this.O(q()), this, this.options)) : s = t[i], s._$AI(n), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class oe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = f;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = L(this, e, t, 0), a = !W(e) || e !== this._$AH && e !== I, a && (this._$AH = e);
    else {
      const r = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = L(this, r[s + l], t, l), c === I && (c = this._$AH[l]), a || (a = !W(c) || c !== this._$AH[l]), c === f ? e = f : e !== f && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class et extends oe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === f ? void 0 : e;
  }
}
class tt extends oe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== f);
  }
}
class st extends oe {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = L(this, e, t, 0) ?? f) === I) return;
    const s = this._$AH, i = e === f && s !== f || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== f && (s === f || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class it {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    L(this, e);
  }
}
const he = V.litHtmlPolyfillSupport;
he == null || he(J, X), (V.litHtmlVersions ?? (V.litHtmlVersions = [])).push("3.3.0");
const ot = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new X(e.insertBefore(q(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class A extends R {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ot(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return I;
  }
}
var Te;
A._$litElement$ = !0, A.finalized = !0, (Te = k.litElementHydrateSupport) == null || Te.call(k, { LitElement: A });
const ce = k.litElementPolyfillSupport;
ce == null || ce({ LitElement: A });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = { attribute: !0, type: String, converter: te, reflect: !1, hasChanged: fe }, at = (o = nt, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), n.set(t.name, o), s === "accessor") {
    const { name: a } = t;
    return { set(r) {
      const l = e.get.call(this);
      e.set.call(this, r), this.requestUpdate(a, l, o);
    }, init(r) {
      return r !== void 0 && this.C(a, void 0, o, r), r;
    } };
  }
  if (s === "setter") {
    const { name: a } = t;
    return function(r) {
      const l = this[a];
      e.call(this, r), this.requestUpdate(a, l, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function _(o) {
  return (e, t) => typeof t == "object" ? at(o, e, t) : ((s, i, n) => {
    const a = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), a ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function E(o) {
  return _({ ...o, state: !0, attribute: !1 });
}
const ie = [
  {
    name: "tuya_with_daysMask",
    entrySize: 5,
    fields: [
      "daysMask",
      "hour",
      "minute",
      "portion",
      "enabled"
    ]
  },
  {
    name: "tuya_no_daysMask",
    entrySize: 4,
    fields: [
      "hour",
      "minute",
      "portion",
      "enabled"
    ]
  }
];
function _e(o) {
  return ie.find((e) => e.name === o);
}
function rt(o) {
  const e = Array(7).fill(0);
  return o.forEach((t) => {
    if (t.enabled === 1 && typeof t.daysMask == "number")
      for (let s = 0; s < 7; s++)
        t.daysMask & 1 << s && (e[s] += t.portion);
  }), e;
}
function lt(o, e) {
  let t = 0;
  return o.forEach((s) => {
    s.enabled === 1 && typeof s.daysMask == "number" && s.daysMask & 1 << e && (t += s.portion);
  }), t;
}
function ht(o, e) {
  if (!o || o === "unknown")
    return [];
  if (!e)
    throw new Error(`Unknown meal plan layout: '${e}'`);
  const t = _e(e);
  if (!t)
    throw new Error(`Unknown meal plan layout: '${e}'`);
  let s;
  try {
    s = atob(o);
  } catch {
    throw new Error("Invalid base64");
  }
  const { entrySize: i, fields: n } = t, a = new Uint8Array([...s].map((r) => r.charCodeAt(0)));
  if (a.length % i !== 0)
    throw new Error("Invalid meal plan length");
  return Array.from({ length: a.length / i }, (r, l) => {
    const c = {};
    for (let d = 0; d < n.length; d++)
      c[n[d]] = a[l * i + d];
    return c;
  });
}
function ct(o, e) {
  if (!e)
    throw new Error(`Unknown meal plan layout: '${e}'`);
  const t = _e(e);
  if (!t)
    throw new Error(`Unknown meal plan layout: '${e}'`);
  const { fields: s } = t, i = [];
  return o.forEach((n) => {
    for (const a of s)
      i.push(Number(n[a]) || 0);
  }), btoa(String.fromCharCode(...i));
}
function De(o, e) {
  return typeof o != "number" || isNaN(o) || typeof e != "number" || isNaN(e) ? "--:--" : `${o.toString().padStart(2, "0")}:${e.toString().padStart(2, "0")}`;
}
const dt = [
  "ha-form",
  "ha-icon",
  "ha-icon-button",
  "ha-selector",
  "ha-textfield",
  "ha-icon-picker",
  "ha-icon-button",
  "ha-entity-picker",
  "ha-select",
  "ha-dialog",
  "ha-sortable",
  "ha-svg-icon",
  "ha-alert",
  "ha-button",
  "ha-color-picker",
  "ha-badge",
  "ha-sankey-chart",
  "mwc-button"
], ye = async (o) => {
  var t, s, i, n, a, r;
  const e = o || dt;
  try {
    if (e.every((h) => customElements.get(h)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((h, u) => setTimeout(() => u(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
    ]);
    const l = document.createElement("partial-panel-resolver");
    if (!l)
      throw new Error("Failed to create partial-panel-resolver element");
    if (l.hass = {
      panels: [
        {
          url_path: "tmp",
          component_name: "config"
        }
      ]
    }, typeof l._updateRoutes != "function")
      throw new Error("partial-panel-resolver does not have _updateRoutes method");
    if (l._updateRoutes(), !((i = (s = (t = l.routerOptions) == null ? void 0 : t.routes) == null ? void 0 : s.tmp) != null && i.load))
      throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([
      l.routerOptions.routes.tmp.load(),
      new Promise((h, u) => setTimeout(() => u(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((h, u) => setTimeout(() => u(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const c = document.createElement("ha-panel-config");
    if (!c)
      throw new Error("Failed to create ha-panel-config element");
    if (!((r = (a = (n = c.routerOptions) == null ? void 0 : n.routes) == null ? void 0 : a.automation) != null && r.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      c.routerOptions.routes.automation.load(),
      new Promise((h, u) => setTimeout(() => u(new Error("Timeout loading automation components")), 1e4))
    ]);
    const d = e.filter((h) => !customElements.get(h));
    if (d.length > 0)
      throw new Error(`Failed to load components: ${d.join(", ")}`);
  } catch (l) {
    console.error("Error loading Home Assistant form components:", l);
    try {
      if (window.customElements && window.customElements.get("home-assistant")) {
        console.log("Attempting fallback loading method for HA components");
        const c = new CustomEvent("ha-request-load-components", {
          detail: {
            components: e
          },
          bubbles: !0,
          composed: !0
        });
        document.dispatchEvent(c);
      }
    } catch (c) {
      console.error("Fallback loading method failed:", c);
    }
  }
}, ut = "Feed Now", pt = "Schedule", mt = "Portion", ft = "Days", gt = "Enabled", _t = "Edit Meal", yt = "Time", vt = "(1 portion = 6g)", $t = "Suggested:", bt = "Back", wt = "Save", At = "Status", Et = "Actions", xt = "Add Meal", St = "Schedules", Ct = "Active Schedules", Mt = "Today", kt = "Edit Feeding Time", Ot = "Manage Schedules", Pt = "Unsaved changes", Dt = "You have unsaved changes. Don't forget to save!", Tt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Rt = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], Ut = "Avg/week", Ft = {
  feed_now: ut,
  schedule: pt,
  portion: mt,
  days: ft,
  enabled: gt,
  edit_meal: _t,
  time: yt,
  portion_helper: vt,
  suggested: $t,
  back: bt,
  save: wt,
  status: At,
  actions: Et,
  delete: "Delete",
  add_meal: xt,
  schedules: St,
  active_schedules: Ct,
  today: Mt,
  edit_feeding_time: kt,
  manage_schedules: Ot,
  unsaved_changes: Pt,
  unsaved_changes_hint: Dt,
  days_short: Tt,
  days_full: Rt,
  avg_week: Ut
}, Ht = "Mata nu", Nt = "Schema", jt = "Portion", It = "Dagar", Lt = "Aktiverad", zt = "Redigera måltid", Bt = "Tid", Vt = "(1 portion = 6g)", qt = "Föreslaget:", Wt = "Tillbaka", Jt = "Spara", Gt = "Status", Kt = "Åtgärder", Zt = "Lägg till måltid", Yt = "Scheman", Qt = "Aktiva scheman", Xt = "Idag", es = "Redigera matningstid", ts = "Hantera scheman", ss = "Osparade ändringar", is = "Du har osparade ändringar. Glöm inte att spara!", os = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"], ns = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"], as = "Snitt/vecka", rs = {
  feed_now: Ht,
  schedule: Nt,
  portion: jt,
  days: It,
  enabled: Lt,
  edit_meal: zt,
  time: Bt,
  portion_helper: Vt,
  suggested: qt,
  back: Wt,
  save: Jt,
  status: Gt,
  actions: Kt,
  delete: "Ta bort",
  add_meal: Zt,
  schedules: Yt,
  active_schedules: Qt,
  today: Xt,
  edit_feeding_time: es,
  manage_schedules: ts,
  unsaved_changes: ss,
  unsaved_changes_hint: is,
  days_short: os,
  days_full: ns,
  avg_week: as
}, de = { en: Ft, sv: rs };
let je = "en";
function ls(o) {
  je = de[o] ? o : "en";
}
function m(o) {
  var e;
  return ((e = de[je]) == null ? void 0 : e[o]) || de.en[o] || o;
}
var ae = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, U;
let G = (U = class extends A {
  constructor() {
    super(), this.selectedDaysMask = 0, this.editable = !1;
  }
  _toggleDay(e) {
    if (!this.editable)
      return;
    const t = this.selectedDaysMask ^ 1 << e;
    this.dispatchEvent(new CustomEvent("days-changed", { detail: { daysMask: t }, bubbles: !0, composed: !0 }));
  }
  render() {
    const e = this.dayLabels && this.dayLabels.length === 7 ? this.dayLabels : ["M", "T", "W", "T", "F", "S", "S"];
    return p`
      <div class="days-row">
        ${e.map((t, s) => p`
          <span
            class="day-cell${this.selectedDaysMask & 1 << s ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(s)}
          >${t}</span>
        `)}
      </div>
    `;
  }
}, U.styles = me`
    .days-row {
      display: flex;
      gap: 1px;
      flex-wrap: wrap;
      align-items: center;
    }
    .day-cell {
      width: 1.7em;
      height: 1.7em;
      line-height: 1.7em;
      text-align: center;
      border-radius: 6px;
      background: var(--card-background-color, #f0f0f0);
      color: #8a8a8a;
      font-weight: 600;
      font-size: 0.95em;
      margin: 0 1px;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
      user-select: none;
      position: relative;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :host(.edit-mode) .days-row {
      justify-content: center;
      margin: 0 auto;
      gap: 8px;
    }
    :host(.edit-mode) .day-cell {
      width: 2.6em;
      height: 2.6em;
      line-height: 2.6em;
      font-size: 1.25em;
      margin: 0 4px;
    }
    .day-cell.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .day-cell.readonly {
      cursor: default;
    }
  `, U);
ae([
  _({ type: Number })
], G.prototype, "selectedDaysMask", void 0);
ae([
  _({ type: Boolean })
], G.prototype, "editable", void 0);
ae([
  _({ type: Array })
], G.prototype, "dayLabels", void 0);
G = ae([
  ne("cleverio-day-selector")
], G);
var x = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, F, H;
let y = (H = class extends A {
  constructor() {
    super();
    T(this, F);
    this._meals = null, this.viewMeals = [], this.editForm = null, this.editError = null, this.editDialogOpen = !1, this.editIdx = null, $(this, F, !1), this.layout = ie[0].name, this.viewMeals = [];
  }
  get meals() {
    return this._meals;
  }
  set meals(t) {
    const s = this._meals;
    this._meals = t, !this.editDialogOpen && (!this._hasUnsavedChanges || s == null) && (this.viewMeals = Array.isArray(t) ? t.map((i) => ({ ...i })) : [], this.requestUpdate("meals", s));
  }
  get haComponentsReady() {
    return D(this, F);
  }
  set haComponentsReady(t) {
    $(this, F, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), await ye(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this.haComponentsReady = !0;
  }
  // Helper to check if there are unsaved changes
  get _hasUnsavedChanges() {
    const t = JSON.stringify(this.viewMeals), s = JSON.stringify(this.meals ?? []);
    return t !== s;
  }
  _toggleEnabled(t, s) {
    const i = s.target.checked;
    this.viewMeals = this.viewMeals.map((n, a) => a === t ? { ...n, enabled: i ? 1 : 0 } : n);
  }
  _openEditDialog(t) {
    this.editDialogOpen = !0, this.editIdx = t;
    const s = { ...this.viewMeals[t] };
    this.editForm = s, this.editError = null;
  }
  _openAddDialog() {
    this.editDialogOpen = !0, this.editIdx = null, this.editForm = { hour: 0, minute: 0, portion: 1, daysMask: 0, enabled: 1 }, this.editError = null;
  }
  _closeEditDialog() {
    this.editDialogOpen = !1, this.editForm = null;
  }
  _delete(t) {
    this.viewMeals = this.viewMeals.filter((s, i) => i !== t);
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 }));
  }
  _save() {
    this.dispatchEvent(new CustomEvent("save-schedule", { detail: { meals: this.viewMeals }, bubbles: !0, composed: !0 }));
  }
  render() {
    var c, d;
    if (!this.haComponentsReady)
      return p`<div>Loading Home Assistant components...</div>`;
    const s = (_e(this.layout) || ie[0]).fields.includes("daysMask"), i = this.viewMeals.some((h) => typeof h.daysMask == "number"), n = s && i, a = {
      time: {
        title: m("time"),
        sortable: !0,
        minWidth: "80px",
        template: (h) => De(h.hour, h.minute)
      },
      portion: { title: m("portion"), sortable: !0, minWidth: "80px" },
      ...n ? {
        days: {
          title: m("days"),
          sortable: !1,
          minWidth: "130px",
          template: (h) => p`
            <cleverio-day-selector
              .selectedDaysMask=${h.daysMask}
              .editable=${!1}
            ></cleverio-day-selector>
          `
        }
      } : {},
      enabled: {
        title: m("enabled"),
        sortable: !0,
        minWidth: "60px",
        template: (h) => p`
          <div style="display: flex; align-items: center; justify-content: center; height: 48px;">
            <ha-switch
              .checked=${h.enabled}
              @change=${(u) => this._toggleEnabled(h._idx, u)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        `
      },
      actions: {
        title: m("actions"),
        sortable: !1,
        minWidth: "140px",
        template: (h) => p`
          <ha-icon-button @click=${() => this._openEditDialog(h._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(h._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        `
      }
    }, r = this.viewMeals.map((h, u) => ({ ...h, _idx: u })), l = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return p`
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? m("edit_feeding_time") : m("manage_schedules")}>
        ${this.editDialogOpen ? p`
              <form class="edit-form" @submit=${(h) => h.preventDefault()}>
                ${this.editError ? p`<div class="error">${this.editError}</div>` : ""}
                ${s ? p`
                  <cleverio-day-selector
                    class="edit-mode"
                    .selectedDaysMask=${((c = this.editForm) == null ? void 0 : c.daysMask) ?? 0}
                    .editable=${!0}
                    @days-changed=${(h) => {
      this.editForm.daysMask = h.detail.daysMask, this.requestUpdate();
    }}
                  ></cleverio-day-selector>
                ` : ""}
                <div class="edit-form-group">
                  <label for="edit-time">${m("time")}</label>
                  <input
                    id="edit-time"
                    class="edit-time"
                    type="time"
                    .value=${this.editForm ? De(this.editForm.hour, this.editForm.minute) : ""}
                    @input=${(h) => {
      const u = h.target.value, [g, P] = u.split(":").map(Number);
      this.editForm.hour = g, this.editForm.minute = P, this.requestUpdate();
    }}
                  />
                </div>
                <div class="edit-form-group">
                  <label for="edit-portion">Portion</label>
                  <input
                    id="edit-portion"
                    type="number"
                    min="1"
                    .value=${((d = this.editForm) == null ? void 0 : d.portion) ?? 1}
                    @input=${(h) => {
      this.editForm.portion = parseInt(h.target.value, 10), this.requestUpdate();
    }}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${l.map((h) => p`
                    <ha-button type="button" @click=${() => {
      const [u, g] = h.split(":").map(Number);
      this.editForm.hour = u, this.editForm.minute = g, this.requestUpdate();
    }}>${h}</ha-button>
                  `)}
                </div>
              </form>
            ` : p`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${m}
                  .columns=${a}
                  .data=${r}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editDialogOpen ? p`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>${m("back")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>${m("save")}</ha-button>
            ` : p`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>${m("add_meal")}</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>${m("cancel")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>${m("save")}</ha-button>
            `}
      </ha-dialog>
    `;
  }
  _onEditSave(t) {
    if (t && t.preventDefault(), !!this.editForm) {
      if (typeof this.editForm.hour != "number" || typeof this.editForm.minute != "number" || isNaN(this.editForm.hour) || isNaN(this.editForm.minute) || this.editForm.hour < 0 || this.editForm.hour > 23 || this.editForm.minute < 0 || this.editForm.minute > 59) {
        this.editError = "Please enter a valid time.";
        return;
      }
      if (!this.editForm.portion || this.editForm.portion < 1) {
        this.editError = "Portion must be at least 1.";
        return;
      }
      this.editError = null, this.editIdx !== null ? this.viewMeals = this.viewMeals.map((s, i) => i === this.editIdx ? { ...this.editForm } : s) : this.viewMeals = [...this.viewMeals, { ...this.editForm }], this._closeEditDialog();
    }
  }
}, F = new WeakMap(), H.styles = [
  me`
      ha-dialog {
        min-width: unset !important;
        width: 100vw !important;
        max-width: 100vw !important;
        box-sizing: border-box;
      }
      .schedule-table-wrapper {
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
      }
      .edit-mode .days-row {
        justify-content: center;
        margin: 0 auto;
        gap: 8px;
      }
      .edit-mode .day-cell {
        width: 2.6em;
        height: 2.6em;
        line-height: 2.6em;
        font-size: 1.25em;
        margin: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 100%;
        box-sizing: border-box;
      }
      .edit-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }
      .edit-predefined-times {
        display: flex;
        gap: 0.5em;
        flex-wrap: wrap;
      }
      .edit-error {
        color: red;
        font-size: 0.9em;
      }
    `
], H);
x([
  _({ type: Array })
], y.prototype, "meals", null);
x([
  E()
], y.prototype, "viewMeals", void 0);
x([
  E()
], y.prototype, "editForm", void 0);
x([
  E()
], y.prototype, "editError", void 0);
x([
  E()
], y.prototype, "editDialogOpen", void 0);
x([
  _({ type: Boolean })
], y.prototype, "haComponentsReady", null);
x([
  _({ type: String })
], y.prototype, "layout", void 0);
y = x([
  ne("cleverio-schedule-view")
], y);
var S = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, Z, Y, Q, N, j;
let v = (j = class extends A {
  constructor() {
    super();
    T(this, Z);
    T(this, Y);
    T(this, Q);
    T(this, N);
    $(this, N, !1), this._haComponentsReady = !1, this._decodeError = null, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1;
  }
  get hass() {
    return this._hass;
  }
  set hass(t) {
    const s = this._hass;
    this._hass = t, this._updateHass(), this.requestUpdate("hass", s);
  }
  get config() {
    return D(this, Z);
  }
  set config(t) {
    $(this, Z, t);
  }
  get _meals() {
    return D(this, Y);
  }
  set _meals(t) {
    $(this, Y, t);
  }
  get _persistedMeals() {
    return D(this, Q);
  }
  set _persistedMeals(t) {
    $(this, Q, t);
  }
  get _dialogOpen() {
    return D(this, N);
  }
  set _dialogOpen(t) {
    $(this, N, t);
  }
  setConfig(t) {
    if (!t.layout) {
      if (window.location.pathname.includes("lovelace") && window.location.hash.includes("edit")) {
        this.config = t;
        return;
      }
      this.config = t;
      return;
    }
    this.config = t;
  }
  async connectedCallback() {
    await ls(this.hass.language), await ye(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback();
  }
  get _sensorID() {
    var t;
    return (t = this.config) == null ? void 0 : t.sensor;
  }
  get _helperID() {
    var t;
    return (t = this.config) == null ? void 0 : t.helper;
  }
  get _stateObj() {
    var t, s;
    return (s = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : s[this._sensorID];
  }
  get _helperObj() {
    var t, s;
    return (s = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : s[this._helperID];
  }
  get _attributes() {
    var t;
    return ((t = this._stateObj) == null ? void 0 : t.attributes) || {};
  }
  get _name() {
    return this._attributes.friendly_name || this._sensorID;
  }
  _updateHass() {
    var n, a;
    const t = ((n = this._stateObj) == null ? void 0 : n.state) ?? "", s = ((a = this._helperObj) == null ? void 0 : a.state) ?? "";
    let i = "";
    this._isValidSensorValue(t) ? (i = t, this._updateHelperIfOutOfSync(t, s)) : i = s, this._setMealsFromRaw(i);
  }
  _isValidSensorValue(t) {
    return typeof t == "string" && t !== "" && t !== "unknown" && t !== "unavailable";
  }
  _updateHelperIfOutOfSync(t, s) {
    this._helperID && this.hass && t !== s && this.hass.callService("input_text", "set_value", {
      entity_id: this._helperID,
      value: t
    });
  }
  _setMealsFromRaw(t) {
    let s = [];
    if (this._decodeError = null, t && typeof t == "string" && t.trim().length > 0)
      try {
        s = ht(t, this.config.layout);
      } catch (i) {
        console.error("Meal plan decode error:", i), this._decodeError = i.message || "Failed to decode meal plan data.", s = [];
      }
    this._persistedMeals = Array.isArray(s) ? s : [], this._meals = JSON.parse(JSON.stringify(this._persistedMeals));
  }
  render() {
    var t, s;
    return this._haComponentsReady ? (t = this.config) != null && t.layout ? p`
      <ha-card header=${((s = this.config) == null ? void 0 : s.title) || "Cleverio Pet Feeder"} style="height: 100%;">
        ${this._decodeError ? p`<div style="color: var(--error-color, red); margin: 8px;">${this._decodeError}</div>` : ""}
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${m("schedules")}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${m("active_schedules")}: <span style="white-space:nowrap;">${this._meals.filter((i) => i.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${m("today")}: <span style="white-space:nowrap;">${lt(this._meals.filter((i) => i.enabled), (/* @__PURE__ */ new Date()).getDay()) * 6}g</span>
          </ha-chip>
          <ha-chip class="overview-average">
            <ha-icon icon="mdi:scale-balance"></ha-icon>
            ${m("avg_week")}: <span style="white-space:nowrap;">
              ${(rt(this._meals.filter((a) => a.enabled)).reduce((a, r) => a + r, 0) / 7 * 6).toFixed(1)}g
            </span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0;
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${m("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? p`
              <cleverio-schedule-view
                .meals=${[...this._meals]}
                .layout=${this.config.layout}
                .localize=${m}
                @save-schedule=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : p`<div style="color: var(--error-color, red); margin: 8px;">Please select a meal plan layout in the card editor.</div>` : p`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => hs), document.createElement("cleverio-card-editor");
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID)
      return;
    const t = ct(this._meals, this.config.layout);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: t
    });
  }
  _onScheduleMealsChanged(t) {
    this._meals = t.detail.meals, this._saveMealsToSensor(), this._dialogOpen = !1;
  }
  _onDialogClose() {
    this._dialogOpen = !1;
  }
}, Z = new WeakMap(), Y = new WeakMap(), Q = new WeakMap(), N = new WeakMap(), j.styles = [
  me`
      .overview-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin: 0 16px 8px 16px;
        box-sizing: border-box;
        padding-right: 8px;
      }
      @media (max-width: 600px) {
        .overview-row {
          flex-direction: column;
          gap: 4px;
          margin: 0 4px 8px 4px;
        }
      }
    `
], j);
S([
  _({ type: Object })
], v.prototype, "hass", null);
S([
  _({ type: Object })
], v.prototype, "config", null);
S([
  E()
], v.prototype, "_meals", null);
S([
  E()
], v.prototype, "_persistedMeals", null);
S([
  E()
], v.prototype, "_dialogOpen", null);
S([
  _({ type: Boolean })
], v.prototype, "_haComponentsReady", void 0);
S([
  E()
], v.prototype, "_decodeError", void 0);
v = S([
  ne("cleverio-pf100-card")
], v);
var ve = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
};
let K = class extends A {
  constructor() {
    super(...arguments), this.config = { sensor: "", title: "", helper: "", layout: "" };
  }
  setConfig(e) {
    this.config = { ...this.config, ...e }, this.config.layout || (this.config.layout = "");
  }
  _onLayoutChange(e) {
    const t = e.target.value;
    this.config = { ...this.config, layout: t }, this.requestUpdate();
  }
  async connectedCallback() {
    await ye(["ha-entity-picker", "ha-form", "ha-textfield", "ha-select"]), this._haComponentsReady = !0, super.connectedCallback();
  }
  configChanged(e) {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: e },
      bubbles: !0,
      composed: !0
    }));
  }
  _onInput(e) {
    const { name: t, value: s } = e.target;
    this.config = { ...this.config, [t]: s }, this.configChanged(this.config);
  }
  _valueChanged(e) {
    const t = e.target;
    t.configValue && (this.config = { ...this.config, [t.configValue]: e.detail.value }, this.configChanged(this.config));
  }
  _validateConfig() {
    return !!this.config.sensor && !!this.config.helper;
  }
  render() {
    var e, t;
    return this._haComponentsReady ? p`
      <label for="layout-picker-ha" style="display:block;margin-bottom:4px;">Meal plan layout</label>
      <ha-select id="layout-picker-ha" @selected=${(s) => {
      this._onLayoutChange({ target: { value: s.detail.value } });
    }} .value=${this.config.layout} fixedMenuPosition>
        <mwc-list-item value="">None (select layout)</mwc-list-item>
        ${ie.map((s) => p`<mwc-list-item value="${s.name}" ?selected=${this.config.layout === s.name}>${s.name}</mwc-list-item>`)}
      </ha-select>
      <div style="height: 20px;"></div>
      <ha-button @click=${() => this.configChanged(this.config)} .disabled=${!this._validateConfig() || !this.config.layout}>
        Save
      </ha-button>
      <div style="height: 20px;"></div>
      <div style="height: 20px;"></div>
      <label for="entity-picker" style="display:block;margin-bottom:4px;">Meal plan entity</label>
      <ha-entity-picker
        id="entity-picker"
        .hass=${this.hass}
        .value=${this.config.sensor || ""}
        .configValue=${"sensor"}
        @value-changed=${this._valueChanged}
        allow-custom-entity
      ></ha-entity-picker>
      <div style="height: 20px;"></div>
      <label for="helper-picker" style="display:block;margin-bottom:4px;">Meal plan storage helper (input_text)
        <ha-tooltip content="This input_text helper is used to store and sync your meal plan schedule. The card will always read and write the schedule to this helper, making it the single source of truth for your meal plan. Tip: Create a dedicated input_text helper in Home Assistant for each feeder you want to manage." placement="right">
          <ha-icon
            icon="mdi:information-outline"
            style="font-size:1.1em;color:var(--secondary-text-color,#666);margin-left:4px;vertical-align:middle;cursor:pointer;"
            tabindex="0"
          ></ha-icon>
        </ha-tooltip>
      </label>
      <ha-entity-picker
        id="helper-picker"
        .hass=${this.hass}
        .value=${this.config.helper || ""}
        .configValue=${"helper"}
        @value-changed=${this._valueChanged}
        .includeDomains=${["input_text"]}
      ></ha-entity-picker>
      <div style="height: 20px;"></div>
      <ha-textfield
        id="title"
        name="title"
        .value=${this.config.title || ""}
        @input=${this._onInput}
        .label=${((t = (e = this.hass) == null ? void 0 : e.localize) == null ? void 0 : t.call(e, "ui.card.config.title_label")) || "Title"}
        placeholder="Title"
      ></ha-textfield>
      ${this._validateConfig() ? "" : p`<div style="color: var(--error-color, red); margin-top: 8px;">Please select a sensor entity and a storage helper (input_text).`}
      <!-- mwc-tooltip handles its own styling -->
    ` : p`<div>Loading Home Assistant components...</div>`;
  }
};
ve([
  _({ attribute: !1 })
], K.prototype, "config", void 0);
ve([
  _({ attribute: !1 })
], K.prototype, "hass", void 0);
K = ve([
  ne("cleverio-card-editor")
], K);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "cleverio-pf100-card",
  name: "Cleverio Feeder Card",
  preview: !1,
  description: "Cleverio PF100 feeder card to decode/encode base64 meal_plan"
});
const hs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return K;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  v as CleverioPf100Card
};
