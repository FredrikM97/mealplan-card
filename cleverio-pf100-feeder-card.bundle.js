var Ge=Object.create;var ht=Object.defineProperty;var Qe=Object.getOwnPropertyDescriptor;var Lt=(r,t)=>(t=Symbol[r])?t:Symbol.for("Symbol."+r),Q=r=>{throw TypeError(r)};var Bt=(r,t,e)=>t in r?ht(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var qt=(r,t)=>ht(r,"name",{value:t,configurable:!0});var f=(r,t)=>()=>(r&&(t=r(r=0)),t);var Xe=(r,t)=>{for(var e in t)ht(r,e,{get:t[e],enumerable:!0})};var T=r=>[,,,Ge(r?.[Lt("metadata")]??null)],Ft=["class","method","getter","setter","accessor","field","value","get","set"],G=r=>r!==void 0&&typeof r!="function"?Q("Function expected"):r,Ve=(r,t,e,s,o)=>({kind:Ft[r],name:t,metadata:s,addInitializer:i=>e._?Q("Already initialized"):o.push(G(i||null))}),C=(r,t)=>Bt(t,Lt("metadata"),r[3]),d=(r,t,e,s)=>{for(var o=0,i=r[t>>1],a=i&&i.length;o<a;o++)t&1?i[o].call(e):s=i[o].call(e,s);return s},u=(r,t,e,s,o,i)=>{var a,c,l,p,g,n=t&7,x=!!(t&8),b=!!(t&16),O=n>3?r.length+1:n?x?1:2:0,Ht=Ft[n+5],Rt=n>3&&(r[O-1]=[]),Ze=r[O]||(r[O]=[]),k=n&&(!b&&!x&&(o=o.prototype),n<5&&(n>3||!b)&&Qe(n<4?o:{get[e](){return zt(this,i)},set[e](A){return It(this,i,A)}},e));n?b&&n<4&&qt(i,(n>2?"set ":n>1?"get ":"")+e):qt(o,e);for(var _t=s.length-1;_t>=0;_t--)p=Ve(n,e,l={},r[3],Ze),n&&(p.static=x,p.private=b,g=p.access={has:b?A=>ts(o,A):A=>e in A},n^3&&(g.get=b?A=>(n^1?zt:es)(A,o,n^4?i:k.get):A=>A[e]),n>2&&(g.set=b?(A,$t)=>It(A,o,$t,n^4?i:k.set):(A,$t)=>A[e]=$t)),c=(0,s[_t])(n?n<4?b?i:k[Ht]:n>4?void 0:{get:k.get,set:k.set}:o,p),l._=1,n^4||c===void 0?G(c)&&(n>4?Rt.unshift(c):n?b?i=c:k[Ht]=c:o=c):typeof c!="object"||c===null?Q("Object expected"):(G(a=c.get)&&(k.get=a),G(a=c.set)&&(k.set=a),G(a=c.init)&&Rt.unshift(a));return n||C(r,o),k&&ht(o,e,k),b?n^4?i:k:o},h=(r,t,e)=>Bt(r,typeof t!="symbol"?t+"":t,e),xt=(r,t,e)=>t.has(r)||Q("Cannot "+e),ts=(r,t)=>Object(t)!==t?Q('Cannot use the "in" operator on this value'):r.has(t),zt=(r,t,e)=>(xt(r,t,"read from private field"),e?e.call(r):t.get(r));var It=(r,t,e,s)=>(xt(r,t,"write to private field"),s?s.call(r,e):t.set(r,e),e),es=(r,t,e)=>(xt(r,t,"access private method"),e);var pt,ut,At,Wt,X,Jt,U,Kt,wt,St=f(()=>{pt=globalThis,ut=pt.ShadowRoot&&(pt.ShadyCSS===void 0||pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,At=Symbol(),Wt=new WeakMap,X=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==At)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ut&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Wt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Wt.set(e,t))}return t}toString(){return this.cssText}},Jt=r=>new X(typeof r=="string"?r:r+"",void 0,At),U=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,o,i)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+r[i+1],r[0]);return new X(e,r,At)},Kt=(r,t)=>{if(ut)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),o=pt.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=e.cssText,r.appendChild(s)}},wt=ut?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Jt(e)})(r):r});var ss,rs,os,is,as,ns,D,Yt,ls,ds,V,tt,mt,Zt,P,et=f(()=>{St();St();({is:ss,defineProperty:rs,getOwnPropertyDescriptor:os,getOwnPropertyNames:is,getOwnPropertySymbols:as,getPrototypeOf:ns}=Object),D=globalThis,Yt=D.trustedTypes,ls=Yt?Yt.emptyScript:"",ds=D.reactiveElementPolyfillSupport,V=(r,t)=>r,tt={toAttribute(r,t){switch(t){case Boolean:r=r?ls:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},mt=(r,t)=>!ss(r,t),Zt={attribute:!0,type:String,converter:tt,reflect:!1,useDefault:!1,hasChanged:mt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),D.litPropertyMetadata??(D.litPropertyMetadata=new WeakMap);P=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Zt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),o=this.getPropertyDescriptor(t,s,e);o!==void 0&&rs(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){let{get:o,set:i}=os(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:o,set(a){let c=o?.call(this);i?.call(this,a),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Zt}static _$Ei(){if(this.hasOwnProperty(V("elementProperties")))return;let t=ns(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(V("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(V("properties"))){let e=this.properties,s=[...is(e),...as(e)];for(let o of s)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,o]of e)this.elementProperties.set(s,o)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let o=this._$Eu(e,s);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let o of s)e.unshift(wt(o))}else t!==void 0&&e.push(wt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Kt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:tt).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=s.getPropertyOptions(o),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:tt;this._$Em=o,this[o]=a.fromAttribute(e,i.type)??this._$Ej?.get(o)??null,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){let o=this.constructor,i=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??mt)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:i},a){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??e??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[o,i]of s){let{wrapped:a}=i,c=this[o];a!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,i,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[V("elementProperties")]=new Map,P[V("finalized")]=new Map,ds?.({ReactiveElement:P}),(D.reactiveElementVersions??(D.reactiveElementVersions=[])).push("2.1.0")});function ie(r,t){if(!Pt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Gt!==void 0?Gt.createHTML(t):t}function W(r,t,e=r,s){if(t===I)return t;let o=s!==void 0?e._$Co?.[s]:e._$Cl,i=it(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(r),o._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=W(r,o._$AS(r,t.values),o,s)),t}var rt,gt,Gt,se,N,re,cs,z,ot,it,Pt,hs,Et,st,Qt,Xt,R,Vt,te,oe,Ot,v,ks,Ms,I,y,ee,q,ps,at,kt,nt,J,Mt,Tt,Ut,Ct,us,ae,bt=f(()=>{rt=globalThis,gt=rt.trustedTypes,Gt=gt?gt.createPolicy("lit-html",{createHTML:r=>r}):void 0,se="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,re="?"+N,cs=`<${re}>`,z=document,ot=()=>z.createComment(""),it=r=>r===null||typeof r!="object"&&typeof r!="function",Pt=Array.isArray,hs=r=>Pt(r)||typeof r?.[Symbol.iterator]=="function",Et=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qt=/-->/g,Xt=/>/g,R=RegExp(`>|${Et}(?:([^\\s"'>=/]+)(${Et}*=${Et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vt=/'/g,te=/"/g,oe=/^(?:script|style|textarea|title)$/i,Ot=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),v=Ot(1),ks=Ot(2),Ms=Ot(3),I=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),ee=new WeakMap,q=z.createTreeWalker(z,129);ps=(r,t)=>{let e=r.length-1,s=[],o,i=t===2?"<svg>":t===3?"<math>":"",a=st;for(let c=0;c<e;c++){let l=r[c],p,g,n=-1,x=0;for(;x<l.length&&(a.lastIndex=x,g=a.exec(l),g!==null);)x=a.lastIndex,a===st?g[1]==="!--"?a=Qt:g[1]!==void 0?a=Xt:g[2]!==void 0?(oe.test(g[2])&&(o=RegExp("</"+g[2],"g")),a=R):g[3]!==void 0&&(a=R):a===R?g[0]===">"?(a=o??st,n=-1):g[1]===void 0?n=-2:(n=a.lastIndex-g[2].length,p=g[1],a=g[3]===void 0?R:g[3]==='"'?te:Vt):a===te||a===Vt?a=R:a===Qt||a===Xt?a=st:(a=R,o=void 0);let b=a===R&&r[c+1].startsWith("/>")?" ":"";i+=a===st?l+cs:n>=0?(s.push(p),l.slice(0,n)+se+l.slice(n)+N+b):l+N+(n===-2?c:b)}return[ie(r,i+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},at=class r{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let i=0,a=0,c=t.length-1,l=this.parts,[p,g]=ps(t,e);if(this.el=r.createElement(p,s),q.currentNode=this.el.content,e===2||e===3){let n=this.el.content.firstChild;n.replaceWith(...n.childNodes)}for(;(o=q.nextNode())!==null&&l.length<c;){if(o.nodeType===1){if(o.hasAttributes())for(let n of o.getAttributeNames())if(n.endsWith(se)){let x=g[a++],b=o.getAttribute(n).split(N),O=/([.?@])?(.*)/.exec(x);l.push({type:1,index:i,name:O[2],strings:b,ctor:O[1]==="."?Mt:O[1]==="?"?Tt:O[1]==="@"?Ut:J}),o.removeAttribute(n)}else n.startsWith(N)&&(l.push({type:6,index:i}),o.removeAttribute(n));if(oe.test(o.tagName)){let n=o.textContent.split(N),x=n.length-1;if(x>0){o.textContent=gt?gt.emptyScript:"";for(let b=0;b<x;b++)o.append(n[b],ot()),q.nextNode(),l.push({type:2,index:++i});o.append(n[x],ot())}}}else if(o.nodeType===8)if(o.data===re)l.push({type:2,index:i});else{let n=-1;for(;(n=o.data.indexOf(N,n+1))!==-1;)l.push({type:7,index:i}),n+=N.length-1}i++}}static createElement(t,e){let s=z.createElement("template");return s.innerHTML=t,s}};kt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??z).importNode(e,!0);q.currentNode=o;let i=q.nextNode(),a=0,c=0,l=s[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new nt(i,i.nextSibling,this,t):l.type===1?p=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(p=new Ct(i,this,t)),this._$AV.push(p),l=s[++c]}a!==l?.index&&(i=q.nextNode(),a++)}return q.currentNode=z,o}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},nt=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=W(this,t,e),it(t)?t===y||t==null||t===""?(this._$AH!==y&&this._$AR(),this._$AH=y):t!==this._$AH&&t!==I&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):hs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==y&&it(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=at.createElement(ie(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new kt(o,this),a=i.u(this.options);i.p(e),this.T(a),this._$AH=i}}_$AC(t){let e=ee.get(t.strings);return e===void 0&&ee.set(t.strings,e=new at(t)),e}k(t){Pt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,o=0;for(let i of t)o===e.length?e.push(s=new r(this.O(ot()),this.O(ot()),this,this.options)):s=e[o],s._$AI(i),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},J=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,i){this.type=1,this._$AH=y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=y}_$AI(t,e=this,s,o){let i=this.strings,a=!1;if(i===void 0)t=W(this,t,e,0),a=!it(t)||t!==this._$AH&&t!==I,a&&(this._$AH=t);else{let c=t,l,p;for(t=i[0],l=0;l<i.length-1;l++)p=W(this,c[s+l],e,l),p===I&&(p=this._$AH[l]),a||(a=!it(p)||p!==this._$AH[l]),p===y?t=y:t!==y&&(t+=(p??"")+i[l+1]),this._$AH[l]=p}a&&!o&&this.j(t)}j(t){t===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Mt=class extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===y?void 0:t}},Tt=class extends J{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==y)}},Ut=class extends J{constructor(t,e,s,o,i){super(t,e,s,o,i),this.type=5}_$AI(t,e=this){if((t=W(this,t,e,0)??y)===I)return;let s=this._$AH,o=t===y&&s!==y||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==y&&(s===y||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Ct=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){W(this,t)}},us=rt.litHtmlPolyfillSupport;us?.(at,nt),(rt.litHtmlVersions??(rt.litHtmlVersions=[])).push("3.3.0");ae=(r,t,e)=>{let s=e?.renderBefore??t,o=s._$litPart$;if(o===void 0){let i=e?.renderBefore??null;s._$litPart$=o=new nt(t.insertBefore(ot(),i),i,void 0,e??{})}return o._$AI(r),o}});var lt,_,ms,ne=f(()=>{et();et();bt();bt();lt=globalThis,_=class extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ae(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}};_._$litElement$=!0,_.finalized=!0,lt.litElementHydrateSupport?.({LitElement:_});ms=lt.litElementPolyfillSupport;ms?.({LitElement:_});(lt.litElementVersions??(lt.litElementVersions=[])).push("4.2.0")});var le=f(()=>{});var L=f(()=>{et();bt();ne();le()});var de,ce=f(()=>{de=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)}});function $(r){return(t,e)=>typeof e=="object"?bs(r,t,e):((s,o,i)=>{let a=o.hasOwnProperty(i);return o.constructor.createProperty(i,s),a?Object.getOwnPropertyDescriptor(o,i):void 0})(r,t,e)}var gs,bs,Dt=f(()=>{et();gs={attribute:!0,type:String,converter:tt,reflect:!1,hasChanged:mt},bs=(r=gs,t,e)=>{let{kind:s,metadata:o}=e,i=globalThis.litPropertyMetadata.get(o);if(i===void 0&&globalThis.litPropertyMetadata.set(o,i=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),i.set(e.name,r),s==="accessor"){let{name:a}=e;return{set(c){let l=t.get.call(this);t.set.call(this,c),this.requestUpdate(a,l,r)},init(c){return c!==void 0&&this.C(a,void 0,r,c),c}}}if(s==="setter"){let{name:a}=e;return function(c){let l=this[a];t.call(this,c),this.requestUpdate(a,l,r)}}throw Error("Unsupported decorator location: "+s)}});function w(r){return $({...r,state:!0,attribute:!1})}var he=f(()=>{Dt();});var pe=f(()=>{});var K=f(()=>{});var ue=f(()=>{K();});var me=f(()=>{K();});var ge=f(()=>{K();});var be=f(()=>{K();});var fe=f(()=>{K();});var Y=f(()=>{ce();Dt();he();pe();ue();me();ge();be();fe()});var qe={};Xe(qe,{CleverioPf100CardEditor:()=>ct});var He,Re,vt,ct,ze=f(()=>{L();Y();ct=class extends(Re=_,He=[$({type:Object})],Re){constructor(){super(...arguments);h(this,"config",d(vt,8,this,{sensor:"",title:""})),d(vt,11,this)}setConfig(e){this.config={...e}}_onInput(e){let{name:s,value:o}=e.target;this.config={...this.config,[s]:o},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config}}))}render(){return v`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor||""} @input=${this._onInput} />
      </label>
      <label>Title:
        <input name="title" .value=${this.config.title||""} @input=${this._onInput} />
      </label>
    `}};vt=T(Re),u(vt,5,"config",He,ct),C(vt,ct)});L();Y();function Nt(r){let t={Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,Saturday:0,Sunday:0};return r.forEach(e=>{if(e.enabled){for(let s=0;s<7;s++)if(e.daysMask&1<<s){let o=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][s];t[o]+=e.portion}}}),t}function ye(r,t){let e=0;return r.forEach(s=>{s.enabled&&s.daysMask&1<<["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(t)&&(e+=s.portion)}),e}function ve(r){let t=r.map(e=>`${e.time},${e.portion},${e.daysMask},${e.enabled?1:0}`).join(";");return btoa(t)}function _e(r){try{return atob(r).split(";").filter(Boolean).map(e=>{let[s,o,i,a]=e.split(",");return{time:s,portion:Number(o),daysMask:Number(i),enabled:a==="1"}})}catch{throw new Error("Invalid base64")}}function dt(r,t){return!Array.isArray(r)||!Array.isArray(t)||r.length!==t.length?!1:r.every((e,s)=>e.time===t[s].time&&e.portion===t[s].portion&&e.daysMask===t[s].daysMask&&e.enabled===t[s].enabled)}L();Y();L();var Z=U`
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
`,$e=U`
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
`;L();Y();var jt=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],ys={Monday:"Mon",Tuesday:"Tue",Wednesday:"Wed",Thursday:"Thu",Friday:"Fri",Saturday:"Sat",Sunday:"Sun"};function vs(r){return r.reduce((t,e)=>t|Ae(e),0)}function xe(r){return jt.filter((t,e)=>(r&1<<e)!==0)}function Ae(r){return 1<<jt.indexOf(r)}function _s(){return["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Monday"]}function $s(r){if(r===31)return"Weekdays";if(r===96)return"Weekend";if(r===127)return"Every day";let t=xe(r);return t.length===1?t[0]:t.length===0?"":t.map(e=>ys[e]).join(", ")}var yt={DAYS:jt,daysArrayToBitmask:vs,bitmaskToDaysArray:xe,getDayBit:Ae,getUIDays:_s,getDaysLabel:$s};L();Y();var we,Se,Ee,ke,Me,S,j=class extends(Me=_,ke=[$({type:Object})],Ee=[w()],Se=[w()],we=[w()],Me){constructor(){super(...arguments);h(this,"meal",d(S,8,this,{time:"",portion:1,daysMask:0,enabled:!0})),d(S,11,this);h(this,"_time",d(S,12,this,"")),d(S,15,this);h(this,"_portion",d(S,16,this,1)),d(S,19,this);h(this,"_daysMask",d(S,20,this,0)),d(S,23,this)}updated(e){e.has("meal")&&this.meal&&(this._time=this.meal.time||"",this._portion=this.meal.portion||1,this._daysMask=this.meal.daysMask||0)}render(){return v`
      <form class="edit-form" @submit=${this._onSave}>
        <h3 class="edit-title" style="margin-top:0; text-align:left;">Edit Meal</h3>
        <div class="edit-days-row" style="justify-content:flex-start;">
          ${yt.DAYS.map((e,s)=>v`
            <ha-button outlined class="day-btn${this._daysMask&1<<s?" selected":""}" @click=${o=>this._toggleDay(o,s)}>${e.slice(0,2)}</ha-button>
          `)}
        </div>
        <div class="edit-fields-row">
          <label>Time:
            <ha-textfield class="edit-time" type="time" required .value=${this._time} @input=${e=>this._time=e.target.value}></ha-textfield>
          </label>
        </div>
        <div class="edit-portion-row">
          <label style="position:relative; display:block;">
            <span style="display:flex; align-items:center; gap:0.5em;">
              Portion:
              <span class="portion-helper-inline">(1 portion = 6g)</span>
            </span>
            <ha-textfield class="edit-portion" type="number" min="1" required .value=${this._portion} @input=${e=>this._portion=Number(e.target.value)}></ha-textfield>
          </label>
        </div>
        <span class="suggested-label">Suggested:</span>
        <div class="suggested-times-btn-row">
          ${["07:00","12:00","18:00"].map(e=>v`<ha-button outlined class="suggested-time-btn" @click=${s=>this._suggestTime(s,e)}>${e}</ha-button>`)}
        </div>
        <div class="edit-divider"></div>
        <menu>
          <ha-button class="back-to-list-btn" @click=${this._onBack}>Back</ha-button>
          <ha-button class="edit-save-btn" type="submit">Save</ha-button>
        </menu>
      </form>
    `}_toggleDay(e,s){e.preventDefault(),this._daysMask^=1<<s}_suggestTime(e,s){e.preventDefault(),this._time=s}_onBack(e){e.preventDefault(),this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_onSave(e){e.preventDefault();let s={...this.meal,time:this._time,portion:this._portion,daysMask:this._daysMask,enabled:!0};this.dispatchEvent(new CustomEvent("save",{detail:{meal:s},bubbles:!0,composed:!0}))}};S=T(Me),u(S,5,"meal",ke,j),u(S,5,"_time",Ee,j),u(S,5,"_portion",Se,j),u(S,5,"_daysMask",we,j),C(S,j),h(j,"styles",[Z,U`
      .edit-form {
        max-width: 320px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--ha-card-section-margin, 1em);
        border: none;
        background: none;
        border-radius: 0;
      }
      .edit-title {
        margin-bottom: 0.2em;
        font-size: 1.2em;
        font-weight: bold;
        color: var(--primary-text-color);
        text-align: left;
      }
      .edit-days-row {
        display: flex;
        gap: 0.5em;
        justify-content: flex-start;
        margin-bottom: 0.5em;
      }
      .day-btn {
        width: 2.4em;
        height: 2.4em;
        min-width: 2.4em;
        min-height: 2.4em;
        border-radius: 50%;
        border: 2px solid var(--divider-color, #888);
        background: var(--card-background-color, #eee);
        color: var(--primary-text-color);
        font-weight: bold;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
        margin-bottom: 0;
        position: relative;
        box-sizing: border-box;
      }
      .day-btn.selected {
        background: var(--primary-color);
        color: var(--text-primary-color);
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px #2196f344;
      }
      .day-check { display: none !important; }
      .edit-fields-row {
        display: flex;
        gap: 1em;
        align-items: flex-end;
        margin-bottom: 0.2em;
      }
      .edit-portion-row {
        margin-bottom: 0.7em;
      }
      .edit-fields-row label,
      .edit-portion-row label {
        max-width: 10em;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.2em;
        position: relative;
      }
      ha-textfield[type="time"],
      ha-textfield[type="number"] {
        max-width: 10em;
        width: 100%;
        height: 2.4em;
        border-radius: var(--ha-card-border-radius, 8px);
        border: 1.5px solid var(--divider-color, #ccc);
        background: var(--input-background-color, var(--card-background-color, #fff));
        color: var(--primary-text-color);
        font-size: 1em;
        padding: 0 0.7em;
        box-sizing: border-box;
        outline: none;
        transition: border 0.2s, background 0.2s;
      }
      ha-textfield[type="time"]:focus,
      ha-textfield[type="number"]:focus {
        border: 1.5px solid var(--primary-color);
        background: var(--input-background-color, var(--ha-card-background));
      }
      .edit-portion { width: 100%; min-width: 0; }
      .portion-helper { display: none; }
      .portion-helper-inline {
        font-size: 0.95em;
        color: var(--secondary-text-color, #888);
        line-height: 1.2;
        white-space: nowrap;
        pointer-events: none;
      }
      .suggested-label {
        color: var(--secondary-text-color, #888);
        font-size: 0.97em;
        margin-left: 0.2em;
        margin-bottom: 0.2em;
        display: block;
      }
      .suggested-times-btn-row {
        display: flex;
        gap: 0.5em;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 1em;
        margin-left: 0.2em;
      }
      ha-button.suggested-time-btn {
        border-radius: var(--ha-card-border-radius, 8px);
        border: 2px solid var(--divider-color, #888);
        background: var(--card-background-color, #eee);
        color: var(--primary-text-color);
        font-weight: bold;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        padding: 0 1.1em;
        min-width: 3.2em;
        height: 2.2em;
      }
      ha-button.suggested-time-btn:active, ha-button.suggested-time-btn:focus {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: var(--text-primary-color);
      }
      menu { display: flex; gap: 1em; justify-content: flex-end; margin-top: 1em; }
      ha-button.edit-save-btn, ha-button.back-to-list-btn {
        border-radius: var(--ha-card-border-radius, 8px);
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        font-weight: 500;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        padding: var(--ha-card-button-padding, 0.5em 1em);
      }
    `]);var Te,Ue,Ce,Pe,Oe,E,H=class extends(Oe=_,Pe=[$({type:Array})],Ce=[w()],Ue=[w()],Te=[w()],Oe){constructor(){super(...arguments);h(this,"meals",d(E,8,this,[])),d(E,11,this);h(this,"_localMeals",d(E,12,this,[])),d(E,15,this);h(this,"_view",d(E,16,this,"table")),d(E,19,this);h(this,"_editIdx",d(E,20,this,null)),d(E,23,this)}updated(e){e.has("meals")&&(this._localMeals=this.meals.map(s=>({...s})),this._view="table",this._editIdx=null)}render(){return this._view==="edit"?this._renderEditView():v`
      <div class="schedules-view ha-card-style">
        <h3 class="schedules-title">Scheduled Meals</h3>
        <table class="popup-meal-table ha-table-style">
          <thead>
            <tr>
              <th>Time</th>
              <th>Portion</th>
              <th>Days</th>
              <th>Enabled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this._localMeals.length===0?v`<tr><td colspan="5" style="text-align:center;color:#888;">No schedules yet</td></tr>`:this._localMeals.map((e,s)=>v`
                  <tr>
                    <td>${e.time}</td>
                    <td>${e.portion}</td>
                    <td>${yt.getDaysLabel(e.daysMask||0)}</td>
                    <td><ha-checkbox class="enabled-checkbox" .checked=${e.enabled} @change=${o=>this._toggleEnabled(s,o)}></ha-checkbox></td>
                    <td><span class="action-btns">
                      <button type="button" class="edit-row-btn icon-btn" @click=${()=>this._edit(s)} aria-label="Edit schedule">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                      </button>
                      <button type="button" class="delete-row-btn icon-btn" @click=${()=>this._delete(s)} aria-label="Delete schedule">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </span></td>
                  </tr>
                `)}
          </tbody>
        </table>
        <div class="popup-actions-row">
          <button class="add-schema-btn" @click=${this._add}>Add schedule</button>
          <button class="cancel-btn" @click=${this._cancel}>Cancel</button>
          <button class="save-btn" @click=${this._save} .disabled=${dt(this._localMeals,this.meals)} style=${dt(this._localMeals,this.meals)?"":"background: var(--error-color, #e53935); color: var(--text-primary-color, #fff); box-shadow: 0 0 0 2px var(--error-color, #e53935)33;"}>Save</button>
        </div>
        <div class="save-helper" style="color:${dt(this._localMeals,this.meals)?"var(--secondary-text-color, #888)":"var(--error-color, #e53935)"};">
          ${dt(this._localMeals,this.meals)?"No changes to save.":"You have unsaved changes."}
        </div>
      </div>
    `}_toggleEnabled(e,s){this._localMeals[e].enabled=s.target.checked,this.requestUpdate()}_edit(e){this._editIdx=e,this._view="edit",this.requestUpdate()}_delete(e){this._localMeals.splice(e,1),this.requestUpdate()}_add(){this._editIdx=null,this._view="edit",this.requestUpdate()}_cancel(){this.dispatchEvent(new CustomEvent("close-dialog",{bubbles:!0,composed:!0}))}_save(){this.dispatchEvent(new CustomEvent("meals-changed",{detail:{meals:this._localMeals},bubbles:!0,composed:!0}))}_renderEditView(){let e=this._editIdx!=null?this._localMeals[this._editIdx]:{time:"",portion:1,daysMask:0,enabled:!0};return v`
      <cleverio-edit-view
        .meal=${e}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></cleverio-edit-view>
    `}_onEditSave(e){let s=e.detail.meal;this._editIdx!=null?this._localMeals[this._editIdx]=s:this._localMeals=[...this._localMeals,s],this._view="table",this._editIdx=null,this.requestUpdate()}_onEditBack(){this._view="table",this._editIdx=null,this.requestUpdate()}};E=T(Oe),u(E,5,"meals",Pe,H),u(E,5,"_localMeals",Ce,H),u(E,5,"_view",Ue,H),u(E,5,"_editIdx",Te,H),C(E,H),h(H,"styles",[Z,$e,U`
      .schedules-title {
        font-size: 1.15em;
        margin: 0.5em 0 0.5em 0;
        text-align: center;
        color: var(--primary-text-color);
      }
      .add-schema-btn, .popup-actions-row button {
        border-radius: var(--ha-card-border-radius, 8px);
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        font-weight: 500;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        padding: var(--ha-card-button-padding, 0.3em 0.8em);
        font-size: 0.95em;
        margin-bottom: 0.2em;
      }
      .popup-actions-row {
        display: flex;
        gap: 0.7em;
        justify-content: flex-end;
        margin-top: 0.5em;
        flex-direction: row;
        align-items: center;
      }
      .popup-actions-row .add-schema-btn {
        order: 1;
        margin-right: auto;
        margin-bottom: 0;
      }
      .popup-actions-row .cancel-btn {
        order: 2;
      }
      .popup-actions-row .save-btn {
        order: 3;
      }
      .action-btns {
        display: flex;
        gap: 0.3em;
        justify-content: center;
        align-items: center;
      }
      .icon-btn {
        background: none;
        border: none;
        padding: 0.2em;
        border-radius: 50%;
        cursor: pointer;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .icon-btn:active, .icon-btn:focus {
        background: var(--primary-color, #2196f3)11;
      }
      .icon-btn svg {
        width: 1.3em;
        height: 1.3em;
        display: block;
      }
      .save-helper {
        text-align: right;
        margin-top: 0.2em;
        font-size: 0.97em;
      }
      .popup-meal-table {
        border: none;
        box-shadow: none;
        background: transparent;
      }
      .popup-meal-table th, .popup-meal-table td {
        border: none;
      }
    `]);var De,Ne,je,B,F=class extends(je=_,Ne=[$({type:Array})],De=[$({type:String})],je){constructor(){super();h(this,"meals",d(B,8,this,[])),d(B,11,this);h(this,"title",d(B,12,this,"Cleverio Pet Feeder")),d(B,15,this);this._dialogOpen=!1}render(){let e=this.meals.filter(i=>i.enabled).length,s=new Date().toLocaleDateString("en-US",{weekday:"long"}),o=ye(this.meals.filter(i=>i.enabled),s)*6;return v`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${this.title||"Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this.meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${e}</span>
          <div class="overview-grams">Today: ${o}g (active)</div>
          <ha-button class="manage-btn" @click=${()=>{this._dialogOpen=!0,this.requestUpdate()}}>Manage schedules</ha-button>
        </section>
        ${this._dialogOpen?v`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedules-view
                  .meals=${this.meals}
                  @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></cleverio-schedules-view>
              </ha-dialog>
            `:""}
      </ha-card>
    `}_onDialogClose(){this._dialogOpen=!1,this.requestUpdate()}_onScheduleMealsChanged(e){this._dialogOpen=!1,this.dispatchEvent(new CustomEvent("meals-changed",{detail:{meals:e.detail.meals},bubbles:!0,composed:!0})),this.requestUpdate()}};B=T(je),u(B,5,"meals",Ne,F),u(B,5,"title",De,F),C(B,F),h(F,"styles",[Z,U`
      .overview-card {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--ha-card-section-margin, 1em);
        align-items: center;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: var(--ha-card-border-width, 1.5px) solid var(--ha-card-border-color, var(--divider-color, #444));
        box-shadow: none;
        overflow: hidden;
      }
      .overview-title {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0.5em 0;
        color: var(--primary-text-color);
        text-align: center;
        width: 100%;
      }
      .overview-section {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        width: 100%;
        align-items: flex-start;
      }
      .overview-summary {
        display: flex;
        flex-direction: row;
        gap: 1.5em;
        align-items: baseline;
        width: 100%;
        justify-content: space-between;
      }
      .overview-grams { font-weight: bold; }
      .overview-schedules { font-size: 1.1em; }
      .overview-active { font-size: 1.1em; margin-top: 0.2em; display: block; }
      .manage-btn {
        border-radius: var(--ha-card-border-radius);
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        padding: var(--ha-card-button-padding, 0.5em 1em);
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        align-self: flex-start;
      }
    `]);customElements.define("cleverio-overview-view",F);var Ie,Le,Be,Fe,We,Je,Ke,Ye,m;Ye=[de("cleverio-pf100-card")];var M=class extends(Ke=_,Je=[$({type:Object})],We=[$({type:Object})],Fe=[w()],Be=[w()],Le=[w()],Ie=[w()],Ke){constructor(){super();h(this,"hass",d(m,8,this)),d(m,11,this);h(this,"config",d(m,12,this)),d(m,15,this);h(this,"_meals",d(m,16,this,[])),d(m,19,this);h(this,"_persistedMeals",d(m,20,this,[])),d(m,23,this);h(this,"_dialogView",d(m,24,this,null)),d(m,27,this);h(this,"_dialogData",d(m,28,this)),d(m,31,this);h(this,"_onMealsChanged",e=>{this._meals=e.detail.meals,this._saveMealsToSensor()});this.hass=void 0,this.config=void 0,this._meals=[],this._persistedMeals=[]}setConfig(e){this.config=e,this._checkConfig(),this._updateConfig()}updated(e){e.has("hass")&&this._updateHass()}get _sensorID(){return this.config?.sensor}get _stateObj(){return this.hass?.states?.[this._sensorID]}get _attributes(){return this._stateObj?.attributes||{}}get _name(){return this._attributes.friendly_name||this._sensorID}_checkConfig(){if(!this.config?.sensor)throw new Error("Please define a sensor!")}_updateConfig(){this.requestUpdate()}_updateHass(){let e=this._stateObj,s=null;if(e)try{s=_e(e.state),Array.isArray(s)&&(this._persistedMeals=s)}catch(o){console.error("Failed to decode meal plan:",o)}Array.isArray(this._persistedMeals)?this._meals=JSON.parse(JSON.stringify(this._persistedMeals)):(this._persistedMeals=[],this._meals=[]),this.requestUpdate()}render(){return v`
      <ha-card>
        <cleverio-overview-view
          .meals=${this._meals}
          .title=${this.config?.title||"Cleverio Pet Feeder"}
          @meals-changed=${this._onMealsChanged}
        ></cleverio-overview-view>
        <slot></slot>
      </ha-card>
    `}_saveMealsToSensor(){let e=ve(this._meals);this.hass.callService("text","set_value",{entity_id:this._sensorID,value:e}),setTimeout(()=>this._updateHass(),500)}static async getConfigElement(){return await Promise.resolve().then(()=>(ze(),qe)),document.createElement("cleverio-pf100-card-editor")}static getStubConfig(){return{sensor:"",title:"Cleverio Pet Feeder"}}static getCardSize(e){return 2}getNextSchedule(){return this._meals&&this._meals.length?this._meals[0].time:"-"}getTotalFoodPerDay(){return typeof Nt=="function"?Nt(this._meals||[]):{}}};m=T(Ke),u(m,5,"hass",Je,M),u(m,5,"config",We,M),u(m,5,"_meals",Fe,M),u(m,5,"_persistedMeals",Be,M),u(m,5,"_dialogView",Le,M),u(m,5,"_dialogData",Ie,M),M=u(m,0,"CleverioPf100Card",Ye,M),d(m,1,M);export{M as CleverioPf100Card};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=cleverio-pf100-feeder-card.bundle.js.map
