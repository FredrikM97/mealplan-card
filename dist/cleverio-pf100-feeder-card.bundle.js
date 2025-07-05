var ye = (o) => {
  throw TypeError(o);
};
var $e = (o, e, t) => e.has(o) || ye("Cannot " + t);
var k = (o, e, t) => ($e(o, e, "read from private field"), t ? t.call(o) : e.get(o)), D = (o, e, t) => e.has(o) ? ye("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), y = (o, e, t, s) => ($e(o, e, "write to private field"), s ? s.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = globalThis, de = ee.ShadowRoot && (ee.ShadyCSS === void 0 || ee.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, pe = Symbol(), ve = /* @__PURE__ */ new WeakMap();
let ke = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (de && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = ve.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ve.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const je = (o) => new ke(typeof o == "string" ? o : o + "", void 0, pe), ue = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new ke(t, o, pe);
}, Fe = (o, e) => {
  if (de) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = ee.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, be = de ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return je(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ne, defineProperty: Ie, getOwnPropertyDescriptor: ze, getOwnPropertyNames: Le, getOwnPropertySymbols: Be, getPrototypeOf: Ve } = Object, v = globalThis, we = v.trustedTypes, We = we ? we.emptyScript : "", ae = v.reactiveElementPolyfillSupport, L = (o, e) => o, te = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? We : null;
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
} }, me = (o, e) => !Ne(o, e), Ae = { attribute: !0, type: String, converter: te, reflect: !1, useDefault: !1, hasChanged: me };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ae) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Ie(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = ze(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const e = Ve(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const t = this.properties, s = [...Le(t), ...Be(t)];
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
      for (const i of s) t.unshift(be(i));
    } else e !== void 0 && t.push(be(e));
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
    return Fe(e, this.constructor.elementStyles), e;
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
      const l = s.getPropertyOptions(i), r = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : te;
      this._$Em = i, this[i] = r.fromAttribute(t, l.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, a = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? me)(a, t) || s.useDefault && s.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[L("elementProperties")] = /* @__PURE__ */ new Map(), T[L("finalized")] = /* @__PURE__ */ new Map(), ae == null || ae({ ReactiveElement: T }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, se = B.trustedTypes, Ee = se ? se.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, De = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Te = "?" + $, qe = `<${Te}>`, C = document, V = () => C.createComment(""), W = (o) => o === null || typeof o != "object" && typeof o != "function", fe = Array.isArray, Je = (o) => fe(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", re = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xe = /-->/g, Se = />/g, E = RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ce = /'/g, Me = /"/g, Re = /^(?:script|style|textarea|title)$/i, Ge = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), u = Ge(1), N = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), Oe = /* @__PURE__ */ new WeakMap(), x = C.createTreeWalker(C, 129);
function Ue(o, e) {
  if (!fe(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ee !== void 0 ? Ee.createHTML(e) : e;
}
const Ke = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = z;
  for (let l = 0; l < t; l++) {
    const r = o[l];
    let h, p, c = -1, f = 0;
    for (; f < r.length && (a.lastIndex = f, p = a.exec(r), p !== null); ) f = a.lastIndex, a === z ? p[1] === "!--" ? a = xe : p[1] !== void 0 ? a = Se : p[2] !== void 0 ? (Re.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = E) : p[3] !== void 0 && (a = E) : a === E ? p[0] === ">" ? (a = i ?? z, c = -1) : p[1] === void 0 ? c = -2 : (c = a.lastIndex - p[2].length, h = p[1], a = p[3] === void 0 ? E : p[3] === '"' ? Me : Ce) : a === Me || a === Ce ? a = E : a === xe || a === Se ? a = z : (a = E, i = void 0);
    const _ = a === E && o[l + 1].startsWith("/>") ? " " : "";
    n += a === z ? r + qe : c >= 0 ? (s.push(h), r.slice(0, c) + De + r.slice(c) + $ + _) : r + $ + (c === -2 ? l : _);
  }
  return [Ue(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class q {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const l = e.length - 1, r = this.parts, [h, p] = Ke(e, t);
    if (this.el = q.createElement(h, s), x.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = x.nextNode()) !== null && r.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(De)) {
          const f = p[a++], _ = i.getAttribute(c).split($), X = /([.?@])?(.*)/.exec(f);
          r.push({ type: 1, index: n, name: X[2], strings: _, ctor: X[1] === "." ? Ye : X[1] === "?" ? Qe : X[1] === "@" ? Xe : ie }), i.removeAttribute(c);
        } else c.startsWith($) && (r.push({ type: 6, index: n }), i.removeAttribute(c));
        if (Re.test(i.tagName)) {
          const c = i.textContent.split($), f = c.length - 1;
          if (f > 0) {
            i.textContent = se ? se.emptyScript : "";
            for (let _ = 0; _ < f; _++) i.append(c[_], V()), x.nextNode(), r.push({ type: 2, index: ++n });
            i.append(c[f], V());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Te) r.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf($, c + 1)) !== -1; ) r.push({ type: 7, index: n }), c += $.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = C.createElement("template");
    return s.innerHTML = e, s;
  }
}
function I(o, e, t = o, s) {
  var a, l;
  if (e === N) return e;
  let i = s !== void 0 ? (a = t._$Co) == null ? void 0 : a[s] : t._$Cl;
  const n = W(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = I(o, i._$AS(o, e.values), i, s)), e;
}
class Ze {
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? C).importNode(t, !0);
    x.currentNode = i;
    let n = x.nextNode(), a = 0, l = 0, r = s[0];
    for (; r !== void 0; ) {
      if (a === r.index) {
        let h;
        r.type === 2 ? h = new Q(n, n.nextSibling, this, e) : r.type === 1 ? h = new r.ctor(n, r.name, r.strings, this, e) : r.type === 6 && (h = new et(n, this, e)), this._$AV.push(h), r = s[++l];
      }
      a !== (r == null ? void 0 : r.index) && (n = x.nextNode(), a++);
    }
    return x.currentNode = C, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class Q {
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
    e = I(this, e, t), W(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== N && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Je(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && W(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = q.createElement(Ue(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const a = new Ze(i, this), l = a.u(this.options);
      a.p(t), this.T(l), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = Oe.get(e.strings);
    return t === void 0 && Oe.set(e.strings, t = new q(e)), t;
  }
  k(e) {
    fe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new Q(this.O(V()), this.O(V()), this, this.options)) : s = t[i], s._$AI(n), i++;
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
class ie {
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
    if (n === void 0) e = I(this, e, t, 0), a = !W(e) || e !== this._$AH && e !== N, a && (this._$AH = e);
    else {
      const l = e;
      let r, h;
      for (e = n[0], r = 0; r < n.length - 1; r++) h = I(this, l[s + r], t, r), h === N && (h = this._$AH[r]), a || (a = !W(h) || h !== this._$AH[r]), h === m ? e = m : e !== m && (e += (h ?? "") + n[r + 1]), this._$AH[r] = h;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ye extends ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class Qe extends ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class Xe extends ie {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = I(this, e, t, 0) ?? m) === N) return;
    const s = this._$AH, i = e === m && s !== m || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== m && (s === m || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class et {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    I(this, e);
  }
}
const le = B.litHtmlPolyfillSupport;
le == null || le(q, Q), (B.litHtmlVersions ?? (B.litHtmlVersions = [])).push("3.3.0");
const tt = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new Q(e.insertBefore(V(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class b extends T {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = tt(t, this.renderRoot, this.renderOptions);
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
    return N;
  }
}
var Pe;
b._$litElement$ = !0, b.finalized = !0, (Pe = S.litElementHydrateSupport) == null || Pe.call(S, { LitElement: b });
const he = S.litElementPolyfillSupport;
he == null || he({ LitElement: b });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = { attribute: !0, type: String, converter: te, reflect: !1, hasChanged: me }, it = (o = st, e, t) => {
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
function g(o) {
  return (e, t) => typeof t == "object" ? it(o, e, t) : ((s, i, n) => {
    const a = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), a ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function M(o) {
  return g({ ...o, state: !0, attribute: !1 });
}
function ot(o) {
  const e = Array(7).fill(0);
  return o.forEach((t) => {
    if (t.enabled)
      for (let s = 0; s < 7; s++)
        t.daysMask & 1 << s && (e[s] += t.portion);
  }), e;
}
function nt(o, e) {
  let t = 0;
  return o.forEach((s) => {
    s.enabled && s.daysMask & 1 << e && (t += s.portion);
  }), t;
}
function at(o) {
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
    const [n, a, l, r, h] = t.slice(i, i + 5);
    s.push({
      time: `${a.toString().padStart(2, "0")}:${l.toString().padStart(2, "0")}`,
      daysMask: n,
      portion: r || 1,
      enabled: h === 1
    });
  }
  return s;
}
function rt(o) {
  const e = [];
  return o.forEach((t) => {
    const [s, i] = t.time.split(":").map(Number);
    e.push(t.daysMask, s, i, Number(t.portion), t.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...e));
}
const lt = [
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
], ge = async (o) => {
  var t, s, i, n, a, l;
  const e = o || lt;
  try {
    if (e.every((c) => customElements.get(c)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
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
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const h = document.createElement("ha-panel-config");
    if (!h)
      throw new Error("Failed to create ha-panel-config element");
    if (!((l = (a = (n = h.routerOptions) == null ? void 0 : n.routes) == null ? void 0 : a.automation) != null && l.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      h.routerOptions.routes.automation.load(),
      new Promise((c, f) => setTimeout(() => f(new Error("Timeout loading automation components")), 1e4))
    ]);
    const p = e.filter((c) => !customElements.get(c));
    if (p.length > 0)
      throw new Error(`Failed to load components: ${p.join(", ")}`);
  } catch (r) {
    console.error("Error loading Home Assistant form components:", r);
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
}, ht = "Feed Now", ct = "Schedule", dt = "Portion", pt = "Days", ut = "Enabled", mt = "Edit Meal", ft = "Time", gt = "(1 portion = 6g)", _t = "Suggested:", yt = "Back", $t = "Save", vt = "Status", bt = "Actions", wt = "Add Meal", At = "Schedules", Et = "Active Schedules", xt = "Today", St = "Edit Feeding Time", Ct = "Manage Schedules", Mt = "Unsaved changes", Ot = "You have unsaved changes. Don't forget to save!", Pt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], kt = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], Dt = "Avg/week", Tt = {
  feed_now: ht,
  schedule: ct,
  portion: dt,
  days: pt,
  enabled: ut,
  edit_meal: mt,
  time: ft,
  portion_helper: gt,
  suggested: _t,
  back: yt,
  save: $t,
  status: vt,
  actions: bt,
  delete: "Delete",
  add_meal: wt,
  schedules: At,
  active_schedules: Et,
  today: xt,
  edit_feeding_time: St,
  manage_schedules: Ct,
  unsaved_changes: Mt,
  unsaved_changes_hint: Ot,
  days_short: Pt,
  days_full: kt,
  avg_week: Dt
}, Rt = "Mata nu", Ut = "Schema", Ht = "Portion", jt = "Dagar", Ft = "Aktiverad", Nt = "Redigera måltid", It = "Tid", zt = "(1 portion = 6g)", Lt = "Föreslaget:", Bt = "Tillbaka", Vt = "Spara", Wt = "Status", qt = "Åtgärder", Jt = "Lägg till måltid", Gt = "Scheman", Kt = "Aktiva scheman", Zt = "Idag", Yt = "Redigera matningstid", Qt = "Hantera scheman", Xt = "Osparade ändringar", es = "Du har osparade ändringar. Glöm inte att spara!", ts = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"], ss = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"], is = "Snitt/vecka", os = {
  feed_now: Rt,
  schedule: Ut,
  portion: Ht,
  days: jt,
  enabled: Ft,
  edit_meal: Nt,
  time: It,
  portion_helper: zt,
  suggested: Lt,
  back: Bt,
  save: Vt,
  status: Wt,
  actions: qt,
  delete: "Ta bort",
  add_meal: Jt,
  schedules: Gt,
  active_schedules: Kt,
  today: Zt,
  edit_feeding_time: Yt,
  manage_schedules: Qt,
  unsaved_changes: Xt,
  unsaved_changes_hint: es,
  days_short: ts,
  days_full: ss,
  avg_week: is
}, ce = { en: Tt, sv: os };
let He = "en";
function ns(o) {
  He = ce[o] ? o : "en";
}
function d(o) {
  var e;
  return ((e = ce[He]) == null ? void 0 : e[o]) || ce.en[o] || o;
}
var ne = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, R;
let J = (R = class extends b {
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
}, R.styles = ue`
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
ne([
  g({ type: Number })
], J.prototype, "selectedDaysMask", void 0);
ne([
  g({ type: Boolean })
], J.prototype, "editable", void 0);
ne([
  g({ type: Array })
], J.prototype, "dayLabels", void 0);
J = ne([
  oe("cleverio-day-selector")
], J);
var O = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, U, H;
let w = (H = class extends b {
  constructor() {
    super();
    D(this, U);
    this._meals = null, this.viewMeals = [], this.editForm = null, this.editError = null, this.editDialogOpen = !1, this.editIdx = null, y(this, U, !1), this.viewMeals = [];
  }
  get meals() {
    return this._meals;
  }
  set meals(t) {
    const s = this._meals;
    this._meals = t, !this.editDialogOpen && (!this._hasUnsavedChanges || s == null) && (this.viewMeals = Array.isArray(t) ? t.map((i) => ({ ...i })) : [], this.requestUpdate("meals", s));
  }
  get haComponentsReady() {
    return k(this, U);
  }
  set haComponentsReady(t) {
    y(this, U, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), await ge(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this.haComponentsReady = !0;
  }
  // Helper to check if there are unsaved changes
  get _hasUnsavedChanges() {
    const t = JSON.stringify(this.viewMeals), s = JSON.stringify(this.meals ?? []);
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
    this.dispatchEvent(new CustomEvent("save-schedule", { detail: { meals: this.viewMeals }, bubbles: !0, composed: !0 }));
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
              @change=${(h) => this._toggleEnabled(r._idx, h)}
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
    }, s = this.viewMeals.map((r, h) => ({ ...r, _idx: h })), i = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
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
}, U = new WeakMap(), H.styles = [
  ue`
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
O([
  g({ type: Array })
], w.prototype, "meals", null);
O([
  M()
], w.prototype, "viewMeals", void 0);
O([
  M()
], w.prototype, "editForm", void 0);
O([
  M()
], w.prototype, "editError", void 0);
O([
  M()
], w.prototype, "editDialogOpen", void 0);
O([
  g({ type: Boolean })
], w.prototype, "haComponentsReady", null);
w = O([
  oe("cleverio-schedule-view")
], w);
var P = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
}, K, Z, Y, j, F;
let A = (F = class extends b {
  constructor() {
    super();
    D(this, K);
    D(this, Z);
    D(this, Y);
    D(this, j);
    y(this, j, !1), this._haComponentsReady = !1, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1;
  }
  get hass() {
    return this._hass;
  }
  set hass(t) {
    const s = this._hass;
    this._hass = t, this._updateHass(), this.requestUpdate("hass", s);
  }
  get config() {
    return k(this, K);
  }
  set config(t) {
    y(this, K, t);
  }
  get _meals() {
    return k(this, Z);
  }
  set _meals(t) {
    y(this, Z, t);
  }
  get _persistedMeals() {
    return k(this, Y);
  }
  set _persistedMeals(t) {
    y(this, Y, t);
  }
  get _dialogOpen() {
    return k(this, j);
  }
  set _dialogOpen(t) {
    y(this, j, t);
  }
  setConfig(t) {
    this.config = t;
  }
  async connectedCallback() {
    await ns(this.hass.language), await ge(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback();
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
    t && typeof t == "string" && t.trim().length > 0 && (s = at(t)), this._persistedMeals = Array.isArray(s) ? s : [], this._meals = JSON.parse(JSON.stringify(this._persistedMeals));
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
            ${d("today")}: <span style="white-space:nowrap;">${nt(this._meals.filter((s) => s.enabled), (/* @__PURE__ */ new Date()).getDay()) * 6}g</span>
          </ha-chip>
          <ha-chip class="overview-average">
            <ha-icon icon="mdi:scale-balance"></ha-icon>
            ${d("avg_week")}: <span style="white-space:nowrap;">
              ${(ot(this._meals.filter((n) => n.enabled)).reduce((n, a) => n + a, 0) / 7 * 6).toFixed(1)}g
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
                .meals=${[...this._meals]}
                .localize=${d}
                @save-schedule=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : u`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => as), document.createElement("cleverio-card-editor");
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID)
      return;
    const t = rt(this._meals);
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
}, K = new WeakMap(), Z = new WeakMap(), Y = new WeakMap(), j = new WeakMap(), F.styles = [
  ue`
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
], F);
P([
  g({ type: Object })
], A.prototype, "hass", null);
P([
  g({ type: Object })
], A.prototype, "config", null);
P([
  M()
], A.prototype, "_meals", null);
P([
  M()
], A.prototype, "_persistedMeals", null);
P([
  M()
], A.prototype, "_dialogOpen", null);
P([
  g({ type: Boolean })
], A.prototype, "_haComponentsReady", void 0);
A = P([
  oe("cleverio-pf100-card")
], A);
var _e = function(o, e, t, s) {
  var i = arguments.length, n = i < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, t) : s, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(o, e, t, s);
  else for (var l = o.length - 1; l >= 0; l--) (a = o[l]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, t, n) : a(e, t)) || n);
  return i > 3 && n && Object.defineProperty(e, t, n), n;
};
let G = class extends b {
  constructor() {
    super(...arguments), this.config = { sensor: "", title: "", helper: "" };
  }
  setConfig(e) {
    this.config = { ...e };
  }
  async connectedCallback() {
    await ge(["ha-entity-picker", "ha-form", "ha-textfield"]), this._haComponentsReady = !0, super.connectedCallback();
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
      ${this._validateConfig() ? "" : u`<div style="color: var(--error-color, red); margin-top: 8px;">Please select a sensor entity and a storage helper (input_text).`}
      <!-- mwc-tooltip handles its own styling -->
    ` : u`<div>Loading Home Assistant components...</div>`;
  }
};
_e([
  g({ attribute: !1 })
], G.prototype, "config", void 0);
_e([
  g({ attribute: !1 })
], G.prototype, "hass", void 0);
G = _e([
  oe("cleverio-card-editor")
], G);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "cleverio-pf100-card",
  name: "Cleverio Feeder Card",
  preview: !1,
  description: "Cleverio PF100 feeder card to decode/encode base64 meal_plan"
});
const as = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return G;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  A as CleverioPf100Card
};
