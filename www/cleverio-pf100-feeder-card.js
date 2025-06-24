var ve = (o) => {
  throw TypeError(o);
};
var be = (o, e, t) => e.has(o) || ve("Cannot " + t);
var _ = (o, e, t) => (be(o, e, "read from private field"), t ? t.call(o) : e.get(o)), $ = (o, e, t) => e.has(o) ? ve("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), f = (o, e, t, s) => (be(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, fe = oe.ShadowRoot && (oe.ShadyCSS === void 0 || oe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ge = Symbol(), we = /* @__PURE__ */ new WeakMap();
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
      s && (e = we.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && we.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Be = (o) => new Ue(typeof o == "string" ? o : o + "", void 0, ge), _e = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new Ue(t, o, ge);
}, We = (o, e) => {
  if (fe) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = oe.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, Ae = fe ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Be(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ve, defineProperty: Je, getOwnPropertyDescriptor: qe, getOwnPropertyNames: Ze, getOwnPropertySymbols: Ye, getPrototypeOf: Ge } = Object, C = globalThis, Ee = C.trustedTypes, Xe = Ee ? Ee.emptyScript : "", de = C.reactiveElementPolyfillSupport, B = (o, e) => o, ne = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Xe : null;
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
} }, $e = (o, e) => !Ve(o, e), Ce = { attribute: !0, type: String, converter: ne, reflect: !1, useDefault: !1, hasChanged: $e };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), C.litPropertyMetadata ?? (C.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let R = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ce) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Je(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = qe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const l = i == null ? void 0 : i.call(this);
      n == null || n.call(this, r), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const e = Ge(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const t = this.properties, s = [...Ze(t), ...Ye(t)];
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
    return We(e, this.constructor.elementStyles), e;
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
      const r = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : ne).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, r;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : ne;
      this._$Em = i, this[i] = a.fromAttribute(t, l.type) ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, r = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? $e)(r, t) || s.useDefault && s.reflect && r === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: n }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: l } = r, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, r, a);
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[B("elementProperties")] = /* @__PURE__ */ new Map(), R[B("finalized")] = /* @__PURE__ */ new Map(), de == null || de({ ReactiveElement: R }), (C.reactiveElementVersions ?? (C.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, re = W.trustedTypes, xe = re ? re.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Ie = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, je = "?" + E, Ke = `<${je}>`, k = document, V = () => k.createComment(""), J = (o) => o === null || typeof o != "object" && typeof o != "function", ye = Array.isArray, Qe = (o) => ye(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", pe = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Se = /-->/g, Me = />/g, M = RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Oe = /'/g, Pe = /"/g, He = /^(?:script|style|textarea|title)$/i, et = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), m = et(1), F = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ke = /* @__PURE__ */ new WeakMap(), O = k.createTreeWalker(k, 129);
function Ne(o, e) {
  if (!ye(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xe !== void 0 ? xe.createHTML(e) : e;
}
const tt = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = L;
  for (let l = 0; l < t; l++) {
    const a = o[l];
    let h, d, c = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, d = r.exec(a), d !== null); ) u = r.lastIndex, r === L ? d[1] === "!--" ? r = Se : d[1] !== void 0 ? r = Me : d[2] !== void 0 ? (He.test(d[2]) && (i = RegExp("</" + d[2], "g")), r = M) : d[3] !== void 0 && (r = M) : r === M ? d[0] === ">" ? (r = i ?? L, c = -1) : d[1] === void 0 ? c = -2 : (c = r.lastIndex - d[2].length, h = d[1], r = d[3] === void 0 ? M : d[3] === '"' ? Pe : Oe) : r === Pe || r === Oe ? r = M : r === Se || r === Me ? r = L : (r = M, i = void 0);
    const A = r === M && o[l + 1].startsWith("/>") ? " " : "";
    n += r === L ? a + Ke : c >= 0 ? (s.push(h), a.slice(0, c) + Ie + a.slice(c) + E + A) : a + E + (c === -2 ? l : A);
  }
  return [Ne(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class q {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const l = e.length - 1, a = this.parts, [h, d] = tt(e, t);
    if (this.el = q.createElement(h, s), O.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = O.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(Ie)) {
          const u = d[r++], A = i.getAttribute(c).split(E), ie = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: ie[2], strings: A, ctor: ie[1] === "." ? it : ie[1] === "?" ? ot : ie[1] === "@" ? nt : le }), i.removeAttribute(c);
        } else c.startsWith(E) && (a.push({ type: 6, index: n }), i.removeAttribute(c));
        if (He.test(i.tagName)) {
          const c = i.textContent.split(E), u = c.length - 1;
          if (u > 0) {
            i.textContent = re ? re.emptyScript : "";
            for (let A = 0; A < u; A++) i.append(c[A], V()), O.nextNode(), a.push({ type: 2, index: ++n });
            i.append(c[u], V());
          }
        }
      } else if (i.nodeType === 8) if (i.data === je) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(E, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += E.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = k.createElement("template");
    return s.innerHTML = e, s;
  }
}
function z(o, e, t = o, s) {
  var r, l;
  if (e === F) return e;
  let i = s !== void 0 ? (r = t._$Co) == null ? void 0 : r[s] : t._$Cl;
  const n = J(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = z(o, i._$AS(o, e.values), i, s)), e;
}
class st {
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
    let n = O.nextNode(), r = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new se(n, n.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (h = new rt(n, this, e)), this._$AV.push(h), a = s[++l];
      }
      r !== (a == null ? void 0 : a.index) && (n = O.nextNode(), r++);
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
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = z(this, e, t), J(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== F && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Qe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && J(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = q.createElement(Ne(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const r = new st(i, this), l = r.u(this.options);
      r.p(t), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = ke.get(e.strings);
    return t === void 0 && ke.set(e.strings, t = new q(e)), t;
  }
  k(e) {
    ye(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new se(this.O(V()), this.O(V()), this, this.options)) : s = t[i], s._$AI(n), i++;
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
class le {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = z(this, e, t, 0), r = !J(e) || e !== this._$AH && e !== F, r && (this._$AH = e);
    else {
      const l = e;
      let a, h;
      for (e = n[0], a = 0; a < n.length - 1; a++) h = z(this, l[s + a], t, a), h === F && (h = this._$AH[a]), r || (r = !J(h) || h !== this._$AH[a]), h === p ? e = p : e !== p && (e += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class it extends le {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class ot extends le {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class nt extends le {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = z(this, e, t, 0) ?? p) === F) return;
    const s = this._$AH, i = e === p && s !== p || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class rt {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    z(this, e);
  }
}
const ue = W.litHtmlPolyfillSupport;
ue == null || ue(q, se), (W.litHtmlVersions ?? (W.litHtmlVersions = [])).push("3.3.0");
const at = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new se(e.insertBefore(V(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class x extends R {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = at(t, this.renderRoot, this.renderOptions);
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
    return F;
  }
}
var Re;
x._$litElement$ = !0, x.finalized = !0, (Re = P.litElementHydrateSupport) == null || Re.call(P, { LitElement: x });
const me = P.litElementPolyfillSupport;
me == null || me({ LitElement: x });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = { attribute: !0, type: String, converter: ne, reflect: !1, hasChanged: $e }, ht = (o = lt, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), n.set(t.name, o), s === "accessor") {
    const { name: r } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(r, a, o);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, o, l), l;
    } };
  }
  if (s === "setter") {
    const { name: r } = t;
    return function(l) {
      const a = this[r];
      e.call(this, l), this.requestUpdate(r, a, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function v(o) {
  return (e, t) => typeof t == "object" ? ht(o, e, t) : ((s, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(o) {
  return v({ ...o, state: !0, attribute: !1 });
}
function ct(o, e) {
  let t = 0;
  return o.forEach((s) => {
    s.enabled && s.daysMask & 1 << e && (t += s.portion);
  }), t;
}
function dt(o) {
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
    const [n, r, l, a, h] = t.slice(i, i + 5);
    s.push({
      time: `${r.toString().padStart(2, "0")}:${l.toString().padStart(2, "0")}`,
      daysMask: n,
      portion: a || 1,
      enabled: h === 1
    });
  }
  return s;
}
function pt(o) {
  const e = [];
  return o.forEach((t) => {
    const [s, i] = t.time.split(":").map(Number);
    e.push(t.daysMask, s, i, Number(t.portion), t.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...e));
}
const ut = [
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
], Fe = async (o) => {
  var t, s, i, n, r, l;
  const e = o || ut;
  try {
    if (e.every((c) => customElements.get(c)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((c, u) => setTimeout(() => u(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
    ]);
    const a = document.createElement("partial-panel-resolver");
    if (!a)
      throw new Error("Failed to create partial-panel-resolver element");
    if (a.hass = {
      panels: [
        {
          url_path: "tmp",
          component_name: "config"
        }
      ]
    }, typeof a._updateRoutes != "function")
      throw new Error("partial-panel-resolver does not have _updateRoutes method");
    if (a._updateRoutes(), !((i = (s = (t = a.routerOptions) == null ? void 0 : t.routes) == null ? void 0 : s.tmp) != null && i.load))
      throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([
      a.routerOptions.routes.tmp.load(),
      new Promise((c, u) => setTimeout(() => u(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((c, u) => setTimeout(() => u(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const h = document.createElement("ha-panel-config");
    if (!h)
      throw new Error("Failed to create ha-panel-config element");
    if (!((l = (r = (n = h.routerOptions) == null ? void 0 : n.routes) == null ? void 0 : r.automation) != null && l.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      h.routerOptions.routes.automation.load(),
      new Promise((c, u) => setTimeout(() => u(new Error("Timeout loading automation components")), 1e4))
    ]);
    const d = e.filter((c) => !customElements.get(c));
    if (d.length > 0)
      throw new Error(`Failed to load components: ${d.join(", ")}`);
  } catch (a) {
    console.error("Error loading Home Assistant form components:", a);
    try {
      if (window.customElements && window.customElements.get("home-assistant")) {
        console.log("Attempting fallback loading method for HA components");
        const h = new CustomEvent("ha-request-load-components", {
          detail: {
            components: e
          },
          bubbles: !0,
          composed: !0
        });
        document.dispatchEvent(h);
      }
    } catch (h) {
      console.error("Fallback loading method failed:", h);
    }
  }
};
let ze = {}, De = !1;
async function mt() {
  if (!De)
    try {
      const o = new URL("data:application/json;base64,ewogICJzY2hlZHVsZXMiOiAiU2NoZWR1bGVzIiwKICAiYWN0aXZlX3NjaGVkdWxlcyI6ICJBY3RpdmUgU2NoZWR1bGVzIiwKICAidG9kYXkiOiAiVG9kYXkiLAogICJtYW5hZ2Vfc2NoZWR1bGVzIjogIk1hbmFnZSBTY2hlZHVsZXMiLAogICJwb3J0aW9uIjogIlBvcnRpb24iLAogICJ0aW1lIjogIlRpbWUiLAogICJkYXlzIjogIkRheXMiLAogICJlbmFibGVkIjogIkVuYWJsZWQiLAogICJhY3Rpb25zIjogIkFjdGlvbnMiCn0K", import.meta.url).href, e = await fetch(o);
      e.ok ? (ze = await e.json(), De = !0) : console.error("Failed to load translations", e.status);
    } catch (o) {
      console.error("Failed to load translations", o);
    }
}
function g(o) {
  return ze[o] || o;
}
var ce = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (n = (i < 3 ? r(n) : i > 3 ? r(e, t, n) : r(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, T;
let Z = (T = class extends x {
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
}, T.styles = _e`
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
  `, T);
ce([
  v({ type: Number })
], Z.prototype, "selectedDaysMask", void 0);
ce([
  v({ type: Boolean })
], Z.prototype, "editable", void 0);
ce([
  v({ type: Array })
], Z.prototype, "dayLabels", void 0);
Z = ce([
  he("cleverio-day-selector")
], Z);
var D = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (n = (i < 3 ? r(n) : i > 3 ? r(e, t, n) : r(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, U, I, j;
let S = (j = class extends x {
  constructor() {
    super();
    $(this, U);
    $(this, I);
    f(this, U, []), this.viewMeals = [], this.editForm = null, this.editError = null, this.editDialogOpen = !1, this.editIdx = null, f(this, I, !1), this.meals = [], this.viewMeals = [];
  }
  get meals() {
    return _(this, U);
  }
  set meals(t) {
    f(this, U, t);
  }
  get haComponentsReady() {
    return _(this, I);
  }
  set haComponentsReady(t) {
    f(this, I, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), await Fe(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this.haComponentsReady = !0;
  }
  // Watch for changes in meals
  updated(t) {
    t.has("meals") && (this.viewMeals = this.meals.map((s) => ({ ...s })), this.editDialogOpen = !1);
  }
  // Helper to check if there are unsaved changes
  get _hasUnsavedChanges() {
    const t = JSON.stringify(this.viewMeals), s = JSON.stringify(this.meals);
    return t !== s;
  }
  _toggleEnabled(t, s) {
    const i = s.target.checked;
    this.viewMeals = this.viewMeals.map((n, r) => r === t ? { ...n, enabled: i } : n);
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
    this.meals = this.viewMeals.map((t) => ({ ...t })), this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this.viewMeals }, bubbles: !0, composed: !0 }));
  }
  render() {
    var n, r, l;
    if (!this.haComponentsReady)
      return m`<div>Loading Home Assistant components...</div>`;
    const t = {
      time: { title: g("time"), sortable: !0, minWidth: "80px" },
      portion: { title: g("portion"), sortable: !0, minWidth: "80px" },
      days: {
        title: g("days"),
        sortable: !1,
        minWidth: "130px",
        template: (a) => m`
          <cleverio-day-selector
            .selectedDaysMask=${a.daysMask}
            .editable=${!1}
          ></cleverio-day-selector>
        `
      },
      enabled: {
        title: g("enabled"),
        sortable: !0,
        minWidth: "60px",
        template: (a) => m`
          <div style="display: flex; align-items: center; justify-content: center; height: 48px;">
            <ha-switch
              .checked=${a.enabled}
              @change=${(h) => this._toggleEnabled(a._idx, h)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        `
      },
      actions: {
        title: g("actions"),
        sortable: !1,
        minWidth: "140px",
        template: (a) => m`
          <ha-icon-button @click=${() => this._openEditDialog(a._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(a._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        `
      }
    }, s = this.viewMeals.map((a, h) => ({ ...a, _idx: h })), i = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return m`
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? "Edit Feeding Time" : g("manage_schedules")}>
      
        ${this.editDialogOpen ? m`
              <form class="edit-form" @submit=${(a) => a.preventDefault()}>
                ${this.editError ? m`<div class="error">${this.editError}</div>` : ""}
                <cleverio-day-selector
                  class="edit-mode"
                  .selectedDaysMask=${((n = this.editForm) == null ? void 0 : n.daysMask) ?? 0}
                  .editable=${!0}
                  @days-changed=${(a) => {
      this.editForm.daysMask = a.detail.daysMask, this.requestUpdate();
    }}
                ></cleverio-day-selector>
                <div class="edit-form-group">
                  <label for="edit-time">Time</label>
                  <input
                    id="edit-time"
                    class="edit-time"
                    type="time"
                    .value=${((r = this.editForm) == null ? void 0 : r.time) ?? ""}
                    @input=${(a) => {
      this.editForm.time = a.target.value, this.requestUpdate();
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
                    @input=${(a) => {
      this.editForm.portion = parseInt(a.target.value, 10), this.requestUpdate();
    }}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${i.map((a) => m`
                    <ha-button type="button" @click=${() => {
      this.editForm.time = a, this.requestUpdate();
    }}>${a}</ha-button>
                  `)}
                </div>
              </form>
            ` : m`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${g}
                  .columns=${t}
                  .data=${s}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editDialogOpen ? m`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>Back</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>Save</ha-button>
            ` : m`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>Add</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>Cancel</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>Save</ha-button>
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
}, U = new WeakMap(), I = new WeakMap(), j.styles = [
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
], j);
D([
  v({ type: Array })
], S.prototype, "meals", null);
D([
  b()
], S.prototype, "viewMeals", void 0);
D([
  b()
], S.prototype, "editForm", void 0);
D([
  b()
], S.prototype, "editError", void 0);
D([
  b()
], S.prototype, "editDialogOpen", void 0);
D([
  v({ type: Boolean })
], S.prototype, "haComponentsReady", null);
S = D([
  he("cleverio-schedule-view")
], S);
var w = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (n = (i < 3 ? r(n) : i > 3 ? r(e, t, n) : r(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, Y, G, X, K, Q, ee, H, N;
let y = (N = class extends x {
  constructor() {
    super();
    $(this, Y);
    $(this, G);
    $(this, X);
    $(this, K);
    $(this, Q);
    $(this, ee);
    $(this, H);
    this._haComponentsReady = !1, f(this, H, []), this.footerButtonsTemplate = null, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return _(this, Y);
  }
  set hass(t) {
    f(this, Y, t);
  }
  get config() {
    return _(this, G);
  }
  set config(t) {
    f(this, G, t);
  }
  get _meals() {
    return _(this, X);
  }
  set _meals(t) {
    f(this, X, t);
  }
  get _persistedMeals() {
    return _(this, K);
  }
  set _persistedMeals(t) {
    f(this, K, t);
  }
  get _dialogOpen() {
    return _(this, Q);
  }
  set _dialogOpen(t) {
    f(this, Q, t);
  }
  get _dialogData() {
    return _(this, ee);
  }
  set _dialogData(t) {
    f(this, ee, t);
  }
  get _footerButtons() {
    return _(this, H);
  }
  set _footerButtons(t) {
    f(this, H, t);
  }
  setConfig(t) {
    this.config = t, this._checkConfig(), this._updateConfig();
  }
  updated(t) {
    t.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await mt(), await Fe(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback();
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
  }
  _updateHass() {
    const t = this._stateObj;
    let s;
    if (t)
      try {
        s = dt(t.state), Array.isArray(s) && (this._persistedMeals = s);
      } catch (i) {
        console.error("Failed to decode meal plan:", i);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []);
  }
  render() {
    var t;
    return this._haComponentsReady ? m`
      <ha-card header=${((t = this.config) == null ? void 0 : t.title) || "Cleverio Pet Feeder"} style="height: 100%;">
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${g("schedules")}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${g("active_schedules")}: <span style="white-space:nowrap;">${this._meals.filter((s) => s.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${g("today")}: <span style="white-space:nowrap;">${ct(this._meals.filter((s) => s.enabled), (/* @__PURE__ */ new Date()).getDay()) * 6}g</span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0;
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${g("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? m`
              <cleverio-schedule-view
                .meals=${this._meals}
                .localize=${g}
                @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                @footer-buttons-changed=${this._onFooterButtonsChanged.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : m`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ft), document.createElement("cleverio-card-editor");
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID)
      return;
    const t = pt(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: t
    });
  }
  _onScheduleMealsChanged(t) {
    this._dialogOpen = !1, this._meals = t.detail.meals, this._saveMealsToSensor();
  }
  _onDialogClose() {
    this._dialogOpen = !1;
  }
  _onFooterButtonsChanged(t) {
    this.footerButtonsTemplate = t.detail.template;
  }
}, Y = new WeakMap(), G = new WeakMap(), X = new WeakMap(), K = new WeakMap(), Q = new WeakMap(), ee = new WeakMap(), H = new WeakMap(), N.styles = [
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
  v({ type: Object })
], y.prototype, "hass", null);
w([
  v({ type: Object })
], y.prototype, "config", null);
w([
  b()
], y.prototype, "_meals", null);
w([
  b()
], y.prototype, "_persistedMeals", null);
w([
  b()
], y.prototype, "_dialogOpen", null);
w([
  b()
], y.prototype, "_dialogData", null);
w([
  v({ type: Boolean })
], y.prototype, "_haComponentsReady", void 0);
w([
  b()
], y.prototype, "_footerButtons", null);
w([
  b()
], y.prototype, "footerButtonsTemplate", void 0);
y = w([
  he("cleverio-pf100-card")
], y);
var Le = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (r = o[l]) && (n = (i < 3 ? r(n) : i > 3 ? r(e, t, n) : r(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, te, Te;
let ae = (Te = class extends x {
  constructor() {
    super(...arguments);
    $(this, te, { sensor: "", title: "" });
  }
  get config() {
    return _(this, te);
  }
  set config(t) {
    f(this, te, t);
  }
  setConfig(t) {
    this.config = { ...t };
  }
  _onInput(t) {
    const { name: s, value: i } = t.target;
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
}, te = new WeakMap(), Te);
Le([
  v({ attribute: !1 })
], ae.prototype, "config", null);
ae = Le([
  he("cleverio-card-editor")
], ae);
const ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return ae;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  y as CleverioPf100Card
};
