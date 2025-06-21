var Pe=Object.create;var dt=Object.defineProperty;var Ce=Object.getOwnPropertyDescriptor;var Ht=(r,t)=>(t=Symbol[r])?t:Symbol.for("Symbol."+r),J=r=>{throw TypeError(r)};var zt=(r,t,e)=>t in r?dt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var Nt=(r,t)=>dt(r,"name",{value:t,configurable:!0});var R=(r,t)=>()=>(r&&(t=r(r=0)),t);var Ue=(r,t)=>{for(var e in t)dt(r,e,{get:t[e],enumerable:!0})};var L=r=>[,,,Pe(r?.[Ht("metadata")]??null)],It=["class","method","getter","setter","accessor","field","value","get","set"],Y=r=>r!==void 0&&typeof r!="function"?J("Function expected"):r,Te=(r,t,e,s,o)=>({kind:It[r],name:t,metadata:s,addInitializer:i=>e._?J("Already initialized"):o.push(Y(i||null))}),V=(r,t)=>zt(t,Ht("metadata"),r[3]),c=(r,t,e,s)=>{for(var o=0,i=r[t>>1],a=i&&i.length;o<a;o++)t&1?i[o].call(e):s=i[o].call(e,s);return s},f=(r,t,e,s,o,i)=>{var a,d,l,p,m,n=t&7,v=!!(t&8),g=!!(t&16),P=n>3?r.length+1:n?v?1:2:0,Tt=It[n+5],Ot=n>3&&(r[P-1]=[]),De=r[P]||(r[P]=[]),S=n&&(!g&&!v&&(o=o.prototype),n<5&&(n>3||!g)&&Ce(n<4?o:{get[e](){return Rt(this,i)},set[e]($){return jt(this,i,$)}},e));n?g&&n<4&&Nt(i,(n>2?"set ":n>1?"get ":"")+e):Nt(o,e);for(var bt=s.length-1;bt>=0;bt--)p=Te(n,e,l={},r[3],De),n&&(p.static=v,p.private=g,m=p.access={has:g?$=>Oe(o,$):$=>e in $},n^3&&(m.get=g?$=>(n^1?Rt:Ne)($,o,n^4?i:S.get):$=>$[e]),n>2&&(m.set=g?($,yt)=>jt($,o,yt,n^4?i:S.set):($,yt)=>$[e]=yt)),d=(0,s[bt])(n?n<4?g?i:S[Tt]:n>4?void 0:{get:S.get,set:S.set}:o,p),l._=1,n^4||d===void 0?Y(d)&&(n>4?Ot.unshift(d):n?g?i=d:S[Tt]=d:o=d):typeof d!="object"||d===null?J("Object expected"):(Y(a=d.get)&&(S.get=a),Y(a=d.set)&&(S.set=a),Y(a=d.init)&&Ot.unshift(a));return n||V(r,o),S&&dt(o,e,S),g?n^4?i:S:o},h=(r,t,e)=>zt(r,typeof t!="symbol"?t+"":t,e),_t=(r,t,e)=>t.has(r)||J("Cannot "+e),Oe=(r,t)=>Object(t)!==t?J('Cannot use the "in" operator on this value'):r.has(t),Rt=(r,t,e)=>(_t(r,t,"read from private field"),e?e.call(r):t.get(r));var jt=(r,t,e,s)=>(_t(r,t,"write to private field"),s?s.call(r,e):t.set(r,e),e),Ne=(r,t,e)=>(_t(r,t,"access private method"),e);var ct,ht,vt,qt,G,Lt,k,Bt,$t,xt=R(()=>{ct=globalThis,ht=ct.ShadowRoot&&(ct.ShadyCSS===void 0||ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,vt=Symbol(),qt=new WeakMap,G=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==vt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(ht&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=qt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&qt.set(e,t))}return t}toString(){return this.cssText}},Lt=r=>new G(typeof r=="string"?r:r+"",void 0,vt),k=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,o,i)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+r[i+1],r[0]);return new G(e,r,vt)},Bt=(r,t)=>{if(ht)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),o=ct.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=e.cssText,r.appendChild(s)}},$t=ht?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Lt(e)})(r):r});var Re,je,He,ze,Ie,qe,C,Ft,Le,Be,K,Z,pt,Wt,M,Q=R(()=>{xt();xt();({is:Re,defineProperty:je,getOwnPropertyDescriptor:He,getOwnPropertyNames:ze,getOwnPropertySymbols:Ie,getPrototypeOf:qe}=Object),C=globalThis,Ft=C.trustedTypes,Le=Ft?Ft.emptyScript:"",Be=C.reactiveElementPolyfillSupport,K=(r,t)=>r,Z={toAttribute(r,t){switch(t){case Boolean:r=r?Le:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},pt=(r,t)=>!Re(r,t),Wt={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:pt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);M=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Wt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),o=this.getPropertyDescriptor(t,s,e);o!==void 0&&je(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){let{get:o,set:i}=He(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:o,set(a){let d=o?.call(this);i?.call(this,a),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Wt}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;let t=qe(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){let e=this.properties,s=[...ze(e),...Ie(e)];for(let o of s)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,o]of e)this.elementProperties.set(s,o)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let o=this._$Eu(e,s);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let o of s)e.unshift($t(o))}else t!==void 0&&e.push($t(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Bt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:Z).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=s.getPropertyOptions(o),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Z;this._$Em=o,this[o]=a.fromAttribute(e,i.type)??this._$Ej?.get(o)??null,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){let o=this.constructor,i=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??pt)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:i},a){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??e??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[o,i]of s){let{wrapped:a}=i,d=this[o];a!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,i,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};M.elementStyles=[],M.shadowRootOptions={mode:"open"},M[K("elementProperties")]=new Map,M[K("finalized")]=new Map,Be?.({ReactiveElement:M}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.0")});function ee(r,t){if(!Dt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Yt!==void 0?Yt.createHTML(t):t}function B(r,t,e=r,s){if(t===I)return t;let o=s!==void 0?e._$Co?.[s]:e._$Cl,i=st(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(r),o._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=B(r,o._$AS(r,t.values),o,s)),t}var tt,ut,Yt,Qt,U,Xt,Fe,z,et,st,Dt,We,wt,X,Jt,Vt,j,Gt,Kt,te,Pt,y,rs,os,I,b,Zt,H,Ye,rt,At,ot,F,St,Et,kt,Mt,Je,se,mt=R(()=>{tt=globalThis,ut=tt.trustedTypes,Yt=ut?ut.createPolicy("lit-html",{createHTML:r=>r}):void 0,Qt="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Xt="?"+U,Fe=`<${Xt}>`,z=document,et=()=>z.createComment(""),st=r=>r===null||typeof r!="object"&&typeof r!="function",Dt=Array.isArray,We=r=>Dt(r)||typeof r?.[Symbol.iterator]=="function",wt=`[ 	
\f\r]`,X=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Jt=/-->/g,Vt=/>/g,j=RegExp(`>|${wt}(?:([^\\s"'>=/]+)(${wt}*=${wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Gt=/'/g,Kt=/"/g,te=/^(?:script|style|textarea|title)$/i,Pt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=Pt(1),rs=Pt(2),os=Pt(3),I=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Zt=new WeakMap,H=z.createTreeWalker(z,129);Ye=(r,t)=>{let e=r.length-1,s=[],o,i=t===2?"<svg>":t===3?"<math>":"",a=X;for(let d=0;d<e;d++){let l=r[d],p,m,n=-1,v=0;for(;v<l.length&&(a.lastIndex=v,m=a.exec(l),m!==null);)v=a.lastIndex,a===X?m[1]==="!--"?a=Jt:m[1]!==void 0?a=Vt:m[2]!==void 0?(te.test(m[2])&&(o=RegExp("</"+m[2],"g")),a=j):m[3]!==void 0&&(a=j):a===j?m[0]===">"?(a=o??X,n=-1):m[1]===void 0?n=-2:(n=a.lastIndex-m[2].length,p=m[1],a=m[3]===void 0?j:m[3]==='"'?Kt:Gt):a===Kt||a===Gt?a=j:a===Jt||a===Vt?a=X:(a=j,o=void 0);let g=a===j&&r[d+1].startsWith("/>")?" ":"";i+=a===X?l+Fe:n>=0?(s.push(p),l.slice(0,n)+Qt+l.slice(n)+U+g):l+U+(n===-2?d:g)}return[ee(r,i+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},rt=class r{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let i=0,a=0,d=t.length-1,l=this.parts,[p,m]=Ye(t,e);if(this.el=r.createElement(p,s),H.currentNode=this.el.content,e===2||e===3){let n=this.el.content.firstChild;n.replaceWith(...n.childNodes)}for(;(o=H.nextNode())!==null&&l.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let n of o.getAttributeNames())if(n.endsWith(Qt)){let v=m[a++],g=o.getAttribute(n).split(U),P=/([.?@])?(.*)/.exec(v);l.push({type:1,index:i,name:P[2],strings:g,ctor:P[1]==="."?St:P[1]==="?"?Et:P[1]==="@"?kt:F}),o.removeAttribute(n)}else n.startsWith(U)&&(l.push({type:6,index:i}),o.removeAttribute(n));if(te.test(o.tagName)){let n=o.textContent.split(U),v=n.length-1;if(v>0){o.textContent=ut?ut.emptyScript:"";for(let g=0;g<v;g++)o.append(n[g],et()),H.nextNode(),l.push({type:2,index:++i});o.append(n[v],et())}}}else if(o.nodeType===8)if(o.data===Xt)l.push({type:2,index:i});else{let n=-1;for(;(n=o.data.indexOf(U,n+1))!==-1;)l.push({type:7,index:i}),n+=U.length-1}i++}}static createElement(t,e){let s=z.createElement("template");return s.innerHTML=t,s}};At=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??z).importNode(e,!0);H.currentNode=o;let i=H.nextNode(),a=0,d=0,l=s[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new ot(i,i.nextSibling,this,t):l.type===1?p=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(p=new Mt(i,this,t)),this._$AV.push(p),l=s[++d]}a!==l?.index&&(i=H.nextNode(),a++)}return H.currentNode=z,o}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},ot=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=B(this,t,e),st(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==I&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):We(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&st(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=rt.createElement(ee(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new At(o,this),a=i.u(this.options);i.p(e),this.T(a),this._$AH=i}}_$AC(t){let e=Zt.get(t.strings);return e===void 0&&Zt.set(t.strings,e=new rt(t)),e}k(t){Dt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,o=0;for(let i of t)o===e.length?e.push(s=new r(this.O(et()),this.O(et()),this,this.options)):s=e[o],s._$AI(i),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},F=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,o){let i=this.strings,a=!1;if(i===void 0)t=B(this,t,e,0),a=!st(t)||t!==this._$AH&&t!==I,a&&(this._$AH=t);else{let d=t,l,p;for(t=i[0],l=0;l<i.length-1;l++)p=B(this,d[s+l],e,l),p===I&&(p=this._$AH[l]),a||(a=!st(p)||p!==this._$AH[l]),p===b?t=b:t!==b&&(t+=(p??"")+i[l+1]),this._$AH[l]=p}a&&!o&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},St=class extends F{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},Et=class extends F{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},kt=class extends F{constructor(t,e,s,o,i){super(t,e,s,o,i),this.type=5}_$AI(t,e=this){if((t=B(this,t,e,0)??b)===I)return;let s=this._$AH,o=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==b&&(s===b||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Mt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){B(this,t)}},Je=tt.litHtmlPolyfillSupport;Je?.(rt,ot),(tt.litHtmlVersions??(tt.litHtmlVersions=[])).push("3.3.0");se=(r,t,e)=>{let s=e?.renderBefore??t,o=s._$litPart$;if(o===void 0){let i=e?.renderBefore??null;s._$litPart$=o=new ot(t.insertBefore(et(),i),i,void 0,e??{})}return o._$AI(r),o}});var it,_,Ve,re=R(()=>{Q();Q();mt();mt();it=globalThis,_=class extends M{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=se(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}};_._$litElement$=!0,_.finalized=!0,it.litElementHydrateSupport?.({LitElement:_});Ve=it.litElementPolyfillSupport;Ve?.({LitElement:_});(it.litElementVersions??(it.litElementVersions=[])).push("4.2.0")});var oe=R(()=>{});var q=R(()=>{Q();mt();re();oe()});var ve={};Ue(ve,{CleverioPf100CardEditor:()=>lt});var lt,Ut=R(()=>{q();lt=class extends _{constructor(){super(),this.config={sensor:"",title:""}}setConfig(t){this.config={...t}}_onInput(t){let{name:e,value:s}=t.target;this.config={...this.config,[e]:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config}}))}render(){return y`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor||""} @input=${this._onInput} />
      </label>
      <label>Title:
        <input name="title" .value=${this.config.title||""} @input=${this._onInput} />
      </label>
    `}};h(lt,"properties",{config:{type:Object}});customElements.define("cleverio-pf100-card-editor",lt)});q();var ie=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};Q();var Ge={attribute:!0,type:String,converter:Z,reflect:!1,hasChanged:pt},Ke=(r=Ge,t,e)=>{let{kind:s,metadata:o}=e,i=globalThis.litPropertyMetadata.get(o);if(i===void 0&&globalThis.litPropertyMetadata.set(o,i=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),i.set(e.name,r),s==="accessor"){let{name:a}=e;return{set(d){let l=t.get.call(this);t.set.call(this,d),this.requestUpdate(a,l,r)},init(d){return d!==void 0&&this.C(a,void 0,r,d),d}}}if(s==="setter"){let{name:a}=e;return function(d){let l=this[a];t.call(this,d),this.requestUpdate(a,l,r)}}throw Error("Unsupported decorator location: "+s)};function D(r){return(t,e)=>typeof e=="object"?Ke(r,t,e):((s,o,i)=>{let a=o.hasOwnProperty(i);return o.constructor.createProperty(i,s),a?Object.getOwnPropertyDescriptor(o,i):void 0})(r,t,e)}function x(r){return D({...r,state:!0,attribute:!1})}var T={DAYS:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],DAY_GROUPS:[{mask:31,label:"Weekdays"},{mask:96,label:"Weekend"},{mask:127,label:"Every day"}],getUIDays(){return[...T.DAYS.slice(1),T.DAYS[0]]},getDayBit(r){return 1<<T.DAYS.indexOf(r)},daysArrayToBitmask(r){return r.reduce((t,e)=>t|T.getDayBit(e),0)},bitmaskToDaysArray(r){return T.DAYS.filter((t,e)=>r&1<<e)},getDaysLabel(r){for(let e of T.DAY_GROUPS)if(r===e.mask)return e.label;let t=T.DAYS.filter((e,s)=>r&1<<s);return t.length===1?t[0]:t.map(e=>e.slice(0,3)).join(", ")}},ft=T;function ae(r){if(!r||r==="unknown")return[];let t;try{t=atob(r)}catch{throw new Error("Invalid base64")}let e=new Uint8Array([...t].map(o=>o.charCodeAt(0)));if(e.length%5!==0)throw new Error("Invalid meal plan length");let s=[];for(let o=0;o<e.length;o+=5){let[i,a,d,l,p]=e.slice(o,o+5);s.push({time:`${a.toString().padStart(2,"0")}:${d.toString().padStart(2,"0")}`,daysMask:i,portion:l||1,enabled:p===1,status:p})}return s}function ne(r){let t=[];return r.forEach(e=>{let[s,o]=e.time.split(":").map(Number);t.push(e.daysMask,s,o,Number(e.portion),e.enabled?1:0)}),btoa(String.fromCharCode(...t))}function Ct(r){let t=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],e={Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,Saturday:0,Sunday:0};for(let s of r||[])if(s.enabled){for(let o=0;o<7;o++)if(s.daysMask&1<<o){let i=t[o];e[i]+=s.portion||0}}return e}function le(r,t){if(!t)return 0;let s=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(t);if(s===-1)return 0;let o=0;for(let i of r||[])i.enabled&&i.daysMask&1<<s&&(o+=i.portion||0);return o}function at(r,t){if(!Array.isArray(r)||!Array.isArray(t)||r.length!==t.length)return!1;let e=i=>`${i.time}|${i.portion}|${i.daysMask}`,s=new Map(r.map(i=>[e(i),i.enabled])),o=new Map(t.map(i=>[e(i),i.enabled]));if(s.size!==o.size)return!1;for(let[i,a]of s.entries())if(!o.has(i)||o.get(i)!==a)return!1;return!0}q();q();var W=k`
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
`,de=k`
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
`;var nt=class extends _{constructor(){super(),this.meals=[],this.title="Cleverio Pet Feeder"}render(){let t=this.meals.filter(o=>o.enabled).length,e=new Date().toLocaleDateString("en-US",{weekday:"long"}),s=le(this.meals.filter(o=>o.enabled),e)*6;return y`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${this.title||"Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this.meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${t}</span>
          <div class="overview-grams">Today: ${s}g (active)</div>
          <ha-button class="manage-btn" @click=${this._onManageSchedules}>Manage schedules</ha-button>
        </section>
      </ha-card>
    `}_onManageSchedules(){this.dispatchEvent(new CustomEvent("manage-schedules",{bubbles:!0,composed:!0}))}};h(nt,"properties",{meals:{type:Array},title:{type:String}}),h(nt,"styles",[W,k`
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
    `]);customElements.define("cleverio-overview-view",nt);q();q();var ce,he,pe,ue,me,w,O=class extends(me=_,ue=[D({type:Object})],pe=[x()],he=[x()],ce=[x()],me){constructor(){super(...arguments);h(this,"meal",c(w,8,this,{time:"",portion:1,daysMask:0,enabled:!0})),c(w,11,this);h(this,"_time",c(w,12,this,"")),c(w,15,this);h(this,"_portion",c(w,16,this,1)),c(w,19,this);h(this,"_daysMask",c(w,20,this,0)),c(w,23,this)}updated(e){e.has("meal")&&this.meal&&(this._time=this.meal.time||"",this._portion=this.meal.portion||1,this._daysMask=this.meal.daysMask||0)}render(){return y`
      <form class="edit-form" @submit=${this._onSave}>
        <h3 class="edit-title" style="margin-top:0; text-align:left;">Edit Meal</h3>
        <div class="edit-days-row" style="justify-content:flex-start;">
          ${ft.DAYS.map((e,s)=>y`
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
          ${["07:00","12:00","18:00"].map(e=>y`<ha-button outlined class="suggested-time-btn" @click=${s=>this._suggestTime(s,e)}>${e}</ha-button>`)}
        </div>
        <div class="edit-divider"></div>
        <menu>
          <ha-button class="back-to-list-btn" @click=${this._onBack}>Back</ha-button>
          <ha-button class="edit-save-btn" type="submit">Save</ha-button>
        </menu>
      </form>
    `}_toggleDay(e,s){e.preventDefault(),this._daysMask^=1<<s}_suggestTime(e,s){e.preventDefault(),this._time=s}_onBack(e){e.preventDefault(),this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_onSave(e){e.preventDefault();let s={...this.meal,time:this._time,portion:this._portion,daysMask:this._daysMask,enabled:!0};this.dispatchEvent(new CustomEvent("save",{detail:{meal:s},bubbles:!0,composed:!0}))}};w=L(me),f(w,5,"meal",ue,O),f(w,5,"_time",pe,O),f(w,5,"_portion",he,O),f(w,5,"_daysMask",ce,O),V(w,O),h(O,"styles",[W,k`
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
    `]);var ge,fe,be,ye,_e,A,N=class extends(_e=_,ye=[D({type:Array})],be=[x()],fe=[x()],ge=[x()],_e){constructor(){super(...arguments);h(this,"meals",c(A,8,this,[])),c(A,11,this);h(this,"_localMeals",c(A,12,this,[])),c(A,15,this);h(this,"_view",c(A,16,this,"table")),c(A,19,this);h(this,"_editIdx",c(A,20,this,null)),c(A,23,this)}updated(e){e.has("meals")&&(this._localMeals=this.meals.map(s=>({...s})),this._view="table",this._editIdx=null)}render(){return this._view==="edit"?this._renderEditView():y`
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
            ${this._localMeals.length===0?y`<tr><td colspan="5" style="text-align:center;color:#888;">No schedules yet</td></tr>`:this._localMeals.map((e,s)=>y`
                  <tr>
                    <td>${e.time}</td>
                    <td>${e.portion}</td>
                    <td>${ft.getDaysLabel(e.daysMask||0)}</td>
                    <td><ha-checkbox class="enabled-checkbox" .checked=${e.enabled} @change=${o=>this._toggleEnabled(s,o)}></ha-checkbox></td>
                    <td><span class="action-btns">
                      <button type="button" class="edit-row-btn icon-btn" @click=${()=>this._emitEditMeal(s)} aria-label="Edit schedule">
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
          <button class="save-btn" @click=${this._save} .disabled=${at(this._localMeals,this.meals)} style=${at(this._localMeals,this.meals)?"":"background: var(--error-color, #e53935); color: var(--text-primary-color, #fff); box-shadow: 0 0 0 2px var(--error-color, #e53935)33;"}>Save</button>
        </div>
        <div class="save-helper" style="color:${at(this._localMeals,this.meals)?"var(--secondary-text-color, #888)":"var(--error-color, #e53935)"};">
          ${at(this._localMeals,this.meals)?"No changes to save.":"You have unsaved changes."}
        </div>
      </div>
    `}_toggleEnabled(e,s){this._localMeals[e].enabled=s.target.checked,this.requestUpdate()}_emitEditMeal(e){this.dispatchEvent(new CustomEvent("edit-meal",{detail:{meal:this._localMeals[e]},bubbles:!0,composed:!0}))}_delete(e){this._localMeals.splice(e,1),this.requestUpdate()}_add(){this._editIdx=null,this._view="edit"}_cancel(){this.dispatchEvent(new CustomEvent("close-dialog",{bubbles:!0,composed:!0}))}_save(){this.dispatchEvent(new CustomEvent("save",{detail:{meals:this._localMeals},bubbles:!0,composed:!0}))}_renderEditView(){let e=this._editIdx!=null?this._localMeals[this._editIdx]:{time:"",portion:1,daysMask:0,enabled:!0};return y`
      <cleverio-edit-view
        .meal=${e}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></cleverio-edit-view>
    `}_onEditSave(e){let s=e.detail.meal;this._editIdx!=null?this._localMeals[this._editIdx]=s:this._localMeals=[...this._localMeals,s],this._view="table",this._editIdx=null,this.requestUpdate()}_onEditBack(){this._view="table",this._editIdx=null,this.requestUpdate()}};A=L(_e),f(A,5,"meals",ye,N),f(A,5,"_localMeals",be,N),f(A,5,"_view",fe,N),f(A,5,"_editIdx",ge,N),V(A,N),h(N,"styles",[W,de,k`
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
    `]);Ut();var $e,xe,we,Ae,Se,Ee,ke,Me,u;Me=[ie("cleverio-pf100-card")];var E=class extends(ke=_,Ee=[D({type:Object})],Se=[D({type:Object})],Ae=[x()],we=[x()],xe=[x()],$e=[x()],ke){constructor(){super(...arguments);h(this,"hass",c(u,8,this)),c(u,11,this);h(this,"config",c(u,12,this)),c(u,15,this);h(this,"_meals",c(u,16,this,[])),c(u,19,this);h(this,"_persistedMeals",c(u,20,this,[])),c(u,23,this);h(this,"_dialogView",c(u,24,this,null)),c(u,27,this);h(this,"_dialogData",c(u,28,this)),c(u,31,this);h(this,"_onManageSchedules",()=>{this._dialogView="schedules",this._dialogData=null});h(this,"_onEditMeal",e=>{this._dialogView="edit",this._dialogData=e.detail.meal});h(this,"_onEditBack",()=>{this._dialogView="schedules",this._dialogData=null});h(this,"_onDialogClose",()=>{this._dialogView=null,this._dialogData=void 0});h(this,"_onSaveSchedules",e=>{this._meals=e.detail.meals,this._saveMealsToSensor(),this._dialogView=null,this._dialogData=void 0});h(this,"_onSaveEdit",e=>{let s=e.detail.meal,o=!1;this._meals=this._meals.map(i=>i.time===s.time&&i.daysMask===s.daysMask?(o=!0,s):i),o||(this._meals=[...this._meals,s]),this._saveMealsToSensor(),this._dialogView=null,this._dialogData=void 0})}setConfig(e){this.config=e,this._checkConfig(),this._updateConfig()}updated(e){e.has("hass")&&this._updateHass()}get _sensorID(){return this.config?.sensor}get _stateObj(){return this.hass?.states?.[this._sensorID]}get _attributes(){return this._stateObj?.attributes||{}}get _name(){return this._attributes.friendly_name||this._sensorID}_checkConfig(){if(!this.config?.sensor)throw new Error("Please define a sensor!")}_updateConfig(){this.requestUpdate()}_updateHass(){let e=this._stateObj,s=null;if(e)try{s=ae(e.state),Array.isArray(s)&&(this._persistedMeals=s)}catch(o){console.error("Failed to decode meal plan:",o)}Array.isArray(this._persistedMeals)?this._meals=JSON.parse(JSON.stringify(this._persistedMeals)):(this._persistedMeals=[],this._meals=[]),this.requestUpdate()}render(){return y`
      <ha-card>
        <cleverio-overview-view
          .meals=${this._meals}
          .title=${this.config?.title||"Cleverio Pet Feeder"}
          @manage-schedules=${this._onManageSchedules}
        ></cleverio-overview-view>
        <slot></slot>
        ${this._dialogView?y`
          <ha-dialog
            open
            scrimClickAction
            @closed=${this._onDialogClose}
          >
            ${this._dialogView==="schedules"?y`
              <cleverio-schedules-view
                .meals=${this._meals}
                @edit-meal=${this._onEditMeal}
                @close-dialog=${this._onDialogClose}
                @save=${this._onSaveSchedules}
              ></cleverio-schedules-view>
            `:this._dialogView==="edit"?y`
              <cleverio-edit-view
                .meal=${this._dialogData}
                @back=${this._onEditBack}
                @save=${this._onSaveEdit}
              ></cleverio-edit-view>
            `:""}
          </ha-dialog>
        `:""}
      </ha-card>
    `}_saveMealsToSensor(){let e=ne(this._meals);this.hass.callService("text","set_value",{entity_id:this._sensorID,value:e}),setTimeout(()=>this._updateHass(),500)}static async getConfigElement(){return await Promise.resolve().then(()=>(Ut(),ve)),document.createElement("cleverio-pf100-card-editor")}static getStubConfig(){return{sensor:"",title:"Cleverio Pet Feeder"}}static getCardSize(e){return 2}getNextSchedule(){return this._meals&&this._meals.length?this._meals[0].time:"-"}getTotalFoodPerDay(){return typeof Ct=="function"?Ct(this._meals||[]):{}}};u=L(ke),f(u,5,"hass",Ee,E),f(u,5,"config",Se,E),f(u,5,"_meals",Ae,E),f(u,5,"_persistedMeals",we,E),f(u,5,"_dialogView",xe,E),f(u,5,"_dialogData",$e,E),E=f(u,0,"CleverioPf100Card",Me,E),c(u,1,E);export{E as CleverioPf100Card};
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
