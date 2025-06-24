var xe = (o) => {
  throw TypeError(o);
};
var Se = (o, t, e) => t.has(o) || xe("Cannot " + e);
var f = (o, t, e) => (Se(o, t, "read from private field"), e ? e.call(o) : t.get(o)), g = (o, t, e) => t.has(o) ? xe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(o) : t.set(o, e), _ = (o, t, e, i) => (Se(o, t, "write to private field"), i ? i.call(o, e) : t.set(o, e), e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = globalThis, be = he.ShadowRoot && (he.ShadyCSS === void 0 || he.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $e = Symbol(), Oe = /* @__PURE__ */ new WeakMap();
let Be = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== $e) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (be && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Oe.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Oe.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ye = (o) => new Be(typeof o == "string" ? o : o + "", void 0, $e), me = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[r + 1], o[0]);
  return new Be(e, o, $e);
}, Ge = (o, t) => {
  if (be) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = he.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  }
}, Me = be ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ye(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xe, defineProperty: Ke, getOwnPropertyDescriptor: Qe, getOwnPropertyNames: et, getOwnPropertySymbols: tt, getPrototypeOf: it } = Object, S = globalThis, Pe = S.trustedTypes, st = Pe ? Pe.emptyScript : "", fe = S.reactiveElementPolyfillSupport, J = (o, t) => o, de = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? st : null;
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
} }, we = (o, t) => !Xe(o, t), De = { attribute: !0, type: String, converter: de, reflect: !1, useDefault: !1, hasChanged: we };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), S.litPropertyMetadata ?? (S.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = De) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Ke(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = Qe(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const a = s == null ? void 0 : s.call(this);
      r == null || r.call(this, n), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? De;
  }
  static _$Ei() {
    if (this.hasOwnProperty(J("elementProperties"))) return;
    const t = it(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(J("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(J("properties"))) {
      const e = this.properties, i = [...et(e), ...tt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(Me(s));
    } else t !== void 0 && e.push(Me(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ge(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var r;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : de).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, n;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : de;
      this._$Em = s, this[s] = l.fromAttribute(e, a.type) ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t, e, i) {
    var s;
    if (t !== void 0) {
      const r = this.constructor, n = this[t];
      if (i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? we)(n, e) || i.useDefault && i.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: a } = n, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[J("elementProperties")] = /* @__PURE__ */ new Map(), T[J("finalized")] = /* @__PURE__ */ new Map(), fe == null || fe({ ReactiveElement: T }), (S.reactiveElementVersions ?? (S.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, ce = Z.trustedTypes, ke = ce ? ce.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Le = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, qe = "?" + x, ot = `<${qe}>`, k = document, Y = () => k.createComment(""), G = (o) => o === null || typeof o != "object" && typeof o != "function", Ee = Array.isArray, rt = (o) => Ee(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", ge = `[ 	
\f\r]`, V = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Re = /-->/g, Te = />/g, M = RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ue = /'/g, Ie = /"/g, We = /^(?:script|style|textarea|title)$/i, nt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), p = nt(1), L = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), je = /* @__PURE__ */ new WeakMap(), P = k.createTreeWalker(k, 129);
function Ve(o, t) {
  if (!Ee(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ke !== void 0 ? ke.createHTML(t) : t;
}
const at = (o, t) => {
  const e = o.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = V;
  for (let a = 0; a < e; a++) {
    const l = o[a];
    let h, c, d = -1, m = 0;
    for (; m < l.length && (n.lastIndex = m, c = n.exec(l), c !== null); ) m = n.lastIndex, n === V ? c[1] === "!--" ? n = Re : c[1] !== void 0 ? n = Te : c[2] !== void 0 ? (We.test(c[2]) && (s = RegExp("</" + c[2], "g")), n = M) : c[3] !== void 0 && (n = M) : n === M ? c[0] === ">" ? (n = s ?? V, d = -1) : c[1] === void 0 ? d = -2 : (d = n.lastIndex - c[2].length, h = c[1], n = c[3] === void 0 ? M : c[3] === '"' ? Ie : Ue) : n === Ie || n === Ue ? n = M : n === Re || n === Te ? n = V : (n = M, s = void 0);
    const C = n === M && o[a + 1].startsWith("/>") ? " " : "";
    r += n === V ? l + ot : d >= 0 ? (i.push(h), l.slice(0, d) + Le + l.slice(d) + x + C) : l + x + (d === -2 ? a : C);
  }
  return [Ve(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class X {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const a = t.length - 1, l = this.parts, [h, c] = at(t, e);
    if (this.el = X.createElement(h, i), P.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = P.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Le)) {
          const m = c[n++], C = s.getAttribute(d).split(x), le = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: r, name: le[2], strings: C, ctor: le[1] === "." ? ht : le[1] === "?" ? dt : le[1] === "@" ? ct : _e }), s.removeAttribute(d);
        } else d.startsWith(x) && (l.push({ type: 6, index: r }), s.removeAttribute(d));
        if (We.test(s.tagName)) {
          const d = s.textContent.split(x), m = d.length - 1;
          if (m > 0) {
            s.textContent = ce ? ce.emptyScript : "";
            for (let C = 0; C < m; C++) s.append(d[C], Y()), P.nextNode(), l.push({ type: 2, index: ++r });
            s.append(d[m], Y());
          }
        }
      } else if (s.nodeType === 8) if (s.data === qe) l.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(x, d + 1)) !== -1; ) l.push({ type: 7, index: r }), d += x.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = k.createElement("template");
    return i.innerHTML = t, i;
  }
}
function q(o, t, e = o, i) {
  var n, a;
  if (t === L) return t;
  let s = i !== void 0 ? (n = e._$Co) == null ? void 0 : n[i] : e._$Cl;
  const r = G(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), r === void 0 ? s = void 0 : (s = new r(o), s._$AT(o, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = q(o, s._$AS(o, t.values), s, i)), t;
}
class lt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? k).importNode(e, !0);
    P.currentNode = s;
    let r = P.nextNode(), n = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let h;
        l.type === 2 ? h = new ne(r, r.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (h = new pt(r, this, t)), this._$AV.push(h), l = i[++a];
      }
      n !== (l == null ? void 0 : l.index) && (r = P.nextNode(), n++);
    }
    return P.currentNode = k, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class ne {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = q(this, t, e), G(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== L && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && G(this._$AH) ? this._$AA.nextSibling.data = t : this.T(k.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = X.createElement(Ve(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(e);
    else {
      const n = new lt(s, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = je.get(t.strings);
    return e === void 0 && je.set(t.strings, e = new X(t)), e;
  }
  k(t) {
    Ee(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new ne(this.O(Y()), this.O(Y()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const s = t.nextSibling;
      t.remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class _e {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = q(this, t, e, 0), n = !G(t) || t !== this._$AH && t !== L, n && (this._$AH = t);
    else {
      const a = t;
      let l, h;
      for (t = r[0], l = 0; l < r.length - 1; l++) h = q(this, a[i + l], e, l), h === L && (h = this._$AH[l]), n || (n = !G(h) || h !== this._$AH[l]), h === u ? t = u : t !== u && (t += (h ?? "") + r[l + 1]), this._$AH[l] = h;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ht extends _e {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class dt extends _e {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ct extends _e {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = q(this, t, e, 0) ?? u) === L) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class pt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    q(this, t);
  }
}
const ye = Z.litHtmlPolyfillSupport;
ye == null || ye(X, ne), (Z.litHtmlVersions ?? (Z.litHtmlVersions = [])).push("3.3.0");
const ut = (o, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new ne(t.insertBefore(Y(), r), r, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis;
class E extends T {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ut(e, this.renderRoot, this.renderOptions);
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
    return L;
  }
}
var Ne;
E._$litElement$ = !0, E.finalized = !0, (Ne = D.litElementHydrateSupport) == null || Ne.call(D, { LitElement: E });
const ve = D.litElementPolyfillSupport;
ve == null || ve({ LitElement: E });
(D.litElementVersions ?? (D.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = (o) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(o, t);
  }) : customElements.define(o, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = { attribute: !0, type: String, converter: de, reflect: !1, hasChanged: we }, _t = (o = mt, t, e) => {
  const { kind: i, metadata: s } = e;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((o = Object.create(o)).wrapped = !0), r.set(e.name, o), i === "accessor") {
    const { name: n } = e;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(n, l, o);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, o, a), a;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(a) {
      const l = this[n];
      t.call(this, a), this.requestUpdate(n, l, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function y(o) {
  return (t, e) => typeof e == "object" ? _t(o, t, e) : ((i, s, r) => {
    const n = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), n ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(o, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(o) {
  return y({ ...o, state: !0, attribute: !1 });
}
function He(o) {
  const t = Array(7).fill(0);
  return o.forEach((e) => {
    if (e.enabled)
      for (let i = 0; i < 7; i++)
        e.daysMask & 1 << i && (t[i] += e.portion);
  }), t;
}
function ft(o, t) {
  let e = 0;
  return o.forEach((i) => {
    i.enabled && i.daysMask & 1 << t && (e += i.portion);
  }), e;
}
function gt(o) {
  if (!o || o === "unknown")
    return [];
  let t;
  try {
    t = atob(o);
  } catch {
    throw new Error("Invalid base64");
  }
  const e = new Uint8Array([...t].map((s) => s.charCodeAt(0)));
  if (e.length % 5 !== 0)
    throw new Error("Invalid meal plan length");
  const i = [];
  for (let s = 0; s < e.length; s += 5) {
    const [r, n, a, l, h] = e.slice(s, s + 5);
    i.push({
      time: `${n.toString().padStart(2, "0")}:${a.toString().padStart(2, "0")}`,
      daysMask: r,
      portion: l || 1,
      enabled: h === 1
    });
  }
  return i;
}
function yt(o) {
  const t = [];
  return o.forEach((e) => {
    const [i, s] = e.time.split(":").map(Number);
    t.push(e.daysMask, i, s, Number(e.portion), e.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...t));
}
const vt = [
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
  var e, i, s, r, n, a;
  const t = o || vt;
  try {
    if (t.every((d) => customElements.get(d)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
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
    if (l._updateRoutes(), !((s = (i = (e = l.routerOptions) == null ? void 0 : e.routes) == null ? void 0 : i.tmp) != null && s.load))
      throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([
      l.routerOptions.routes.tmp.load(),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const h = document.createElement("ha-panel-config");
    if (!h)
      throw new Error("Failed to create ha-panel-config element");
    if (!((a = (n = (r = h.routerOptions) == null ? void 0 : r.routes) == null ? void 0 : n.automation) != null && a.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      h.routerOptions.routes.automation.load(),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout loading automation components")), 1e4))
    ]);
    const c = t.filter((d) => !customElements.get(d));
    if (c.length > 0)
      throw new Error(`Failed to load components: ${c.join(", ")}`);
  } catch (l) {
    console.error("Error loading Home Assistant form components:", l);
    try {
      if (window.customElements && window.customElements.get("home-assistant")) {
        console.log("Attempting fallback loading method for HA components");
        const h = new CustomEvent("ha-request-load-components", {
          detail: {
            components: t
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
let Je = {}, Fe = !1;
async function bt() {
  if (!Fe)
    try {
      const o = new URL("data:application/json;base64,ewogICJzY2hlZHVsZXMiOiAiU2NoZWR1bGVzIiwKICAiYWN0aXZlX3NjaGVkdWxlcyI6ICJBY3RpdmUgU2NoZWR1bGVzIiwKICAidG9kYXkiOiAiVG9kYXkiLAogICJtYW5hZ2Vfc2NoZWR1bGVzIjogIk1hbmFnZSBTY2hlZHVsZXMiLAogICJwb3J0aW9uIjogIlBvcnRpb24iLAogICJ0aW1lIjogIlRpbWUiLAogICJkYXlzIjogIkRheXMiLAogICJlbmFibGVkIjogIkVuYWJsZWQiLAogICJhY3Rpb25zIjogIkFjdGlvbnMiCn0K", import.meta.url).href, t = await fetch(o);
      t.ok ? (Je = await t.json(), Fe = !0) : console.error("Failed to load translations", t.status);
    } catch (o) {
      console.error("Failed to load translations", o);
    }
}
function v(o) {
  return Je[o] || o;
}
var Ce = function(o, t, e, i) {
  var s = arguments.length, r = s < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, t, e, i);
  else for (var a = o.length - 1; a >= 0; a--) (n = o[a]) && (r = (s < 3 ? n(r) : s > 3 ? n(t, e, r) : n(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
const $t = ["M", "T", "W", "T", "F", "S", "S"], wt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var U;
let pe = (U = class extends E {
  constructor() {
    super(), this.selectedDaysMask = 0, this.editable = !1;
  }
  _toggleDay(t) {
    if (!this.editable)
      return;
    const e = this.selectedDaysMask ^ 1 << t;
    this.dispatchEvent(new CustomEvent("days-changed", { detail: { daysMask: e }, bubbles: !0, composed: !0 }));
  }
  render() {
    const t = this.editable;
    return p`
      <div class="days-row${t ? " days-row-edit" : ""}">
        ${$t.map((e, i) => p`
          <span
            class="day-cell${t ? " day-cell-edit" : ""}${this.selectedDaysMask & 1 << i ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(i)}
            title=${wt[i]}
          >${e}</span>
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
Ce([
  y({ type: Number })
], pe.prototype, "selectedDaysMask", void 0);
Ce([
  y({ type: Boolean })
], pe.prototype, "editable", void 0);
pe = Ce([
  ae("cleverio-day-selector")
], pe);
var W = function(o, t, e, i) {
  var s = arguments.length, r = s < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, t, e, i);
  else for (var a = o.length - 1; a >= 0; a--) (n = o[a]) && (r = (s < 3 ? n(r) : s > 3 ? n(t, e, r) : n(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, K, I;
let R = (I = class extends E {
  constructor() {
    super();
    g(this, K);
    this.openDialog = !1, this._haComponentsReady = !1, this._localEdit = null, this._error = null, this._onEditSave = (e) => {
      if (e.preventDefault(), !!this._localEdit) {
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
    return f(this, K);
  }
  set data(e) {
    _(this, K, e);
  }
  async connectedCallback() {
    super.connectedCallback(), await Ae(["ha-form", "ha-button", "ha-switch"]), this._haComponentsReady = !0;
  }
  updated(e) {
    e.has("data") && this.data && (this._localEdit = { ...this.data }, this._error = null);
  }
  render() {
    if (!this._haComponentsReady || !this._localEdit)
      return p``;
    const e = this._localEdit, i = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return this.openDialog ? p`
      <ha-dialog open scrimClickAction>
        <div slot="heading">Edit Feeding Time</div>
        <form class="edit-form" @submit=${(s) => s.preventDefault()}>
          ${this._error ? p`<div class="error">${this._error}</div>` : ""}
          <cleverio-day-selector
            .selectedDaysMask=${e.daysMask}
            .editable=${!0}
            @days-changed=${(s) => this._onDaysChanged(s)}
          ></cleverio-day-selector>
          <div class="form-group">
            <label for="edit-time">Time</label>
            <input
              id="edit-time"
              class="edit-time"
              type="time"
              .value=${e.time}
              @input=${(s) => e.time = s.target.value}
            />
          </div>
          <div class="form-group">
            <label for="edit-portion">Portion</label>
            <input
              id="edit-portion"
              type="number"
              min="1"
              .value=${e.portion}
              @input=${(s) => e.portion = parseInt(s.target.value, 10)}
            />
            <div class="helper">1 portion = 6 grams</div>
          </div>
          <div class="predefined-times">
            ${i.map((s) => p`
              <ha-button type="button" @click=${() => {
      e.time = s, this.requestUpdate();
    }}>${s}</ha-button>
            `)}
          </div>
        </form>
        <ha-button slot="secondaryAction" @click=${this._onBackClick.bind(this)}>Back</ha-button>
        <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>Save</ha-button>
      </ha-dialog>
    ` : p``;
  }
  _onDaysChanged(e) {
    this._localEdit && (this._localEdit.daysMask = e.detail.daysMask, this.requestUpdate());
  }
  _onBackClick(e) {
    e.preventDefault(), this.dispatchEvent(new CustomEvent("back", { bubbles: !0, composed: !0 }));
  }
}, K = new WeakMap(), I.styles = me`
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
  `, I);
W([
  y({ type: Object })
], R.prototype, "data", null);
W([
  y({ type: Boolean })
], R.prototype, "openDialog", void 0);
W([
  b()
], R.prototype, "_haComponentsReady", void 0);
W([
  b()
], R.prototype, "_localEdit", void 0);
W([
  b()
], R.prototype, "_error", void 0);
R = W([
  ae("cleverio-edit-view")
], R);
var O = function(o, t, e, i) {
  var s = arguments.length, r = s < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, t, e, i);
  else for (var a = o.length - 1; a >= 0; a--) (n = o[a]) && (r = (s < 3 ? n(r) : s > 3 ? n(t, e, r) : n(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
console.log("[cleverio-schedule-view] Module loaded");
var j, H, F, N;
let A = (N = class extends E {
  constructor() {
    super();
    g(this, j);
    g(this, H);
    g(this, F);
    _(this, j, []), _(this, H, []), _(this, F, !1), this._editDialogOpen = !1, this._editDialogReallyOpen = !1, this._editForm = null, this._editError = null, this._editIdx = null, this.meals = [], this._localMeals = [], this._editDialogOpen = !1, this._editDialogReallyOpen = !1, console.log("[cleverio-schedule-view] Constructor");
  }
  get meals() {
    return f(this, j);
  }
  set meals(e) {
    _(this, j, e);
  }
  get _localMeals() {
    return f(this, H);
  }
  set _localMeals(e) {
    _(this, H, e);
  }
  get _haComponentsReady() {
    return f(this, F);
  }
  set _haComponentsReady(e) {
    _(this, F, e);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), console.log("[cleverio-schedule-view] connectedCallback"), await Ae(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this._haComponentsReady = !0, console.log("[cleverio-schedule-view] HA components loaded");
  }
  // Watch for changes in meals
  updated(e) {
    e.has("meals") && (this._localMeals = this.meals.map((i) => ({ ...i })), this._editDialogOpen = !1, this._editDialogReallyOpen = !1, console.log("[cleverio-schedule-view] Meals updated", this._localMeals));
  }
  // Helper to check if there are unsaved changes
  get _hasUnsavedChanges() {
    const e = JSON.stringify(this._localMeals), i = JSON.stringify(this.meals);
    return e !== i;
  }
  render() {
    var n, a, l;
    if (!this._haComponentsReady)
      return p`<div>Loading Home Assistant components...</div>`;
    const e = {
      time: { title: v("time"), sortable: !0, minWidth: "80px" },
      portion: { title: v("portion"), sortable: !0, minWidth: "80px" },
      days: {
        title: v("days"),
        sortable: !1,
        minWidth: "130px",
        template: (h) => p`
          <cleverio-day-selector .selectedDaysMask=${h.daysMask} .editable=${!1}></cleverio-day-selector>`
      },
      enabled: {
        title: p`<span style="font-size:0.9em;">${v("enabled")}</span>`,
        sortable: !1,
        minWidth: "80px",
        minHeight: "100px",
        template: (h) => p`
            <ha-switch .checked=${h.enabled} @change=${(c) => this._toggleEnabled(h._idx, c)} title="Enable/disable schedule"></ha-switch>
        `
      },
      actions: {
        title: v("actions"),
        sortable: !1,
        minWidth: "80px",
        template: (h) => p`
          <ha-icon-button @click=${() => this._openEditDialog(h._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(h._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        `
      }
    }, i = this._localMeals.map((h, c) => ({ ...h, _idx: c })), s = { locale: { language: "en", country: "US" } }, r = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return p`
      <ha-dialog open scrimClickAction style="--mdc-dialog-min-width: unset; min-width: unset; width: fit-content; max-width: 98vw;" heading= ${this._editDialogReallyOpen ? "Edit Feeding Time" : v("manage_schedules")}>
      
        ${this._editDialogReallyOpen ? p`
              <form class="edit-form" @submit=${(h) => h.preventDefault()}>
                ${this._editError ? p`<div class="error">${this._editError}</div>` : ""}
                <cleverio-day-selector
                  .selectedDaysMask=${((n = this._editForm) == null ? void 0 : n.daysMask) ?? 0}
                  .editable=${!0}
                  @days-changed=${(h) => this._onEditDaysChanged(h)}
                ></cleverio-day-selector>
                <div class="edit-form-group">
                  <label for="edit-time">Time</label>
                  <input
                    id="edit-time"
                    class="edit-time"
                    type="time"
                    .value=${((a = this._editForm) == null ? void 0 : a.time) ?? ""}
                    @input=${(h) => this._onEditTimeInput(h)}
                  />
                </div>
                <div class="edit-form-group">
                  <label for="edit-portion">Portion</label>
                  <input
                    id="edit-portion"
                    type="number"
                    min="1"
                    .value=${((l = this._editForm) == null ? void 0 : l.portion) ?? 1}
                    @input=${(h) => this._onEditPortionInput(h)}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${r.map((h) => p`
                    <ha-button type="button" @click=${() => this._onEditPredefinedTime(h)}>${h}</ha-button>
                  `)}
                </div>
              </form>
            ` : p`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .hass=${s}
                  .localizeFunc=${v}
                  .columns=${e}
                  .data=${i}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this._editDialogReallyOpen ? p`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>Back</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>Save</ha-button>
            ` : p`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>Add</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>Cancel</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>Save</ha-button>
            `}
      </ha-dialog>
    `;
  }
  _toggleEnabled(e, i) {
    this._localMeals[e].enabled = i.target.checked, this.requestUpdate(), console.log("[cleverio-schedule-view] _toggleEnabled", { idx: e, enabled: this._localMeals[e].enabled });
  }
  _openEditDialog(e) {
    this._editDialogOpen = !0, this._editDialogReallyOpen = !0, this._editIdx = e, this._editForm = { ...this._localMeals[e] }, this._editError = null, this.requestUpdate();
  }
  _openAddDialog() {
    this._editDialogOpen = !0, this._editDialogReallyOpen = !0, this._editIdx = null, this._editForm = { time: "", portion: 1, daysMask: 0, enabled: !0 }, this._editError = null, this.requestUpdate();
  }
  _closeEditDialog() {
    this._editDialogOpen = !1, this._editDialogReallyOpen = !1, this._editIdx = null, this._editForm = null, this._editError = null, this.requestUpdate();
  }
  _onEditDaysChanged(e) {
    this._editForm && (this._editForm.daysMask = e.detail.daysMask, this.requestUpdate());
  }
  _onEditTimeInput(e) {
    this._editForm && (this._editForm.time = e.target.value, this.requestUpdate());
  }
  _onEditPortionInput(e) {
    this._editForm && (this._editForm.portion = parseInt(e.target.value, 10), this.requestUpdate());
  }
  _onEditPredefinedTime(e) {
    this._editForm && (this._editForm.time = e, this.requestUpdate());
  }
  _onEditSave(e) {
    if (e && e.preventDefault(), !!this._editForm) {
      if (!this._editForm.time || !/^[0-2]\d:[0-5]\d$/.test(this._editForm.time)) {
        this._editError = "Please enter a valid time.", this.requestUpdate();
        return;
      }
      if (!this._editForm.portion || this._editForm.portion < 1) {
        this._editError = "Portion must be at least 1.", this.requestUpdate();
        return;
      }
      this._editError = null, this._editIdx !== null ? (this.meals[this._editIdx] = { ...this._editForm }, console.log("[cleverio-schedule-view] Updated meal", this.meals[this._editIdx])) : (this.meals.push({ ...this._editForm }), console.log("[cleverio-schedule-view] Added new meal", this.meals[this.meals.length - 1])), this._closeEditDialog();
    }
  }
  _delete(e) {
    this._localMeals.splice(e, 1), this.requestUpdate(), console.log("[cleverio-schedule-view] _delete", { idx: e });
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _cancel");
  }
  _save() {
    this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this._localMeals }, bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _save", { meals: this._localMeals });
  }
}, j = new WeakMap(), H = new WeakMap(), F = new WeakMap(), N.styles = [
  me`
      /* Schedule Table Styles */
      .schedule-table-wrapper {
        margin: 0 auto 0.2em auto;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
      }
      ha-dialog {
        width: 100%;
        max-width: 100vw;
        box-sizing: border-box;
      }
      .schedule-table-style td, .schedule-table-style th {
        padding: 0 4px;
        vertical-align: middle;
        border: none;
      }
      :host ::ng-deep .mdc-data-table__cell,
      :host ::ng-deep .mdc-data-table__header-cell {
        box-sizing: content-box !important;
      }
      /* Edit Dialog Styles */
      .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 100%;
        max-width: 100%;
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
O([
  y({ type: Array })
], A.prototype, "meals", null);
O([
  y({ type: Array })
], A.prototype, "_localMeals", null);
O([
  y({ type: Boolean })
], A.prototype, "_haComponentsReady", null);
O([
  y({ type: Boolean })
], A.prototype, "_editDialogOpen", void 0);
O([
  b()
], A.prototype, "_editDialogReallyOpen", void 0);
O([
  b()
], A.prototype, "_editForm", void 0);
O([
  b()
], A.prototype, "_editError", void 0);
A = O([
  ae("cleverio-schedule-view")
], A);
var w = function(o, t, e, i) {
  var s = arguments.length, r = s < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, t, e, i);
  else for (var a = o.length - 1; a >= 0; a--) (n = o[a]) && (r = (s < 3 ? n(r) : s > 3 ? n(t, e, r) : n(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, Q, ee, te, ie, se, oe, z, B;
let $ = (B = class extends E {
  constructor() {
    super();
    g(this, Q);
    g(this, ee);
    g(this, te);
    g(this, ie);
    g(this, se);
    g(this, oe);
    g(this, z);
    this._haComponentsReady = !1, _(this, z, []), this.footerButtonsTemplate = null, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return f(this, Q);
  }
  set hass(e) {
    _(this, Q, e);
  }
  get config() {
    return f(this, ee);
  }
  set config(e) {
    _(this, ee, e);
  }
  get _meals() {
    return f(this, te);
  }
  set _meals(e) {
    _(this, te, e);
  }
  get _persistedMeals() {
    return f(this, ie);
  }
  set _persistedMeals(e) {
    _(this, ie, e);
  }
  get _dialogOpen() {
    return f(this, se);
  }
  set _dialogOpen(e) {
    _(this, se, e);
  }
  get _dialogData() {
    return f(this, oe);
  }
  set _dialogData(e) {
    _(this, oe, e);
  }
  get _footerButtons() {
    return f(this, z);
  }
  set _footerButtons(e) {
    _(this, z, e);
  }
  setConfig(e) {
    this.config = e, this._checkConfig(), this._updateConfig();
  }
  updated(e) {
    e.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await bt(), await Ae(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback(), this.requestUpdate();
  }
  get _sensorID() {
    var e;
    return (e = this.config) == null ? void 0 : e.sensor;
  }
  get _stateObj() {
    var e, i;
    return (i = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : i[this._sensorID];
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
    let i;
    if (e)
      try {
        i = gt(e.state), Array.isArray(i) && (this._persistedMeals = i);
      } catch (s) {
        console.error("Failed to decode meal plan:", s);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []), this.requestUpdate();
  }
  render() {
    var e;
    return this._haComponentsReady ? p`
      <ha-card header=${((e = this.config) == null ? void 0 : e.title) || "Cleverio Pet Feeder"} style="height: 100%;">
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${v("schedules")}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${v("active_schedules")}: <span style="white-space:nowrap;">${this._meals.filter((i) => i.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${v("today")}: <span style="white-space:nowrap;">${ft(this._meals.filter((i) => i.enabled), (/* @__PURE__ */ new Date()).getDay()) * 6}g</span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0, this.requestUpdate();
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${v("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? p`
              <cleverio-schedule-view
                .meals=${this._meals}
                .localize=${v}
                @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                @footer-buttons-changed=${this._onFooterButtonsChanged.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : p`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Et), document.createElement("cleverio-card-editor");
  }
  // Legacy methods for test compatibility
  getNextSchedule() {
    return this._meals && this._meals.length ? this._meals[0].time : "-";
  }
  getTotalFoodPerDay() {
    return typeof He == "function" ? He(this._meals || []) : {};
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID)
      return;
    const e = yt(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: e
    });
  }
  _onScheduleMealsChanged(e) {
    this._dialogOpen = !1, this._meals = e.detail.meals, this._saveMealsToSensor(), this.requestUpdate();
  }
  _onDialogClose() {
    this._dialogOpen = !1, this.requestUpdate();
  }
  _onFooterButtonsChanged(e) {
    this.footerButtonsTemplate = e.detail.template;
  }
}, Q = new WeakMap(), ee = new WeakMap(), te = new WeakMap(), ie = new WeakMap(), se = new WeakMap(), oe = new WeakMap(), z = new WeakMap(), B.styles = [
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
], B);
w([
  y({ type: Object })
], $.prototype, "hass", null);
w([
  y({ type: Object })
], $.prototype, "config", null);
w([
  b()
], $.prototype, "_meals", null);
w([
  b()
], $.prototype, "_persistedMeals", null);
w([
  b()
], $.prototype, "_dialogOpen", null);
w([
  b()
], $.prototype, "_dialogData", null);
w([
  y({ type: Boolean })
], $.prototype, "_haComponentsReady", void 0);
w([
  b()
], $.prototype, "_footerButtons", null);
w([
  b()
], $.prototype, "footerButtonsTemplate", void 0);
$ = w([
  ae("cleverio-pf100-card")
], $);
var Ze = function(o, t, e, i) {
  var s = arguments.length, r = s < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, t, e, i);
  else for (var a = o.length - 1; a >= 0; a--) (n = o[a]) && (r = (s < 3 ? n(r) : s > 3 ? n(t, e, r) : n(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, re, ze;
let ue = (ze = class extends E {
  constructor() {
    super(...arguments);
    g(this, re, { sensor: "", title: "" });
  }
  get config() {
    return f(this, re);
  }
  set config(e) {
    _(this, re, e);
  }
  setConfig(e) {
    this.config = { ...e };
  }
  _onInput(e) {
    const { name: i, value: s } = e.target;
    this.config = { ...this.config, [i]: s }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }
  render() {
    return p`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ""} @input=${this._onInput} /></label>
      <label>Title:
        <input name="title" .value=${this.config.title || ""} @input=${this._onInput} /></label>
    `;
  }
}, re = new WeakMap(), ze);
Ze([
  y({ attribute: !1 })
], ue.prototype, "config", null);
ue = Ze([
  ae("cleverio-card-editor")
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
