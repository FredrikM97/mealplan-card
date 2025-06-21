var We = Object.defineProperty;
var Ae = (r) => {
  throw TypeError(r);
};
var Je = (r, e, t) => e in r ? We(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var k = (r, e, t) => Je(r, typeof e != "symbol" ? e + "" : e, t), we = (r, e, t) => e.has(r) || Ae("Cannot " + t);
var p = (r, e, t) => (we(r, e, "read from private field"), t ? t.call(r) : e.get(r)), _ = (r, e, t) => e.has(r) ? Ae("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), f = (r, e, t, s) => (we(r, e, "write to private field"), s ? s.call(r, t) : e.set(r, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis, $e = se.ShadowRoot && (se.ShadyCSS === void 0 || se.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ve = Symbol(), Ee = /* @__PURE__ */ new WeakMap();
let je = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== ve) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if ($e && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Ee.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Ee.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ke = (r) => new je(typeof r == "string" ? r : r + "", void 0, ve), ae = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new je(t, r, ve);
}, Ze = (r, e) => {
  if ($e) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = se.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, r.appendChild(s);
  }
}, Se = $e ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ke(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ge, defineProperty: Qe, getOwnPropertyDescriptor: Xe, getOwnPropertyNames: Ye, getOwnPropertySymbols: et, getPrototypeOf: tt } = Object, y = globalThis, Ce = y.trustedTypes, st = Ce ? Ce.emptyScript : "", ce = y.reactiveElementPolyfillSupport, R = (r, e) => r, ie = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? st : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, me = (r, e) => !Ge(r, e), xe = { attribute: !0, type: String, converter: ie, reflect: !1, useDefault: !1, hasChanged: me };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = xe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Qe(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: o } = Xe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: i, set(n) {
      const a = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(e, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? xe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const e = tt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const t = this.properties, s = [...Ye(t), ...et(t)];
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
    return Ze(e, this.constructor.elementStyles), e;
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
    var o;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : ie).toAttribute(t, s.type);
      this._$Em = e, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var o, n;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = s.getPropertyOptions(i), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : ie;
      this._$Em = i, this[i] = l.fromAttribute(t, a.type) ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const o = this.constructor, n = this[e];
      if (s ?? (s = o.getPropertyOptions(e)), !((s.hasChanged ?? me)(n, t) || s.useDefault && s.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: a } = n, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, n, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
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
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[R("elementProperties")] = /* @__PURE__ */ new Map(), P[R("finalized")] = /* @__PURE__ */ new Map(), ce == null || ce({ ReactiveElement: P }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, re = H.trustedTypes, Me = re ? re.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Ie = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, Ve = "?" + m, it = `<${Ve}>`, x = document, N = () => x.createComment(""), j = (r) => r === null || typeof r != "object" && typeof r != "function", ye = Array.isArray, rt = (r) => ye(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", ue = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pe = /-->/g, Oe = />/g, E = RegExp(`>|${ue}(?:([^\\s"'>=/]+)(${ue}*=${ue}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ue = /'/g, Te = /"/g, ze = /^(?:script|style|textarea|title)$/i, ot = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), b = ot(1), O = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ke = /* @__PURE__ */ new WeakMap(), S = x.createTreeWalker(x, 129);
function qe(r, e) {
  if (!ye(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Me !== void 0 ? Me.createHTML(e) : e;
}
const nt = (r, e) => {
  const t = r.length - 1, s = [];
  let i, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = D;
  for (let a = 0; a < t; a++) {
    const l = r[a];
    let d, u, h = -1, $ = 0;
    for (; $ < l.length && (n.lastIndex = $, u = n.exec(l), u !== null); ) $ = n.lastIndex, n === D ? u[1] === "!--" ? n = Pe : u[1] !== void 0 ? n = Oe : u[2] !== void 0 ? (ze.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = E) : u[3] !== void 0 && (n = E) : n === E ? u[0] === ">" ? (n = i ?? D, h = -1) : u[1] === void 0 ? h = -2 : (h = n.lastIndex - u[2].length, d = u[1], n = u[3] === void 0 ? E : u[3] === '"' ? Te : Ue) : n === Te || n === Ue ? n = E : n === Pe || n === Oe ? n = D : (n = E, i = void 0);
    const v = n === E && r[a + 1].startsWith("/>") ? " " : "";
    o += n === D ? l + it : h >= 0 ? (s.push(d), l.slice(0, h) + Ie + l.slice(h) + m + v) : l + m + (h === -2 ? a : v);
  }
  return [qe(r, o + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class I {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const a = e.length - 1, l = this.parts, [d, u] = nt(e, t);
    if (this.el = I.createElement(d, s), S.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = S.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(Ie)) {
          const $ = u[n++], v = i.getAttribute(h).split(m), te = /([.?@])?(.*)/.exec($);
          l.push({ type: 1, index: o, name: te[2], strings: v, ctor: te[1] === "." ? lt : te[1] === "?" ? ht : te[1] === "@" ? dt : le }), i.removeAttribute(h);
        } else h.startsWith(m) && (l.push({ type: 6, index: o }), i.removeAttribute(h));
        if (ze.test(i.tagName)) {
          const h = i.textContent.split(m), $ = h.length - 1;
          if ($ > 0) {
            i.textContent = re ? re.emptyScript : "";
            for (let v = 0; v < $; v++) i.append(h[v], N()), S.nextNode(), l.push({ type: 2, index: ++o });
            i.append(h[$], N());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ve) l.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(m, h + 1)) !== -1; ) l.push({ type: 7, index: o }), h += m.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = x.createElement("template");
    return s.innerHTML = e, s;
  }
}
function U(r, e, t = r, s) {
  var n, a;
  if (e === O) return e;
  let i = s !== void 0 ? (n = t._$Co) == null ? void 0 : n[s] : t._$Cl;
  const o = j(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = U(r, i._$AS(r, e.values), i, s)), e;
}
class at {
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? x).importNode(t, !0);
    S.currentNode = i;
    let o = S.nextNode(), n = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new Y(o, o.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (d = new ct(o, this, e)), this._$AV.push(d), l = s[++a];
      }
      n !== (l == null ? void 0 : l.index) && (o = S.nextNode(), n++);
    }
    return S.currentNode = x, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class Y {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = U(this, e, t), j(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : rt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = I.createElement(qe(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(t);
    else {
      const n = new at(i, this), a = n.u(this.options);
      n.p(t), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = ke.get(e.strings);
    return t === void 0 && ke.set(e.strings, t = new I(e)), t;
  }
  k(e) {
    ye(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const o of e) i === t.length ? t.push(s = new Y(this.O(N()), this.O(N()), this, this.options)) : s = t[i], s._$AI(o), i++;
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
  constructor(e, t, s, i, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(e, t = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = U(this, e, t, 0), n = !j(e) || e !== this._$AH && e !== O, n && (this._$AH = e);
    else {
      const a = e;
      let l, d;
      for (e = o[0], l = 0; l < o.length - 1; l++) d = U(this, a[s + l], t, l), d === O && (d = this._$AH[l]), n || (n = !j(d) || d !== this._$AH[l]), d === c ? e = c : e !== c && (e += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class lt extends le {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class ht extends le {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class dt extends le {
  constructor(e, t, s, i, o) {
    super(e, t, s, i, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = U(this, e, t, 0) ?? c) === O) return;
    const s = this._$AH, i = e === c && s !== c || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== c && (s === c || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
    U(this, e);
  }
}
const pe = H.litHtmlPolyfillSupport;
pe == null || pe(I, Y), (H.litHtmlVersions ?? (H.litHtmlVersions = [])).push("3.3.0");
const ut = (r, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new Y(e.insertBefore(N(), o), o, void 0, t ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
class A extends P {
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
    return O;
  }
}
var Re;
A._$litElement$ = !0, A.finalized = !0, (Re = C.litElementHydrateSupport) == null || Re.call(C, { LitElement: A });
const _e = C.litElementPolyfillSupport;
_e == null || _e({ LitElement: A });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = { attribute: !0, type: String, converter: ie, reflect: !1, hasChanged: me }, _t = (r = pt, e, t) => {
  const { kind: s, metadata: i } = t;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(t.name, r), s === "accessor") {
    const { name: n } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(n, l, r);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, r, a), a;
    } };
  }
  if (s === "setter") {
    const { name: n } = t;
    return function(a) {
      const l = this[n];
      e.call(this, a), this.requestUpdate(n, l, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function g(r) {
  return (e, t) => typeof t == "object" ? _t(r, e, t) : ((s, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function de(r) {
  return g({ ...r, state: !0, attribute: !1 });
}
function De(r) {
  const e = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  };
  return r.forEach((t) => {
    if (t.enabled) {
      for (let s = 0; s < 7; s++)
        if (t.daysMask & 1 << s) {
          const i = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ][s];
          e[i] += t.portion;
        }
    }
  }), e;
}
function Le(r, e) {
  let t = 0;
  return r.forEach((s) => {
    s.enabled && s.daysMask & 1 << [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ].indexOf(e) && (t += s.portion);
  }), t;
}
function ft(r) {
  const e = r.map((t) => `${t.time},${t.portion},${t.daysMask},${t.enabled ? 1 : 0}`).join(";");
  return btoa(e);
}
function gt(r) {
  try {
    return atob(r).split(";").filter(Boolean).map((t) => {
      const [s, i, o, n] = t.split(",");
      return {
        time: s,
        portion: Number(i),
        daysMask: Number(o),
        enabled: n === "1"
      };
    });
  } catch {
    throw new Error("Invalid base64");
  }
}
const Be = ae`
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
`, $t = ae`
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
`;
var ee = function(r, e, t, s) {
  var i = arguments.length, o = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(r, e, t, s);
  else for (var a = r.length - 1; a >= 0; a--) (n = r[a]) && (o = (i < 3 ? n(o) : i > 3 ? n(e, t, o) : n(e, t)) || o);
  return i > 3 && o && Object.defineProperty(e, t, o), o;
}, V, z, q, L, fe;
let T = (fe = class extends A {
  constructor() {
    super();
    _(this, V, []);
    _(this, z, []);
    _(this, q, "table");
    _(this, L, null);
    this.meals = [], this._localMeals = [], this._view = "table", this._editIdx = null;
  }
  get meals() {
    return p(this, V);
  }
  set meals(t) {
    f(this, V, t);
  }
  get _localMeals() {
    return p(this, z);
  }
  set _localMeals(t) {
    f(this, z, t);
  }
  get _view() {
    return p(this, q);
  }
  set _view(t) {
    f(this, q, t);
  }
  get _editIdx() {
    return p(this, L);
  }
  set _editIdx(t) {
    f(this, L, t);
  }
  updated(t) {
    t.has("meals") && (this._localMeals = this.meals.map((s) => ({ ...s })), this._view = "table", this._editIdx = null);
  }
  render() {
    return this._view === "edit" ? this._renderEditView() : b`
      <table>
        <tr><th>Time</th><th>Portion</th><th>Status</th></tr>
        ${this._localMeals.map((t, s) => b`
          <tr>
            <td>${t.time}</td>
            <td>${t.portion}</td>
            <td>${t.enabled ? "enabled" : "disabled"}</td>
            <td><button @click=${() => this._edit(s)}>Edit</button></td>
          </tr>
        `)}
      </table>
    `;
  }
  _toggleEnabled(t, s) {
    this._localMeals[t].enabled = s.target.checked, this.requestUpdate();
  }
  _edit(t) {
    this._editIdx = t, this._view = "edit", this.requestUpdate();
  }
  _delete(t) {
    this._localMeals.splice(t, 1), this.requestUpdate();
  }
  _add() {
    this._editIdx = null, this._view = "edit", this.requestUpdate();
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 }));
  }
  _save() {
    this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this._localMeals }, bubbles: !0, composed: !0 }));
  }
  _renderEditView() {
    const t = this._editIdx != null ? this._localMeals[this._editIdx] : { time: "", portion: 1, daysMask: 0 };
    return b`
      <edit-view
        .time=${t.time}
        .portion=${t.portion}
        .daysMask=${t.daysMask}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></edit-view>
    `;
  }
  _onEditSave(t) {
    const s = t.detail.meal;
    this._editIdx != null ? this._localMeals[this._editIdx] = s : this._localMeals = [...this._localMeals, s], this._view = "table", this._editIdx = null, this.requestUpdate();
  }
  _onEditBack() {
    this._view = "table", this._editIdx = null, this.requestUpdate();
  }
}, V = new WeakMap(), z = new WeakMap(), q = new WeakMap(), L = new WeakMap(), k(fe, "styles", [
  Be,
  $t,
  ae`
      // ...existing code...
    `
]), fe);
ee([
  g({ type: Array })
], T.prototype, "meals", null);
ee([
  g({ type: Array })
], T.prototype, "_localMeals", null);
ee([
  g({ type: String })
], T.prototype, "_view", null);
ee([
  g({ type: Number })
], T.prototype, "_editIdx", null);
T = ee([
  he("schedule-view")
], T);
var be = function(r, e, t, s) {
  var i = arguments.length, o = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(r, e, t, s);
  else for (var a = r.length - 1; a >= 0; a--) (n = r[a]) && (o = (i < 3 ? n(o) : i > 3 ? n(e, t, o) : n(e, t)) || o);
  return i > 3 && o && Object.defineProperty(e, t, o), o;
}, B, F, ge;
let oe = (ge = class extends A {
  constructor() {
    super();
    _(this, B, []);
    _(this, F, "Cleverio Pet Feeder");
    k(this, "_dialogOpen");
    this.meals = [], this.title = "Cleverio Pet Feeder", this._dialogOpen = !1;
  }
  get meals() {
    return p(this, B);
  }
  set meals(t) {
    f(this, B, t);
  }
  get title() {
    return p(this, F);
  }
  set title(t) {
    f(this, F, t);
  }
  render() {
    const t = this.meals.filter((o) => o.enabled).length, s = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" }), i = Le(this.meals.filter((o) => o.enabled), s) * 6;
    return b`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${this.title || "Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this.meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${t}</span>
          <div class="overview-grams">Today: ${i}g (active)</div>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0, this.requestUpdate();
    }}>Manage schedules</ha-button>
        </section>
        ${this._dialogOpen ? b`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <schedule-view
                  .meals=${this.meals}
                  @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></schedule-view>
              </ha-dialog>
            ` : ""}
      </ha-card>
    `;
  }
  _onDialogClose() {
    this._dialogOpen = !1, this.requestUpdate();
  }
  _onScheduleMealsChanged(t) {
    this._dialogOpen = !1, this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: t.detail.meals }, bubbles: !0, composed: !0 })), this.requestUpdate();
  }
}, B = new WeakMap(), F = new WeakMap(), k(ge, "styles", [
  Be,
  ae`
      // ...existing code...
    `
]), ge);
be([
  g({ type: Array })
], oe.prototype, "meals", null);
be([
  g({ type: String })
], oe.prototype, "title", null);
oe = be([
  he("cleverio-overview-view")
], oe);
var M = function(r, e, t, s) {
  var i = arguments.length, o = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(r, e, t, s);
  else for (var a = r.length - 1; a >= 0; a--) (n = r[a]) && (o = (i < 3 ? n(o) : i > 3 ? n(e, t, o) : n(e, t)) || o);
  return i > 3 && o && Object.defineProperty(e, t, o), o;
}, W, J, K, Z, G, Q, He;
let w = (He = class extends A {
  constructor() {
    super();
    _(this, W);
    _(this, J);
    _(this, K, []);
    _(this, Z, []);
    _(this, G, null);
    _(this, Q);
    k(this, "_onMealsChanged", (t) => {
      this._meals = t.detail.meals, this._saveMealsToSensor();
    });
    this.hass = void 0, this.config = void 0, this._meals = [], this._persistedMeals = [];
  }
  get hass() {
    return p(this, W);
  }
  set hass(t) {
    f(this, W, t);
  }
  get config() {
    return p(this, J);
  }
  set config(t) {
    f(this, J, t);
  }
  get _meals() {
    return p(this, K);
  }
  set _meals(t) {
    f(this, K, t);
  }
  get _persistedMeals() {
    return p(this, Z);
  }
  set _persistedMeals(t) {
    f(this, Z, t);
  }
  get _dialogView() {
    return p(this, G);
  }
  set _dialogView(t) {
    f(this, G, t);
  }
  get _dialogData() {
    return p(this, Q);
  }
  set _dialogData(t) {
    f(this, Q, t);
  }
  setConfig(t) {
    this.config = t, this._checkConfig(), this._updateConfig();
  }
  updated(t) {
    t.has("hass") && this._updateHass();
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
    let s = [];
    if (t)
      try {
        s = gt(t.state), Array.isArray(s) && (this._persistedMeals = s);
      } catch (i) {
        console.error("Failed to decode meal plan:", i);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []), this.requestUpdate();
  }
  render() {
    var o;
    const t = this._meals.filter((n) => n.enabled).length, s = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" }), i = Le(this._meals.filter((n) => n.enabled), s) * 6 || 0;
    return b`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${((o = this.config) == null ? void 0 : o.title) || "Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this._meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${t}</span>
          <div class="overview-grams">Today: ${i}g (active)</div>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogView = "schedules", this.requestUpdate();
    }}>Manage schedules</ha-button>
        </section>
        ${this._dialogView === "schedules" ? b`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <schedule-view
                  .meals=${this._meals}
                  @meals-changed=${this._onMealsChanged}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></schedule-view>
              </ha-dialog>
            ` : ""}
        <slot></slot>
      </ha-card>
    `;
  }
  _onDialogClose() {
    this._dialogView = null, this.requestUpdate();
  }
  _saveMealsToSensor() {
    const t = ft(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: t
    }), setTimeout(() => this._updateHass(), 500);
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => vt), document.createElement("card-editor");
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
    return typeof De == "function" ? De(this._meals || []) : {};
  }
}, W = new WeakMap(), J = new WeakMap(), K = new WeakMap(), Z = new WeakMap(), G = new WeakMap(), Q = new WeakMap(), He);
M([
  g({ type: Object })
], w.prototype, "hass", null);
M([
  g({ type: Object })
], w.prototype, "config", null);
M([
  de()
], w.prototype, "_meals", null);
M([
  de()
], w.prototype, "_persistedMeals", null);
M([
  de()
], w.prototype, "_dialogView", null);
M([
  de()
], w.prototype, "_dialogData", null);
w = M([
  he("cleverio-pf100-card")
], w);
var Fe = function(r, e, t, s) {
  var i = arguments.length, o = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(r, e, t, s);
  else for (var a = r.length - 1; a >= 0; a--) (n = r[a]) && (o = (i < 3 ? n(o) : i > 3 ? n(e, t, o) : n(e, t)) || o);
  return i > 3 && o && Object.defineProperty(e, t, o), o;
}, X, Ne;
let ne = (Ne = class extends A {
  constructor() {
    super();
    _(this, X);
    this.config = { sensor: "", title: "" };
  }
  get config() {
    return p(this, X);
  }
  set config(t) {
    f(this, X, t);
  }
  setConfig(t) {
    this.config = { ...t };
  }
  _onInput(t) {
    const { name: s, value: i } = t.target;
    this.config = { ...this.config, [s]: i }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }
  render() {
    return b`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ""} @input=${this._onInput.bind(this)} />
      </label>
      <label>Title:
        <input name="title" .value=${this.config.title || ""} @input=${this._onInput.bind(this)} />
      </label>
    `;
  }
}, X = new WeakMap(), Ne);
Fe([
  g({ attribute: !1 })
], ne.prototype, "config", null);
ne = Fe([
  he("card-editor")
], ne);
const vt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CardEditor() {
    return ne;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  w as CleverioPf100Card
};
