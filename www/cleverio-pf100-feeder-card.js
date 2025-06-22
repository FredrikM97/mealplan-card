var Ae = (o) => {
  throw TypeError(o);
};
var Ce = (o, e, t) => e.has(o) || Ae("Cannot " + t);
var g = (o, e, t) => (Ce(o, e, "read from private field"), t ? t.call(o) : e.get(o)), v = (o, e, t) => e.has(o) ? Ae("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), f = (o, e, t, s) => (Ce(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = globalThis, be = ce.ShadowRoot && (ce.ShadyCSS === void 0 || ce.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ye = Symbol(), Se = /* @__PURE__ */ new WeakMap();
let Le = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== ye) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (be && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ze = (o) => new Le(typeof o == "string" ? o : o + "", void 0, ye), F = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, a) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[a + 1], o[0]);
  return new Le(t, o, ye);
}, Ge = (o, e) => {
  if (be) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = ce.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, ke = be ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ze(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ye, defineProperty: Qe, getOwnPropertyDescriptor: Xe, getOwnPropertyNames: et, getOwnPropertySymbols: tt, getPrototypeOf: st } = Object, x = globalThis, Me = x.trustedTypes, it = Me ? Me.emptyScript : "", fe = x.reactiveElementPolyfillSupport, V = (o, e) => o, de = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? it : null;
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
} }, $e = (o, e) => !Ye(o, e), Oe = { attribute: !0, type: String, converter: de, reflect: !1, useDefault: !1, hasChanged: $e };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Oe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Qe(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: a } = Xe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const n = i == null ? void 0 : i.call(this);
      a == null || a.call(this, r), this.requestUpdate(e, n, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = st(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const t = this.properties, s = [...et(t), ...tt(t)];
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
      for (const i of s) t.unshift(ke(i));
    } else e !== void 0 && t.push(ke(e));
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
    return Ge(e, this.constructor.elementStyles), e;
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
    var a;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (((a = s.converter) == null ? void 0 : a.toAttribute) !== void 0 ? s.converter : de).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var a, r;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), l = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((a = n.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? n.converter : de;
      this._$Em = i, this[i] = l.fromAttribute(t, n.type) ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const a = this.constructor, r = this[e];
      if (s ?? (s = a.getPropertyOptions(e)), !((s.hasChanged ?? $e)(r, t) || s.useDefault && s.reflect && r === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: a }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), a !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, r] of i) {
        const { wrapped: n } = r, l = this[a];
        n !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, r, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var a;
        return (a = i.hostUpdate) == null ? void 0 : a.call(i);
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
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[V("elementProperties")] = /* @__PURE__ */ new Map(), D[V("finalized")] = /* @__PURE__ */ new Map(), fe == null || fe({ ReactiveElement: D }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, he = J.trustedTypes, Pe = he ? he.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, qe = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, Be = "?" + E, ot = `<${Be}>`, P = document, K = () => P.createComment(""), Z = (o) => o === null || typeof o != "object" && typeof o != "function", we = Array.isArray, at = (o) => we(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", _e = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ue = /-->/g, De = />/g, k = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Te = /'/g, Re = /"/g, Fe = /^(?:script|style|textarea|title)$/i, rt = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), p = rt(1), L = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), je = /* @__PURE__ */ new WeakMap(), M = P.createTreeWalker(P, 129);
function We(o, e) {
  if (!we(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pe !== void 0 ? Pe.createHTML(e) : e;
}
const nt = (o, e) => {
  const t = o.length - 1, s = [];
  let i, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = W;
  for (let n = 0; n < t; n++) {
    const l = o[n];
    let d, h, c = -1, m = 0;
    for (; m < l.length && (r.lastIndex = m, h = r.exec(l), h !== null); ) m = r.lastIndex, r === W ? h[1] === "!--" ? r = Ue : h[1] !== void 0 ? r = De : h[2] !== void 0 ? (Fe.test(h[2]) && (i = RegExp("</" + h[2], "g")), r = k) : h[3] !== void 0 && (r = k) : r === k ? h[0] === ">" ? (r = i ?? W, c = -1) : h[1] === void 0 ? c = -2 : (c = r.lastIndex - h[2].length, d = h[1], r = h[3] === void 0 ? k : h[3] === '"' ? Re : Te) : r === Re || r === Te ? r = k : r === Ue || r === De ? r = W : (r = k, i = void 0);
    const w = r === k && o[n + 1].startsWith("/>") ? " " : "";
    a += r === W ? l + ot : c >= 0 ? (s.push(d), l.slice(0, c) + qe + l.slice(c) + E + w) : l + E + (c === -2 ? n : w);
  }
  return [We(o, a + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class G {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let a = 0, r = 0;
    const n = e.length - 1, l = this.parts, [d, h] = nt(e, t);
    if (this.el = G.createElement(d, s), M.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = M.nextNode()) !== null && l.length < n; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(qe)) {
          const m = h[r++], w = i.getAttribute(c).split(E), le = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: a, name: le[2], strings: w, ctor: le[1] === "." ? ct : le[1] === "?" ? dt : le[1] === "@" ? ht : me }), i.removeAttribute(c);
        } else c.startsWith(E) && (l.push({ type: 6, index: a }), i.removeAttribute(c));
        if (Fe.test(i.tagName)) {
          const c = i.textContent.split(E), m = c.length - 1;
          if (m > 0) {
            i.textContent = he ? he.emptyScript : "";
            for (let w = 0; w < m; w++) i.append(c[w], K()), M.nextNode(), l.push({ type: 2, index: ++a });
            i.append(c[m], K());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Be) l.push({ type: 2, index: a });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(E, c + 1)) !== -1; ) l.push({ type: 7, index: a }), c += E.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const s = P.createElement("template");
    return s.innerHTML = e, s;
  }
}
function q(o, e, t = o, s) {
  var r, n;
  if (e === L) return e;
  let i = s !== void 0 ? (r = t._$Co) == null ? void 0 : r[s] : t._$Cl;
  const a = Z(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== a && ((n = i == null ? void 0 : i._$AO) == null || n.call(i, !1), a === void 0 ? i = void 0 : (i = new a(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = q(o, i._$AS(o, e.values), i, s)), e;
}
class lt {
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? P).importNode(t, !0);
    M.currentNode = i;
    let a = M.nextNode(), r = 0, n = 0, l = s[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let d;
        l.type === 2 ? d = new ae(a, a.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (d = new pt(a, this, e)), this._$AV.push(d), l = s[++n];
      }
      r !== (l == null ? void 0 : l.index) && (a = M.nextNode(), r++);
    }
    return M.currentNode = P, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class ae {
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
    e = q(this, e, t), Z(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== L && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : at(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && Z(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = G.createElement(We(s.h, s.h[0]), this.options)), s);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === i) this._$AH.p(t);
    else {
      const r = new lt(i, this), n = r.u(this.options);
      r.p(t), this.T(n), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = je.get(e.strings);
    return t === void 0 && je.set(e.strings, t = new G(e)), t;
  }
  k(e) {
    we(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const a of e) i === t.length ? t.push(s = new ae(this.O(K()), this.O(K()), this, this.options)) : s = t[i], s._$AI(a), i++;
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
class me {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, a) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(e, t = this, s, i) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) e = q(this, e, t, 0), r = !Z(e) || e !== this._$AH && e !== L, r && (this._$AH = e);
    else {
      const n = e;
      let l, d;
      for (e = a[0], l = 0; l < a.length - 1; l++) d = q(this, n[s + l], t, l), d === L && (d = this._$AH[l]), r || (r = !Z(d) || d !== this._$AH[l]), d === u ? e = u : e !== u && (e += (d ?? "") + a[l + 1]), this._$AH[l] = d;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ct extends me {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class dt extends me {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class ht extends me {
  constructor(e, t, s, i, a) {
    super(e, t, s, i, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = q(this, e, t, 0) ?? u) === L) return;
    const s = this._$AH, i = e === u && s !== u || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class pt {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    q(this, e);
  }
}
const ge = J.litHtmlPolyfillSupport;
ge == null || ge(G, ae), (J.litHtmlVersions ?? (J.litHtmlVersions = [])).push("3.3.0");
const ut = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new ae(e.insertBefore(K(), a), a, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis;
class y extends D {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ut(t, this.renderRoot, this.renderOptions);
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
    return L;
  }
}
var Ie;
y._$litElement$ = !0, y.finalized = !0, (Ie = O.litElementHydrateSupport) == null || Ie.call(O, { LitElement: y });
const ve = O.litElementPolyfillSupport;
ve == null || ve({ LitElement: y });
(O.litElementVersions ?? (O.litElementVersions = [])).push("4.2.0");
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
const mt = { attribute: !0, type: String, converter: de, reflect: !1, hasChanged: $e }, ft = (o = mt, e, t) => {
  const { kind: s, metadata: i } = t;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), a.set(t.name, o), s === "accessor") {
    const { name: r } = t;
    return { set(n) {
      const l = e.get.call(this);
      e.set.call(this, n), this.requestUpdate(r, l, o);
    }, init(n) {
      return n !== void 0 && this.C(r, void 0, o, n), n;
    } };
  }
  if (s === "setter") {
    const { name: r } = t;
    return function(n) {
      const l = this[r];
      e.call(this, n), this.requestUpdate(r, l, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function _(o) {
  return (e, t) => typeof t == "object" ? ft(o, e, t) : ((s, i, a) => {
    const r = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, s), r ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(o) {
  return _({ ...o, state: !0, attribute: !1 });
}
function He(o) {
  const e = Array(7).fill(0);
  return o.forEach((t) => {
    if (t.enabled)
      for (let s = 0; s < 7; s++)
        t.daysMask & 1 << s && (e[s] += t.portion);
  }), e;
}
function _t(o, e) {
  let t = 0;
  return o.forEach((s) => {
    s.enabled && s.daysMask & 1 << e && (t += s.portion);
  }), t;
}
function gt(o) {
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
    const [a, r, n, l, d] = t.slice(i, i + 5);
    s.push({
      time: `${r.toString().padStart(2, "0")}:${n.toString().padStart(2, "0")}`,
      daysMask: a,
      portion: l || 1,
      enabled: d === 1
    });
  }
  return s;
}
function vt(o) {
  const e = [];
  return o.forEach((t) => {
    const [s, i] = t.time.split(":").map(Number);
    e.push(t.daysMask, s, i, Number(t.portion), t.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...e));
}
const Ve = F`
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
F`
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
const bt = [
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
], Ee = async (o) => {
  var t, s, i, a, r, n;
  const e = o || bt;
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
    if (!((n = (r = (a = d.routerOptions) == null ? void 0 : a.routes) == null ? void 0 : r.automation) != null && n.load))
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
let Je = {}, Ne = !1;
async function yt() {
  if (!Ne)
    try {
      const o = new URL("./en.json", import.meta.url).href, e = await fetch(o);
      e.ok ? (Je = await e.json(), Ne = !0) : console.error("Failed to load translations", e.status);
    } catch (o) {
      console.error("Failed to load translations", o);
    }
}
function b(o) {
  return Je[o] || o;
}
var xe = function(o, e, t, s) {
  var i = arguments.length, a = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (r = o[n]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, t, a) : r(e, t)) || a);
  return i > 3 && a && Object.defineProperty(e, t, a), a;
};
const $t = ["M", "T", "W", "T", "F", "S", "S"], wt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var T;
let pe = (T = class extends y {
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
        ${$t.map((t, s) => p`
          <span
            class="day-cell${e ? " day-cell-edit" : ""}${this.selectedDaysMask & 1 << s ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(s)}
            title=${wt[s]}
          >${t}</span>
        `)}
      </div>
    `;
  }
}, T.styles = F`
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
xe([
  _({ type: Number })
], pe.prototype, "selectedDaysMask", void 0);
xe([
  _({ type: Boolean })
], pe.prototype, "editable", void 0);
pe = xe([
  re("cleverio-day-selector")
], pe);
var ne = function(o, e, t, s) {
  var i = arguments.length, a = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (r = o[n]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, t, a) : r(e, t)) || a);
  return i > 3 && a && Object.defineProperty(e, t, a), a;
}, Y, R;
let B = (R = class extends y {
  constructor() {
    super();
    v(this, Y);
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
    return g(this, Y);
  }
  set data(t) {
    f(this, Y, t);
  }
  async connectedCallback() {
    super.connectedCallback(), await Ee(["ha-form", "ha-button", "ha-switch"]), this._haComponentsReady = !0;
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
}, Y = new WeakMap(), R.styles = F`
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
ne([
  _({ type: Object })
], B.prototype, "data", null);
ne([
  C()
], B.prototype, "_haComponentsReady", void 0);
ne([
  C()
], B.prototype, "_localEdit", void 0);
ne([
  C()
], B.prototype, "_error", void 0);
B = ne([
  re("cleverio-edit-view")
], B);
var U = function(o, e, t, s) {
  var i = arguments.length, a = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (r = o[n]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, t, a) : r(e, t)) || a);
  return i > 3 && a && Object.defineProperty(e, t, a), a;
};
console.log("[cleverio-schedule-view] Module loaded");
var j, H, N, I;
let A = (I = class extends y {
  constructor() {
    super();
    v(this, j);
    v(this, H);
    v(this, N);
    f(this, j, []), f(this, H, []), f(this, N, !1), this._editDialogOpen = !1, this._mode = "table", this._editIdx = null, this._hasUnsavedChanges = !1, this.meals = [], this._localMeals = [], this._editDialogOpen = !1, console.log("[cleverio-schedule-view] Constructor");
  }
  get meals() {
    return g(this, j);
  }
  set meals(t) {
    f(this, j, t);
  }
  get _localMeals() {
    return g(this, H);
  }
  set _localMeals(t) {
    f(this, H, t);
  }
  get _haComponentsReady() {
    return g(this, N);
  }
  set _haComponentsReady(t) {
    f(this, N, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), console.log("[cleverio-schedule-view] connectedCallback"), await Ee(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this._haComponentsReady = !0, console.log("[cleverio-schedule-view] HA components loaded");
  }
  // Watch for changes in meals
  updated(t) {
    t.has("meals") && (this._localMeals = this.meals.map((s) => ({ ...s })), this._editDialogOpen = !1, this._hasUnsavedChanges = !1, console.log("[cleverio-schedule-view] Meals updated", this._localMeals));
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
      time: { title: b("time"), sortable: !0, minWidth: "80px" },
      portion: { title: b("portion"), sortable: !0, minWidth: "80px" },
      days: {
        title: b("days"),
        sortable: !1,
        minWidth: "130px",
        template: (a) => p`
          <cleverio-day-selector .selectedDaysMask=${a.daysMask} .editable=${!1}></cleverio-day-selector>`
      },
      enabled: {
        title: p`<span style="font-size:0.9em;">${b("enabled")}</span>`,
        sortable: !1,
        minWidth: "60px",
        maxWidth: "70px",
        cellClass: "enabled-cell",
        template: (a) => p`
          <div class="switch-flex"><ha-switch .checked=${a.enabled} @change=${(r) => this._toggleEnabled(a._idx, r)} title="Enable/disable schedule"></ha-switch></div>
        `
      },
      actions: {
        title: p`<span style="font-size:0.9em;">${b("actions")}</span>`,
        sortable: !1,
        minWidth: "100px",
        template: (a) => p`
          <ha-icon
            icon="mdi:pencil"
            @click=${() => this._openEditDialog(a._idx)}
            title="Edit"
            style="cursor:pointer;margin-right:8px;"
            tabindex="0"
            role="button"
          ></ha-icon>
          <ha-icon
            icon="mdi:delete"
            @click=${() => this._delete(a._idx)}
            title="Delete"
            style="color: var(--error-color, #b71c1c); cursor:pointer;"
            tabindex="0"
            role="button"
          ></ha-icon>
        `
      }
    }, s = this._localMeals.map((a, r) => ({ ...a, _idx: r }));
    return p`
      <div class="ha-table-wrapper">
        <ha-data-table
          .hass=${{ locale: { language: "en", country: "US" } }}
          .localizeFunc=${b}
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
      this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this._localMeals }, bubbles: !0, composed: !0 })), this._hasUnsavedChanges = !1, console.log("[cleverio-schedule-view] _save", { meals: this._localMeals });
    }}>
          ${b("save")}
        </ha-button>
      </div>
      ${this._hasUnsavedChanges ? p`<div class="save-note">You have unsaved changes. Press Save to persist changes to Home Assistant.</div>` : ""}
    `;
  }
  _markUnsaved() {
    const t = JSON.stringify(this.meals), s = JSON.stringify(this._localMeals);
    this._hasUnsavedChanges = t !== s;
  }
  _toggleEnabled(t, s) {
    this._localMeals[t].enabled = s.target.checked, this.requestUpdate(), this._markUnsaved(), console.log("[cleverio-schedule-view] _toggleEnabled", { idx: t, enabled: this._localMeals[t].enabled });
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
    this._editIdx !== null && this._editIdx !== void 0 ? this._localMeals[this._editIdx] = s : this._localMeals = [...this._localMeals, s], this._mode = "table", this._editIdx = null, this.requestUpdate(), this._markUnsaved(), console.log("[cleverio-schedule-view] _onEditSave", { meal: s });
  }
  _delete(t) {
    this._localMeals.splice(t, 1), this.requestUpdate(), this._markUnsaved(), console.log("[cleverio-schedule-view] _delete", { idx: t });
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _cancel");
  }
}, j = new WeakMap(), H = new WeakMap(), N = new WeakMap(), I.styles = [
  Ve,
  F`
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
], I);
U([
  _({ type: Array })
], A.prototype, "meals", null);
U([
  _({ type: Array })
], A.prototype, "_localMeals", null);
U([
  _({ type: Boolean })
], A.prototype, "_haComponentsReady", null);
U([
  _({ type: Boolean })
], A.prototype, "_editDialogOpen", void 0);
U([
  _({ type: String })
], A.prototype, "_mode", void 0);
U([
  C()
], A.prototype, "_hasUnsavedChanges", void 0);
A = U([
  re("cleverio-schedule-view")
], A);
var S = function(o, e, t, s) {
  var i = arguments.length, a = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (r = o[n]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, t, a) : r(e, t)) || a);
  return i > 3 && a && Object.defineProperty(e, t, a), a;
}, Q, X, ee, te, se, ie, z;
let $ = (z = class extends y {
  constructor() {
    super();
    v(this, Q);
    v(this, X);
    v(this, ee);
    v(this, te);
    v(this, se);
    v(this, ie);
    this._haComponentsReady = !1, this._onMealsChanged = (t) => {
      this._meals = t.detail.meals, this.requestUpdate();
    }, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return g(this, Q);
  }
  set hass(t) {
    f(this, Q, t);
  }
  get config() {
    return g(this, X);
  }
  set config(t) {
    f(this, X, t);
  }
  get _meals() {
    return g(this, ee);
  }
  set _meals(t) {
    f(this, ee, t);
  }
  get _persistedMeals() {
    return g(this, te);
  }
  set _persistedMeals(t) {
    f(this, te, t);
  }
  get _dialogOpen() {
    return g(this, se);
  }
  set _dialogOpen(t) {
    f(this, se, t);
  }
  get _dialogData() {
    return g(this, ie);
  }
  set _dialogData(t) {
    f(this, ie, t);
  }
  setConfig(t) {
    this.config = t, this._checkConfig(), this._updateConfig();
  }
  updated(t) {
    t.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await yt(), await Ee(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback(), this.requestUpdate();
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
        s = gt(t.state), Array.isArray(s) && (this._persistedMeals = s);
      } catch (i) {
        console.error("Failed to decode meal plan:", i);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []), this.requestUpdate();
  }
  render() {
    var r;
    if (!this._haComponentsReady)
      return p`<div>Loading Home Assistant components...</div>`;
    const t = this._meals.filter((n) => n.enabled).length, s = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" }), i = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(s), a = _t(this._meals.filter((n) => n.enabled), i) * 6;
    return p`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${((r = this.config) == null ? void 0 : r.title) || "Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary-row">
            <div class="overview-summary">
              <ha-chip>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>
                ${b("schedules")}: ${this._meals.length}
              </ha-chip>
              <ha-chip>
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${b("active_schedules")}: ${t}
              </ha-chip>
              <ha-chip>
                <ha-icon icon="mdi:food-drumstick"></ha-icon>
                ${b("today")}: ${a}g
              </ha-chip>
            </div>
          </div>
          <div class="overview-actions-row">
            <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0, this.requestUpdate();
    }}>
              <ha-icon icon="mdi:table-edit"></ha-icon>
              ${b("manage_schedules")}
            </ha-button>
          </div>
        </section>
        ${this._dialogOpen ? p`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedule-view
                  .meals=${this._meals}
                  .localize=${b}
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
    const t = vt(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: t
    });
  }
  _onScheduleMealsChanged(t) {
    this._dialogOpen = !1, this._meals = t.detail.meals, this._saveMealsToSensor(), this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: t.detail.meals }, bubbles: !0, composed: !0 })), this.requestUpdate();
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Et), document.createElement("cleverio-card-editor");
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
    return typeof He == "function" ? He(this._meals || []) : {};
  }
}, Q = new WeakMap(), X = new WeakMap(), ee = new WeakMap(), te = new WeakMap(), se = new WeakMap(), ie = new WeakMap(), z.styles = [
  Ve,
  F`
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
], z);
S([
  _({ type: Object })
], $.prototype, "hass", null);
S([
  _({ type: Object })
], $.prototype, "config", null);
S([
  C()
], $.prototype, "_meals", null);
S([
  C()
], $.prototype, "_persistedMeals", null);
S([
  C()
], $.prototype, "_dialogOpen", null);
S([
  C()
], $.prototype, "_dialogData", null);
S([
  _({ type: Boolean })
], $.prototype, "_haComponentsReady", void 0);
$ = S([
  re("cleverio-pf100-card")
], $);
var Ke = function(o, e, t, s) {
  var i = arguments.length, a = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(o, e, t, s);
  else for (var n = o.length - 1; n >= 0; n--) (r = o[n]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, t, a) : r(e, t)) || a);
  return i > 3 && a && Object.defineProperty(e, t, a), a;
}, oe, ze;
let ue = (ze = class extends y {
  constructor() {
    super(...arguments);
    v(this, oe, { sensor: "", title: "" });
  }
  get config() {
    return g(this, oe);
  }
  set config(t) {
    f(this, oe, t);
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
}, oe = new WeakMap(), ze);
Ke([
  _({ attribute: !1 })
], ue.prototype, "config", null);
ue = Ke([
  re("cleverio-card-editor")
], ue);
const Et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return ue;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  $ as CleverioPf100Card
};
