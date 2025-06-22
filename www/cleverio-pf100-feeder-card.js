var xe = (o) => {
  throw TypeError(o);
};
var Ae = (o, e, t) => e.has(o) || xe("Cannot " + t);
var b = (o, e, t) => (Ae(o, e, "read from private field"), t ? t.call(o) : e.get(o)), v = (o, e, t) => e.has(o) ? xe("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), f = (o, e, t, s) => (Ae(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis, be = le.ShadowRoot && (le.ShadyCSS === void 0 || le.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ve = Symbol(), Ce = /* @__PURE__ */ new WeakMap();
let Ie = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== ve) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (be && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Ce.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Ce.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ve = (o) => new Ie(typeof o == "string" ? o : o + "", void 0, ve), B = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[r + 1], o[0]);
  return new Ie(t, o, ve);
}, Je = (o, e) => {
  if (be) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = le.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, Se = be ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ve(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ke, defineProperty: Ze, getOwnPropertyDescriptor: Ge, getOwnPropertyNames: Qe, getOwnPropertySymbols: Xe, getPrototypeOf: Ye } = Object, E = globalThis, ke = E.trustedTypes, et = ke ? ke.emptyScript : "", me = E.reactiveElementPolyfillSupport, V = (o, e) => o, ce = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? et : null;
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
} }, ye = (o, e) => !Ke(o, e), Me = { attribute: !0, type: String, converter: ce, reflect: !1, useDefault: !1, hasChanged: ye };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let U = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Me) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Ze(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: r } = Ge(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const n = i == null ? void 0 : i.call(this);
      r == null || r.call(this, a), this.requestUpdate(e, n, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Me;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = Ye(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const t = this.properties, s = [...Qe(t), ...Xe(t)];
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
      for (const i of s) t.unshift(Se(i));
    } else e !== void 0 && t.push(Se(e));
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
    return Je(e, this.constructor.elementStyles), e;
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
    var r;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const a = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : ce).toAttribute(t, s.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var r, a;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), l = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((r = n.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? n.converter : ce;
      this._$Em = i, this[i] = l.fromAttribute(t, n.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const r = this.constructor, a = this[e];
      if (s ?? (s = r.getPropertyOptions(e)), !((s.hasChanged ?? ye)(a, t) || s.useDefault && s.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(r._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: r }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, a] of i) {
        const { wrapped: n } = a, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, a, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var r;
        return (r = i.hostUpdate) == null ? void 0 : r.call(i);
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
U.elementStyles = [], U.shadowRootOptions = { mode: "open" }, U[V("elementProperties")] = /* @__PURE__ */ new Map(), U[V("finalized")] = /* @__PURE__ */ new Map(), me == null || me({ ReactiveElement: U }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, de = J.trustedTypes, Pe = de ? de.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ze = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, Le = "?" + w, tt = `<${Le}>`, k = document, K = () => k.createComment(""), Z = (o) => o === null || typeof o != "object" && typeof o != "function", $e = Array.isArray, st = (o) => $e(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", fe = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Oe = /-->/g, Ue = />/g, A = RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Te = /'/g, Re = /"/g, qe = /^(?:script|style|textarea|title)$/i, it = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), p = it(1), z = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), De = /* @__PURE__ */ new WeakMap(), C = k.createTreeWalker(k, 129);
function Be(o, e) {
  if (!$e(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pe !== void 0 ? Pe.createHTML(e) : e;
}
const ot = (o, e) => {
  const t = o.length - 1, s = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = W;
  for (let n = 0; n < t; n++) {
    const l = o[n];
    let d, h, c = -1, m = 0;
    for (; m < l.length && (a.lastIndex = m, h = a.exec(l), h !== null); ) m = a.lastIndex, a === W ? h[1] === "!--" ? a = Oe : h[1] !== void 0 ? a = Ue : h[2] !== void 0 ? (qe.test(h[2]) && (i = RegExp("</" + h[2], "g")), a = A) : h[3] !== void 0 && (a = A) : a === A ? h[0] === ">" ? (a = i ?? W, c = -1) : h[1] === void 0 ? c = -2 : (c = a.lastIndex - h[2].length, d = h[1], a = h[3] === void 0 ? A : h[3] === '"' ? Re : Te) : a === Re || a === Te ? a = A : a === Oe || a === Ue ? a = W : (a = A, i = void 0);
    const $ = a === A && o[n + 1].startsWith("/>") ? " " : "";
    r += a === W ? l + tt : c >= 0 ? (s.push(d), l.slice(0, c) + ze + l.slice(c) + w + $) : l + w + (c === -2 ? n : $);
  }
  return [Be(o, r + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class G {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let r = 0, a = 0;
    const n = e.length - 1, l = this.parts, [d, h] = ot(e, t);
    if (this.el = G.createElement(d, s), C.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = C.nextNode()) !== null && l.length < n; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(ze)) {
          const m = h[a++], $ = i.getAttribute(c).split(w), ne = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: r, name: ne[2], strings: $, ctor: ne[1] === "." ? at : ne[1] === "?" ? nt : ne[1] === "@" ? lt : ue }), i.removeAttribute(c);
        } else c.startsWith(w) && (l.push({ type: 6, index: r }), i.removeAttribute(c));
        if (qe.test(i.tagName)) {
          const c = i.textContent.split(w), m = c.length - 1;
          if (m > 0) {
            i.textContent = de ? de.emptyScript : "";
            for (let $ = 0; $ < m; $++) i.append(c[$], K()), C.nextNode(), l.push({ type: 2, index: ++r });
            i.append(c[m], K());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Le) l.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(w, c + 1)) !== -1; ) l.push({ type: 7, index: r }), c += w.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = k.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(o, e, t = o, s) {
  var a, n;
  if (e === z) return e;
  let i = s !== void 0 ? (a = t._$Co) == null ? void 0 : a[s] : t._$Cl;
  const r = Z(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((n = i == null ? void 0 : i._$AO) == null || n.call(i, !1), r === void 0 ? i = void 0 : (i = new r(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = L(o, i._$AS(o, e.values), i, s)), e;
}
class rt {
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
    C.currentNode = i;
    let r = C.nextNode(), a = 0, n = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let d;
        l.type === 2 ? d = new oe(r, r.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (d = new ct(r, this, e)), this._$AV.push(d), l = s[++n];
      }
      a !== (l == null ? void 0 : l.index) && (r = C.nextNode(), a++);
    }
    return C.currentNode = k, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class oe {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = L(this, e, t), Z(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== z && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : st(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && Z(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = G.createElement(Be(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(t);
    else {
      const a = new rt(i, this), n = a.u(this.options);
      a.p(t), this.T(n), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = De.get(e.strings);
    return t === void 0 && De.set(e.strings, t = new G(e)), t;
  }
  k(e) {
    $e(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const r of e) i === t.length ? t.push(s = new oe(this.O(K()), this.O(K()), this, this.options)) : s = t[i], s._$AI(r), i++;
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
class ue {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(e, t = this, s, i) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = L(this, e, t, 0), a = !Z(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
    else {
      const n = e;
      let l, d;
      for (e = r[0], l = 0; l < r.length - 1; l++) d = L(this, n[s + l], t, l), d === z && (d = this._$AH[l]), a || (a = !Z(d) || d !== this._$AH[l]), d === u ? e = u : e !== u && (e += (d ?? "") + r[l + 1]), this._$AH[l] = d;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class at extends ue {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class nt extends ue {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class lt extends ue {
  constructor(e, t, s, i, r) {
    super(e, t, s, i, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = L(this, e, t, 0) ?? u) === z) return;
    const s = this._$AH, i = e === u && s !== u || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ct {
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
const _e = J.litHtmlPolyfillSupport;
_e == null || _e(G, oe), (J.litHtmlVersions ?? (J.litHtmlVersions = [])).push("3.3.0");
const dt = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new oe(e.insertBefore(K(), r), r, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class y extends U {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = dt(t, this.renderRoot, this.renderOptions);
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
    return z;
  }
}
var He;
y._$litElement$ = !0, y.finalized = !0, (He = S.litElementHydrateSupport) == null || He.call(S, { LitElement: y });
const ge = S.litElementPolyfillSupport;
ge == null || ge({ LitElement: y });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht = { attribute: !0, type: String, converter: ce, reflect: !1, hasChanged: ye }, pt = (o = ht, e, t) => {
  const { kind: s, metadata: i } = t;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), r.set(t.name, o), s === "accessor") {
    const { name: a } = t;
    return { set(n) {
      const l = e.get.call(this);
      e.set.call(this, n), this.requestUpdate(a, l, o);
    }, init(n) {
      return n !== void 0 && this.C(a, void 0, o, n), n;
    } };
  }
  if (s === "setter") {
    const { name: a } = t;
    return function(n) {
      const l = this[a];
      e.call(this, n), this.requestUpdate(a, l, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function g(o) {
  return (e, t) => typeof t == "object" ? pt(o, e, t) : ((s, i, r) => {
    const a = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function P(o) {
  return g({ ...o, state: !0, attribute: !1 });
}
function je(o) {
  const e = Array(7).fill(0);
  return o.forEach((t) => {
    if (t.enabled)
      for (let s = 0; s < 7; s++)
        t.daysMask & 1 << s && (e[s] += t.portion);
  }), e;
}
function ut(o, e) {
  let t = 0;
  return o.forEach((s) => {
    s.enabled && s.daysMask & 1 << e && (t += s.portion);
  }), t;
}
function mt(o) {
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
    const [r, a, n, l, d] = t.slice(i, i + 5);
    s.push({
      time: `${a.toString().padStart(2, "0")}:${n.toString().padStart(2, "0")}`,
      daysMask: r,
      portion: l || 1,
      enabled: d === 1
    });
  }
  return s;
}
function ft(o) {
  const e = [];
  return o.forEach((t) => {
    const [s, i] = t.time.split(":").map(Number);
    e.push(t.daysMask, s, i, Number(t.portion), t.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...e));
}
const Fe = B`
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
`;
B`
  .ha-table-style {
    background: var(--ha-card-background, var(--card-background-color, #222));
    color: var(--primary-text-color);
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1.5px solid var(--divider-color, #444);
    border-collapse: separate;
    border-spacing: 0;
    box-shadow: none;
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
`;
const _t = [
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
], we = async (o) => {
  var t, s, i, r, a, n;
  const e = o || _t;
  try {
    if (e.every((c) => customElements.get(c)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((c, m) => setTimeout(() => m(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
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
      new Promise((c, m) => setTimeout(() => m(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((c, m) => setTimeout(() => m(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const d = document.createElement("ha-panel-config");
    if (!d)
      throw new Error("Failed to create ha-panel-config element");
    if (!((n = (a = (r = d.routerOptions) == null ? void 0 : r.routes) == null ? void 0 : a.automation) != null && n.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      d.routerOptions.routes.automation.load(),
      new Promise((c, m) => setTimeout(() => m(new Error("Timeout loading automation components")), 1e4))
    ]);
    const h = e.filter((c) => !customElements.get(c));
    if (h.length > 0)
      throw new Error(`Failed to load components: ${h.join(", ")}`);
  } catch (l) {
    console.error("Error loading Home Assistant form components:", l);
    try {
      if (window.customElements && window.customElements.get("home-assistant")) {
        console.log("Attempting fallback loading method for HA components");
        const d = new CustomEvent("ha-request-load-components", {
          detail: {
            components: e
          },
          bubbles: !0,
          composed: !0
        });
        document.dispatchEvent(d);
      }
    } catch (d) {
      console.error("Fallback loading method failed:", d);
    }
  }
};
let gt = {};
function _(o) {
  return gt[o] || o;
}
var Ee = function(o, e, t, s) {
  var i = arguments.length, r = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (a = o[n]) && (r = (i < 3 ? a(r) : i > 3 ? a(e, t, r) : a(e, t)) || r);
  return i > 3 && r && Object.defineProperty(e, t, r), r;
};
const bt = ["M", "T", "W", "T", "F", "S", "S"], vt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var T;
let he = (T = class extends y {
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
    const e = this.editable;
    return p`
      <div class="days-row${e ? " days-row-edit" : ""}">
        ${bt.map((t, s) => p`
          <span
            class="day-cell${e ? " day-cell-edit" : ""}${this.selectedDaysMask & 1 << s ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(s)}
            title=${vt[s]}
          >${t}</span>
        `)}
      </div>
    `;
  }
}, T.styles = B`
    .days-row {
      display: flex;
      gap: 1px;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      margin: 0.2em 0 0.4em 0;
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
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      cursor: pointer;
      user-select: none;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .day-cell.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 2px 6px rgba(3,169,244,0.10);
    }
    .day-cell.readonly {
      cursor: default;
      opacity: 0.7;
    }
    /* Improved, larger style for edit view only */
    .days-row-edit {
      gap: 4px;
      justify-content: center;
      margin: 0.5em 0 0.7em 0;
    }
    .day-cell-edit {
      width: 2.3em;
      height: 2.3em;
      line-height: 2.3em;
      border-radius: 8px;
      font-size: 1.15em;
      margin: 0 2px;
    }
  `, T);
Ee([
  g({ type: Number })
], he.prototype, "selectedDaysMask", void 0);
Ee([
  g({ type: Boolean })
], he.prototype, "editable", void 0);
he = Ee([
  re("cleverio-day-selector")
], he);
var ae = function(o, e, t, s) {
  var i = arguments.length, r = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (a = o[n]) && (r = (i < 3 ? a(r) : i > 3 ? a(e, t, r) : a(e, t)) || r);
  return i > 3 && r && Object.defineProperty(e, t, r), r;
}, Q, R;
let q = (R = class extends y {
  constructor() {
    super();
    v(this, Q);
    this._haComponentsReady = !1, this._localEdit = null, this._error = null, this._onEditSave = (t) => {
      if (t.preventDefault(), !!this._localEdit) {
        if (!this._localEdit.time || !/^\d{2}:\d{2}$/.test(this._localEdit.time)) {
          this._error = "Please enter a valid time.", this.requestUpdate();
          return;
        }
        if (!this._localEdit.portion || this._localEdit.portion < 1) {
          this._error = "Portion must be at least 1.", this.requestUpdate();
          return;
        }
        this._error = null, this.dispatchEvent(new CustomEvent("edit-save", {
          detail: { meal: this._localEdit },
          bubbles: !0,
          composed: !0
        })), this.dispatchEvent(new CustomEvent("back", { bubbles: !0, composed: !0 }));
      }
    };
  }
  get data() {
    return b(this, Q);
  }
  set data(t) {
    f(this, Q, t);
  }
  async connectedCallback() {
    super.connectedCallback(), await we(["ha-form", "ha-button", "ha-switch"]), this._haComponentsReady = !0;
  }
  updated(t) {
    t.has("data") && this.data && (this._localEdit = { ...this.data }, this._error = null);
  }
  render() {
    if (!this._haComponentsReady || !this._localEdit)
      return p`<div>Loading…</div>`;
    const t = this._localEdit, s = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return p`
      <form class="edit-form" @submit=${(i) => i.preventDefault()}>
        ${this._error ? p`<div class="error">${this._error}</div>` : ""}
        <cleverio-day-selector
          .selectedDaysMask=${t.daysMask}
          .editable=${!0}
          @days-changed=${(i) => this._onDaysChanged(i)}
        ></cleverio-day-selector>
        <div class="form-group">
          <label for="edit-time">Time</label>
          <input
            id="edit-time"
            class="edit-time"
            type="time"
            .value=${t.time}
            @input=${(i) => t.time = i.target.value}
          />
        </div>
        <div class="form-group">
          <label for="edit-portion">Portion</label>
          <input
            id="edit-portion"
            type="number"
            min="1"
            .value=${t.portion}
            @input=${(i) => t.portion = parseInt(i.target.value, 10)}
          />
          <div class="helper">1 portion = 6 grams</div>
        </div>
        <div class="predefined-times">
          ${s.map((i) => p`
            <ha-button type="button" @click=${() => {
      t.time = i, this.requestUpdate();
    }}>${i}</ha-button>
          `)}
        </div>
        <div class="edit-actions">
          <ha-button type="button" @click=${() => this.dispatchEvent(new CustomEvent("back", { bubbles: !0, composed: !0 }))}>Back</ha-button>
          <ha-button class="ha-primary save-btn" type="button" @click=${this._onEditSave}>Save</ha-button>
        </div>
      </form>
    `;
  }
  _onDaysChanged(t) {
    this._localEdit && (this._localEdit.daysMask = t.detail.daysMask, this.requestUpdate());
  }
}, Q = new WeakMap(), R.styles = B`
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.2em;
      padding: 1.2em 0.5em 0.5em 0.5em;
      min-width: 260px;
      max-width: 350px;
      margin: 0 auto;
    }
    .error {
      color: var(--error-color, #b71c1c);
      background: #fff0f0;
      border-radius: 4px;
      padding: 0.5em 0.8em;
      margin-bottom: 0.5em;
      font-size: 0.98em;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3em;
    }
    label {
      font-size: 1em;
      font-weight: 500;
      margin-bottom: 0.1em;
      color: var(--primary-text-color, #333);
    }
    .helper {
      font-size: 0.92em;
      color: #888;
      margin-top: -0.2em;
      margin-bottom: 0.2em;
    }
    .predefined-times {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      margin: 0.5em 0 0.5em 0;
      justify-content: flex-start;
    }
    .edit-actions {
      display: flex;
      flex-direction: row;
      gap: 1em;
      justify-content: flex-end;
      margin-top: 1.2em;
    }
    .edit-actions ha-button:first-child {
      order: 1;
    }
    .edit-actions .save-btn {
      order: 2;
    }
  `, R);
ae([
  g({ type: Object })
], q.prototype, "data", null);
ae([
  P()
], q.prototype, "_haComponentsReady", void 0);
ae([
  P()
], q.prototype, "_localEdit", void 0);
ae([
  P()
], q.prototype, "_error", void 0);
q = ae([
  re("cleverio-edit-view")
], q);
var F = function(o, e, t, s) {
  var i = arguments.length, r = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (a = o[n]) && (r = (i < 3 ? a(r) : i > 3 ? a(e, t, r) : a(e, t)) || r);
  return i > 3 && r && Object.defineProperty(e, t, r), r;
}, D, j, H, N;
let M = (N = class extends y {
  constructor() {
    super();
    v(this, D);
    v(this, j);
    v(this, H);
    f(this, D, []), f(this, j, []), f(this, H, !1), this._editIdx = null, this._hasUnsavedChanges = !1, this._mode = "table", this.meals = [], this._localMeals = [], console.log("[cleverio-schedule-view] Constructor");
  }
  get meals() {
    return b(this, D);
  }
  set meals(t) {
    f(this, D, t);
  }
  get _localMeals() {
    return b(this, j);
  }
  set _localMeals(t) {
    f(this, j, t);
  }
  get _haComponentsReady() {
    return b(this, H);
  }
  set _haComponentsReady(t) {
    f(this, H, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), await we(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this._haComponentsReady = !0;
  }
  // Watch for changes in meals
  updated(t) {
    t.has("meals") && (this._localMeals = this.meals.map((s) => ({ ...s })), this._hasUnsavedChanges = !1, console.log("[cleverio-schedule-view] Meals updated", this._localMeals));
  }
  render() {
    if (!this._haComponentsReady)
      return p`<div>Loading Home Assistant components...</div>`;
    if (this._mode === "edit")
      return p`
        <cleverio-edit-view
          .data=${this._editIdx !== null && this._editIdx !== void 0 ? { ...this._localMeals[this._editIdx] } : { time: "", portion: 1, daysMask: 0, enabled: !0 }}
          @edit-save=${this._onEditSave}
          @back=${this._onEditBack}
        ></cleverio-edit-view>
      `;
    const t = {
      time: { title: _("time"), sortable: !0, minWidth: "80px" },
      portion: { title: _("portion"), sortable: !0, minWidth: "80px" },
      days: {
        title: _("days"),
        sortable: !1,
        minWidth: "125px",
        template: (r) => p`
          <cleverio-day-selector .selectedDaysMask=${r.daysMask} .editable=${!1}></cleverio-day-selector>`
      },
      enabled: {
        title: p`<span style="font-size:0.9em;">${_("enabled")}</span>`,
        sortable: !1,
        minWidth: "70px",
        cellClass: "enabled-cell",
        template: (r) => p`
          <div class="switch-flex"><ha-switch .checked=${r.enabled} @change=${(a) => this._toggleEnabled(r._idx, a)} title="Enable/disable schedule"></ha-switch></div>
        `
      },
      actions: {
        title: p`<span style="font-size:0.9em;">${_("actions")}</span>`,
        sortable: !1,
        minWidth: "100px",
        template: (r) => p`
          <ha-icon
            icon="mdi:pencil"
            @click=${() => this._openEditDialog(r._idx)}
            title="Edit"
            style="cursor:pointer;margin-right:8px;"
            tabindex="0"
            role="button"
          ></ha-icon>
          <ha-icon
            icon="mdi:delete"
            @click=${() => this._delete(r._idx)}
            title="Delete"
            style="color: var(--error-color, #b71c1c); cursor:pointer;"
            tabindex="0"
            role="button"
          ></ha-icon>
        `
      }
    }, s = this._localMeals.map((r, a) => ({ ...r, _idx: a }));
    return p`
      <div class="ha-table-wrapper">
        <ha-data-table
          .hass=${{ locale: { language: "en", country: "US" } }}
          .localizeFunc=${_}
          .columns=${t}
          .data=${s}
          class="ha-table-style"
          auto-height
        ></ha-data-table>
      </div>
      <div class="ha-actions-row">
        <ha-button @click=${this._openAddDialog.bind(this)}>Add</ha-button>
        <ha-button @click=${this._cancel.bind(this)}>Cancel</ha-button>
        <ha-button class="ha-primary" @click=${() => {
      this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this._localMeals }, bubbles: !0, composed: !0 })), this._hasUnsavedChanges = !1;
    }}>
          ${_("save")}
        </ha-button>
      </div>
      ${this._hasUnsavedChanges ? p`<div class="save-note">Unsaved changes</div>` : ""}
    `;
  }
  _markUnsaved() {
    const t = JSON.stringify(this.meals), s = JSON.stringify(this._localMeals);
    this._hasUnsavedChanges = t !== s;
  }
  _toggleEnabled(t, s) {
    this._localMeals[t].enabled = s.target.checked, this.requestUpdate(), this._markUnsaved();
  }
  _openEditDialog(t) {
    this._mode = "edit", this._editIdx = t, this.requestUpdate();
  }
  _openAddDialog() {
    this._mode = "edit", this._editIdx = null, this.requestUpdate();
  }
  _onEditBack() {
    this._mode = "table", this._editIdx = null, this.requestUpdate();
  }
  _onEditSave(t) {
    const s = t.detail.meal;
    this._editIdx !== null && this._editIdx !== void 0 ? this._localMeals[this._editIdx] = s : this._localMeals = [...this._localMeals, s], this._mode = "table", this._editIdx = null, this.requestUpdate(), this._markUnsaved();
  }
  _delete(t) {
    this._localMeals.splice(t, 1), this.requestUpdate(), this._markUnsaved();
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 }));
  }
}, D = new WeakMap(), j = new WeakMap(), H = new WeakMap(), N.styles = [
  Fe,
  B`
      .ha-actions-row {
        display: flex;
        gap: 0.5em;
        justify-content: flex-end;
        margin: 1em 0 0 0;
      }
      .ha-table-wrapper {
        margin: 0 auto 1em auto;
      }
      .days-row {
        display: flex;
        gap: 1px;
        flex-wrap: wrap;
        align-items: center;
        white-space: normal;
        word-break: break-word;
      }
      .day-cell {
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
      }
      .day-cell.selected {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
      }
      .switch-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 4px;
        padding-bottom: 4px;
      }
      .ha-table-style td, .ha-table-style th {
        padding: 0 4px;
        vertical-align: middle;
        border: none;
      }
      .ha-table-style td.enabled-cell, .ha-table-style th.enabled-cell {
        width: 70px;
        min-width: 70px;
        max-width: 80px;
        text-align: center;
        padding: 0;
        overflow: visible;
        position: relative;
        vertical-align: middle;
      }
      .switch-flex {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 40px;
      }
      .ha-table-style td.enabled-cell ha-switch {
        min-width: 48px;
        min-height: 32px;
        max-width: 100%;
        z-index: 1;
        position: relative;
        margin: 0;
      }
      .ha-table-style td.enabled-cell {
        background: transparent;
      }
      :host ::ng-deep .mdc-data-table__cell,
      :host ::ng-deep .mdc-data-table__header-cell {
        box-sizing: content-box !important;
      }
    `
], N);
F([
  g({ type: Array })
], M.prototype, "meals", null);
F([
  g({ type: Array })
], M.prototype, "_localMeals", null);
F([
  g({ type: Boolean })
], M.prototype, "_haComponentsReady", null);
F([
  P()
], M.prototype, "_hasUnsavedChanges", void 0);
F([
  g({ type: String })
], M.prototype, "_mode", void 0);
M = F([
  re("cleverio-schedule-view")
], M);
var O = function(o, e, t, s) {
  var i = arguments.length, r = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (a = o[n]) && (r = (i < 3 ? a(r) : i > 3 ? a(e, t, r) : a(e, t)) || r);
  return i > 3 && r && Object.defineProperty(e, t, r), r;
}, X, Y, ee, te, se, I;
let x = (I = class extends y {
  constructor() {
    super();
    v(this, X);
    v(this, Y);
    v(this, ee);
    v(this, te);
    v(this, se);
    this._haComponentsReady = !1, this._onMealsChanged = (t) => {
      this._meals = t.detail.meals, this.requestUpdate();
    }, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1;
  }
  get hass() {
    return b(this, X);
  }
  set hass(t) {
    f(this, X, t);
  }
  get config() {
    return b(this, Y);
  }
  set config(t) {
    f(this, Y, t);
  }
  get _meals() {
    return b(this, ee);
  }
  set _meals(t) {
    f(this, ee, t);
  }
  get _persistedMeals() {
    return b(this, te);
  }
  set _persistedMeals(t) {
    f(this, te, t);
  }
  get _dialogOpen() {
    return b(this, se);
  }
  set _dialogOpen(t) {
    f(this, se, t);
  }
  setConfig(t) {
    this.config = t, this._checkConfig(), this._updateConfig();
  }
  updated(t) {
    t.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await we(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback(), this.requestUpdate();
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
  _checkConfig() {
    var t;
    if (!((t = this.config) != null && t.sensor))
      throw new Error("Please define a sensor!");
  }
  _updateConfig() {
    this.requestUpdate();
  }
  _updateHass() {
    const t = this._stateObj;
    let s;
    if (t)
      try {
        s = mt(t.state), Array.isArray(s) && (this._persistedMeals = s);
      } catch (i) {
        console.error("Failed to decode meal plan:", i);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []), this.requestUpdate();
  }
  render() {
    var a;
    if (!this._haComponentsReady)
      return p`<div>Loading Home Assistant components...</div>`;
    const t = this._meals.filter((n) => n.enabled).length, s = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" }), i = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(s), r = ut(this._meals.filter((n) => n.enabled), i) * 6;
    return p`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${((a = this.config) == null ? void 0 : a.title) || "Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary-row">
            <div class="overview-summary">
              <ha-chip>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>
                ${_("schedules")}: ${this._meals.length}
              </ha-chip>
              <ha-chip>
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${_("active_schedules")}: ${t}
              </ha-chip>
              <ha-chip>
                <ha-icon icon="mdi:food-drumstick"></ha-icon>
                ${_("today")}: ${r}g
              </ha-chip>
            </div>
          </div>
          <div class="overview-actions-row">
            <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0, this.requestUpdate();
    }}>
              <ha-icon icon="mdi:table-edit"></ha-icon>
              ${_("manage_schedules")}
            </ha-button>
          </div>
        </section>
        ${this._dialogOpen ? p`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedule-view
                  .meals=${this._meals}
                  .localize=${_}
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
    const t = ft(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: t
    });
  }
  _onScheduleMealsChanged(t) {
    this._dialogOpen = !1, this._meals = t.detail.meals, this._saveMealsToSensor(), this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: t.detail.meals }, bubbles: !0, composed: !0 })), this.requestUpdate();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => yt), document.createElement("cleverio-card-editor");
  }
  static getStubConfig() {
    return { sensor: "", title: "Cleverio Pet Feeder" };
  }
  static getCardSize(t) {
    return 2;
  }
  // Legacy methods for test compatibility
  getNextSchedule() {
    return this._meals && this._meals.length ? this._meals[0].time : "-";
  }
  getTotalFoodPerDay() {
    return typeof je == "function" ? je(this._meals || []) : {};
  }
}, X = new WeakMap(), Y = new WeakMap(), ee = new WeakMap(), te = new WeakMap(), se = new WeakMap(), I.styles = [
  Fe,
  B`
      .overview-summary-row {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-bottom: 0.5em;
      }
      .overview-summary {
        display: flex;
        gap: 0.5em;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
      }
      .overview-actions-row {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-bottom: 0.5em;
      }
      .manage-btn {
        margin-top: 0.2em;
      }
    `
], I);
O([
  g({ type: Object })
], x.prototype, "hass", null);
O([
  g({ type: Object })
], x.prototype, "config", null);
O([
  P()
], x.prototype, "_meals", null);
O([
  P()
], x.prototype, "_persistedMeals", null);
O([
  P()
], x.prototype, "_dialogOpen", null);
O([
  g({ type: Boolean })
], x.prototype, "_haComponentsReady", void 0);
x = O([
  re("cleverio-pf100-card")
], x);
var We = function(o, e, t, s) {
  var i = arguments.length, r = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (a = o[n]) && (r = (i < 3 ? a(r) : i > 3 ? a(e, t, r) : a(e, t)) || r);
  return i > 3 && r && Object.defineProperty(e, t, r), r;
}, ie, Ne;
let pe = (Ne = class extends y {
  constructor() {
    super(...arguments);
    v(this, ie, { sensor: "", title: "" });
  }
  get config() {
    return b(this, ie);
  }
  set config(t) {
    f(this, ie, t);
  }
  setConfig(t) {
    this.config = { ...t };
  }
  _onInput(t) {
    const { name: s, value: i } = t.target;
    this.config = { ...this.config, [s]: i }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }
  render() {
    return p`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ""} @input=${this._onInput} /></label>
      <label>Title:
        <input name="title" .value=${this.config.title || ""} @input=${this._onInput} /></label>
    `;
  }
}, ie = new WeakMap(), Ne);
We([
  g({ attribute: !1 })
], pe.prototype, "config", null);
pe = We([
  re("cleverio-card-editor")
], pe);
const yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return pe;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as CleverioPf100Card
};
