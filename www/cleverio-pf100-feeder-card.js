var Ke = Object.defineProperty;
var xe = (o) => {
  throw TypeError(o);
};
var Ze = (o, t, e) => t in o ? Ke(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var b = (o, t, e) => Ze(o, typeof t != "symbol" ? t + "" : t, e), Ce = (o, t, e) => t.has(o) || xe("Cannot " + e);
var _ = (o, t, e) => (Ce(o, t, "read from private field"), e ? e.call(o) : t.get(o)), f = (o, t, e) => t.has(o) ? xe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(o) : t.set(o, e), g = (o, t, e, s) => (Ce(o, t, "write to private field"), s ? s.call(o, e) : t.set(o, e), e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = globalThis, be = ae.ShadowRoot && (ae.ShadyCSS === void 0 || ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ye = Symbol(), Se = /* @__PURE__ */ new WeakMap();
let ze = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== ye) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (be && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Se.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Se.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ge = (o) => new ze(typeof o == "string" ? o : o + "", void 0, ye), se = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((s, i, a) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[a + 1], o[0]);
  return new ze(e, o, ye);
}, Qe = (o, t) => {
  if (be) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = ae.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
  }
}, Me = be ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Ge(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xe, defineProperty: Ye, getOwnPropertyDescriptor: et, getOwnPropertyNames: tt, getOwnPropertySymbols: st, getPrototypeOf: it } = Object, A = globalThis, ke = A.trustedTypes, ot = ke ? ke.emptyScript : "", ue = A.reactiveElementPolyfillSupport, N = (o, t) => o, re = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? ot : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, $e = (o, t) => !Xe(o, t), Pe = { attribute: !0, type: String, converter: re, reflect: !1, useDefault: !1, hasChanged: $e };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), A.litPropertyMetadata ?? (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Pe) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Ye(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: a } = et(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: i, set(r) {
      const l = i == null ? void 0 : i.call(this);
      a == null || a.call(this, r), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Pe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = it(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const e = this.properties, s = [...tt(e), ...st(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(Me(i));
    } else t !== void 0 && e.push(Me(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qe(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var a;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (((a = s.converter) == null ? void 0 : a.toAttribute) !== void 0 ? s.converter : re).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, r;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((a = l.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? l.converter : re;
      this._$Em = i, this[i] = n.fromAttribute(e, l.type) ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const a = this.constructor, r = this[t];
      if (s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? $e)(r, e) || s.useDefault && s.reflect && r === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: a }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, r] of i) {
        const { wrapped: l } = r, n = this[a];
        l !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, r, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var a;
        return (a = i.hostUpdate) == null ? void 0 : a.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[N("elementProperties")] = /* @__PURE__ */ new Map(), T[N("finalized")] = /* @__PURE__ */ new Map(), ue == null || ue({ ReactiveElement: T }), (A.reactiveElementVersions ?? (A.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, ne = j.trustedTypes, Oe = ne ? ne.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Be = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, Fe = "?" + E, at = `<${Fe}>`, P = document, q = () => P.createComment(""), z = (o) => o === null || typeof o != "object" && typeof o != "function", we = Array.isArray, rt = (o) => we(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", pe = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Te = /-->/g, Ue = />/g, S = RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Re = /'/g, De = /"/g, Le = /^(?:script|style|textarea|title)$/i, nt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), m = nt(1), U = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Ie = /* @__PURE__ */ new WeakMap(), M = P.createTreeWalker(P, 129);
function We(o, t) {
  if (!we(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Oe !== void 0 ? Oe.createHTML(t) : t;
}
const lt = (o, t) => {
  const e = o.length - 1, s = [];
  let i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = H;
  for (let l = 0; l < e; l++) {
    const n = o[l];
    let c, h, d = -1, p = 0;
    for (; p < n.length && (r.lastIndex = p, h = r.exec(n), h !== null); ) p = r.lastIndex, r === H ? h[1] === "!--" ? r = Te : h[1] !== void 0 ? r = Ue : h[2] !== void 0 ? (Le.test(h[2]) && (i = RegExp("</" + h[2], "g")), r = S) : h[3] !== void 0 && (r = S) : r === S ? h[0] === ">" ? (r = i ?? H, d = -1) : h[1] === void 0 ? d = -2 : (d = r.lastIndex - h[2].length, c = h[1], r = h[3] === void 0 ? S : h[3] === '"' ? De : Re) : r === De || r === Re ? r = S : r === Te || r === Ue ? r = H : (r = S, i = void 0);
    const $ = r === S && o[l + 1].startsWith("/>") ? " " : "";
    a += r === H ? n + at : d >= 0 ? (s.push(c), n.slice(0, d) + Be + n.slice(d) + E + $) : n + E + (d === -2 ? l : $);
  }
  return [We(o, a + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class B {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let a = 0, r = 0;
    const l = t.length - 1, n = this.parts, [c, h] = lt(t, e);
    if (this.el = B.createElement(c, s), M.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = M.nextNode()) !== null && n.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Be)) {
          const p = h[r++], $ = i.getAttribute(d).split(E), oe = /([.?@])?(.*)/.exec(p);
          n.push({ type: 1, index: a, name: oe[2], strings: $, ctor: oe[1] === "." ? ct : oe[1] === "?" ? ht : oe[1] === "@" ? ut : de }), i.removeAttribute(d);
        } else d.startsWith(E) && (n.push({ type: 6, index: a }), i.removeAttribute(d));
        if (Le.test(i.tagName)) {
          const d = i.textContent.split(E), p = d.length - 1;
          if (p > 0) {
            i.textContent = ne ? ne.emptyScript : "";
            for (let $ = 0; $ < p; $++) i.append(d[$], q()), M.nextNode(), n.push({ type: 2, index: ++a });
            i.append(d[p], q());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Fe) n.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(E, d + 1)) !== -1; ) n.push({ type: 7, index: a }), d += E.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const s = P.createElement("template");
    return s.innerHTML = t, s;
  }
}
function R(o, t, e = o, s) {
  var r, l;
  if (t === U) return t;
  let i = s !== void 0 ? (r = e._$Co) == null ? void 0 : r[s] : e._$Cl;
  const a = z(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== a && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), a === void 0 ? i = void 0 : (i = new a(o), i._$AT(o, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = R(o, i._$AS(o, t.values), i, s)), t;
}
class dt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? P).importNode(e, !0);
    M.currentNode = i;
    let a = M.nextNode(), r = 0, l = 0, n = s[0];
    for (; n !== void 0; ) {
      if (r === n.index) {
        let c;
        n.type === 2 ? c = new ie(a, a.nextSibling, this, t) : n.type === 1 ? c = new n.ctor(a, n.name, n.strings, this, t) : n.type === 6 && (c = new pt(a, this, t)), this._$AV.push(c), n = s[++l];
      }
      r !== (n == null ? void 0 : n.index) && (a = M.nextNode(), r++);
    }
    return M.currentNode = P, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class ie {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = R(this, t, e), z(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = B.createElement(We(s.h, s.h[0]), this.options)), s);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === i) this._$AH.p(e);
    else {
      const r = new dt(i, this), l = r.u(this.options);
      r.p(e), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = Ie.get(t.strings);
    return e === void 0 && Ie.set(t.strings, e = new B(t)), e;
  }
  k(t) {
    we(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const a of t) i === e.length ? e.push(s = new ie(this.O(q()), this.O(q()), this, this.options)) : s = e[i], s._$AI(a), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class de {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, a) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, i) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = R(this, t, e, 0), r = !z(t) || t !== this._$AH && t !== U, r && (this._$AH = t);
    else {
      const l = t;
      let n, c;
      for (t = a[0], n = 0; n < a.length - 1; n++) c = R(this, l[s + n], e, n), c === U && (c = this._$AH[n]), r || (r = !z(c) || c !== this._$AH[n]), c === u ? t = u : t !== u && (t += (c ?? "") + a[n + 1]), this._$AH[n] = c;
    }
    r && !i && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ct extends de {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class ht extends de {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ut extends de {
  constructor(t, e, s, i, a) {
    super(t, e, s, i, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = R(this, t, e, 0) ?? u) === U) return;
    const s = this._$AH, i = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class pt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const me = j.litHtmlPolyfillSupport;
me == null || me(B, ie), (j.litHtmlVersions ?? (j.litHtmlVersions = [])).push("3.3.0");
const mt = (o, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new ie(t.insertBefore(q(), a), a, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class x extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = mt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return U;
  }
}
var je;
x._$litElement$ = !0, x.finalized = !0, (je = k.litElementHydrateSupport) == null || je.call(k, { LitElement: x });
const _e = k.litElementPolyfillSupport;
_e == null || _e({ LitElement: x });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = (o) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(o, t);
  }) : customElements.define(o, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = { attribute: !0, type: String, converter: re, reflect: !1, hasChanged: $e }, ft = (o = _t, t, e) => {
  const { kind: s, metadata: i } = e;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), a.set(e.name, o), s === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, n, o);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, o, l), l;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(l) {
      const n = this[r];
      t.call(this, l), this.requestUpdate(r, n, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function v(o) {
  return (t, e) => typeof e == "object" ? ft(o, t, e) : ((s, i, a) => {
    const r = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, s), r ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function D(o) {
  return v({ ...o, state: !0, attribute: !1 });
}
function He(o) {
  const t = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  };
  return o.forEach((e) => {
    if (e.enabled) {
      for (let s = 0; s < 7; s++)
        if (e.daysMask & 1 << s) {
          const i = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ][s];
          t[i] += e.portion;
        }
    }
  }), t;
}
function gt(o, t) {
  let e = 0;
  return o.forEach((s) => {
    s.enabled && s.daysMask & 1 << [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ].indexOf(t) && (e += s.portion);
  }), e;
}
function vt(o) {
  if (!o || o === "unknown")
    return [];
  let t;
  try {
    t = atob(o);
  } catch {
    throw new Error("Invalid base64");
  }
  const e = new Uint8Array([...t].map((i) => i.charCodeAt(0)));
  if (e.length % 5 !== 0)
    throw new Error("Invalid meal plan length");
  const s = [];
  for (let i = 0; i < e.length; i += 5) {
    const [a, r, l, n, c] = e.slice(i, i + 5);
    s.push({
      time: `${r.toString().padStart(2, "0")}:${l.toString().padStart(2, "0")}`,
      daysMask: a,
      portion: n || 1,
      enabled: c === 1
    });
  }
  return s;
}
function bt(o) {
  const t = [];
  return o.forEach((e) => {
    const [s, i] = e.time.split(":").map(Number);
    t.push(e.daysMask, s, i, Number(e.portion), e.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...t));
}
const Ee = se`
  .ha-card-style {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: 0 0 0 2px #2196f344; /* Home Assistant blue focus ring */
    border: var(--ha-card-border-width, 1.5px) solid var(--ha-card-border-color, var(--divider-color, #444));
    color: var(--primary-text-color);
    font-family: var(--ha-font-family-body, inherit);
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    box-sizing: border-box;
    padding: var(--ha-card-padding, 16px); /* Restored default padding */
    margin: 0;
  }
`, yt = se`
  .ha-table-style {
    background: var(--ha-card-background, var(--card-background-color, #222));
    color: var(--primary-text-color);
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1.5px solid var(--divider-color, #444);
    border-collapse: separate;
    border-spacing: 0;
    box-shadow: none;
    width: 100%;
    font-size: 0.95em;
    table-layout: fixed;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .ha-table-style th, .ha-table-style td {
    text-align: center;
    padding: 0.25em 0.4em;
    border-bottom: 1px solid var(--divider-color, #444);
    background: var(--ha-card-background, var(--card-background-color, #222));
    color: var(--primary-text-color);
    background-color: var(--ha-card-background, var(--card-background-color, #222));
    opacity: 1 !important;
    transition: background 0.2s, color 0.2s;
    vertical-align: middle;
    word-break: break-word;
  }
  .ha-table-style th {
    font-weight: 600;
  }
  .ha-table-style tr:hover {
    background: var(--table-row-background-hover, var(--primary-background-color, #333));
    background-color: var(--table-row-background-hover, var(--primary-background-color, #333));
    opacity: 1 !important;
    transition: background 0.2s, color 0.2s;
  }
`, $t = [
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
], Ae = async (o) => {
  var e, s, i, a, r, l;
  const t = o || $t;
  try {
    if (t.every((d) => customElements.get(d)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((d, p) => setTimeout(() => p(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
    ]);
    const n = document.createElement("partial-panel-resolver");
    if (!n)
      throw new Error("Failed to create partial-panel-resolver element");
    if (n.hass = {
      panels: [
        {
          url_path: "tmp",
          component_name: "config"
        }
      ]
    }, typeof n._updateRoutes != "function")
      throw new Error("partial-panel-resolver does not have _updateRoutes method");
    if (n._updateRoutes(), !((i = (s = (e = n.routerOptions) == null ? void 0 : e.routes) == null ? void 0 : s.tmp) != null && i.load))
      throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([
      n.routerOptions.routes.tmp.load(),
      new Promise((d, p) => setTimeout(() => p(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((d, p) => setTimeout(() => p(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const c = document.createElement("ha-panel-config");
    if (!c)
      throw new Error("Failed to create ha-panel-config element");
    if (!((l = (r = (a = c.routerOptions) == null ? void 0 : a.routes) == null ? void 0 : r.automation) != null && l.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      c.routerOptions.routes.automation.load(),
      new Promise((d, p) => setTimeout(() => p(new Error("Timeout loading automation components")), 1e4))
    ]);
    const h = t.filter((d) => !customElements.get(d));
    if (h.length > 0)
      throw new Error(`Failed to load components: ${h.join(", ")}`);
  } catch (n) {
    console.error("Error loading Home Assistant form components:", n);
    try {
      if (window.customElements && window.customElements.get("home-assistant")) {
        console.log("Attempting fallback loading method for HA components");
        const c = new CustomEvent("ha-request-load-components", {
          detail: {
            components: t
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
};
let Ve = {}, Ne = !1;
async function wt() {
  if (!Ne)
    try {
      const o = new URL("./en.json", import.meta.url).href, t = await fetch(o);
      t.ok ? (Ve = await t.json(), Ne = !0) : console.error("Failed to load translations", t.status);
    } catch (o) {
      console.error("Failed to load translations", o);
    }
}
function w(o) {
  return Ve[o] || o;
}
var he = function(o, t, e, s) {
  var i = arguments.length, a = i < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, t, e, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, e, a) : r(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
console.log("[cleverio-edit-view] Module loaded");
var L, fe;
let F = (fe = class extends x {
  constructor() {
    super(...arguments);
    f(this, L, { time: "", portion: 1, daysMask: 0 });
    b(this, "_schema", [
      { name: "time", selector: { time: {} } },
      { name: "portion", selector: { number: { min: 1 } } }
    ]);
    b(this, "_haComponentsReady", !1);
  }
  get data() {
    return _(this, L);
  }
  set data(e) {
    g(this, L, e);
  }
  async connectedCallback() {
    super.connectedCallback(), console.log("[cleverio-edit-view] connectedCallback");
    try {
      await Ae(["ha-form", "ha-button", "ha-switch"]), this._haComponentsReady = !0, this.requestUpdate(), console.log("[cleverio-edit-view] HA components loaded"), console.log("[cleverio-edit-view] ha-button defined:", !!customElements.get("ha-button")), console.log("[cleverio-edit-view] ha-form defined:", !!customElements.get("ha-form")), console.log("[cleverio-edit-view] ha-switch defined:", !!customElements.get("ha-switch"));
    } catch (e) {
      console.error("[cleverio-edit-view] Error loading HA components", e);
    }
  }
  render() {
    return console.log("[cleverio-edit-view] render", { _haComponentsReady: this._haComponentsReady, data: this.data }), this._haComponentsReady ? m`
      <form class="edit-form" @submit=${this._onSave}>
        <h3 class="edit-title">Edit Meal</h3>
        <div style="display:flex; gap:0.5em; margin-bottom:0.5em; flex-wrap:wrap;">
          ${["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((e, s) => m`
            <ha-button
              outlined
              class="day-btn${this.data.daysMask & 1 << s ? " selected" : ""}"
              @click=${(i) => this._toggleDay(i, s)}
              style="min-width:2.5em; padding:0 0.5em;"
            >${e}</ha-button>
          `)}
        </div>
        <div style="margin-bottom:0.5em; display:flex; flex-direction:column; gap:0.5em;">
          <label for="time-input">Time:</label>
          <input id="time-input" type="time" .value=${this.data.time} @input=${(e) => this._onTimeInput(e)} required style="max-width: 120px;" />
        </div>
        <div style="margin-bottom:0.5em; display:flex; flex-direction:column; gap:0.5em;">
          <label for="portion-input">Portion:</label>
          <input id="portion-input" type="number" min="1" .value=${this.data.portion} @input=${(e) => this._onPortionInput(e)} required style="max-width: 80px;" />
        </div>
        <div style="display:flex; gap:0.5em; margin: 1em 0;">
          ${["07:00", "12:00", "18:00"].map((e) => m`<ha-button outlined @click=${(s) => this._suggestTime(s, e)}>${e}</ha-button>`)}
        </div>
        <div style="display:flex; gap:1em; justify-content:flex-end;">
          <ha-button @click=${this._onBack}>Back</ha-button>
          <ha-button type="submit">Save</ha-button>
        </div>
      </form>
    ` : m`<div>Loading Home Assistant components...</div>`;
  }
  _toggleDay(e, s) {
    e.preventDefault(), this.data = { ...this.data, daysMask: this.data.daysMask ^ 1 << s }, this.requestUpdate(), console.log("[cleverio-edit-view] _toggleDay", { i: s, daysMask: this.data.daysMask });
  }
  _suggestTime(e, s) {
    e.preventDefault(), this.data = { ...this.data, time: s }, this.requestUpdate(), console.log("[cleverio-edit-view] _suggestTime", { t: s });
  }
  _onFormValueChanged(e) {
    this.data = { ...this.data, ...e.detail.value }, this.requestUpdate(), console.log("[cleverio-edit-view] _onFormValueChanged", { value: e.detail.value });
  }
  _onBack(e) {
    e.preventDefault(), this.dispatchEvent(new CustomEvent("back", { bubbles: !0, composed: !0 })), console.log("[cleverio-edit-view] _onBack");
  }
  _onSave(e) {
    e.preventDefault(), this.dispatchEvent(new CustomEvent("save", { detail: { meal: this.data }, bubbles: !0, composed: !0 })), console.log("[cleverio-edit-view] _onSave", { meal: this.data });
  }
  _onTimeInput(e) {
    const s = e.target;
    this.data = { ...this.data, time: s.value }, this.requestUpdate(), console.log("[cleverio-edit-view] _onTimeInput", { value: s.value });
  }
  _onPortionInput(e) {
    const s = e.target;
    this.data = { ...this.data, portion: parseInt(s.value, 10) }, this.requestUpdate(), console.log("[cleverio-edit-view] _onPortionInput", { value: s.value });
  }
}, L = new WeakMap(), b(fe, "styles", [
  Ee,
  // language=css
  se`
      .day-btn.selected {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        font-weight: bold;
        border-radius: 16px;
        box-shadow: 0 0 0 2px var(--primary-color, #03a9f4) inset;
        border: 2px solid var(--primary-color, #03a9f4);
      }
      .day-btn {
        min-width: 2.5em;
        padding: 0 0.5em;
        font-weight: 500;
        border: 2px solid var(--divider-color, #bdbdbd);
        border-radius: 16px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #222);
        transition: border 0.2s, background 0.2s, color 0.2s;
      }
      .day-btn:not(.selected):hover {
        border: 2px solid var(--primary-color, #03a9f4);
        background: var(--primary-color, #e3f2fd);
        color: var(--primary-color, #03a9f4);
      }
      input[type="number"] {
        text-align: right;
      }
    `
]), fe);
he([
  v({ type: Object })
], F.prototype, "data", null);
he([
  D()
], F.prototype, "_schema", void 0);
he([
  D()
], F.prototype, "_haComponentsReady", void 0);
F = he([
  ce("cleverio-edit-view")
], F);
var I = function(o, t, e, s) {
  var i = arguments.length, a = i < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, t, e, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, e, a) : r(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
console.log("[cleverio-schedule-view] Module loaded");
var W, V, J, K, ge;
let O = (ge = class extends x {
  constructor() {
    super();
    f(this, W, []);
    f(this, V, []);
    f(this, J, "table");
    f(this, K, null);
    b(this, "_haComponentsReady", !1);
    this.meals = [], this._localMeals = [], this._view = "table", this._editIdx = null, console.log("[cleverio-schedule-view] Constructor");
  }
  get meals() {
    return _(this, W);
  }
  set meals(e) {
    g(this, W, e);
  }
  get _localMeals() {
    return _(this, V);
  }
  set _localMeals(e) {
    g(this, V, e);
  }
  get _view() {
    return _(this, J);
  }
  set _view(e) {
    g(this, J, e);
  }
  get _editIdx() {
    return _(this, K);
  }
  set _editIdx(e) {
    g(this, K, e);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), console.log("[cleverio-schedule-view] connectedCallback"), await Ae(["ha-data-table", "ha-switch", "ha-button"]), this._haComponentsReady = !0, console.log("[cleverio-schedule-view] HA components loaded");
  }
  // Watch for changes in meals
  updated(e) {
    e.has("meals") && (this._localMeals = this.meals.map((s) => ({ ...s })), this._view = "table", this._editIdx = null, console.log("[cleverio-schedule-view] Meals updated", this._localMeals));
  }
  render() {
    if (console.log("[cleverio-schedule-view] render", { _view: this._view, _editIdx: this._editIdx }), this._view === "edit")
      return this._renderEditView();
    if (!this._haComponentsReady)
      return m`<div>Loading Home Assistant components...</div>`;
    const e = {
      time: { title: w("time"), sortable: !0, minWidth: "60px", maxWidth: "80px" },
      portion: { title: w("portion"), sortable: !0, minWidth: "40px", maxWidth: "60px" },
      days: {
        title: w("days"),
        sortable: !1,
        minWidth: "80px",
        maxWidth: "110px",
        template: (i) => m`
          <div style="display:flex; gap:1px; flex-wrap:wrap;">
            ${["M", "T", "W", "T", "F", "S", "S"].map((a, r) => m`
              <span style="display:inline-block; width:1.2em; text-align:center; border-radius:8px; background:${i.daysMask & 1 << r ? "var(--primary-color, #03a9f4)" : "var(--card-background-color, #eee)"}; color:${i.daysMask & 1 << r ? "var(--text-primary-color, #fff)" : "#888"}; font-weight:bold;">${a}</span>
            `)}
          </div>`
      },
      enabled: { title: m`<span style="font-size:0.9em;">${w("enabled")}</span>`, sortable: !1, minWidth: "32px", maxWidth: "38px", width: "38px", className: "enabled-col", template: (i) => m`
        <ha-switch .checked=${i.enabled} @change=${(a) => this._toggleEnabled(i._idx, a)} title="Enable/disable schedule"></ha-switch>
      ` },
      actions: { title: m`<span style="font-size:0.9em;">${w("actions")}</span>`, sortable: !1, minWidth: "70px", maxWidth: "90px", width: "80px", className: "actions-col", template: (i) => m`
        <ha-button @click=${() => this._edit(i._idx)}>Edit</ha-button>
        <ha-button @click=${() => this._delete(i._idx)} style="margin-left:0.2em; background: var(--error-color, #b71c1c); color: #fff;">Delete</ha-button>
      ` }
    }, s = this._localMeals.map((i, a) => ({ ...i, _idx: a }));
    return m`
      <div class="ha-table-wrapper">
        <ha-data-table
          .localizeFunc=${w}
          .columns=${e}
          .data=${s}
          class="ha-table-style"
          style="width:100%; min-width:420px; max-width:600px; margin:auto;"
          auto-height
        ></ha-data-table>
      </div>
      <div class="ha-actions-row">
        <ha-button @click=${this._add.bind(this)}>Add</ha-button>
        <ha-button @click=${this._cancel.bind(this)}>Cancel</ha-button>
        <ha-button class="ha-primary" @click=${this._save.bind(this)}>${w("save")}</ha-button>
      </div>
    `;
  }
  _toggleEnabled(e, s) {
    this._localMeals[e].enabled = s.target.checked, this.requestUpdate(), console.log("[cleverio-schedule-view] _toggleEnabled", { idx: e, enabled: this._localMeals[e].enabled });
  }
  _edit(e) {
    this._editIdx = e, this._view = "edit", this.requestUpdate(), console.log("[cleverio-schedule-view] _edit", { idx: e });
  }
  _delete(e) {
    this._localMeals.splice(e, 1), this.requestUpdate(), console.log("[cleverio-schedule-view] _delete", { idx: e });
  }
  _add() {
    this._editIdx = null, this._view = "edit", this.requestUpdate(), console.log("[cleverio-schedule-view] _add");
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _cancel");
  }
  _save() {
    this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this._localMeals }, bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _save", { meals: this._localMeals });
  }
  _renderEditView() {
    const e = this._editIdx != null && this._localMeals[this._editIdx] ? this._localMeals[this._editIdx] : { time: "", portion: 1, daysMask: 0, enabled: !0 };
    return console.log("[cleverio-schedule-view] _renderEditView", { meal: e, _editIdx: this._editIdx }), m`
      <cleverio-edit-view
        .data=${e}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></cleverio-edit-view>
    `;
  }
  _onEditSave(e) {
    const s = e.detail.meal;
    this._editIdx != null ? this._localMeals[this._editIdx] = s : this._localMeals = [...this._localMeals, s], this._view = "table", this._editIdx = null, this.requestUpdate(), console.log("[cleverio-schedule-view] _onEditSave", { meal: s });
  }
  _onEditBack() {
    this._view = "table", this._editIdx = null, this.requestUpdate(), console.log("[cleverio-schedule-view] _onEditBack");
  }
}, W = new WeakMap(), V = new WeakMap(), J = new WeakMap(), K = new WeakMap(), b(ge, "styles", [
  Ee,
  yt,
  se`
      .ha-actions-row ha-button.ha-primary {
        background: var(--primary-color, #03a9f4) !important;
        color: var(--text-primary-color, #fff) !important;
      }
      .ha-actions-row ha-button.ha-primary:active,
      .ha-actions-row ha-button.ha-primary:focus {
        filter: brightness(0.95);
      }
      .ha-table-style th, .ha-table-style td {
        font-size: 0.92em;
        padding: 0.18em 0.15em;
        min-width: 0;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ha-table-style th.enabled-col, .ha-table-style td.enabled-col {
        min-width: 32px !important;
        max-width: 38px !important;
        width: 38px !important;
        text-align: center;
      }
      .ha-table-style th.actions-col, .ha-table-style td.actions-col {
        min-width: 70px !important;
        max-width: 90px !important;
        width: 80px !important;
        text-align: center;
      }
      .ha-table-wrapper {
        width: 100%;
        max-width: 100vw;
        overflow-x: auto;
        margin: 0 auto 1em auto;
      }
    `
]), ge);
I([
  v({ type: Array })
], O.prototype, "meals", null);
I([
  v({ type: Array })
], O.prototype, "_localMeals", null);
I([
  v({ type: String })
], O.prototype, "_view", null);
I([
  v({ type: Number })
], O.prototype, "_editIdx", null);
I([
  v({ type: Boolean })
], O.prototype, "_haComponentsReady", void 0);
O = I([
  ce("cleverio-schedule-view")
], O);
var C = function(o, t, e, s) {
  var i = arguments.length, a = i < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, t, e, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, e, a) : r(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Z, G, Q, X, Y, ee, ve;
let y = (ve = class extends x {
  constructor() {
    super();
    f(this, Z);
    f(this, G);
    f(this, Q);
    f(this, X);
    f(this, Y);
    f(this, ee);
    b(this, "_haComponentsReady", !1);
    b(this, "_onMealsChanged", (e) => {
      this._meals = e.detail.meals, this.requestUpdate();
    });
    this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return _(this, Z);
  }
  set hass(e) {
    g(this, Z, e);
  }
  get config() {
    return _(this, G);
  }
  set config(e) {
    g(this, G, e);
  }
  get _meals() {
    return _(this, Q);
  }
  set _meals(e) {
    g(this, Q, e);
  }
  get _persistedMeals() {
    return _(this, X);
  }
  set _persistedMeals(e) {
    g(this, X, e);
  }
  get _dialogOpen() {
    return _(this, Y);
  }
  set _dialogOpen(e) {
    g(this, Y, e);
  }
  get _dialogData() {
    return _(this, ee);
  }
  set _dialogData(e) {
    g(this, ee, e);
  }
  setConfig(e) {
    this.config = e, this._checkConfig(), this._updateConfig();
  }
  updated(e) {
    e.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await wt(), await Ae(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback(), this.requestUpdate();
  }
  get _sensorID() {
    var e;
    return (e = this.config) == null ? void 0 : e.sensor;
  }
  get _stateObj() {
    var e, s;
    return (s = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : s[this._sensorID];
  }
  get _attributes() {
    var e;
    return ((e = this._stateObj) == null ? void 0 : e.attributes) || {};
  }
  get _name() {
    return this._attributes.friendly_name || this._sensorID;
  }
  _checkConfig() {
    var e;
    if (!((e = this.config) != null && e.sensor))
      throw new Error("Please define a sensor!");
  }
  _updateConfig() {
    this.requestUpdate();
  }
  _updateHass() {
    const e = this._stateObj;
    let s;
    if (e)
      try {
        s = vt(e.state), Array.isArray(s) && (this._persistedMeals = s);
      } catch (i) {
        console.error("Failed to decode meal plan:", i);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []), this.requestUpdate();
  }
  render() {
    var a;
    if (!this._haComponentsReady)
      return m`<div>Loading Home Assistant components...</div>`;
    const e = this._meals.filter((r) => r.enabled).length, s = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" }), i = gt(this._meals.filter((r) => r.enabled), s) * 6;
    return m`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${((a = this.config) == null ? void 0 : a.title) || "Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this._meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${e}</span>
          <div class="overview-grams">Today: ${i}g (active)</div>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0, this.requestUpdate();
    }}>Manage schedules</ha-button>
        </section>
        ${this._dialogOpen ? m`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedule-view
                  .meals=${this._meals}
                  .localize=${w}
                  @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></cleverio-schedule-view>
              </ha-dialog>
            ` : ""}
        <slot></slot>
      </ha-card>
    `;
  }
  _onDialogClose() {
    this._dialogOpen = !1, this.requestUpdate();
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID)
      return;
    const e = bt(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: e
    });
  }
  _onScheduleMealsChanged(e) {
    this._dialogOpen = !1, this._meals = e.detail.meals, this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: e.detail.meals }, bubbles: !0, composed: !0 })), this.requestUpdate();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Et), document.createElement("card-editor");
  }
  static getStubConfig() {
    return { sensor: "", title: "Cleverio Pet Feeder" };
  }
  static getCardSize(e) {
    return 2;
  }
  // Legacy methods for test compatibility
  getNextSchedule() {
    return this._meals && this._meals.length ? this._meals[0].time : "-";
  }
  getTotalFoodPerDay() {
    return typeof He == "function" ? He(this._meals || []) : {};
  }
}, Z = new WeakMap(), G = new WeakMap(), Q = new WeakMap(), X = new WeakMap(), Y = new WeakMap(), ee = new WeakMap(), b(ve, "styles", [Ee, se``]), ve);
C([
  v({ type: Object })
], y.prototype, "hass", null);
C([
  v({ type: Object })
], y.prototype, "config", null);
C([
  D()
], y.prototype, "_meals", null);
C([
  D()
], y.prototype, "_persistedMeals", null);
C([
  D()
], y.prototype, "_dialogOpen", null);
C([
  D()
], y.prototype, "_dialogData", null);
C([
  v({ type: Boolean })
], y.prototype, "_haComponentsReady", void 0);
y = C([
  ce("cleverio-pf100-card")
], y);
var Je = function(o, t, e, s) {
  var i = arguments.length, a = i < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, t, e, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, e, a) : r(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, te, qe;
let le = (qe = class extends x {
  constructor() {
    super(...arguments);
    f(this, te);
  }
  get config() {
    return _(this, te);
  }
  set config(e) {
    g(this, te, e);
  }
  setConfig(e) {
    this.config = { ...e };
  }
  _onInput(e) {
    const { name: s, value: i } = e.target;
    this.config = { ...this.config, [s]: i }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }
  render() {
    return m`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ""} @input=${this._onInput} /></label>
      <label>Title:
        <input name="title" .value=${this.config.title || ""} @input=${this._onInput} /></label>
    `;
  }
}, te = new WeakMap(), qe);
Je([
  v({ attribute: !1 })
], le.prototype, "config", null);
le = Je([
  ce("cleverio-card-editor")
], le);
const Et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return le;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  y as CleverioPf100Card
};
