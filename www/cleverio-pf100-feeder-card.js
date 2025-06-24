var Ce = (o) => {
  throw TypeError(o);
};
var xe = (o, e, t) => e.has(o) || Ce("Cannot " + t);
var _ = (o, e, t) => (xe(o, e, "read from private field"), t ? t.call(o) : e.get(o)), v = (o, e, t) => e.has(o) ? Ce("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(o) : e.set(o, t), f = (o, e, t, i) => (xe(o, e, "write to private field"), i ? i.call(o, t) : e.set(o, t), t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = globalThis, $e = he.ShadowRoot && (he.ShadyCSS === void 0 || he.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, be = Symbol(), Se = /* @__PURE__ */ new WeakMap();
let ze = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== be) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if ($e && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ze = (o) => new ze(typeof o == "string" ? o : o + "", void 0, be), ue = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((i, s, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[r + 1], o[0]);
  return new ze(t, o, be);
}, Ye = (o, e) => {
  if ($e) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = he.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, o.appendChild(i);
  }
}, Me = $e ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Ze(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ge, defineProperty: Xe, getOwnPropertyDescriptor: Ke, getOwnPropertyNames: Qe, getOwnPropertySymbols: et, getPrototypeOf: tt } = Object, x = globalThis, Oe = x.trustedTypes, it = Oe ? Oe.emptyScript : "", ge = x.reactiveElementPolyfillSupport, V = (o, e) => o, de = { toAttribute(o, e) {
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
} }, we = (o, e) => !Ge(o, e), Pe = { attribute: !0, type: String, converter: de, reflect: !1, useDefault: !1, hasChanged: we };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let R = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Pe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && Xe(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: r } = Ke(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: s, set(n) {
      const l = s == null ? void 0 : s.call(this);
      r == null || r.call(this, n), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Pe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = tt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const t = this.properties, i = [...Qe(t), ...et(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(Me(s));
    } else e !== void 0 && t.push(Me(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ye(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var r;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : de).toAttribute(t, i.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var r, n;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : de;
      this._$Em = s, this[s] = a.fromAttribute(t, l.type) ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, i) {
    var s;
    if (e !== void 0) {
      const r = this.constructor, n = this[e];
      if (i ?? (i = r.getPropertyOptions(e)), !((i.hasChanged ?? we)(n, t) || i.useDefault && i.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(e)) && !this.hasAttribute(r._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: r }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: l } = n, a = this[r];
        l !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, n, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[V("elementProperties")] = /* @__PURE__ */ new Map(), R[V("finalized")] = /* @__PURE__ */ new Map(), ge == null || ge({ ReactiveElement: R }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, ce = J.trustedTypes, ke = ce ? ce.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Be = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, qe = "?" + C, st = `<${qe}>`, k = document, Z = () => k.createComment(""), Y = (o) => o === null || typeof o != "object" && typeof o != "function", Ee = Array.isArray, ot = (o) => Ee(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", _e = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, De = /-->/g, Ue = />/g, M = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Re = /'/g, Te = /"/g, Le = /^(?:script|style|textarea|title)$/i, rt = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), c = rt(1), B = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), je = /* @__PURE__ */ new WeakMap(), O = k.createTreeWalker(k, 129);
function We(o, e) {
  if (!Ee(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ke !== void 0 ? ke.createHTML(e) : e;
}
const nt = (o, e) => {
  const t = o.length - 1, i = [];
  let s, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = W;
  for (let l = 0; l < t; l++) {
    const a = o[l];
    let h, p, d = -1, m = 0;
    for (; m < a.length && (n.lastIndex = m, p = n.exec(a), p !== null); ) m = n.lastIndex, n === W ? p[1] === "!--" ? n = De : p[1] !== void 0 ? n = Ue : p[2] !== void 0 ? (Le.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = M) : p[3] !== void 0 && (n = M) : n === M ? p[0] === ">" ? (n = s ?? W, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, h = p[1], n = p[3] === void 0 ? M : p[3] === '"' ? Te : Re) : n === Te || n === Re ? n = M : n === De || n === Ue ? n = W : (n = M, s = void 0);
    const A = n === M && o[l + 1].startsWith("/>") ? " " : "";
    r += n === W ? a + st : d >= 0 ? (i.push(h), a.slice(0, d) + Be + a.slice(d) + C + A) : a + C + (d === -2 ? l : A);
  }
  return [We(o, r + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class G {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const l = e.length - 1, a = this.parts, [h, p] = nt(e, t);
    if (this.el = G.createElement(h, i), O.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = O.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Be)) {
          const m = p[n++], A = s.getAttribute(d).split(C), le = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: r, name: le[2], strings: A, ctor: le[1] === "." ? lt : le[1] === "?" ? ht : le[1] === "@" ? dt : me }), s.removeAttribute(d);
        } else d.startsWith(C) && (a.push({ type: 6, index: r }), s.removeAttribute(d));
        if (Le.test(s.tagName)) {
          const d = s.textContent.split(C), m = d.length - 1;
          if (m > 0) {
            s.textContent = ce ? ce.emptyScript : "";
            for (let A = 0; A < m; A++) s.append(d[A], Z()), O.nextNode(), a.push({ type: 2, index: ++r });
            s.append(d[m], Z());
          }
        }
      } else if (s.nodeType === 8) if (s.data === qe) a.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(C, d + 1)) !== -1; ) a.push({ type: 7, index: r }), d += C.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const i = k.createElement("template");
    return i.innerHTML = e, i;
  }
}
function q(o, e, t = o, i) {
  var n, l;
  if (e === B) return e;
  let s = i !== void 0 ? (n = t._$Co) == null ? void 0 : n[i] : t._$Cl;
  const r = Y(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), r === void 0 ? s = void 0 : (s = new r(o), s._$AT(o, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = s : t._$Cl = s), s !== void 0 && (e = q(o, s._$AS(o, e.values), s, i)), e;
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
    const { el: { content: t }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? k).importNode(t, !0);
    O.currentNode = s;
    let r = O.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new ne(r, r.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(r, a.name, a.strings, this, e) : a.type === 6 && (h = new ct(r, this, e)), this._$AV.push(h), a = i[++l];
      }
      n !== (a == null ? void 0 : a.index) && (r = O.nextNode(), n++);
    }
    return O.currentNode = k, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class ne {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    e = q(this, e, t), Y(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== B && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ot(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && Y(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = G.createElement(We(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(t);
    else {
      const n = new at(s, this), l = n.u(this.options);
      n.p(t), this.T(l), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = je.get(e.strings);
    return t === void 0 && je.set(e.strings, t = new G(e)), t;
  }
  k(e) {
    Ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const r of e) s === t.length ? t.push(i = new ne(this.O(Z()), this.O(Z()), this, this.options)) : i = t[s], i._$AI(r), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const s = e.nextSibling;
      e.remove(), e = s;
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
  constructor(e, t, i, s, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(e, t = this, i, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = q(this, e, t, 0), n = !Y(e) || e !== this._$AH && e !== B, n && (this._$AH = e);
    else {
      const l = e;
      let a, h;
      for (e = r[0], a = 0; a < r.length - 1; a++) h = q(this, l[i + a], t, a), h === B && (h = this._$AH[a]), n || (n = !Y(h) || h !== this._$AH[a]), h === u ? e = u : e !== u && (e += (h ?? "") + r[a + 1]), this._$AH[a] = h;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class lt extends me {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class ht extends me {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class dt extends me {
  constructor(e, t, i, s, r) {
    super(e, t, i, s, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = q(this, e, t, 0) ?? u) === B) return;
    const i = this._$AH, s = e === u && i !== u || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ct {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    q(this, e);
  }
}
const ve = J.litHtmlPolyfillSupport;
ve == null || ve(G, ne), (J.litHtmlVersions ?? (J.litHtmlVersions = [])).push("3.3.0");
const pt = (o, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = s = new ne(e.insertBefore(Z(), r), r, void 0, t ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class E extends R {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = pt(t, this.renderRoot, this.renderOptions);
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
    return B;
  }
}
var Ne;
E._$litElement$ = !0, E.finalized = !0, (Ne = P.litElementHydrateSupport) == null || Ne.call(P, { LitElement: E });
const ye = P.litElementPolyfillSupport;
ye == null || ye({ LitElement: E });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.0");
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
const ut = { attribute: !0, type: String, converter: de, reflect: !1, hasChanged: we }, mt = (o = ut, e, t) => {
  const { kind: i, metadata: s } = t;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((o = Object.create(o)).wrapped = !0), r.set(t.name, o), i === "accessor") {
    const { name: n } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(n, a, o);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, o, l), l;
    } };
  }
  if (i === "setter") {
    const { name: n } = t;
    return function(l) {
      const a = this[n];
      e.call(this, l), this.requestUpdate(n, a, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function $(o) {
  return (e, t) => typeof t == "object" ? mt(o, e, t) : ((i, s, r) => {
    const n = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), n ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(o) {
  return $({ ...o, state: !0, attribute: !1 });
}
function Ie(o) {
  const e = Array(7).fill(0);
  return o.forEach((t) => {
    if (t.enabled)
      for (let i = 0; i < 7; i++)
        t.daysMask & 1 << i && (e[i] += t.portion);
  }), e;
}
function ft(o, e) {
  let t = 0;
  return o.forEach((i) => {
    i.enabled && i.daysMask & 1 << e && (t += i.portion);
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
  const t = new Uint8Array([...e].map((s) => s.charCodeAt(0)));
  if (t.length % 5 !== 0)
    throw new Error("Invalid meal plan length");
  const i = [];
  for (let s = 0; s < t.length; s += 5) {
    const [r, n, l, a, h] = t.slice(s, s + 5);
    i.push({
      time: `${n.toString().padStart(2, "0")}:${l.toString().padStart(2, "0")}`,
      daysMask: r,
      portion: a || 1,
      enabled: h === 1
    });
  }
  return i;
}
function _t(o) {
  const e = [];
  return o.forEach((t) => {
    const [i, s] = t.time.split(":").map(Number);
    e.push(t.daysMask, i, s, Number(t.portion), t.enabled ? 1 : 0);
  }), btoa(String.fromCharCode(...e));
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
  var t, i, s, r, n, l;
  const e = o || vt;
  try {
    if (e.every((d) => customElements.get(d)))
      return;
    await Promise.race([
      customElements.whenDefined("partial-panel-resolver"),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout waiting for partial-panel-resolver")), 1e4))
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
    if (a._updateRoutes(), !((s = (i = (t = a.routerOptions) == null ? void 0 : t.routes) == null ? void 0 : i.tmp) != null && s.load))
      throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([
      a.routerOptions.routes.tmp.load(),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout loading tmp route")), 1e4))
    ]), await Promise.race([
      customElements.whenDefined("ha-panel-config"),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout waiting for ha-panel-config")), 1e4))
    ]);
    const h = document.createElement("ha-panel-config");
    if (!h)
      throw new Error("Failed to create ha-panel-config element");
    if (!((l = (n = (r = h.routerOptions) == null ? void 0 : r.routes) == null ? void 0 : n.automation) != null && l.load))
      throw new Error("ha-panel-config does not have automation route");
    await Promise.race([
      h.routerOptions.routes.automation.load(),
      new Promise((d, m) => setTimeout(() => m(new Error("Timeout loading automation components")), 1e4))
    ]);
    const p = e.filter((d) => !customElements.get(d));
    if (p.length > 0)
      throw new Error(`Failed to load components: ${p.join(", ")}`);
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
let Ve = {}, He = !1;
async function yt() {
  if (!He)
    try {
      const o = new URL("data:application/json;base64,ewogICJzY2hlZHVsZXMiOiAiU2NoZWR1bGVzIiwKICAiYWN0aXZlX3NjaGVkdWxlcyI6ICJBY3RpdmUgU2NoZWR1bGVzIiwKICAidG9kYXkiOiAiVG9kYXkiLAogICJtYW5hZ2Vfc2NoZWR1bGVzIjogIk1hbmFnZSBTY2hlZHVsZXMiLAogICJwb3J0aW9uIjogIlBvcnRpb24iLAogICJ0aW1lIjogIlRpbWUiLAogICJkYXlzIjogIkRheXMiLAogICJlbmFibGVkIjogIkVuYWJsZWQiLAogICJhY3Rpb25zIjogIkFjdGlvbnMiCn0K", import.meta.url).href, e = await fetch(o);
      e.ok ? (Ve = await e.json(), He = !0) : console.error("Failed to load translations", e.status);
    } catch (o) {
      console.error("Failed to load translations", o);
    }
}
function y(o) {
  return Ve[o] || o;
}
var fe = function(o, e, t, i) {
  var s = arguments.length, r = s < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, t) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, i);
  else for (var l = o.length - 1; l >= 0; l--) (n = o[l]) && (r = (s < 3 ? n(r) : s > 3 ? n(e, t, r) : n(e, t)) || r);
  return s > 3 && r && Object.defineProperty(e, t, r), r;
}, T;
let X = (T = class extends E {
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
    return c`
      <div class="days-row">
        ${e.map((t, i) => c`
          <span
            class="day-cell${this.selectedDaysMask & 1 << i ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(i)}
          >${t}</span>
        `)}
      </div>
    `;
  }
}, T.styles = ue`
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
fe([
  $({ type: Number })
], X.prototype, "selectedDaysMask", void 0);
fe([
  $({ type: Boolean })
], X.prototype, "editable", void 0);
fe([
  $({ type: Array })
], X.prototype, "dayLabels", void 0);
X = fe([
  ae("cleverio-day-selector")
], X);
var L = function(o, e, t, i) {
  var s = arguments.length, r = s < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, t) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, i);
  else for (var l = o.length - 1; l >= 0; l--) (n = o[l]) && (r = (s < 3 ? n(r) : s > 3 ? n(e, t, r) : n(e, t)) || r);
  return s > 3 && r && Object.defineProperty(e, t, r), r;
}, K, j;
let D = (j = class extends E {
  constructor() {
    super();
    v(this, K);
    this.openDialog = !1, this._haComponentsReady = !1, this._localEdit = null, this._error = null, this._onEditSave = (t) => {
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
    return _(this, K);
  }
  set data(t) {
    f(this, K, t);
  }
  async connectedCallback() {
    super.connectedCallback(), await Ae(["ha-form", "ha-button", "ha-switch"]), this._haComponentsReady = !0;
  }
  updated(t) {
    t.has("data") && this.data && (this._localEdit = { ...this.data }, this._error = null);
  }
  render() {
    if (!this._haComponentsReady || !this._localEdit)
      return c``;
    const t = this._localEdit, i = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return this.openDialog ? c`
      <ha-dialog open scrimClickAction>
        <div slot="heading">Edit Feeding Time</div>
        <form class="edit-form" @submit=${(s) => s.preventDefault()}>
          ${this._error ? c`<div class="error">${this._error}</div>` : ""}
          <cleverio-day-selector
            .selectedDaysMask=${t.daysMask}
            .editable=${!0}
            @days-changed=${(s) => this._onDaysChanged(s)}
          ></cleverio-day-selector>
          <div class="form-group">
            <label for="edit-time">Time</label>
            <input
              id="edit-time"
              class="edit-time"
              type="time"
              .value=${t.time}
              @input=${(s) => t.time = s.target.value}
            />
          </div>
          <div class="form-group">
            <label for="edit-portion">Portion</label>
            <input
              id="edit-portion"
              type="number"
              min="1"
              .value=${t.portion}
              @input=${(s) => t.portion = parseInt(s.target.value, 10)}
            />
            <div class="helper">1 portion = 6 grams</div>
          </div>
          <div class="predefined-times">
            ${i.map((s) => c`
              <ha-button type="button" @click=${() => {
      t.time = s, this.requestUpdate();
    }}>${s}</ha-button>
            `)}
          </div>
        </form>
        <ha-button slot="secondaryAction" @click=${this._onBackClick.bind(this)}>Back</ha-button>
        <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>Save</ha-button>
      </ha-dialog>
    ` : c``;
  }
  _onDaysChanged(t) {
    this._localEdit && (this._localEdit.daysMask = t.detail.daysMask, this.requestUpdate());
  }
  _onBackClick(t) {
    t.preventDefault(), this.dispatchEvent(new CustomEvent("back", { bubbles: !0, composed: !0 }));
  }
}, K = new WeakMap(), j.styles = ue`
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
  `, j);
L([
  $({ type: Object })
], D.prototype, "data", null);
L([
  $({ type: Boolean })
], D.prototype, "openDialog", void 0);
L([
  g()
], D.prototype, "_haComponentsReady", void 0);
L([
  g()
], D.prototype, "_localEdit", void 0);
L([
  g()
], D.prototype, "_error", void 0);
D = L([
  ae("cleverio-edit-view")
], D);
var U = function(o, e, t, i) {
  var s = arguments.length, r = s < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, t) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, i);
  else for (var l = o.length - 1; l >= 0; l--) (n = o[l]) && (r = (s < 3 ? n(r) : s > 3 ? n(e, t, r) : n(e, t)) || r);
  return s > 3 && r && Object.defineProperty(e, t, r), r;
};
console.log("[cleverio-schedule-view] Module loaded");
var I, H, N;
let S = (N = class extends E {
  constructor() {
    super();
    v(this, I);
    v(this, H);
    f(this, I, []), this.viewMeals = [], this.editForm = null, this.editError = null, this.editDialogOpen = !1, this.editIdx = null, f(this, H, !1), this.meals = [], this.viewMeals = [], console.log("[cleverio-schedule-view] Constructor");
  }
  get meals() {
    return _(this, I);
  }
  set meals(t) {
    f(this, I, t);
  }
  get haComponentsReady() {
    return _(this, H);
  }
  set haComponentsReady(t) {
    f(this, H, t);
  }
  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback(), console.log("[cleverio-schedule-view] connectedCallback"), await Ae(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this.haComponentsReady = !0, console.log("[cleverio-schedule-view] HA components loaded");
  }
  // Watch for changes in meals
  updated(t) {
    t.has("meals") && (this.viewMeals = this.meals.map((i) => ({ ...i })), this.editDialogOpen = !1, console.log("[cleverio-schedule-view] Meals updated", this.viewMeals));
  }
  // Helper to check if there are unsaved changes
  get _hasUnsavedChanges() {
    const t = JSON.stringify(this.viewMeals), i = JSON.stringify(this.meals);
    return t !== i;
  }
  _toggleEnabled(t, i) {
    this.viewMeals[t].enabled = i.target.checked, this.requestUpdate(), console.log("[cleverio-schedule-view] _toggleEnabled", { idx: t, enabled: this.viewMeals[t].enabled });
  }
  _openEditDialog(t) {
    this.editDialogOpen = !0, this.editIdx = t, this.viewMeals = this.meals.map((i) => ({ ...i })), this.editForm = { ...this.viewMeals[t] }, this.editError = null, this.requestUpdate();
  }
  _openAddDialog() {
    this.editDialogOpen = !0, this.editIdx = null, this.viewMeals = this.meals.map((t) => ({ ...t })), this.editForm = { time: "", portion: 1, daysMask: 0, enabled: !0 }, this.editError = null, this.requestUpdate();
  }
  _closeEditDialog() {
    this.editDialogOpen = !1, this.editForm = null, this.requestUpdate();
  }
  _delete(t) {
    this.viewMeals.splice(t, 1), this.requestUpdate(), console.log("[cleverio-schedule-view] _delete", { idx: t });
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _cancel");
  }
  _save() {
    this.meals = this.viewMeals.map((t) => ({ ...t })), this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this.viewMeals }, bubbles: !0, composed: !0 })), console.log("[cleverio-schedule-view] _save", { meals: this.viewMeals });
  }
  render() {
    var r, n, l;
    if (!this.haComponentsReady)
      return c`<div>Loading Home Assistant components...</div>`;
    const t = {
      time: { title: y("time"), sortable: !0, minWidth: "80px" },
      portion: { title: y("portion"), sortable: !0, minWidth: "80px" },
      days: {
        title: y("days"),
        sortable: !1,
        minWidth: "130px",
        template: (a) => c`
          <cleverio-day-selector
            .selectedDaysMask=${a.daysMask}
            .editable=${!1}
          ></cleverio-day-selector>
        `
      },
      enabled: {
        title: y("enabled"),
        sortable: !0,
        minWidth: "60px",
        template: (a) => c`
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
        title: y("actions"),
        sortable: !1,
        minWidth: "140px",
        template: (a) => c`
          <ha-icon-button @click=${() => this._openEditDialog(a._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(a._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        `
      }
    }, i = this.viewMeals.map((a, h) => ({ ...a, _idx: h })), s = ["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"];
    return c`
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? "Edit Feeding Time" : y("manage_schedules")}>
      
        ${this.editDialogOpen ? c`
              <form class="edit-form" @submit=${(a) => a.preventDefault()}>
                ${this.editError ? c`<div class="error">${this.editError}</div>` : ""}
                <cleverio-day-selector
                  class="edit-mode"
                  .selectedDaysMask=${((r = this.editForm) == null ? void 0 : r.daysMask) ?? 0}
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
                    .value=${((n = this.editForm) == null ? void 0 : n.time) ?? ""}
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
                  ${s.map((a) => c`
                    <ha-button type="button" @click=${() => {
      this.editForm.time = a, this.requestUpdate();
    }}>${a}</ha-button>
                  `)}
                </div>
              </form>
            ` : c`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${y}
                  .columns=${t}
                  .data=${i}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editDialogOpen ? c`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>Back</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>Save</ha-button>
            ` : c`
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
        this.editError = "Please enter a valid time.", this.requestUpdate();
        return;
      }
      if (!this.editForm.portion || this.editForm.portion < 1) {
        this.editError = "Portion must be at least 1.", this.requestUpdate();
        return;
      }
      this.editError = null, this.editIdx !== null ? (this.viewMeals[this.editIdx] = { ...this.editForm }, console.log("[cleverio-schedule-view] Updated meal", this.viewMeals[this.editIdx])) : (this.viewMeals.push({ ...this.editForm }), console.log("[cleverio-schedule-view] Added new meal", this.viewMeals[this.viewMeals.length - 1])), this.requestUpdate(), this._closeEditDialog();
    }
  }
}, I = new WeakMap(), H = new WeakMap(), N.styles = [
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
], N);
U([
  $({ type: Array })
], S.prototype, "meals", null);
U([
  g()
], S.prototype, "viewMeals", void 0);
U([
  g()
], S.prototype, "editForm", void 0);
U([
  g()
], S.prototype, "editError", void 0);
U([
  g()
], S.prototype, "editDialogOpen", void 0);
U([
  $({ type: Boolean })
], S.prototype, "haComponentsReady", null);
S = U([
  ae("cleverio-schedule-view")
], S);
var w = function(o, e, t, i) {
  var s = arguments.length, r = s < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, t) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, i);
  else for (var l = o.length - 1; l >= 0; l--) (n = o[l]) && (r = (s < 3 ? n(r) : s > 3 ? n(e, t, r) : n(e, t)) || r);
  return s > 3 && r && Object.defineProperty(e, t, r), r;
}, Q, ee, te, ie, se, oe, F, z;
let b = (z = class extends E {
  constructor() {
    super();
    v(this, Q);
    v(this, ee);
    v(this, te);
    v(this, ie);
    v(this, se);
    v(this, oe);
    v(this, F);
    this._haComponentsReady = !1, f(this, F, []), this.footerButtonsTemplate = null, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return _(this, Q);
  }
  set hass(t) {
    f(this, Q, t);
  }
  get config() {
    return _(this, ee);
  }
  set config(t) {
    f(this, ee, t);
  }
  get _meals() {
    return _(this, te);
  }
  set _meals(t) {
    f(this, te, t);
  }
  get _persistedMeals() {
    return _(this, ie);
  }
  set _persistedMeals(t) {
    f(this, ie, t);
  }
  get _dialogOpen() {
    return _(this, se);
  }
  set _dialogOpen(t) {
    f(this, se, t);
  }
  get _dialogData() {
    return _(this, oe);
  }
  set _dialogData(t) {
    f(this, oe, t);
  }
  get _footerButtons() {
    return _(this, F);
  }
  set _footerButtons(t) {
    f(this, F, t);
  }
  setConfig(t) {
    this.config = t, this._checkConfig(), this._updateConfig();
  }
  updated(t) {
    t.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    await yt(), await Ae(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback(), this.requestUpdate();
  }
  get _sensorID() {
    var t;
    return (t = this.config) == null ? void 0 : t.sensor;
  }
  get _stateObj() {
    var t, i;
    return (i = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : i[this._sensorID];
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
    let i;
    if (t)
      try {
        i = gt(t.state), Array.isArray(i) && (this._persistedMeals = i);
      } catch (s) {
        console.error("Failed to decode meal plan:", s);
      }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []), this.requestUpdate();
  }
  render() {
    var t;
    return this._haComponentsReady ? c`
      <ha-card header=${((t = this.config) == null ? void 0 : t.title) || "Cleverio Pet Feeder"} style="height: 100%;">
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${y("schedules")}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${y("active_schedules")}: <span style="white-space:nowrap;">${this._meals.filter((i) => i.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${y("today")}: <span style="white-space:nowrap;">${ft(this._meals.filter((i) => i.enabled), (/* @__PURE__ */ new Date()).getDay()) * 6}g</span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0, this.requestUpdate();
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${y("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? c`
              <cleverio-schedule-view
                .meals=${this._meals}
                .localize=${y}
                @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                @footer-buttons-changed=${this._onFooterButtonsChanged.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : c`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => $t), document.createElement("cleverio-card-editor");
  }
  // Legacy methods for test compatibility
  getNextSchedule() {
    return this._meals && this._meals.length ? this._meals[0].time : "-";
  }
  getTotalFoodPerDay() {
    return typeof Ie == "function" ? Ie(this._meals || []) : {};
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID)
      return;
    const t = _t(this._meals);
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value: t
    });
  }
  _onScheduleMealsChanged(t) {
    this._dialogOpen = !1, this._meals = t.detail.meals, this._saveMealsToSensor(), this.requestUpdate();
  }
  _onDialogClose() {
    this._dialogOpen = !1, this.requestUpdate();
  }
  _onFooterButtonsChanged(t) {
    this.footerButtonsTemplate = t.detail.template;
  }
}, Q = new WeakMap(), ee = new WeakMap(), te = new WeakMap(), ie = new WeakMap(), se = new WeakMap(), oe = new WeakMap(), F = new WeakMap(), z.styles = [
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
], z);
w([
  $({ type: Object })
], b.prototype, "hass", null);
w([
  $({ type: Object })
], b.prototype, "config", null);
w([
  g()
], b.prototype, "_meals", null);
w([
  g()
], b.prototype, "_persistedMeals", null);
w([
  g()
], b.prototype, "_dialogOpen", null);
w([
  g()
], b.prototype, "_dialogData", null);
w([
  $({ type: Boolean })
], b.prototype, "_haComponentsReady", void 0);
w([
  g()
], b.prototype, "_footerButtons", null);
w([
  g()
], b.prototype, "footerButtonsTemplate", void 0);
b = w([
  ae("cleverio-pf100-card")
], b);
var Je = function(o, e, t, i) {
  var s = arguments.length, r = s < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, t) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(o, e, t, i);
  else for (var l = o.length - 1; l >= 0; l--) (n = o[l]) && (r = (s < 3 ? n(r) : s > 3 ? n(e, t, r) : n(e, t)) || r);
  return s > 3 && r && Object.defineProperty(e, t, r), r;
}, re, Fe;
let pe = (Fe = class extends E {
  constructor() {
    super(...arguments);
    v(this, re, { sensor: "", title: "" });
  }
  get config() {
    return _(this, re);
  }
  set config(t) {
    f(this, re, t);
  }
  setConfig(t) {
    this.config = { ...t };
  }
  _onInput(t) {
    const { name: i, value: s } = t.target;
    this.config = { ...this.config, [i]: s }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }
  render() {
    return c`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ""} @input=${this._onInput} /></label>
      <label>Title:
        <input name="title" .value=${this.config.title || ""} @input=${this._onInput} /></label>
    `;
  }
}, re = new WeakMap(), Fe);
Je([
  $({ attribute: !1 })
], pe.prototype, "config", null);
pe = Je([
  ae("cleverio-card-editor")
], pe);
const $t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get CleverioCardEditor() {
    return pe;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  b as CleverioPf100Card
};
