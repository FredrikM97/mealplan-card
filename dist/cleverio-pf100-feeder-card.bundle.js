var we = (o) => {
  throw TypeError(o);
};
var Ae = (o, e, t) => e.has(o) || we("Cannot " + t);
var y = (o, e, t) => (Ae(o, e, "read from private field"), t ? t.call(o) : e.get(o)), v = (o, e, t) => e.has(o) ? we("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), g = (o, e, t, s) => (Ae(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, fe = oe.ShadowRoot && (oe.ShadyCSS === void 0 || oe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ge = Symbol(), Ee = /* @__PURE__ */ new WeakMap();
let Ue = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== ge) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (fe && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Ee.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Ee.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Le = (o) => new Ue(typeof o == "string" ? o : o + "", void 0, ge), _e = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new Ue(t, o, ge);
}, ze = (o, e) => {
  if (fe) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = oe.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, Ce = fe ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Le(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Be, defineProperty: We, getOwnPropertyDescriptor: qe, getOwnPropertyNames: Ve, getOwnPropertySymbols: Je, getPrototypeOf: Ge } = Object, C = globalThis, Se = C.trustedTypes, Ke = Se ? Se.emptyScript : "", he = C.reactiveElementPolyfillSupport, B = (o, e) => o, ne = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Ke : null;
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
} }, $e = (o, e) => !Be(o, e), xe = { attribute: !0, type: String, converter: ne, reflect: !1, useDefault: !1, hasChanged: $e };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), C.litPropertyMetadata ?? (C.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = xe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && We(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = qe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const l = i == null ? void 0 : i.call(this);
      n == null || n.call(this, a), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? xe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const e = Ge(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const t = this.properties, s = [...Ve(t), ...Je(t)];
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
      for (const i of s) t.unshift(Ce(i));
    } else e !== void 0 && t.push(Ce(e));
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
    return ze(e, this.constructor.elementStyles), e;
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
      const a = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : ne).toAttribute(t, s.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, a;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), r = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : ne;
      this._$Em = i, this[i] = r.fromAttribute(t, l.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, a = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? $e)(a, t) || s.useDefault && s.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
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
        const { wrapped: l } = a, r = this[n];
        l !== !0 || this._$AL.has(n) || r === void 0 || this.C(n, void 0, a, r);
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
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[B("elementProperties")] = /* @__PURE__ */ new Map(), D[B("finalized")] = /* @__PURE__ */ new Map(), he == null || he({ ReactiveElement: D }), (C.reactiveElementVersions ?? (C.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, ae = W.trustedTypes, Me = ae ? ae.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, He = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, Fe = "?" + E, Ze = `<${Fe}>`, k = document, q = () => k.createComment(""), V = (o) => o === null || typeof o != "object" && typeof o != "function", ye = Array.isArray, Ye = (o) => ye(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", de = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Oe = /-->/g, Pe = />/g, M = RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ke = /'/g, Te = /"/g, je = /^(?:script|style|textarea|title)$/i, Qe = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), u = Qe(1), I = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), De = /* @__PURE__ */ new WeakMap(), O = k.createTreeWalker(k, 129);
function Ne(o, e) {
  if (!ye(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Me !== void 0 ? Me.createHTML(e) : e;
}
const Xe = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = z;
  for (let l = 0; l < t; l++) {
    const r = o[l];
    let c, p, h = -1, f = 0;
    for (; f < r.length && (a.lastIndex = f, p = a.exec(r), p !== null); ) f = a.lastIndex, a === z ? p[1] === "!--" ? a = Oe : p[1] !== void 0 ? a = Pe : p[2] !== void 0 ? (je.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = M) : p[3] !== void 0 && (a = M) : a === M ? p[0] === ">" ? (a = i ?? z, h = -1) : p[1] === void 0 ? h = -2 : (h = a.lastIndex - p[2].length, c = p[1], a = p[3] === void 0 ? M : p[3] === '"' ? Te : ke) : a === Te || a === ke ? a = M : a === Oe || a === Pe ? a = z : (a = M, i = void 0);
    const A = a === M && o[l + 1].startsWith("/>") ? " " : "";
    n += a === z ? r + Ze : h >= 0 ? (s.push(c), r.slice(0, h) + He + r.slice(h) + E + A) : r + E + (h === -2 ? l : A);
  }
  return [Ne(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class J {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const l = e.length - 1, r = this.parts, [c, p] = Xe(e, t);
    if (this.el = J.createElement(c, s), O.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = O.nextNode()) !== null && r.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(He)) {
          const f = p[a++], A = i.getAttribute(h).split(E), ie = /([.?@])?(.*)/.exec(f);
          r.push({ type: 1, index: n, name: ie[2], strings: A, ctor: ie[1] === "." ? tt : ie[1] === "?" ? st : ie[1] === "@" ? it : re }), i.removeAttribute(h);
        } else h.startsWith(E) && (r.push({ type: 6, index: n }), i.removeAttribute(h));
        if (je.test(i.tagName)) {
          const h = i.textContent.split(E), f = h.length - 1;
          if (f > 0) {
            i.textContent = ae ? ae.emptyScript : "";
            for (let A = 0; A < f; A++) i.append(h[A], q()), O.nextNode(), r.push({ type: 2, index: ++n });
            i.append(h[f], q());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Fe) r.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(E, h + 1)) !== -1; ) r.push({ type: 7, index: n }), h += E.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = k.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(o, e, t = o, s) {
  var a, l;
  if (e === I) return e;
  let i = s !== void 0 ? (a = t._$Co) == null ? void 0 : a[s] : t._$Cl;
  const n = V(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = L(o, i._$AS(o, e.values), i, s)), e;
}
class et {
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? k).importNode(t, !0);
    O.currentNode = i;
    let n = O.nextNode(), a = 0, l = 0, r = s[0];
    for (; r !== void 0; ) {
      if (a === r.index) {
        let c;
        r.type === 2 ? c = new se(n, n.nextSibling, this, e) : r.type === 1 ? c = new r.ctor(n, r.name, r.strings, this, e) : r.type === 6 && (c = new ot(n, this, e)), this._$AV.push(c), r = s[++l];
      }
      a !== (r == null ? void 0 : r.index) && (n = O.nextNode(), a++);
    }
    return O.currentNode = k, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class se {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = L(this, e, t), V(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== I && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ye(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && V(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = J.createElement(Ne(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const a = new et(i, this), l = a.u(this.options);
      a.p(t), this.T(l), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = De.get(e.strings);
    return t === void 0 && De.set(e.strings, t = new J(e)), t;
  }
  k(e) {
    ye(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new se(this.O(q()), this.O(q()), this, this.options)) : s = t[i], s._$AI(n), i++;
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
class re {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = m;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = L(this, e, t, 0), a = !V(e) || e !== this._$AH && e !== I, a && (this._$AH = e);
    else {
      const l = e;
      let r, c;
      for (e = n[0], r = 0; r < n.length - 1; r++) c = L(this, l[s + r], t, r), c === I && (c = this._$AH[r]), a || (a = !V(c) || c !== this._$AH[r]), c === m ? e = m : e !== m && (e += (c ?? "") + n[r + 1]), this._$AH[r] = c;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class tt extends re {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class st extends re {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class it extends re {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = L(this, e, t, 0) ?? m) === I) return;
    const s = this._$AH, i = e === m && s !== m || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== m && (s === m || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ot {
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
const pe = W.litHtmlPolyfillSupport;
pe == null || pe(J, se), (W.litHtmlVersions ?? (W.litHtmlVersions = [])).push("3.3.0");
const nt = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new se(e.insertBefore(q(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class S extends D {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = nt(t, this.renderRoot, this.renderOptions);
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
var Re;
S._$litElement$ = !0, S.finalized = !0, (Re = P.litElementHydrateSupport) == null || Re.call(P, { LitElement: S });
const ue = P.litElementPolyfillSupport;
ue == null || ue({ LitElement: S });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = { attribute: !0, type: String, converter: ne, reflect: !1, hasChanged: $e }, rt = (o = at, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), n.set(t.name, o), s === "accessor") {
    const { name: a } = t;
    return { set(l) {
      const r = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, r, o);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, o, l), l;
    } };
  }
  if (s === "setter") {
    const { name: a } = t;
    return function(l) {
      const r = this[a];
      e.call(this, l), this.requestUpdate(a, r, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function $(o) {
  return (e, t) => typeof t == "object" ? rt(o, e, t) : ((s, i, n) => {
    const a = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), a ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(o) {
  return $({ ...o, state: !0, attribute: !1 });
}
function lt(o) {
  const e = Array(7).fill(0);
  return o.forEach((t) => {
    if (t.enabled)
      for (let s = 0; s < 7; s++)
        t.daysMask & 1 << s && (e[s] += t.portion);
  }), e;
}
function ct(o, e) {
  let t = 0;
  return o.forEach((s) => {
    s.enabled && s.daysMask & 1 << e && (t += s.portion);
  }), t;
}
function ht(o) {
  if (!o || o === "unknown")
    return [];
  let e;
  try {
    e = atob(o);
  } catch {
    throw new Error("Invalid base64");
  }
  const t = new Uint8Array([...e].map((i) => i.charCodeAt(0)));
  if (t.length % 5 !== 0)
    throw new Error("Invalid meal plan length");
  const s = [];
  for (let i = 0; i < t.length; i += 5) {
    const [n, a, l, r, c] = t.slice(i, i + 5);
    s.push({
      time: `${a.toString().padStart(2, "0")}:${l.toString().padStart(2, "0")}`,
      daysMask: n,
      portion: r || 1,
      enabled: c === 1
    });
  }
  return s;
}
function dt(o) {
  const e = [];
  return o.forEach((t) => {
    const [s, i] = t.time.split(":").map(Number);
    e.push(t.daysMask, s, i, Number(t.portion), t.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...e));
}
const pt = [
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
], ve = async (o) => {
  var t, s, i, n, a, l;
  const e = o || pt;
  try {
    if (e.every((h) => customElements.get(h)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((h, f) => setTimeout(() => f(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
    ]);
    const r = document.createElement("partial-panel-resolver");
    if (!r)
      throw new Error("Failed to create partial-panel-resolver element");
    if (r.hass = {
      panels: [
        {
          url_path: "tmp",
          component_name: "config"
        }
      ]
    }, typeof r._updateRoutes != "function")
      throw new Error("partial-panel-resolver does not have _updateRoutes method");
    if (r._updateRoutes(), !((i = (s = (t = r.routerOptions) == null ? void 0 : t.routes) == null ? void 0 : s.tmp) != null && i.load))
      throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([
      r.routerOptions.routes.tmp.load(),
      new Promise((h, f) => setTimeout(() => f(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((h, f) => setTimeout(() => f(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const c = document.createElement("ha-panel-config");
    if (!c)
      throw new Error("Failed to create ha-panel-config element");
    if (!((l = (a = (n = c.routerOptions) == null ? void 0 : n.routes) == null ? void 0 : a.automation) != null && l.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      c.routerOptions.routes.automation.load(),
      new Promise((h, f) => setTimeout(() => f(new Error("Timeout loading automation components")), 1e4))
    ]);
    const p = e.filter((h) => !customElements.get(h));
    if (p.length > 0)
      throw new Error(`Failed to load components: ${p.join(", ")}`);
  } catch (r) {
    console.error("Error loading Home Assistant form components:", r);
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
}, ut = "Feed Now", mt = "Schedule", ft = "Portion", gt = "Days", _t = "Enabled", $t = "Edit Meal", yt = "Time", vt = "(1 portion = 6g)", bt = "Suggested:", wt = "Back", At = "Save", Et = "Status", Ct = "Actions", St = "Add Meal", xt = "Schedules", Mt = "Active Schedules", Ot = "Today", Pt = "Edit Feeding Time", kt = "Manage Schedules", Tt = "Unsaved changes", Dt = "You have unsaved changes. Don't forget to save!", Rt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Ut = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], Ht = "Avg/week", Ft = {
  feed_now: ut,
  schedule: mt,
  portion: ft,
  days: gt,
  enabled: _t,
  edit_meal: $t,
  time: yt,
  portion_helper: vt,
  suggested: bt,
  back: wt,
  save: At,
  status: Et,
  actions: Ct,
  delete: "Delete",
  add_meal: St,
  schedules: xt,
  active_schedules: Mt,
  today: Ot,
  edit_feeding_time: Pt,
  manage_schedules: kt,
  unsaved_changes: Tt,
  unsaved_changes_hint: Dt,
  days_short: Rt,
  days_full: Ut,
  avg_week: Ht
}, jt = "Mata nu", Nt = "Schema", It = "Portion", Lt = "Dagar", zt = "Aktiverad", Bt = "Redigera måltid", Wt = "Tid", qt = "(1 portion = 6g)", Vt = "Föreslaget:", Jt = "Tillbaka", Gt = "Spara", Kt = "Status", Zt = "Åtgärder", Yt = "Lägg till måltid", Qt = "Scheman", Xt = "Aktiva scheman", es = "Idag", ts = "Redigera matningstid", ss = "Hantera scheman", is = "Osparade ändringar", os = "Du har osparade ändringar. Glöm inte att spara!", ns = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"], as = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"], rs = "Snitt/vecka", ls = {
  feed_now: jt,
  schedule: Nt,
  portion: It,
  days: Lt,
  enabled: zt,
  edit_meal: Bt,
  time: Wt,
  portion_helper: qt,
  suggested: Vt,
  back: Jt,
  save: Gt,
  status: Kt,
  actions: Zt,
  delete: "Ta bort",
  add_meal: Yt,
  schedules: Qt,
  active_schedules: Xt,
  today: es,
  edit_feeding_time: ts,
  manage_schedules: ss,
  unsaved_changes: is,
  unsaved_changes_hint: os,
  days_short: ns,
  days_full: as,
  avg_week: rs
}, me = { en: Ft, sv: ls };
let Ie = "en";
function cs(o) {
  Ie = me[o] ? o : "en";
}
function d(o) {
  var e;
  return ((e = me[Ie]) == null ? void 0 : e[o]) || me.en[o] || o;
}
var ce = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, R;
let G = (R = class extends S {
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
    return u`
      <div class="days-row">
        ${e.map((t, s) => u`
          <span
            class="day-cell${this.selectedDaysMask & 1 << s ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(s)}
          >${t}</span>
        `)}
      </div>
    `;
  }
}, R.styles = _e`
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
  `, R);
ce([
  $({ type: Number })
], G.prototype, "selectedDaysMask", void 0);
ce([
  $({ type: Boolean })
], G.prototype, "editable", void 0);
ce([
  $({ type: Array })
], G.prototype, "dayLabels", void 0);
G = ce([
  le("cleverio-day-selector")
], G);
var T = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, U, H, F;
let x = (F = class extends S {
  constructor() {
    super();
    v(this, U);
    v(this, H);
    g(this, U, []), this.viewMeals = [], this.editForm = null, this.editError = null, this.editDialogOpen = !1, this.editIdx = null, g(this, H, !1), this.meals = [], this.viewMeals = [];
  }
  get meals() {
    return y(this, U);
  }
  set meals(t) {
    g(this, U, t);
  }
  get haComponentsReady() {
    return y(this, H);
  }
  set haComponentsReady(t) {
    g(this, H, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), await ve(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this.haComponentsReady = !0;
  }
  // Watch for changes in meals
  updated(t) {
    t.has("meals") && (this.viewMeals = this.meals.map((s) => ({ ...s })));
  }
  // Helper to check if there are unsaved changes
  get _hasUnsavedChanges() {
    const t = JSON.stringify(this.viewMeals), s = JSON.stringify(this.meals);
    return t !== s;
  }
  _toggleEnabled(t, s) {
    const i = s.target.checked;
    this.viewMeals = this.viewMeals.map((n, a) => a === t ? { ...n, enabled: i } : n);
  }
  _openEditDialog(t) {
    this.editDialogOpen = !0, this.editIdx = t, this.editForm = { ...this.viewMeals[t] }, this.editError = null;
  }
  _openAddDialog() {
    this.editDialogOpen = !0, this.editIdx = null, this.editForm = { time: "", portion: 1, daysMask: 0, enabled: !0 }, this.editError = null;
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
    this.meals = this.viewMeals.map((t) => ({ ...t })), this.dispatchEvent(new CustomEvent("save-schedule", { detail: { meals: this.viewMeals }, bubbles: !0, composed: !0 }));
  }
  render() {
    var n, a, l;
    if (!this.haComponentsReady)
      return u`<div>Loading Home Assistant components...</div>`;
    const t = {
      time: { title: d("time"), sortable: !0, minWidth: "80px" },
      portion: { title: d("portion"), sortable: !0, minWidth: "80px" },
      days: {
        title: d("days"),
        sortable: !1,
        minWidth: "130px",
        template: (r) => u`
          <cleverio-day-selector
            .selectedDaysMask=${r.daysMask}
            .editable=${!1}
          ></cleverio-day-selector>
        `
      },
      enabled: {
        title: d("enabled"),
        sortable: !0,
        minWidth: "60px",
        template: (r) => u`
          <div style="display: flex; align-items: center; justify-content: center; height: 48px;">
            <ha-switch
              .checked=${r.enabled}
              @change=${(c) => this._toggleEnabled(r._idx, c)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        `
      },
      actions: {
        title: d("actions"),
        sortable: !1,
        minWidth: "140px",
        template: (r) => u`
          <ha-icon-button @click=${() => this._openEditDialog(r._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(r._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        `
      }
    }, s = this.viewMeals.map((r, c) => ({ ...r, _idx: c })), i = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return u`
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? d("edit_feeding_time") : d("manage_schedules")}>

        ${this.editDialogOpen ? u`
              <form class="edit-form" @submit=${(r) => r.preventDefault()}>
                ${this.editError ? u`<div class="error">${this.editError}</div>` : ""}
                <cleverio-day-selector
                  class="edit-mode"
                  .selectedDaysMask=${((n = this.editForm) == null ? void 0 : n.daysMask) ?? 0}
                  .editable=${!0}
                  @days-changed=${(r) => {
      this.editForm.daysMask = r.detail.daysMask, this.requestUpdate();
    }}
                ></cleverio-day-selector>
                <div class="edit-form-group">
                  <label for="edit-time">${d("time")}</label>
                  <input
                    id="edit-time"
                    class="edit-time"
                    type="time"
                    .value=${((a = this.editForm) == null ? void 0 : a.time) ?? ""}
                    @input=${(r) => {
      this.editForm.time = r.target.value, this.requestUpdate();
    }}
                  />
                </div>
                <div class="edit-form-group">
                  <label for="edit-portion">Portion</label>
                  <input
                    id="edit-portion"
                    type="number"
                    min="1"
                    .value=${((l = this.editForm) == null ? void 0 : l.portion) ?? 1}
                    @input=${(r) => {
      this.editForm.portion = parseInt(r.target.value, 10), this.requestUpdate();
    }}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${i.map((r) => u`
                    <ha-button type="button" @click=${() => {
      this.editForm.time = r, this.requestUpdate();
    }}>${r}</ha-button>
                  `)}
                </div>
              </form>
            ` : u`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${d}
                  .columns=${t}
                  .data=${s}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editDialogOpen ? u`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>${d("back")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>${d("save")}</ha-button>
            ` : u`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>${d("add_meal")}</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>${d("cancel")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>${d("save")}</ha-button>
            `}
      </ha-dialog>
    `;
  }
  _onEditSave(t) {
    if (t && t.preventDefault(), !!this.editForm) {
      if (!this.editForm.time || !/^[0-2]\d:[0-5]\d$/.test(this.editForm.time)) {
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
}, U = new WeakMap(), H = new WeakMap(), F.styles = [
  _e`
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
], F);
T([
  $({ type: Array })
], x.prototype, "meals", null);
T([
  b()
], x.prototype, "viewMeals", void 0);
T([
  b()
], x.prototype, "editForm", void 0);
T([
  b()
], x.prototype, "editError", void 0);
T([
  b()
], x.prototype, "editDialogOpen", void 0);
T([
  $({ type: Boolean })
], x.prototype, "haComponentsReady", null);
x = T([
  le("cleverio-schedule-view")
], x);
var w = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, Z, Y, Q, X, ee, te, j, N;
let _ = (N = class extends S {
  constructor() {
    super();
    v(this, Z);
    v(this, Y);
    v(this, Q);
    v(this, X);
    v(this, ee);
    v(this, te);
    v(this, j);
    this._haComponentsReady = !1, g(this, j, []), this.footerButtonsTemplate = null, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return y(this, Z);
  }
  set hass(t) {
    g(this, Z, t);
  }
  get config() {
    return y(this, Y);
  }
  set config(t) {
    g(this, Y, t);
  }
  get _meals() {
    return y(this, Q);
  }
  set _meals(t) {
    g(this, Q, t);
  }
  get _persistedMeals() {
    return y(this, X);
  }
  set _persistedMeals(t) {
    g(this, X, t);
  }
  get _dialogOpen() {
    return y(this, ee);
  }
  set _dialogOpen(t) {
    g(this, ee, t);
  }
  get _dialogData() {
    return y(this, te);
  }
  set _dialogData(t) {
    g(this, te, t);
  }
  get _footerButtons() {
    return y(this, j);
  }
  set _footerButtons(t) {
    g(this, j, t);
  }
  setConfig(t) {
    this.config = t;
  }
  updated(t) {
    t.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await cs(this.hass.language), await ve(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback();
  }
  get _sensorID() {
    var t;
    return (t = this.config) == null ? void 0 : t.sensor;
  }
  get _stateObj() {
    var t, s;
    return (s = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : s[this._sensorID];
  }
  get _attributes() {
    var t;
    return ((t = this._stateObj) == null ? void 0 : t.attributes) || {};
  }
  get _name() {
    return this._attributes.friendly_name || this._sensorID;
  }
  _updateHass() {
    const t = this._stateObj;
    let s;
    if (t)
      try {
        s = ht(t.state), Array.isArray(s) && (this._persistedMeals = s);
      } catch (i) {
        console.error("Failed to decode meal plan:", i);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []);
  }
  render() {
    var t;
    return this._haComponentsReady ? u`
      <ha-card header=${((t = this.config) == null ? void 0 : t.title) || "Cleverio Pet Feeder"} style="height: 100%;">
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${d("schedules")}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${d("active_schedules")}: <span style="white-space:nowrap;">${this._meals.filter((s) => s.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${d("today")}: <span style="white-space:nowrap;">${ct(this._meals.filter((s) => s.enabled), (/* @__PURE__ */ new Date()).getDay()) * 6}g</span>
          </ha-chip>
          <ha-chip class="overview-average">
            <ha-icon icon="mdi:scale-balance"></ha-icon>
            ${d("avg_week")}: <span style="white-space:nowrap;">
              ${(lt(this._meals.filter((n) => n.enabled)).reduce((n, a) => n + a, 0) / 7 * 6).toFixed(1)}g
            </span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0;
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${d("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? u`
              <cleverio-schedule-view
                .meals=${this._meals}
                .localize=${d}
                @save-schedule=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                @footer-buttons-changed=${this._onFooterButtonsChanged.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : u`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => hs), document.createElement("cleverio-card-editor");
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID)
      return;
    const t = dt(this._meals);
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
  _onFooterButtonsChanged(t) {
    this.footerButtonsTemplate = t.detail.template;
  }
}, Z = new WeakMap(), Y = new WeakMap(), Q = new WeakMap(), X = new WeakMap(), ee = new WeakMap(), te = new WeakMap(), j = new WeakMap(), N.styles = [
  _e`
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
], N);
w([
  $({ type: Object })
], _.prototype, "hass", null);
w([
  $({ type: Object })
], _.prototype, "config", null);
w([
  b()
], _.prototype, "_meals", null);
w([
  b()
], _.prototype, "_persistedMeals", null);
w([
  b()
], _.prototype, "_dialogOpen", null);
w([
  b()
], _.prototype, "_dialogData", null);
w([
  $({ type: Boolean })
], _.prototype, "_haComponentsReady", void 0);
w([
  b()
], _.prototype, "_footerButtons", null);
w([
  b()
], _.prototype, "footerButtonsTemplate", void 0);
_ = w([
  le("cleverio-pf100-card")
], _);
var be = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
};
let K = class extends S {
  constructor() {
    super(...arguments), this.config = { sensor: "", title: "" };
  }
  setConfig(e) {
    this.config = { ...e };
  }
  async connectedCallback() {
    await ve(["ha-entity-picker", "ha-form", "ha-textfield"]), this._haComponentsReady = !0, super.connectedCallback();
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
    return !!this.config.sensor;
  }
  render() {
    var e, t;
    return this._haComponentsReady ? u`
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
      <ha-textfield
        id="title"
        name="title"
        .value=${this.config.title || ""}
        @input=${this._onInput}
        .label=${((t = (e = this.hass) == null ? void 0 : e.localize) == null ? void 0 : t.call(e, "ui.card.config.title_label")) || "Title"}
        placeholder="Title"
      ></ha-textfield>
      ${this._validateConfig() ? "" : u`<div style="color: var(--error-color, red); margin-top: 8px;">Please select a sensor entity.</div>`}
    ` : u`<div>Loading Home Assistant components...</div>`;
  }
};
be([
  $({ attribute: !1 })
], K.prototype, "config", void 0);
be([
  $({ attribute: !1 })
], K.prototype, "hass", void 0);
K = be([
  le("cleverio-card-editor")
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
  _ as CleverioPf100Card
};
