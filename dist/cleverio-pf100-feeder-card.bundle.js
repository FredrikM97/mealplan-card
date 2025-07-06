var be = (o) => {
  throw TypeError(o);
};
var we = (o, e, t) => e.has(o) || be("Cannot " + t);
var T = (o, e, t) => (we(o, e, "read from private field"), t ? t.call(o) : e.get(o)), R = (o, e, t) => e.has(o) ? be("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), w = (o, e, t, s) => (we(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis, pe = te.ShadowRoot && (te.ShadyCSS === void 0 || te.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, me = Symbol(), Ee = /* @__PURE__ */ new WeakMap();
let Ue = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== me) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (pe && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Ee.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Ee.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ie = (o) => new Ue(typeof o == "string" ? o : o + "", void 0, me), fe = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new Ue(t, o, me);
}, ze = (o, e) => {
  if (pe) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = te.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, Ae = pe ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ie(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Le, defineProperty: Be, getOwnPropertyDescriptor: Ve, getOwnPropertyNames: We, getOwnPropertySymbols: qe, getPrototypeOf: Je } = Object, A = globalThis, xe = A.trustedTypes, Ge = xe ? xe.emptyScript : "", le = A.reactiveElementPolyfillSupport, V = (o, e) => o, se = { toAttribute(o, e) {
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
} }, ge = (o, e) => !Le(o, e), Se = { attribute: !0, type: String, converter: se, reflect: !1, useDefault: !1, hasChanged: ge };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), A.litPropertyMetadata ?? (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let U = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Se) {
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
    return this.elementProperties.get(e) ?? Se;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = Je(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const t = this.properties, s = [...We(t), ...qe(t)];
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
      const a = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : se).toAttribute(t, s.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, a;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), h = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : se;
      this._$Em = i, this[i] = h.fromAttribute(t, r.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, a = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? ge)(a, t) || s.useDefault && s.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
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
        const { wrapped: r } = a, h = this[n];
        r !== !0 || this._$AL.has(n) || h === void 0 || this.C(n, void 0, a, h);
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
U.elementStyles = [], U.shadowRootOptions = { mode: "open" }, U[V("elementProperties")] = /* @__PURE__ */ new Map(), U[V("finalized")] = /* @__PURE__ */ new Map(), le == null || le({ ReactiveElement: U }), (A.reactiveElementVersions ?? (A.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, ie = W.trustedTypes, Ce = ie ? ie.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Fe = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, He = "?" + E, Ke = `<${He}>`, P = document, q = () => P.createComment(""), J = (o) => o === null || typeof o != "object" && typeof o != "function", _e = Array.isArray, Ze = (o) => _e(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", he = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Me = /-->/g, Oe = />/g, M = RegExp(`>|${he}(?:([^\\s"'>=/]+)(${he}*=${he}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ke = /'/g, Pe = /"/g, Ne = /^(?:script|style|textarea|title)$/i, Ye = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), m = Ye(1), z = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), De = /* @__PURE__ */ new WeakMap(), O = P.createTreeWalker(P, 129);
function je(o, e) {
  if (!_e(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ce !== void 0 ? Ce.createHTML(e) : e;
}
const Qe = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = B;
  for (let r = 0; r < t; r++) {
    const h = o[r];
    let c, d, l = -1, u = 0;
    for (; u < h.length && (a.lastIndex = u, d = a.exec(h), d !== null); ) u = a.lastIndex, a === B ? d[1] === "!--" ? a = Me : d[1] !== void 0 ? a = Oe : d[2] !== void 0 ? (Ne.test(d[2]) && (i = RegExp("</" + d[2], "g")), a = M) : d[3] !== void 0 && (a = M) : a === M ? d[0] === ">" ? (a = i ?? B, l = -1) : d[1] === void 0 ? l = -2 : (l = a.lastIndex - d[2].length, c = d[1], a = d[3] === void 0 ? M : d[3] === '"' ? Pe : ke) : a === Pe || a === ke ? a = M : a === Me || a === Oe ? a = B : (a = M, i = void 0);
    const _ = a === M && o[r + 1].startsWith("/>") ? " " : "";
    n += a === B ? h + Ke : l >= 0 ? (s.push(c), h.slice(0, l) + Fe + h.slice(l) + E + _) : h + E + (l === -2 ? r : _);
  }
  return [je(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class G {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const r = e.length - 1, h = this.parts, [c, d] = Qe(e, t);
    if (this.el = G.createElement(c, s), O.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = O.nextNode()) !== null && h.length < r; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(Fe)) {
          const u = d[a++], _ = i.getAttribute(l).split(E), D = /([.?@])?(.*)/.exec(u);
          h.push({ type: 1, index: n, name: D[2], strings: _, ctor: D[1] === "." ? et : D[1] === "?" ? tt : D[1] === "@" ? st : ne }), i.removeAttribute(l);
        } else l.startsWith(E) && (h.push({ type: 6, index: n }), i.removeAttribute(l));
        if (Ne.test(i.tagName)) {
          const l = i.textContent.split(E), u = l.length - 1;
          if (u > 0) {
            i.textContent = ie ? ie.emptyScript : "";
            for (let _ = 0; _ < u; _++) i.append(l[_], q()), O.nextNode(), h.push({ type: 2, index: ++n });
            i.append(l[u], q());
          }
        }
      } else if (i.nodeType === 8) if (i.data === He) h.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = i.data.indexOf(E, l + 1)) !== -1; ) h.push({ type: 7, index: n }), l += E.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = P.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(o, e, t = o, s) {
  var a, r;
  if (e === z) return e;
  let i = s !== void 0 ? (a = t._$Co) == null ? void 0 : a[s] : t._$Cl;
  const n = J(e) ? void 0 : e._$litDirective$;
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? P).importNode(t, !0);
    O.currentNode = i;
    let n = O.nextNode(), a = 0, r = 0, h = s[0];
    for (; h !== void 0; ) {
      if (a === h.index) {
        let c;
        h.type === 2 ? c = new ee(n, n.nextSibling, this, e) : h.type === 1 ? c = new h.ctor(n, h.name, h.strings, this, e) : h.type === 6 && (c = new it(n, this, e)), this._$AV.push(c), h = s[++r];
      }
      a !== (h == null ? void 0 : h.index) && (n = O.nextNode(), a++);
    }
    return O.currentNode = P, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class ee {
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
    e = L(this, e, t), J(e) ? e === f || e == null || e === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : e !== this._$AH && e !== z && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ze(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== f && J(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = G.createElement(je(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const a = new Xe(i, this), r = a.u(this.options);
      a.p(t), this.T(r), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = De.get(e.strings);
    return t === void 0 && De.set(e.strings, t = new G(e)), t;
  }
  k(e) {
    _e(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new ee(this.O(q()), this.O(q()), this, this.options)) : s = t[i], s._$AI(n), i++;
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
class ne {
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
    if (n === void 0) e = L(this, e, t, 0), a = !J(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
    else {
      const r = e;
      let h, c;
      for (e = n[0], h = 0; h < n.length - 1; h++) c = L(this, r[s + h], t, h), c === z && (c = this._$AH[h]), a || (a = !J(c) || c !== this._$AH[h]), c === f ? e = f : e !== f && (e += (c ?? "") + n[h + 1]), this._$AH[h] = c;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class et extends ne {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === f ? void 0 : e;
  }
}
class tt extends ne {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== f);
  }
}
class st extends ne {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = L(this, e, t, 0) ?? f) === z) return;
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
const ce = W.litHtmlPolyfillSupport;
ce == null || ce(G, ee), (W.litHtmlVersions ?? (W.litHtmlVersions = [])).push("3.3.0");
const ot = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new ee(e.insertBefore(q(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class x extends U {
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
    return z;
  }
}
var Re;
x._$litElement$ = !0, x.finalized = !0, (Re = k.litElementHydrateSupport) == null || Re.call(k, { LitElement: x });
const de = k.litElementPolyfillSupport;
de == null || de({ LitElement: x });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = { attribute: !0, type: String, converter: se, reflect: !1, hasChanged: ge }, at = (o = nt, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), n.set(t.name, o), s === "accessor") {
    const { name: a } = t;
    return { set(r) {
      const h = e.get.call(this);
      e.set.call(this, r), this.requestUpdate(a, h, o);
    }, init(r) {
      return r !== void 0 && this.C(a, void 0, o, r), r;
    } };
  }
  if (s === "setter") {
    const { name: a } = t;
    return function(r) {
      const h = this[a];
      e.call(this, r), this.requestUpdate(a, h, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function g(o) {
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
function S(o) {
  return g({ ...o, state: !0, attribute: !1 });
}
const oe = [
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
function ye(o) {
  return oe.find((e) => e.name === o);
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
  const t = ye(e);
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
  return Array.from({ length: a.length / i }, (r, h) => {
    const c = {};
    for (let d = 0; d < n.length; d++)
      c[n[d]] = a[h * i + d];
    for (const d of n)
      if (!(d in c) || typeof c[d] > "u")
        throw new Error(`Meal plan decode error: missing field '${d}' in entry. Possible layout mismatch or corrupt data.`);
    return c;
  });
}
function ct(o, e) {
  if (!e)
    throw new Error(`Unknown meal plan layout: '${e}'`);
  const t = ye(e);
  if (!t)
    throw new Error(`Unknown meal plan layout: '${e}'`);
  const { fields: s } = t, i = [];
  return o.forEach((n, a) => {
    for (const r of s) {
      if (!(r in n) || typeof n[r] > "u")
        throw new Error(`Meal plan encode error: missing field '${r}' in entry #${a}. Possible layout mismatch or incomplete FeedingTime.`);
      i.push(Number(n[r]));
    }
  }), btoa(String.fromCharCode(...i));
}
function Te(o, e) {
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
], ve = async (o) => {
  var t, s, i, n, a, r;
  const e = o || dt;
  try {
    if (e.every((l) => customElements.get(l)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((l, u) => setTimeout(() => u(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
    ]);
    const h = document.createElement("partial-panel-resolver");
    if (!h)
      throw new Error("Failed to create partial-panel-resolver element");
    if (h.hass = {
      panels: [
        {
          url_path: "tmp",
          component_name: "config"
        }
      ]
    }, typeof h._updateRoutes != "function")
      throw new Error("partial-panel-resolver does not have _updateRoutes method");
    if (h._updateRoutes(), !((i = (s = (t = h.routerOptions) == null ? void 0 : t.routes) == null ? void 0 : s.tmp) != null && i.load))
      throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([
      h.routerOptions.routes.tmp.load(),
      new Promise((l, u) => setTimeout(() => u(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((l, u) => setTimeout(() => u(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const c = document.createElement("ha-panel-config");
    if (!c)
      throw new Error("Failed to create ha-panel-config element");
    if (!((r = (a = (n = c.routerOptions) == null ? void 0 : n.routes) == null ? void 0 : a.automation) != null && r.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      c.routerOptions.routes.automation.load(),
      new Promise((l, u) => setTimeout(() => u(new Error("Timeout loading automation components")), 1e4))
    ]);
    const d = e.filter((l) => !customElements.get(l));
    if (d.length > 0)
      throw new Error(`Failed to load components: ${d.join(", ")}`);
  } catch (h) {
    console.error("Error loading Home Assistant form components:", h);
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
}, ut = "Feed Now", pt = "Schedule", mt = "Portion", ft = "Days", gt = "Enabled", _t = "Edit Meal", yt = "Time", vt = "(1 portion = 6g)", $t = "Suggested:", bt = "Back", wt = "Save", Et = "Status", At = "Actions", xt = "Add Meal", St = "Schedules", Ct = "Active Schedules", Mt = "Today", Ot = "Edit Feeding Time", kt = "Manage Schedules", Pt = "Unsaved changes", Dt = "You have unsaved changes. Don't forget to save!", Tt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Rt = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], Ut = "Avg/week", Ft = "Mealplan (with days)", Ht = "Mealplan (no days)", Nt = "Select layout...", jt = "Meal plan layout", It = {
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
  status: Et,
  actions: At,
  delete: "Delete",
  add_meal: xt,
  schedules: St,
  active_schedules: Ct,
  today: Mt,
  edit_feeding_time: Ot,
  manage_schedules: kt,
  unsaved_changes: Pt,
  unsaved_changes_hint: Dt,
  days_short: Tt,
  days_full: Rt,
  avg_week: Ut,
  tuya_with_daysMask: Ft,
  tuya_no_daysMask: Ht,
  select_layout: Nt,
  mealplan_layout: jt
}, zt = "Mata nu", Lt = "Schema", Bt = "Portion", Vt = "Dagar", Wt = "Aktiverad", qt = "Redigera måltid", Jt = "Tid", Gt = "(1 portion = 6g)", Kt = "Föreslaget:", Zt = "Tillbaka", Yt = "Spara", Qt = "Status", Xt = "Åtgärder", es = "Lägg till måltid", ts = "Scheman", ss = "Aktiva scheman", is = "Idag", os = "Redigera matningstid", ns = "Hantera scheman", as = "Osparade ändringar", rs = "Du har osparade ändringar. Glöm inte att spara!", ls = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"], hs = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"], cs = "Snitt/vecka", ds = {
  feed_now: zt,
  schedule: Lt,
  portion: Bt,
  days: Vt,
  enabled: Wt,
  edit_meal: qt,
  time: Jt,
  portion_helper: Gt,
  suggested: Kt,
  back: Zt,
  save: Yt,
  status: Qt,
  actions: Xt,
  delete: "Ta bort",
  add_meal: es,
  schedules: ts,
  active_schedules: ss,
  today: is,
  edit_feeding_time: os,
  manage_schedules: ns,
  unsaved_changes: as,
  unsaved_changes_hint: rs,
  days_short: ls,
  days_full: hs,
  avg_week: cs
}, v = { en: It, sv: ds };
let ue = "en";
function us(o) {
  v != null && v[o] ? ue = o : ue = "en";
}
function p(o) {
  var e, t;
  return ((e = v == null ? void 0 : v[ue]) == null ? void 0 : e[o]) || ((t = v == null ? void 0 : v.en) == null ? void 0 : t[o]) || o;
}
var re = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, F;
let K = (F = class extends x {
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
    return m`
      <div class="days-row">
        ${e.map((t, s) => m`
          <span
            class="day-cell${this.selectedDaysMask & 1 << s ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(s)}
          >${t}</span>
        `)}
      </div>
    `;
  }
}, F.styles = fe`
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
  `, F);
re([
  g({ type: Number })
], K.prototype, "selectedDaysMask", void 0);
re([
  g({ type: Boolean })
], K.prototype, "editable", void 0);
re([
  g({ type: Array })
], K.prototype, "dayLabels", void 0);
K = re([
  ae("cleverio-day-selector")
], K);
var b = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, H, N;
let y = (N = class extends x {
  constructor() {
    super();
    R(this, H);
    this._meals = null, this.viewMeals = [], this.editForm = null, this.editError = null, this.editDialogOpen = !1, this.editIdx = null, w(this, H, !1), this.layout = oe[0].name, this.viewMeals = [];
  }
  get meals() {
    return this._meals;
  }
  set meals(t) {
    const s = this._meals;
    this._meals = t, !this.editDialogOpen && (!this._hasUnsavedChanges || s == null) && (this.viewMeals = Array.isArray(t) ? t.map((i) => ({ ...i })) : [], this.requestUpdate("meals", s));
  }
  get haComponentsReady() {
    return T(this, H);
  }
  set haComponentsReady(t) {
    w(this, H, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), await ve(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this.haComponentsReady = !0;
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
      return m`<div>Loading Home Assistant components...</div>`;
    const s = (ye(this.layout) || oe[0]).fields.includes("daysMask"), i = this.viewMeals.some((l) => typeof l.daysMask == "number"), n = s && i, a = {
      time: {
        title: p("time"),
        sortable: !0,
        minWidth: "80px",
        valueColumn: "hourMinute",
        template: (l) => Te(l.hour, l.minute)
      },
      portion: { title: p("portion"), sortable: !0, minWidth: "80px" },
      ...n ? {
        days: {
          title: p("days"),
          sortable: !1,
          minWidth: "130px",
          template: (l) => m`
            <cleverio-day-selector
              .selectedDaysMask=${l.daysMask}
              .editable=${!1}
            ></cleverio-day-selector>
          `
        }
      } : {},
      enabled: {
        title: p("enabled"),
        sortable: !0,
        minWidth: "60px",
        template: (l) => m`
          <div style="display: flex; align-items: center; justify-content: center; height: 48px;">
            <ha-switch
              .checked=${l.enabled}
              @change=${(u) => this._toggleEnabled(l._idx, u)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        `
      },
      actions: {
        title: p("actions"),
        sortable: !1,
        minWidth: "140px",
        template: (l) => m`
          <ha-icon-button @click=${() => this._openEditDialog(l._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(l._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        `
      }
    }, r = this.viewMeals.map((l, u) => ({ ...l, _idx: u, hourMinute: l.hour * 60 + l.minute })), h = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return m`
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? p("edit_feeding_time") : p("manage_schedules")}>
        ${this.editDialogOpen ? m`
              <form class="edit-form" @submit=${(l) => l.preventDefault()}>
                ${this.editError ? m`<div class="error">${this.editError}</div>` : ""}
                ${s ? m`
                  <cleverio-day-selector
                    class="edit-mode"
                    .selectedDaysMask=${((c = this.editForm) == null ? void 0 : c.daysMask) ?? 0}
                    .editable=${!0}
                    @days-changed=${(l) => {
      this.editForm.daysMask = l.detail.daysMask, this.requestUpdate();
    }}
                  ></cleverio-day-selector>
                ` : ""}
                <div class="edit-form-group">
                  <label for="edit-time">${p("time")}</label>
                  <input
                    id="edit-time"
                    class="edit-time"
                    type="time"
                    .value=${this.editForm ? Te(this.editForm.hour, this.editForm.minute) : ""}
                    @input=${(l) => {
      const u = l.target.value, [_, D] = u.split(":").map(Number);
      this.editForm.hour = _, this.editForm.minute = D, this.requestUpdate();
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
                    @input=${(l) => {
      this.editForm.portion = parseInt(l.target.value, 10), this.requestUpdate();
    }}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${h.map((l) => m`
                    <ha-button type="button" @click=${() => {
      const [u, _] = l.split(":").map(Number);
      this.editForm.hour = u, this.editForm.minute = _, this.requestUpdate();
    }}>${l}</ha-button>
                  `)}
                </div>
              </form>
            ` : m`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${p}
                  .columns=${a}
                  .hass=${this.hass}
                  .data=${r}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editDialogOpen ? m`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>${p("back")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>${p("save")}</ha-button>
            ` : m`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>${p("add_meal")}</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>${p("cancel")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>${p("save")}</ha-button>
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
}, H = new WeakMap(), N.styles = [
  fe`
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
], N);
b([
  g({ type: Object })
], y.prototype, "hass", void 0);
b([
  g({ type: Array })
], y.prototype, "meals", null);
b([
  S()
], y.prototype, "viewMeals", void 0);
b([
  S()
], y.prototype, "editForm", void 0);
b([
  S()
], y.prototype, "editError", void 0);
b([
  S()
], y.prototype, "editDialogOpen", void 0);
b([
  g({ type: Boolean })
], y.prototype, "haComponentsReady", null);
b([
  g({ type: String })
], y.prototype, "layout", void 0);
y = b([
  ae("cleverio-schedule-view")
], y);
var C = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, Y, Q, X, j, I;
let $ = (I = class extends x {
  constructor() {
    super();
    R(this, Y);
    R(this, Q);
    R(this, X);
    R(this, j);
    w(this, j, !1), this._haComponentsReady = !1, this._decodeError = null, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1;
  }
  get hass() {
    return this._hass;
  }
  set hass(t) {
    const s = this._hass;
    this._hass = t, this._updateHass(), this.requestUpdate("hass", s);
  }
  get config() {
    return T(this, Y);
  }
  set config(t) {
    w(this, Y, t);
  }
  get _meals() {
    return T(this, Q);
  }
  set _meals(t) {
    w(this, Q, t);
  }
  get _persistedMeals() {
    return T(this, X);
  }
  set _persistedMeals(t) {
    w(this, X, t);
  }
  get _dialogOpen() {
    return T(this, j);
  }
  set _dialogOpen(t) {
    w(this, j, t);
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
    await us(this.hass.language), await ve(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback();
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
    var i;
    let s = [];
    if (this._decodeError = null, !((i = this.config) != null && i.layout)) {
      this._decodeError = "Please select a meal plan layout in the card editor.", this._persistedMeals = [], this._meals = [];
      return;
    }
    if (t && typeof t == "string" && t.trim().length > 0)
      try {
        s = ht(t, this.config.layout);
      } catch (n) {
        console.error("Meal plan decode error:", n), this._decodeError = n.message || "Failed to decode meal plan data.", s = [];
      }
    this._persistedMeals = Array.isArray(s) ? s : [], this._meals = JSON.parse(JSON.stringify(this._persistedMeals));
  }
  render() {
    var t, s;
    return this._haComponentsReady ? (t = this.config) != null && t.layout ? m`
      <ha-card header=${((s = this.config) == null ? void 0 : s.title) || "Cleverio Pet Feeder"} style="height: 100%;">
        ${this._decodeError ? m`<div style="color: var(--error-color, red); margin: 8px;">${this._decodeError}</div>` : ""}
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${p("schedules")}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${p("active_schedules")}: <span style="white-space:nowrap;">${this._meals.filter((i) => i.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${p("today")}: <span style="white-space:nowrap;">${lt(this._meals.filter((i) => i.enabled), (/* @__PURE__ */ new Date()).getDay()) * 6}g</span>
          </ha-chip>
          <ha-chip class="overview-average">
            <ha-icon icon="mdi:scale-balance"></ha-icon>
            ${p("avg_week")}: <span style="white-space:nowrap;">
              ${(rt(this._meals.filter((a) => a.enabled)).reduce((a, r) => a + r, 0) / 7 * 6).toFixed(1)}g
            </span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0;
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${p("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? m`
              <cleverio-schedule-view
                .meals=${[...this._meals]}
                .layout=${this.config.layout}
                .localize=${p}
                .hass=${this.hass}
                @save-schedule=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : m`<div style="color: var(--error-color, red); margin: 8px;">Please select a meal plan layout in the card editor.</div>` : m`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ps), document.createElement("cleverio-card-editor");
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
}, Y = new WeakMap(), Q = new WeakMap(), X = new WeakMap(), j = new WeakMap(), I.styles = [
  fe`
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
], I);
C([
  g({ type: Object })
], $.prototype, "hass", null);
C([
  g({ type: Object })
], $.prototype, "config", null);
C([
  S()
], $.prototype, "_meals", null);
C([
  S()
], $.prototype, "_persistedMeals", null);
C([
  S()
], $.prototype, "_dialogOpen", null);
C([
  g({ type: Boolean })
], $.prototype, "_haComponentsReady", void 0);
C([
  S()
], $.prototype, "_decodeError", void 0);
$ = C([
  ae("cleverio-pf100-card")
], $);
var $e = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
};
let Z = class extends x {
  constructor() {
    super(...arguments), this.config = { sensor: "", title: "", helper: "", layout: "", overviewFields: ["schedules", "active_schedules", "today", "avg_week"] };
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
    return !!this.config.sensor && !!this.config.helper;
  }
  render() {
    var e, t;
    return this._haComponentsReady ? m`
      <label for="layout-combo" style="display:block;margin-bottom:4px;">${p("mealplan_layout")}</label>
      <ha-combo-box
        id="layout-combo"
        .items=${[
      { value: "", label: p("select_layout") },
      ...oe.map((s) => ({ value: s.name, label: p(s.name) }))
    ]}
        .value=${this.config.layout || ""}
        @value-changed=${(s) => {
      this.config = { ...this.config, layout: s.detail.value }, this.configChanged(this.config);
    }}
      ></ha-combo-box>
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
      <div style="height: 20px;"></div>
      ${this._validateConfig() ? "" : m`<div style="color: var(--error-color, red); margin-top: 8px;">Please select a sensor entity and a storage helper (input_text).`}
      <!-- mwc-tooltip handles its own styling -->
    ` : m`<div>Loading Home Assistant components...</div>`;
  }
};
$e([
  g({ attribute: !1 })
], Z.prototype, "config", void 0);
$e([
  g({ attribute: !1 })
], Z.prototype, "hass", void 0);
Z = $e([
  ae("cleverio-card-editor")
], Z);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "cleverio-pf100-card",
  name: "Cleverio Feeder Card",
  preview: !1,
  description: "Cleverio PF100 feeder card to decode/encode base64 meal_plan"
});
const ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return Z;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  $ as CleverioPf100Card
};
