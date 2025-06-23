var Ce = (o) => {
  throw TypeError(o);
};
var Se = (o, e, t) => e.has(o) || Ce("Cannot " + t);
var _ = (o, e, t) => (Se(o, e, "read from private field"), t ? t.call(o) : e.get(o)), g = (o, e, t) => e.has(o) ? Ce("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), m = (o, e, t, s) => (Se(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = globalThis, ve = ce.ShadowRoot && (ce.ShadyCSS === void 0 || ce.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, be = Symbol(), Me = /* @__PURE__ */ new WeakMap();
let qe = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== be) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ve && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Me.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Me.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ze = (o) => new qe(typeof o == "string" ? o : o + "", void 0, be), fe = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new qe(t, o, be);
}, Ge = (o, e) => {
  if (ve) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = ce.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, Oe = ve ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ze(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Qe, defineProperty: Xe, getOwnPropertyDescriptor: Ye, getOwnPropertyNames: et, getOwnPropertySymbols: tt, getPrototypeOf: st } = Object, x = globalThis, Pe = x.trustedTypes, it = Pe ? Pe.emptyScript : "", _e = x.reactiveElementPolyfillSupport, W = (o, e) => o, de = { toAttribute(o, e) {
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
} }, we = (o, e) => !Qe(o, e), Te = { attribute: !0, type: String, converter: de, reflect: !1, useDefault: !1, hasChanged: we };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Te) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Xe(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = Ye(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Te;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const e = st(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
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
      for (const i of s) t.unshift(Oe(i));
    } else e !== void 0 && t.push(Oe(e));
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
    var n;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const a = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : de).toAttribute(t, s.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, a;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), l = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : de;
      this._$Em = i, this[i] = l.fromAttribute(t, r.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, a = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? we)(a, t) || s.useDefault && s.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[W("elementProperties")] = /* @__PURE__ */ new Map(), k[W("finalized")] = /* @__PURE__ */ new Map(), _e == null || _e({ ReactiveElement: k }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, he = V.trustedTypes, ke = he ? he.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Be = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Fe = "?" + A, ot = `<${Fe}>`, P = document, J = () => P.createComment(""), K = (o) => o === null || typeof o != "object" && typeof o != "function", Ee = Array.isArray, nt = (o) => Ee(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", ge = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ue = /-->/g, De = />/g, S = RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Re = /'/g, je = /"/g, We = /^(?:script|style|textarea|title)$/i, at = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), p = at(1), z = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), He = /* @__PURE__ */ new WeakMap(), M = P.createTreeWalker(P, 129);
function Ve(o, e) {
  if (!Ee(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ke !== void 0 ? ke.createHTML(e) : e;
}
const rt = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = F;
  for (let r = 0; r < t; r++) {
    const l = o[r];
    let d, h, c = -1, f = 0;
    for (; f < l.length && (a.lastIndex = f, h = a.exec(l), h !== null); ) f = a.lastIndex, a === F ? h[1] === "!--" ? a = Ue : h[1] !== void 0 ? a = De : h[2] !== void 0 ? (We.test(h[2]) && (i = RegExp("</" + h[2], "g")), a = S) : h[3] !== void 0 && (a = S) : a === S ? h[0] === ">" ? (a = i ?? F, c = -1) : h[1] === void 0 ? c = -2 : (c = a.lastIndex - h[2].length, d = h[1], a = h[3] === void 0 ? S : h[3] === '"' ? je : Re) : a === je || a === Re ? a = S : a === Ue || a === De ? a = F : (a = S, i = void 0);
    const E = a === S && o[r + 1].startsWith("/>") ? " " : "";
    n += a === F ? l + ot : c >= 0 ? (s.push(d), l.slice(0, c) + Be + l.slice(c) + A + E) : l + A + (c === -2 ? r : E);
  }
  return [Ve(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Z {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const r = e.length - 1, l = this.parts, [d, h] = rt(e, t);
    if (this.el = Z.createElement(d, s), M.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = M.nextNode()) !== null && l.length < r; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(Be)) {
          const f = h[a++], E = i.getAttribute(c).split(A), le = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: le[2], strings: E, ctor: le[1] === "." ? ct : le[1] === "?" ? dt : le[1] === "@" ? ht : me }), i.removeAttribute(c);
        } else c.startsWith(A) && (l.push({ type: 6, index: n }), i.removeAttribute(c));
        if (We.test(i.tagName)) {
          const c = i.textContent.split(A), f = c.length - 1;
          if (f > 0) {
            i.textContent = he ? he.emptyScript : "";
            for (let E = 0; E < f; E++) i.append(c[E], J()), M.nextNode(), l.push({ type: 2, index: ++n });
            i.append(c[f], J());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Fe) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(A, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += A.length - 1;
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
  const n = K(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((r = i == null ? void 0 : i._$AO) == null || r.call(i, !1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = L(o, i._$AS(o, e.values), i, s)), e;
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
    let n = M.nextNode(), a = 0, r = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let d;
        l.type === 2 ? d = new oe(n, n.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (d = new pt(n, this, e)), this._$AV.push(d), l = s[++r];
      }
      a !== (l == null ? void 0 : l.index) && (n = M.nextNode(), a++);
    }
    return M.currentNode = P, i;
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
    e = L(this, e, t), K(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== z && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : nt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && K(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Z.createElement(Ve(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const a = new lt(i, this), r = a.u(this.options);
      a.p(t), this.T(r), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = He.get(e.strings);
    return t === void 0 && He.set(e.strings, t = new Z(e)), t;
  }
  k(e) {
    Ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new oe(this.O(J()), this.O(J()), this, this.options)) : s = t[i], s._$AI(n), i++;
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
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = L(this, e, t, 0), a = !K(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
    else {
      const r = e;
      let l, d;
      for (e = n[0], l = 0; l < n.length - 1; l++) d = L(this, r[s + l], t, l), d === z && (d = this._$AH[l]), a || (a = !K(d) || d !== this._$AH[l]), d === u ? e = u : e !== u && (e += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    a && !i && this.j(e);
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
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = L(this, e, t, 0) ?? u) === z) return;
    const s = this._$AH, i = e === u && s !== u || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
    L(this, e);
  }
}
const ye = V.litHtmlPolyfillSupport;
ye == null || ye(Z, oe), (V.litHtmlVersions ?? (V.litHtmlVersions = [])).push("3.3.0");
const ut = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new oe(e.insertBefore(J(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis;
class b extends k {
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
    return z;
  }
}
var ze;
b._$litElement$ = !0, b.finalized = !0, (ze = O.litElementHydrateSupport) == null || ze.call(O, { LitElement: b });
const $e = O.litElementPolyfillSupport;
$e == null || $e({ LitElement: b });
(O.litElementVersions ?? (O.litElementVersions = [])).push("4.2.0");
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
const ft = { attribute: !0, type: String, converter: de, reflect: !1, hasChanged: we }, mt = (o = ft, e, t) => {
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
function $(o) {
  return (e, t) => typeof t == "object" ? mt(o, e, t) : ((s, i, n) => {
    const a = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), a ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function T(o) {
  return $({ ...o, state: !0, attribute: !1 });
}
function Ne(o) {
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
    const [n, a, r, l, d] = t.slice(i, i + 5);
    s.push({
      time: `${a.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`,
      daysMask: n,
      portion: l || 1,
      enabled: d === 1
    });
  }
  return s;
}
function yt(o) {
  const e = [];
  return o.forEach((t) => {
    const [s, i] = t.time.split(":").map(Number);
    e.push(t.daysMask, s, i, Number(t.portion), t.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...e));
}
const $t = [
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
  var t, s, i, n, a, r;
  const e = o || $t;
  try {
    if (e.every((c) => customElements.get(c)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
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
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const d = document.createElement("ha-panel-config");
    if (!d)
      throw new Error("Failed to create ha-panel-config element");
    if (!((r = (a = (n = d.routerOptions) == null ? void 0 : n.routes) == null ? void 0 : a.automation) != null && r.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      d.routerOptions.routes.automation.load(),
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout loading automation components")), 1e4))
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
let Je = {}, Ie = !1;
async function vt() {
  if (!Ie)
    try {
      const o = new URL("./en.json", import.meta.url).href, e = await fetch(o);
      e.ok ? (Je = await e.json(), Ie = !0) : console.error("Failed to load translations", e.status);
    } catch (o) {
      console.error("Failed to load translations", o);
    }
}
function y(o) {
  return Je[o] || o;
}
var xe = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
};
const bt = ["M", "T", "W", "T", "F", "S", "S"], wt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var U;
let pe = (U = class extends b {
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
            title=${wt[s]}
          >${t}</span>
        `)}
      </div>
    `;
  }
}, U.styles = fe`
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
  `, U);
xe([
  $({ type: Number })
], pe.prototype, "selectedDaysMask", void 0);
xe([
  $({ type: Boolean })
], pe.prototype, "editable", void 0);
pe = xe([
  ne("cleverio-day-selector")
], pe);
var ae = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, G, D;
let q = (D = class extends b {
  constructor() {
    super();
    g(this, G);
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
    return _(this, G);
  }
  set data(t) {
    m(this, G, t);
  }
  async connectedCallback() {
    super.connectedCallback(), await Ae(["ha-form", "ha-button", "ha-switch"]), this._haComponentsReady = !0;
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
}, G = new WeakMap(), D.styles = fe`
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
  `, D);
ae([
  $({ type: Object })
], q.prototype, "data", null);
ae([
  T()
], q.prototype, "_haComponentsReady", void 0);
ae([
  T()
], q.prototype, "_localEdit", void 0);
ae([
  T()
], q.prototype, "_error", void 0);
q = ae([
  ne("cleverio-edit-view")
], q);
var re = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
};
console.log("[cleverio-schedule-view] Module loaded");
var R, j, H, N;
let B = (N = class extends b {
  constructor() {
    super();
    g(this, R);
    g(this, j);
    g(this, H);
    m(this, R, []), m(this, j, []), m(this, H, !1), this._editDialogOpen = !1, this._editIdx = null, this.meals = [], this._localMeals = [], this._editDialogOpen = !1, console.log("[cleverio-schedule-view] Constructor");
  }
  get meals() {
    return _(this, R);
  }
  set meals(t) {
    m(this, R, t);
  }
  get _localMeals() {
    return _(this, j);
  }
  set _localMeals(t) {
    m(this, j, t);
  }
  get _haComponentsReady() {
    return _(this, H);
  }
  set _haComponentsReady(t) {
    m(this, H, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), console.log("[cleverio-schedule-view] connectedCallback"), await Ae(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this._haComponentsReady = !0, console.log("[cleverio-schedule-view] HA components loaded");
  }
  // Watch for changes in meals
  updated(t) {
    t.has("meals") && (this._localMeals = this.meals.map((s) => ({ ...s })), this._editDialogOpen = !1, console.log("[cleverio-schedule-view] Meals updated", this._localMeals));
  }
  render() {
    if (!this._haComponentsReady)
      return p`<div>Loading Home Assistant components...</div>`;
    const t = {
      time: { title: y("time"), sortable: !0, minWidth: "80px" },
      portion: { title: y("portion"), sortable: !0, minWidth: "80px" },
      days: {
        title: y("days"),
        sortable: !1,
        minWidth: "130px",
        template: (n) => p`
          <cleverio-day-selector .selectedDaysMask=${n.daysMask} .editable=${!1}></cleverio-day-selector>`
      },
      enabled: {
        title: p`<span style="font-size:0.9em;">${y("enabled")}</span>`,
        sortable: !1,
        minWidth: "80px",
        minHeight: "100px",
        template: (n) => p`
            <ha-switch .checked=${n.enabled} @change=${(a) => this._toggleEnabled(n._idx, a)} title="Enable/disable schedule"></ha-switch>
        `
      },
      actions: {
        title: p`<span style="font-size:0.9em;">${y("actions")}</span>`,
        sortable: !1,
        minWidth: "100px",
        template: (n) => p`
          <ha-icon
            icon="mdi:pencil"
            @click=${() => this._openEditDialog(n._idx)}
            title="Edit"
            style="cursor:pointer;margin-right:8px;"
            tabindex="0"
            role="button"
          ></ha-icon>
          <ha-icon
            icon="mdi:delete"
            @click=${() => this._delete(n._idx)}
            title="Delete"
            style="color: var(--error-color, #b71c1c); cursor:pointer;"
            tabindex="0"
            role="button"
          ></ha-icon>
        `
      }
    }, s = this._localMeals.map((n, a) => ({ ...n, _idx: a })), i = { locale: { language: "en", country: "US" } };
    return p`
      ${this._editDialogOpen ? "" : p`
        <div class="ha-table-wrapper">
          <ha-data-table
            .hass=${i}
            .localizeFunc=${y}
            .columns=${t}
            .data=${s}
            class="ha-table-style"
            auto-height
          ></ha-data-table>
        </div>
        <div class="ha-actions-row">
          <ha-button @click=${this._openAddDialog.bind(this)}>Add</ha-button>
          <ha-button @click=${this._cancel.bind(this)}>Cancel</ha-button>
          <ha-button class="ha-primary" @click=${this._save.bind(this)}>${y("save")}</ha-button>
        </div>
      `}
      ${this._editDialogOpen ? p`
        <cleverio-edit-view
          .data=${this._editIdx !== null && this._editIdx !== void 0 ? { ...this._localMeals[this._editIdx] } : { time: "", portion: 1, daysMask: 0, enabled: !0 }}
          @edit-save=${this._onEditSave}
          @back=${this._closeEditDialog}
        ></cleverio-edit-view>
      ` : ""}
    `;
  }
  _toggleEnabled(t, s) {
    this._localMeals[t].enabled = s.target.checked, this.requestUpdate(), console.log("[cleverio-schedule-view] _toggleEnabled", { idx: t, enabled: this._localMeals[t].enabled });
  }
  _openEditDialog(t) {
    this._editDialogOpen = !0, this._editIdx = t, this.requestUpdate();
  }
  _openAddDialog() {
    this._editDialogOpen = !0, this._editIdx = null, this.requestUpdate();
  }
  _closeEditDialog() {
    this._editDialogOpen = !1, this._editIdx = null, this.requestUpdate();
  }
  _onEditSave(t) {
    const s = t.detail.meal;
    this._editIdx !== null && this._editIdx !== void 0 ? this._localMeals[this._editIdx] = s : this._localMeals = [...this._localMeals, s], this._closeEditDialog(), this.requestUpdate(), console.log("[cleverio-schedule-view] _onEditSave", { meal: s });
  }
  _delete(t) {
    this._localMeals.splice(t, 1), this.requestUpdate(), console.log("[cleverio-schedule-view] _delete", { idx: t });
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _cancel");
  }
  _save() {
    this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this._localMeals }, bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _save", { meals: this._localMeals });
  }
}, R = new WeakMap(), j = new WeakMap(), H = new WeakMap(), N.styles = [
  fe`
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
      :host ::ng-deep .mdc-data-table__cell,
      :host ::ng-deep .mdc-data-table__header-cell {
        box-sizing: content-box !important;
      }
    `
], N);
re([
  $({ type: Array })
], B.prototype, "meals", null);
re([
  $({ type: Array })
], B.prototype, "_localMeals", null);
re([
  $({ type: Boolean })
], B.prototype, "_haComponentsReady", null);
re([
  $({ type: Boolean })
], B.prototype, "_editDialogOpen", void 0);
B = re([
  ne("cleverio-schedule-view")
], B);
var v;
(function(o) {
  o[o.Monday = 1] = "Monday", o[o.Tuesday = 2] = "Tuesday", o[o.Wednesday = 4] = "Wednesday", o[o.Thursday = 8] = "Thursday", o[o.Friday = 16] = "Friday", o[o.Saturday = 32] = "Saturday", o[o.Sunday = 64] = "Sunday";
})(v || (v = {}));
var C = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, Q, X, Y, ee, te, se, I;
let w = (I = class extends b {
  constructor() {
    super();
    g(this, Q);
    g(this, X);
    g(this, Y);
    g(this, ee);
    g(this, te);
    g(this, se);
    this._haComponentsReady = !1, this._onMealsChanged = (t) => {
      this._meals = t.detail.meals, this.requestUpdate();
    }, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return _(this, Q);
  }
  set hass(t) {
    m(this, Q, t);
  }
  get config() {
    return _(this, X);
  }
  set config(t) {
    m(this, X, t);
  }
  get _meals() {
    return _(this, Y);
  }
  set _meals(t) {
    m(this, Y, t);
  }
  get _persistedMeals() {
    return _(this, ee);
  }
  set _persistedMeals(t) {
    m(this, ee, t);
  }
  get _dialogOpen() {
    return _(this, te);
  }
  set _dialogOpen(t) {
    m(this, te, t);
  }
  get _dialogData() {
    return _(this, se);
  }
  set _dialogData(t) {
    m(this, se, t);
  }
  setConfig(t) {
    this.config = t, this._checkConfig(), this._updateConfig();
  }
  updated(t) {
    t.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await vt(), await Ae(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback(), this.requestUpdate();
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
    var n;
    if (!this._haComponentsReady)
      return p`<div>Loading Home Assistant components...</div>`;
    const t = this._meals.filter((a) => a.enabled).length, s = (/* @__PURE__ */ new Date()).getDay();
    [v.Sunday, v.Monday, v.Tuesday, v.Wednesday, v.Thursday, v.Friday, v.Saturday][s];
    const i = _t(this._meals.filter((a) => a.enabled), s) * 6;
    return p`
      <ha-card>
        <div style="padding: 16px 16px 0 16px;">
          <h2 style="margin:0 0 8px 0;">${((n = this.config) == null ? void 0 : n.title) || "Cleverio Pet Feeder"}</h2>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 0 16px 8px 16px;">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${y("schedules")}: ${this._meals.length}
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${y("active_schedules")}: ${t}
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${y("today")}: ${i}g
          </ha-chip>
        </div>
        <div style="display: flex; justify-content: flex-end; margin: 0 16px 16px 16px;">
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0, this.requestUpdate();
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${y("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? p`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedule-view
                  .meals=${this._meals}
                  .localize=${y}
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
    const t = yt(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: t
    });
  }
  _onScheduleMealsChanged(t) {
    this._dialogOpen = !1, this._meals = t.detail.meals, this._saveMealsToSensor(), this.requestUpdate();
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
    return typeof Ne == "function" ? Ne(this._meals || []) : {};
  }
}, Q = new WeakMap(), X = new WeakMap(), Y = new WeakMap(), ee = new WeakMap(), te = new WeakMap(), se = new WeakMap(), I.styles = [fe``], I);
C([
  $({ type: Object })
], w.prototype, "hass", null);
C([
  $({ type: Object })
], w.prototype, "config", null);
C([
  T()
], w.prototype, "_meals", null);
C([
  T()
], w.prototype, "_persistedMeals", null);
C([
  T()
], w.prototype, "_dialogOpen", null);
C([
  T()
], w.prototype, "_dialogData", null);
C([
  $({ type: Boolean })
], w.prototype, "_haComponentsReady", void 0);
w = C([
  ne("cleverio-pf100-card")
], w);
var Ke = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var r = o.length - 1; r >= 0; r--) (a = o[r]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, ie, Le;
let ue = (Le = class extends b {
  constructor() {
    super(...arguments);
    g(this, ie, { sensor: "", title: "" });
  }
  get config() {
    return _(this, ie);
  }
  set config(t) {
    m(this, ie, t);
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
}, ie = new WeakMap(), Le);
Ke([
  $({ attribute: !1 })
], ue.prototype, "config", null);
ue = Ke([
  ne("cleverio-card-editor")
], ue);
const Et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return ue;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  w as CleverioPf100Card
};
