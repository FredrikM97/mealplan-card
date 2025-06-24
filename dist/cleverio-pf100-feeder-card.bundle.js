var bt = (i) => {
  throw TypeError(i);
};
var wt = (i, t, e) => t.has(i) || bt("Cannot " + e);
var _ = (i, t, e) => (wt(i, t, "read from private field"), e ? e.call(i) : t.get(i)), y = (i, t, e) => t.has(i) ? bt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(i) : t.set(i, e), f = (i, t, e, s) => (wt(i, t, "write to private field"), s ? s.call(i, e) : t.set(i, e), e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = globalThis, _t = nt.ShadowRoot && (nt.ShadyCSS === void 0 || nt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, yt = Symbol(), At = /* @__PURE__ */ new WeakMap();
let jt = class {
  constructor(i, t, e) {
    if (this._$cssResult$ = !0, e !== yt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = i, this.t = t;
  }
  get styleSheet() {
    let i = this.o;
    const t = this.t;
    if (_t && i === void 0) {
      const e = t !== void 0 && t.length === 1;
      e && (i = At.get(t)), i === void 0 && ((this.o = i = new CSSStyleSheet()).replaceSync(this.cssText), e && At.set(t, i));
    }
    return i;
  }
  toString() {
    return this.cssText;
  }
};
const vt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, o, a) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[a + 1], i[0]);
  return new jt(e, i, yt);
}, Et = _t ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ((s) => new jt(typeof s == "string" ? s : s + "", void 0, yt))(e);
})(i) : i, { is: Lt, defineProperty: Wt, getOwnPropertyDescriptor: qt, getOwnPropertyNames: Vt, getOwnPropertySymbols: Jt, getPrototypeOf: Zt } = Object, x = globalThis, St = x.trustedTypes, Gt = St ? St.emptyScript : "", ct = x.reactiveElementPolyfillSupport, W = (i, t) => i, rt = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Gt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, $t = (i, t) => !Lt(i, t), xt = { attribute: !0, type: String, converter: rt, reflect: !1, useDefault: !1, hasChanged: $t };
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(i) {
    this._$Ei(), (this.l ?? (this.l = [])).push(i);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(i, t = xt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(i) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(i, t), !t.noAccessor) {
      const e = Symbol(), s = this.getPropertyDescriptor(i, e, t);
      s !== void 0 && Wt(this.prototype, i, s);
    }
  }
  static getPropertyDescriptor(i, t, e) {
    const { get: s, set: o } = qt(this.prototype, i) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: s, set(a) {
      const n = s == null ? void 0 : s.call(this);
      o == null || o.call(this, a), this.requestUpdate(i, n, e);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(i) {
    return this.elementProperties.get(i) ?? xt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const i = Zt(this);
    i.finalize(), i.l !== void 0 && (this.l = [...i.l]), this.elementProperties = new Map(i.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const t = this.properties, e = [...Vt(t), ...Jt(t)];
      for (const s of e) this.createProperty(s, t[s]);
    }
    const i = this[Symbol.metadata];
    if (i !== null) {
      const t = litPropertyMetadata.get(i);
      if (t !== void 0) for (const [e, s] of t) this.elementProperties.set(e, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, e] of this.elementProperties) {
      const s = this._$Eu(t, e);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(i) {
    const t = [];
    if (Array.isArray(i)) {
      const e = new Set(i.flat(1 / 0).reverse());
      for (const s of e) t.unshift(Et(s));
    } else i !== void 0 && t.push(Et(i));
    return t;
  }
  static _$Eu(i, t) {
    const e = t.attribute;
    return e === !1 ? void 0 : typeof e == "string" ? e : typeof i == "string" ? i.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var i;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (i = this.constructor.l) == null || i.forEach((t) => t(this));
  }
  addController(i) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(i), this.renderRoot !== void 0 && this.isConnected && ((t = i.hostConnected) == null || t.call(i));
  }
  removeController(i) {
    var t;
    (t = this._$EO) == null || t.delete(i);
  }
  _$E_() {
    const i = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const e of t.keys()) this.hasOwnProperty(e) && (i.set(e, this[e]), delete this[e]);
    i.size > 0 && (this._$Ep = i);
  }
  createRenderRoot() {
    const i = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ((t, e) => {
      if (_t) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
      else for (const s of e) {
        const o = document.createElement("style"), a = nt.litNonce;
        a !== void 0 && o.setAttribute("nonce", a), o.textContent = s.cssText, t.appendChild(o);
      }
    })(i, this.constructor.elementStyles), i;
  }
  connectedCallback() {
    var i;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (i = this._$EO) == null || i.forEach((t) => {
      var e;
      return (e = t.hostConnected) == null ? void 0 : e.call(t);
    });
  }
  enableUpdating(i) {
  }
  disconnectedCallback() {
    var i;
    (i = this._$EO) == null || i.forEach((t) => {
      var e;
      return (e = t.hostDisconnected) == null ? void 0 : e.call(t);
    });
  }
  attributeChangedCallback(i, t, e) {
    this._$AK(i, e);
  }
  _$ET(i, t) {
    var o;
    const e = this.constructor.elementProperties.get(i), s = this.constructor._$Eu(i, e);
    if (s !== void 0 && e.reflect === !0) {
      const a = (((o = e.converter) == null ? void 0 : o.toAttribute) !== void 0 ? e.converter : rt).toAttribute(t, e.type);
      this._$Em = i, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(i, t) {
    var o, a;
    const e = this.constructor, s = e._$Eh.get(i);
    if (s !== void 0 && this._$Em !== s) {
      const n = e.getPropertyOptions(s), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((o = n.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? n.converter : rt;
      this._$Em = s, this[s] = r.fromAttribute(t, n.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(s)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(i, t, e) {
    var s;
    if (i !== void 0) {
      const o = this.constructor, a = this[i];
      if (e ?? (e = o.getPropertyOptions(i)), !((e.hasChanged ?? $t)(a, t) || e.useDefault && e.reflect && a === ((s = this._$Ej) == null ? void 0 : s.get(i)) && !this.hasAttribute(o._$Eu(i, e)))) return;
      this.C(i, t, e);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(i, t, { useDefault: e, reflect: s, wrapped: o }, a) {
    e && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(i) && (this._$Ej.set(i, a ?? t ?? this[i]), o !== !0 || a !== void 0) || (this._$AL.has(i) || (this.hasUpdated || e || (t = void 0), this._$AL.set(i, t)), s === !0 && this._$Em !== i && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(i));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const i = this.scheduleUpdate();
    return i != null && await i, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, a] of s) {
        const { wrapped: n } = a, r = this[o];
        n !== !0 || this._$AL.has(o) || r === void 0 || this.C(o, void 0, a, r);
      }
    }
    let i = !1;
    const t = this._$AL;
    try {
      i = this.shouldUpdate(t), i ? (this.willUpdate(t), (e = this._$EO) == null || e.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw i = !1, this._$EM(), s;
    }
    i && this._$AE(t);
  }
  willUpdate(i) {
  }
  _$AE(i) {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostUpdated) == null ? void 0 : s.call(e);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(i)), this.updated(i);
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
  shouldUpdate(i) {
    return !0;
  }
  update(i) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(i) {
  }
  firstUpdated(i) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[W("elementProperties")] = /* @__PURE__ */ new Map(), T[W("finalized")] = /* @__PURE__ */ new Map(), ct == null || ct({ ReactiveElement: T }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, lt = q.trustedTypes, Ct = lt ? lt.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Ht = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, Ft = "?" + S, Kt = `<${Ft}>`, D = document, V = () => D.createComment(""), J = (i) => i === null || typeof i != "object" && typeof i != "function", gt = Array.isArray, pt = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Ot = />/g, M = RegExp(`>|${pt}(?:([^\\s"'>=/]+)(${pt}*=${pt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), kt = /'/g, Pt = /"/g, Nt = /^(?:script|style|textarea|title)$/i, g = /* @__PURE__ */ ((i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }))(1), I = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), Dt = /* @__PURE__ */ new WeakMap(), k = D.createTreeWalker(D, 129);
function It(i, t) {
  if (!gt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ct !== void 0 ? Ct.createHTML(t) : t;
}
const Qt = (i, t) => {
  const e = i.length - 1, s = [];
  let o, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = B;
  for (let r = 0; r < e; r++) {
    const l = i[r];
    let d, c, h = -1, u = 0;
    for (; u < l.length && (n.lastIndex = u, c = n.exec(l), c !== null); ) u = n.lastIndex, n === B ? c[1] === "!--" ? n = Mt : c[1] !== void 0 ? n = Ot : c[2] !== void 0 ? (Nt.test(c[2]) && (o = RegExp("</" + c[2], "g")), n = M) : c[3] !== void 0 && (n = M) : n === M ? c[0] === ">" ? (n = o ?? B, h = -1) : c[1] === void 0 ? h = -2 : (h = n.lastIndex - c[2].length, d = c[1], n = c[3] === void 0 ? M : c[3] === '"' ? Pt : kt) : n === Pt || n === kt ? n = M : n === Mt || n === Ot ? n = B : (n = M, o = void 0);
    const $ = n === M && i[r + 1].startsWith("/>") ? " " : "";
    a += n === B ? l + Kt : h >= 0 ? (s.push(d), l.slice(0, h) + Ht + l.slice(h) + S + $) : l + S + (h === -2 ? r : $);
  }
  return [It(i, a + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class Z {
  constructor({ strings: t, _$litType$: e }, s) {
    let o;
    this.parts = [];
    let a = 0, n = 0;
    const r = t.length - 1, l = this.parts, [d, c] = Qt(t, e);
    if (this.el = Z.createElement(d, s), k.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = k.nextNode()) !== null && l.length < r; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(Ht)) {
          const u = c[n++], $ = o.getAttribute(h).split(S), st = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: a, name: st[2], strings: $, ctor: st[1] === "." ? Yt : st[1] === "?" ? te : st[1] === "@" ? ee : ht }), o.removeAttribute(h);
        } else h.startsWith(S) && (l.push({ type: 6, index: a }), o.removeAttribute(h));
        if (Nt.test(o.tagName)) {
          const h = o.textContent.split(S), u = h.length - 1;
          if (u > 0) {
            o.textContent = lt ? lt.emptyScript : "";
            for (let $ = 0; $ < u; $++) o.append(h[$], V()), k.nextNode(), l.push({ type: 2, index: ++a });
            o.append(h[u], V());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Ft) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(S, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += S.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const s = D.createElement("template");
    return s.innerHTML = t, s;
  }
}
function z(i, t, e = i, s) {
  var n, r;
  if (t === I) return t;
  let o = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const a = J(t) ? void 0 : t._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== a && ((r = o == null ? void 0 : o._$AO) == null || r.call(o, !1), a === void 0 ? o = void 0 : (o = new a(i), o._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = o : e._$Cl = o), o !== void 0 && (t = z(i, o._$AS(i, t.values), o, s)), t;
}
class Xt {
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
    const { el: { content: e }, parts: s } = this._$AD, o = ((t == null ? void 0 : t.creationScope) ?? D).importNode(e, !0);
    k.currentNode = o;
    let a = k.nextNode(), n = 0, r = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new it(a, a.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (d = new ie(a, this, t)), this._$AV.push(d), l = s[++r];
      }
      n !== (l == null ? void 0 : l.index) && (a = k.nextNode(), n++);
    }
    return k.currentNode = D, o;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class it {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, o) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    t = z(this, t, e), J(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== I && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ((s) => gt(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function")(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && J(this._$AH) ? this._$AA.nextSibling.data = t : this.T(D.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: s } = t, o = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = Z.createElement(It(s.h, s.h[0]), this.options)), s);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === o) this._$AH.p(e);
    else {
      const n = new Xt(o, this), r = n.u(this.options);
      n.p(e), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = Dt.get(t.strings);
    return e === void 0 && Dt.set(t.strings, e = new Z(t)), e;
  }
  k(t) {
    gt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, o = 0;
    for (const a of t) o === e.length ? e.push(s = new it(this.O(V()), this.O(V()), this, this.options)) : s = e[o], s._$AI(a), o++;
    o < e.length && (this._$AR(s && s._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const o = t.nextSibling;
      t.remove(), t = o;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class ht {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, o, a) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = m;
  }
  _$AI(t, e = this, s, o) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = z(this, t, e, 0), n = !J(t) || t !== this._$AH && t !== I, n && (this._$AH = t);
    else {
      const r = t;
      let l, d;
      for (t = a[0], l = 0; l < a.length - 1; l++) d = z(this, r[s + l], e, l), d === I && (d = this._$AH[l]), n || (n = !J(d) || d !== this._$AH[l]), d === m ? t = m : t !== m && (t += (d ?? "") + a[l + 1]), this._$AH[l] = d;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Yt extends ht {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class te extends ht {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class ee extends ht {
  constructor(t, e, s, o, a) {
    super(t, e, s, o, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = z(this, t, e, 0) ?? m) === I) return;
    const s = this._$AH, o = t === m && s !== m || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== m && (s === m || o);
    o && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ie {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    z(this, t);
  }
}
const ut = q.litHtmlPolyfillSupport;
ut == null || ut(Z, it), (q.litHtmlVersions ?? (q.litHtmlVersions = [])).push("3.3.0");
const P = globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class C extends T {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ((s, o, a) => {
      const n = (a == null ? void 0 : a.renderBefore) ?? o;
      let r = n._$litPart$;
      if (r === void 0) {
        const l = (a == null ? void 0 : a.renderBefore) ?? null;
        n._$litPart$ = r = new it(o.insertBefore(V(), l), l, void 0, a ?? {});
      }
      return r._$AI(s), r;
    })(e, this.renderRoot, this.renderOptions);
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
    return I;
  }
}
var Rt;
C._$litElement$ = !0, C.finalized = !0, (Rt = P.litElementHydrateSupport) == null || Rt.call(P, { LitElement: C });
const mt = P.litElementPolyfillSupport;
mt == null || mt({ LitElement: C }), (P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
}, se = { attribute: !0, type: String, converter: rt, reflect: !1, hasChanged: $t }, oe = (i = se, t, e) => {
  const { kind: s, metadata: o } = e;
  let a = globalThis.litPropertyMetadata.get(o);
  if (a === void 0 && globalThis.litPropertyMetadata.set(o, a = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), a.set(e.name, i), s === "accessor") {
    const { name: n } = e;
    return { set(r) {
      const l = t.get.call(this);
      t.set.call(this, r), this.requestUpdate(n, l, i);
    }, init(r) {
      return r !== void 0 && this.C(n, void 0, i, r), r;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(r) {
      const l = this[n];
      t.call(this, r), this.requestUpdate(n, l, i);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function A(i) {
  return (t, e) => typeof e == "object" ? oe(i, t, e) : ((s, o, a) => {
    const n = o.hasOwnProperty(a);
    return o.constructor.createProperty(a, s), n ? Object.getOwnPropertyDescriptor(o, a) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(i) {
  return A({ ...i, state: !0, attribute: !1 });
}
const ne = ["ha-form", "ha-icon", "ha-icon-button", "ha-selector", "ha-textfield", "ha-icon-picker", "ha-icon-button", "ha-entity-picker", "ha-select", "ha-dialog", "ha-sortable", "ha-svg-icon", "ha-alert", "ha-button", "ha-color-picker", "ha-badge", "ha-sankey-chart", "mwc-button"], zt = async (i) => {
  var e, s, o, a, n, r;
  const t = i || ne;
  try {
    if (t.every((h) => customElements.get(h))) return;
    await Promise.race([customElements.whenDefined("partial-panel-resolver"), new Promise((h, u) => setTimeout(() => u(new Error("Timeout waiting for partial-panel-resolver")), 1e4))]);
    const l = document.createElement("partial-panel-resolver");
    if (!l) throw new Error("Failed to create partial-panel-resolver element");
    if (l.hass = { panels: [{ url_path: "tmp", component_name: "config" }] }, typeof l._updateRoutes != "function") throw new Error("partial-panel-resolver does not have _updateRoutes method");
    if (l._updateRoutes(), !((o = (s = (e = l.routerOptions) == null ? void 0 : e.routes) == null ? void 0 : s.tmp) != null && o.load)) throw new Error("Failed to create tmp route in partial-panel-resolver");
    await Promise.race([l.routerOptions.routes.tmp.load(), new Promise((h, u) => setTimeout(() => u(new Error("Timeout loading tmp route")), 1e4))]), await Promise.race([customElements.whenDefined("ha-panel-config"), new Promise((h, u) => setTimeout(() => u(new Error("Timeout waiting for ha-panel-config")), 1e4))]);
    const d = document.createElement("ha-panel-config");
    if (!d) throw new Error("Failed to create ha-panel-config element");
    if (!((r = (n = (a = d.routerOptions) == null ? void 0 : a.routes) == null ? void 0 : n.automation) != null && r.load)) throw new Error("ha-panel-config does not have automation route");
    await Promise.race([d.routerOptions.routes.automation.load(), new Promise((h, u) => setTimeout(() => u(new Error("Timeout loading automation components")), 1e4))]);
    const c = t.filter((h) => !customElements.get(h));
    if (c.length > 0) throw new Error(`Failed to load components: ${c.join(", ")}`);
  } catch (l) {
    console.error("Error loading Home Assistant form components:", l);
    try {
      if (window.customElements && window.customElements.get("home-assistant")) {
        console.log("Attempting fallback loading method for HA components");
        const d = new CustomEvent("ha-request-load-components", { detail: { components: t }, bubbles: !0, composed: !0 });
        document.dispatchEvent(d);
      }
    } catch (d) {
      console.error("Fallback loading method failed:", d);
    }
  }
}, ft = { en: { feed_now: "Feed Now", schedule: "Schedule", portion: "Portion", days: "Days", enabled: "Enabled", edit_meal: "Edit Meal", time: "Time", portion_helper: "(1 portion = 6g)", suggested: "Suggested:", back: "Back", save: "Save", status: "Status", actions: "Actions", delete: "Delete", add_meal: "Add Meal", schedules: "Schedules", active_schedules: "Active Schedules", today: "Today", edit_feeding_time: "Edit Feeding Time", manage_schedules: "Manage Schedules", unsaved_changes: "Unsaved changes", unsaved_changes_hint: "You have unsaved changes. Don't forget to save!", days_short: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], days_full: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], avg_week: "Avg/week" }, sv: { feed_now: "Mata nu", schedule: "Schema", portion: "Portion", days: "Dagar", enabled: "Aktiverad", edit_meal: "Redigera måltid", time: "Tid", portion_helper: "(1 portion = 6g)", suggested: "Föreslaget:", back: "Tillbaka", save: "Spara", status: "Status", actions: "Åtgärder", delete: "Ta bort", add_meal: "Lägg till måltid", schedules: "Scheman", active_schedules: "Aktiva scheman", today: "Idag", edit_feeding_time: "Redigera matningstid", manage_schedules: "Hantera scheman", unsaved_changes: "Osparade ändringar", unsaved_changes_hint: "Du har osparade ändringar. Glöm inte att spara!", days_short: ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"], days_full: ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"], avg_week: "Snitt/vecka" } };
let Bt = "en";
function p(i) {
  var t;
  return ((t = ft[Bt]) == null ? void 0 : t[i]) || ft.en[i] || i;
}
var ot = function(i, t, e, s) {
  var o, a = arguments.length, n = a < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(i, t, e, s);
  else for (var r = i.length - 1; r >= 0; r--) (o = i[r]) && (n = (a < 3 ? o(n) : a > 3 ? o(t, e, n) : o(t, e)) || n);
  return a > 3 && n && Object.defineProperty(t, e, n), n;
}, R;
let L = (R = class extends C {
  constructor() {
    super(), this.selectedDaysMask = 0, this.editable = !1;
  }
  _toggleDay(t) {
    if (!this.editable) return;
    const e = this.selectedDaysMask ^ 1 << t;
    this.dispatchEvent(new CustomEvent("days-changed", { detail: { daysMask: e }, bubbles: !0, composed: !0 }));
  }
  render() {
    const t = this.dayLabels && this.dayLabels.length === 7 ? this.dayLabels : ["M", "T", "W", "T", "F", "S", "S"];
    return g`
      <div class="days-row">
        ${t.map((e, s) => g`
          <span
            class="day-cell${this.selectedDaysMask & 1 << s ? " selected" : ""}${this.editable ? "" : " readonly"}"
            @click=${() => this._toggleDay(s)}
          >${e}</span>
        `)}
      </div>
    `;
  }
}, R.styles = vt`
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
ot([A({ type: Number })], L.prototype, "selectedDaysMask", void 0), ot([A({ type: Boolean })], L.prototype, "editable", void 0), ot([A({ type: Array })], L.prototype, "dayLabels", void 0), L = ot([dt("cleverio-day-selector")], L);
var O = function(i, t, e, s) {
  var o, a = arguments.length, n = a < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(i, t, e, s);
  else for (var r = i.length - 1; r >= 0; r--) (o = i[r]) && (n = (a < 3 ? o(n) : a > 3 ? o(t, e, n) : o(t, e)) || n);
  return a > 3 && n && Object.defineProperty(t, e, n), n;
}, U, j, H;
let E = (H = class extends C {
  constructor() {
    super();
    y(this, U);
    y(this, j);
    f(this, U, []), this.viewMeals = [], this.editForm = null, this.editError = null, this.editDialogOpen = !1, this.editIdx = null, f(this, j, !1), this.meals = [], this.viewMeals = [];
  }
  get meals() {
    return _(this, U);
  }
  set meals(e) {
    f(this, U, e);
  }
  get haComponentsReady() {
    return _(this, j);
  }
  set haComponentsReady(e) {
    f(this, j, e);
  }
  async connectedCallback() {
    super.connectedCallback(), await zt(["ha-data-table", "ha-switch", "ha-button", "ha-icon"]), this.haComponentsReady = !0;
  }
  updated(e) {
    e.has("meals") && (this.viewMeals = this.meals.map((s) => ({ ...s })), this.editDialogOpen = !1);
  }
  get _hasUnsavedChanges() {
    return JSON.stringify(this.viewMeals) !== JSON.stringify(this.meals);
  }
  _toggleEnabled(e, s) {
    const o = s.target.checked;
    this.viewMeals = this.viewMeals.map((a, n) => n === e ? { ...a, enabled: o } : a);
  }
  _openEditDialog(e) {
    this.editDialogOpen = !0, this.editIdx = e, this.editForm = { ...this.viewMeals[e] }, this.editError = null;
  }
  _openAddDialog() {
    this.editDialogOpen = !0, this.editIdx = null, this.editForm = { time: "", portion: 1, daysMask: 0, enabled: !0 }, this.editError = null;
  }
  _closeEditDialog() {
    this.editDialogOpen = !1, this.editForm = null;
  }
  _delete(e) {
    this.viewMeals = this.viewMeals.filter((s, o) => o !== e);
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("close-dialog", { bubbles: !0, composed: !0 }));
  }
  _save() {
    this.meals = this.viewMeals.map((e) => ({ ...e })), this.dispatchEvent(new CustomEvent("meals-changed", { detail: { meals: this.viewMeals }, bubbles: !0, composed: !0 }));
  }
  render() {
    var o, a, n;
    if (!this.haComponentsReady) return g`<div>Loading Home Assistant components...</div>`;
    const e = { time: { title: p("time"), sortable: !0, minWidth: "80px" }, portion: { title: p("portion"), sortable: !0, minWidth: "80px" }, days: { title: p("days"), sortable: !1, minWidth: "130px", template: (r) => g`
          <cleverio-day-selector
            .selectedDaysMask=${r.daysMask}
            .editable=${!1}
          ></cleverio-day-selector>
        ` }, enabled: { title: p("enabled"), sortable: !0, minWidth: "60px", template: (r) => g`
          <div style="display: flex; align-items: center; justify-content: center; height: 48px;">
            <ha-switch
              .checked=${r.enabled}
              @change=${(l) => this._toggleEnabled(r._idx, l)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        ` }, actions: { title: p("actions"), sortable: !1, minWidth: "140px", template: (r) => g`
          <ha-icon-button @click=${() => this._openEditDialog(r._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(r._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        ` } }, s = this.viewMeals.map((r, l) => ({ ...r, _idx: l }));
    return g`
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? p("edit_feeding_time") : p("manage_schedules")}>

        ${this.editDialogOpen ? g`
              <form class="edit-form" @submit=${(r) => r.preventDefault()}>
                ${this.editError ? g`<div class="error">${this.editError}</div>` : ""}
                <cleverio-day-selector
                  class="edit-mode"
                  .selectedDaysMask=${((o = this.editForm) == null ? void 0 : o.daysMask) ?? 0}
                  .editable=${!0}
                  @days-changed=${(r) => {
      this.editForm.daysMask = r.detail.daysMask, this.requestUpdate();
    }}
                ></cleverio-day-selector>
                <div class="edit-form-group">
                  <label for="edit-time">${p("time")}</label>
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
                    .value=${((n = this.editForm) == null ? void 0 : n.portion) ?? 1}
                    @input=${(r) => {
      this.editForm.portion = parseInt(r.target.value, 10), this.requestUpdate();
    }}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${["06:00", "08:00", "12:00", "15:00", "18:00", "21:00"].map((r) => g`
                    <ha-button type="button" @click=${() => {
      this.editForm.time = r, this.requestUpdate();
    }}>${r}</ha-button>
                  `)}
                </div>
              </form>
            ` : g`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${p}
                  .columns=${e}
                  .data=${s}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editDialogOpen ? g`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>${p("back")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>${p("save")}</ha-button>
            ` : g`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>${p("add_meal")}</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>${p("cancel")}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>${p("save")}</ha-button>
            `}
      </ha-dialog>
    `;
  }
  _onEditSave(e) {
    e && e.preventDefault(), this.editForm && (this.editForm.time && /^[0-2]\d:[0-5]\d$/.test(this.editForm.time) ? !this.editForm.portion || this.editForm.portion < 1 ? this.editError = "Portion must be at least 1." : (this.editError = null, this.editIdx !== null ? this.viewMeals = this.viewMeals.map((s, o) => o === this.editIdx ? { ...this.editForm } : s) : this.viewMeals = [...this.viewMeals, { ...this.editForm }], this._closeEditDialog()) : this.editError = "Please enter a valid time.");
  }
}, U = new WeakMap(), j = new WeakMap(), H.styles = [vt`
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
    `], H);
O([A({ type: Array })], E.prototype, "meals", null), O([w()], E.prototype, "viewMeals", void 0), O([w()], E.prototype, "editForm", void 0), O([w()], E.prototype, "editError", void 0), O([w()], E.prototype, "editDialogOpen", void 0), O([A({ type: Boolean })], E.prototype, "haComponentsReady", null), E = O([dt("cleverio-schedule-view")], E);
var b = function(i, t, e, s) {
  var o, a = arguments.length, n = a < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(i, t, e, s);
  else for (var r = i.length - 1; r >= 0; r--) (o = i[r]) && (n = (a < 3 ? o(n) : a > 3 ? o(t, e, n) : o(t, e)) || n);
  return a > 3 && n && Object.defineProperty(t, e, n), n;
}, G, K, Q, X, Y, tt, F, N;
let v = (N = class extends C {
  constructor() {
    super();
    y(this, G);
    y(this, K);
    y(this, Q);
    y(this, X);
    y(this, Y);
    y(this, tt);
    y(this, F);
    this._haComponentsReady = !1, f(this, F, []), this.footerButtonsTemplate = null, this._meals = [], this._persistedMeals = [], this._dialogOpen = !1, this._dialogData = void 0;
  }
  get hass() {
    return _(this, G);
  }
  set hass(e) {
    f(this, G, e);
  }
  get config() {
    return _(this, K);
  }
  set config(e) {
    f(this, K, e);
  }
  get _meals() {
    return _(this, Q);
  }
  set _meals(e) {
    f(this, Q, e);
  }
  get _persistedMeals() {
    return _(this, X);
  }
  set _persistedMeals(e) {
    f(this, X, e);
  }
  get _dialogOpen() {
    return _(this, Y);
  }
  set _dialogOpen(e) {
    f(this, Y, e);
  }
  get _dialogData() {
    return _(this, tt);
  }
  set _dialogData(e) {
    f(this, tt, e);
  }
  get _footerButtons() {
    return _(this, F);
  }
  set _footerButtons(e) {
    f(this, F, e);
  }
  setConfig(e) {
    this.config = e, this._checkConfig(), this._updateConfig();
  }
  updated(e) {
    e.has("hass") && this._updateHass();
  }
  async connectedCallback() {
    var e;
    console.log("What language", this.hass.language), await (e = this.hass.language, void (Bt = ft[e] ? e : "en")), await zt(["ha-button", "ha-data-table"]), this._haComponentsReady = !0, super.connectedCallback();
  }
  get _sensorID() {
    var e;
    return (e = this.config) == null ? void 0 : e.sensor;
  }
  get _stateObj() {
    var e, s;
    return (s = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : s[this._sensorID];
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
    if (!((e = this.config) != null && e.sensor)) throw new Error("Please define a sensor!");
  }
  _updateConfig() {
  }
  _updateHass() {
    const e = this._stateObj;
    let s;
    if (e) try {
      s = function(o) {
        if (!o || o === "unknown") return [];
        let a;
        try {
          a = atob(o);
        } catch {
          throw new Error("Invalid base64");
        }
        const n = new Uint8Array([...a].map((l) => l.charCodeAt(0)));
        if (n.length % 5 != 0) throw new Error("Invalid meal plan length");
        const r = [];
        for (let l = 0; l < n.length; l += 5) {
          const [d, c, h, u, $] = n.slice(l, l + 5);
          r.push({ time: `${c.toString().padStart(2, "0")}:${h.toString().padStart(2, "0")}`, daysMask: d, portion: u || 1, enabled: $ === 1 });
        }
        return r;
      }(e.state), Array.isArray(s) && (this._persistedMeals = s);
    } catch (o) {
      console.error("Failed to decode meal plan:", o);
    }
    Array.isArray(this._persistedMeals) ? this._meals = JSON.parse(JSON.stringify(this._persistedMeals)) : (this._persistedMeals = [], this._meals = []);
  }
  render() {
    var e;
    return this._haComponentsReady ? g`
      <ha-card header=${((e = this.config) == null ? void 0 : e.title) || "Cleverio Pet Feeder"} style="height: 100%;">
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${p("schedules")}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${p("active_schedules")}: <span style="white-space:nowrap;">${this._meals.filter((s) => s.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${p("today")}: <span style="white-space:nowrap;">${6 * function(s, o) {
      let a = 0;
      return s.forEach((n) => {
        n.enabled && n.daysMask & 1 << o && (a += n.portion);
      }), a;
    }(this._meals.filter((s) => s.enabled), (/* @__PURE__ */ new Date()).getDay())}g</span>
          </ha-chip>
          <ha-chip class="overview-average">
            <ha-icon icon="mdi:scale-balance"></ha-icon>
            ${p("avg_week")}: <span style="white-space:nowrap;">
              ${(6 * (function(a) {
      const n = Array(7).fill(0);
      return a.forEach((r) => {
        if (r.enabled) for (let l = 0; l < 7; l++) r.daysMask & 1 << l && (n[l] += r.portion);
      }), n;
    }(this._meals.filter((a) => a.enabled)).reduce((a, n) => a + n, 0) / 7)).toFixed(1)}g
            </span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => {
      this._dialogOpen = !0;
    }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${p("manage_schedules")}
          </ha-button>
        </div>
        ${this._dialogOpen ? g`
              <cleverio-schedule-view
                .meals=${this._meals}
                .localize=${p}
                @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                @footer-buttons-changed=${this._onFooterButtonsChanged.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            ` : ""}
        <slot></slot>
      </ha-card>
    ` : g`<div>Loading Home Assistant components...</div>`;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ae), document.createElement("cleverio-card-editor");
  }
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID) return;
    const e = function(s) {
      const o = [];
      return s.forEach((a) => {
        const [n, r] = a.time.split(":").map(Number);
        o.push(a.daysMask, n, r, Number(a.portion), a.enabled ? 1 : 0);
      }), btoa(String.fromCharCode(...o));
    }(this._meals);
    this.hass.callService("text", "set_value", { entity_id: this._sensorID, value: e });
  }
  _onScheduleMealsChanged(e) {
    this._dialogOpen = !1, this._meals = e.detail.meals, this._saveMealsToSensor();
  }
  _onDialogClose() {
    this._dialogOpen = !1;
  }
  _onFooterButtonsChanged(e) {
    this.footerButtonsTemplate = e.detail.template;
  }
}, G = new WeakMap(), K = new WeakMap(), Q = new WeakMap(), X = new WeakMap(), Y = new WeakMap(), tt = new WeakMap(), F = new WeakMap(), N.styles = [vt`
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
    `], N);
b([A({ type: Object })], v.prototype, "hass", null), b([A({ type: Object })], v.prototype, "config", null), b([w()], v.prototype, "_meals", null), b([w()], v.prototype, "_persistedMeals", null), b([w()], v.prototype, "_dialogOpen", null), b([w()], v.prototype, "_dialogData", null), b([A({ type: Boolean })], v.prototype, "_haComponentsReady", void 0), b([w()], v.prototype, "_footerButtons", null), b([w()], v.prototype, "footerButtonsTemplate", void 0), v = b([dt("cleverio-pf100-card")], v);
var Tt = function(i, t, e, s) {
  var o, a = arguments.length, n = a < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, e) : s;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(i, t, e, s);
  else for (var r = i.length - 1; r >= 0; r--) (o = i[r]) && (n = (a < 3 ? o(n) : a > 3 ? o(t, e, n) : o(t, e)) || n);
  return a > 3 && n && Object.defineProperty(t, e, n), n;
}, et, Ut;
let at = (Ut = class extends C {
  constructor() {
    super(...arguments);
    y(this, et, { sensor: "", title: "" });
  }
  get config() {
    return _(this, et);
  }
  set config(t) {
    f(this, et, t);
  }
  setConfig(t) {
    this.config = { ...t };
  }
  _onInput(t) {
    const { name: e, value: s } = t.target;
    this.config = { ...this.config, [e]: s }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }
  render() {
    return g`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ""} @input=${this._onInput} /></label>
      <label>Title:
        <input name="title" .value=${this.config.title || ""} @input=${this._onInput} /></label>
    `;
  }
}, et = new WeakMap(), Ut);
Tt([A({ attribute: !1 })], at.prototype, "config", null), at = Tt([dt("cleverio-card-editor")], at), window.customCards = window.customCards || [], window.customCards.push({ type: "cleverio-pf100-card", name: "Cleverio Feeder Card", preview: !1, description: "Cleverio PF100 feeder card to decode/encode base64 meal_plan" });
const ae = Object.freeze(Object.defineProperty({ __proto__: null, get CleverioCardEditor() {
  return at;
} }, Symbol.toStringTag, { value: "Module" }));
export {
  v as CleverioPf100Card
};
