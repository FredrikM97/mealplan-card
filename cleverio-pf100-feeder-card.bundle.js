var lt=Object.defineProperty;var ge=Object.getOwnPropertyDescriptor;var At=r=>{throw TypeError(r)};var fe=(r,t,e)=>t in r?lt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var p=(r,t)=>()=>(r&&(t=r(r=0)),t);var _e=(r,t)=>{for(var e in t)lt(r,e,{get:t[e],enumerable:!0})};var c=(r,t,e,s)=>{for(var i=s>1?void 0:s?ge(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&lt(t,e,i),i};var T=(r,t,e)=>fe(r,typeof t!="symbol"?t+"":t,e),Et=(r,t,e)=>t.has(r)||At("Cannot "+e);var m=(r,t,e)=>(Et(r,t,"read from private field"),e?e.call(r):t.get(r)),g=(r,t,e)=>t.has(r)?At("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),f=(r,t,e,s)=>(Et(r,t,"write to private field"),s?s.call(r,e):t.set(r,e),e);var et,st,ht,St,j,xt,x,wt,ct,dt=p(()=>{et=globalThis,st=et.ShadowRoot&&(et.ShadyCSS===void 0||et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),St=new WeakMap,j=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(st&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=St.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&St.set(e,t))}return t}toString(){return this.cssText}},xt=r=>new j(typeof r=="string"?r:r+"",void 0,ht),x=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new j(e,r,ht)},wt=(r,t)=>{if(st)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=et.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ct=st?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return xt(e)})(r):r});var ye,$e,be,ve,Ae,Ee,w,Mt,Se,xe,L,z,rt,Tt,E,B=p(()=>{dt();dt();({is:ye,defineProperty:$e,getOwnPropertyDescriptor:be,getOwnPropertyNames:ve,getOwnPropertySymbols:Ae,getPrototypeOf:Ee}=Object),w=globalThis,Mt=w.trustedTypes,Se=Mt?Mt.emptyScript:"",xe=w.reactiveElementPolyfillSupport,L=(r,t)=>r,z={toAttribute(r,t){switch(t){case Boolean:r=r?Se:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},rt=(r,t)=>!ye(r,t),Tt={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:rt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),w.litPropertyMetadata??(w.litPropertyMetadata=new WeakMap);E=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Tt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&$e(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=be(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let l=i?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Tt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=Ee(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,s=[...ve(e),...Ae(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(ct(i))}else t!==void 0&&e.push(ct(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:z).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:z;this._$Em=i,this[i]=n.fromAttribute(e,o.type)??this._$Ej?.get(i)??null,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){let i=this.constructor,o=this[t];if(s??(s=i.getPropertyOptions(t)),!((s.hasChanged??rt)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[L("elementProperties")]=new Map,E[L("finalized")]=new Map,xe?.({ReactiveElement:E}),(w.reactiveElementVersions??(w.reactiveElementVersions=[])).push("2.1.0")});function It(r,t){if(!yt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ct!==void 0?Ct.createHTML(t):t}function H(r,t,e=r,s){if(t===U)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=V(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=H(r,i._$AS(r,t.values),i,s)),t}var J,it,Ct,Ht,M,Rt,we,k,K,V,yt,Me,pt,W,Pt,kt,C,Ut,Ot,Dt,$t,b,qe,Fe,U,u,Nt,P,Te,Z,ut,G,R,mt,gt,ft,_t,Ce,qt,ot=p(()=>{J=globalThis,it=J.trustedTypes,Ct=it?it.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ht="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Rt="?"+M,we=`<${Rt}>`,k=document,K=()=>k.createComment(""),V=r=>r===null||typeof r!="object"&&typeof r!="function",yt=Array.isArray,Me=r=>yt(r)||typeof r?.[Symbol.iterator]=="function",pt=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,kt=/>/g,C=RegExp(`>|${pt}(?:([^\\s"'>=/]+)(${pt}*=${pt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ut=/'/g,Ot=/"/g,Dt=/^(?:script|style|textarea|title)$/i,$t=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),b=$t(1),qe=$t(2),Fe=$t(3),U=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Nt=new WeakMap,P=k.createTreeWalker(k,129);Te=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=W;for(let l=0;l<e;l++){let a=r[l],d,_,h=-1,A=0;for(;A<a.length&&(n.lastIndex=A,_=n.exec(a),_!==null);)A=n.lastIndex,n===W?_[1]==="!--"?n=Pt:_[1]!==void 0?n=kt:_[2]!==void 0?(Dt.test(_[2])&&(i=RegExp("</"+_[2],"g")),n=C):_[3]!==void 0&&(n=C):n===C?_[0]===">"?(n=i??W,h=-1):_[1]===void 0?h=-2:(h=n.lastIndex-_[2].length,d=_[1],n=_[3]===void 0?C:_[3]==='"'?Ot:Ut):n===Ot||n===Ut?n=C:n===Pt||n===kt?n=W:(n=C,i=void 0);let S=n===C&&r[l+1].startsWith("/>")?" ":"";o+=n===W?a+we:h>=0?(s.push(d),a.slice(0,h)+Ht+a.slice(h)+M+S):a+M+(h===-2?l:S)}return[It(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Z=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[d,_]=Te(t,e);if(this.el=r.createElement(d,s),P.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=P.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Ht)){let A=_[n++],S=i.getAttribute(h).split(M),tt=/([.?@])?(.*)/.exec(A);a.push({type:1,index:o,name:tt[2],strings:S,ctor:tt[1]==="."?mt:tt[1]==="?"?gt:tt[1]==="@"?ft:R}),i.removeAttribute(h)}else h.startsWith(M)&&(a.push({type:6,index:o}),i.removeAttribute(h));if(Dt.test(i.tagName)){let h=i.textContent.split(M),A=h.length-1;if(A>0){i.textContent=it?it.emptyScript:"";for(let S=0;S<A;S++)i.append(h[S],K()),P.nextNode(),a.push({type:2,index:++o});i.append(h[A],K())}}}else if(i.nodeType===8)if(i.data===Rt)a.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf(M,h+1))!==-1;)a.push({type:7,index:o}),h+=M.length-1}o++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};ut=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);P.currentNode=i;let o=P.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new G(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new _t(o,this,t)),this._$AV.push(d),a=s[++l]}n!==a?.index&&(o=P.nextNode(),n++)}return P.currentNode=k,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},G=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=H(this,t,e),V(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==U&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Me(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&V(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Z.createElement(It(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new ut(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=Nt.get(t.strings);return e===void 0&&Nt.set(t.strings,e=new Z(t)),e}k(t){yt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(K()),this.O(K()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=H(this,t,e,0),n=!V(t)||t!==this._$AH&&t!==U,n&&(this._$AH=t);else{let l=t,a,d;for(t=o[0],a=0;a<o.length-1;a++)d=H(this,l[s+a],e,a),d===U&&(d=this._$AH[a]),n||(n=!V(d)||d!==this._$AH[a]),d===u?t=u:t!==u&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},mt=class extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},gt=class extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},ft=class extends R{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=H(this,t,e,0)??u)===U)return;let s=this._$AH,i=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==u&&(s===u||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},_t=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}},Ce=J.litHtmlPolyfillSupport;Ce?.(Z,G),(J.litHtmlVersions??(J.litHtmlVersions=[])).push("3.3.0");qt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new G(t.insertBefore(K(),o),o,void 0,e??{})}return i._$AI(r),i}});var Q,$,Pe,Ft=p(()=>{B();B();ot();ot();Q=globalThis,$=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};$._$litElement$=!0,$.finalized=!0,Q.litElementHydrateSupport?.({LitElement:$});Pe=Q.litElementPolyfillSupport;Pe?.({LitElement:$});(Q.litElementVersions??(Q.litElementVersions=[])).push("4.2.0")});var jt=p(()=>{});var D=p(()=>{B();ot();Ft();jt()});var I,Lt=p(()=>{I=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)}});function y(r){return(t,e)=>typeof e=="object"?Ue(r,t,e):((s,i,o)=>{let n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}var ke,Ue,bt=p(()=>{B();ke={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:rt},Ue=(r=ke,t,e)=>{let{kind:s,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,r)},init(l){return l!==void 0&&this.C(n,void 0,r,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,r)}}throw Error("Unsupported decorator location: "+s)}});function X(r){return y({...r,state:!0,attribute:!1})}var zt=p(()=>{bt();});var Bt=p(()=>{});var q=p(()=>{});var Wt=p(()=>{q();});var Jt=p(()=>{q();});var Kt=p(()=>{q();});var Vt=p(()=>{q();});var Zt=p(()=>{q();});var Y=p(()=>{Lt();bt();zt();Bt();Wt();Jt();Kt();Vt();Zt()});var ae={};_e(ae,{CleverioPf100CardEditor:()=>F});var ne,F,le=p(()=>{"use strict";D();Y();F=class extends ${constructor(){super();g(this,ne);this.config={sensor:"",title:""}}get config(){return m(this,ne)}set config(e){f(this,ne,e)}setConfig(e){this.config={...e}}_onInput(e){let{name:s,value:i}=e.target;this.config={...this.config,[s]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config}}))}render(){return b`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor||""} @input=${this._onInput.bind(this)} />
      </label>
      <label>Title:
        <input name="title" .value=${this.config.title||""} @input=${this._onInput.bind(this)} />
      </label>
    `}};ne=new WeakMap,c([y({attribute:!1})],F.prototype,"config",1),F=c([I("cleverio-pf100-card-editor")],F)});D();Y();function vt(r){let t={Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,Saturday:0,Sunday:0};return r.forEach(e=>{if(e.enabled){for(let s=0;s<7;s++)if(e.daysMask&1<<s){let i=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][s];t[i]+=e.portion}}}),t}function Gt(r,t){let e=0;return r.forEach(s=>{s.enabled&&s.daysMask&1<<["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(t)&&(e+=s.portion)}),e}function Qt(r){let t=r.map(e=>`${e.time},${e.portion},${e.daysMask},${e.enabled?1:0}`).join(";");return btoa(t)}function Xt(r){try{return atob(r).split(";").filter(Boolean).map(e=>{let[s,i,o,n]=e.split(",");return{time:s,portion:Number(i),daysMask:Number(o),enabled:n==="1"}})}catch{throw new Error("Invalid base64")}}D();Y();D();var at=x`
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
`,Yt=x`
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
`;D();Y();var te,ee,se,re,O=class extends ${constructor(){super();g(this,te,[]);g(this,ee,[]);g(this,se,"table");g(this,re,null);this.meals=[],this._localMeals=[],this._view="table",this._editIdx=null}get meals(){return m(this,te)}set meals(e){f(this,te,e)}get _localMeals(){return m(this,ee)}set _localMeals(e){f(this,ee,e)}get _view(){return m(this,se)}set _view(e){f(this,se,e)}get _editIdx(){return m(this,re)}set _editIdx(e){f(this,re,e)}updated(e){e.has("meals")&&(this._localMeals=this.meals.map(s=>({...s})),this._view="table",this._editIdx=null)}render(){return this._view==="edit"?this._renderEditView():b`
      // ...existing code...
    `}_toggleEnabled(e,s){this._localMeals[e].enabled=s.target.checked,this.requestUpdate()}_edit(e){this._editIdx=e,this._view="edit",this.requestUpdate()}_delete(e){this._localMeals.splice(e,1),this.requestUpdate()}_add(){this._editIdx=null,this._view="edit",this.requestUpdate()}_cancel(){this.dispatchEvent(new CustomEvent("close-dialog",{bubbles:!0,composed:!0}))}_save(){this.dispatchEvent(new CustomEvent("meals-changed",{detail:{meals:this._localMeals},bubbles:!0,composed:!0}))}_renderEditView(){let e=this._editIdx!=null?this._localMeals[this._editIdx]:{time:"",portion:1,daysMask:0,enabled:!0};return b`
      <cleverio-edit-view
        .time=${e.time}
        .portion=${e.portion}
        .daysMask=${e.daysMask}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></cleverio-edit-view>
    `}_onEditSave(e){let s=e.detail.meal;this._editIdx!=null?this._localMeals[this._editIdx]=s:this._localMeals=[...this._localMeals,s],this._view="table",this._editIdx=null,this.requestUpdate()}_onEditBack(){this._view="table",this._editIdx=null,this.requestUpdate()}};te=new WeakMap,ee=new WeakMap,se=new WeakMap,re=new WeakMap,T(O,"styles",[at,Yt,x`
      // ...existing code...
    `]),c([y({type:Array})],O.prototype,"meals",1),c([y({type:Array})],O.prototype,"_localMeals",1),c([y({type:String})],O.prototype,"_view",1),c([y({type:Number})],O.prototype,"_editIdx",1);var ie,oe,N=class extends ${constructor(){super();g(this,ie,[]);g(this,oe,"Cleverio Pet Feeder");T(this,"_dialogOpen");this.meals=[],this.title="Cleverio Pet Feeder",this._dialogOpen=!1}get meals(){return m(this,ie)}set meals(e){f(this,ie,e)}get title(){return m(this,oe)}set title(e){f(this,oe,e)}render(){let e=this.meals.filter(o=>o.enabled).length,s=new Date().toLocaleDateString("en-US",{weekday:"long"}),i=Gt(this.meals.filter(o=>o.enabled),s)*6;return b`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${this.title||"Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this.meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${e}</span>
          <div class="overview-grams">Today: ${i}g (active)</div>
          <ha-button class="manage-btn" @click=${()=>{this._dialogOpen=!0,this.requestUpdate()}}>Manage schedules</ha-button>
        </section>
        ${this._dialogOpen?b`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedules-view
                  .meals=${this.meals}
                  @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></cleverio-schedules-view>
              </ha-dialog>
            `:""}
      </ha-card>
    `}_onDialogClose(){this._dialogOpen=!1,this.requestUpdate()}_onScheduleMealsChanged(e){this._dialogOpen=!1,this.dispatchEvent(new CustomEvent("meals-changed",{detail:{meals:e.detail.meals},bubbles:!0,composed:!0})),this.requestUpdate()}};ie=new WeakMap,oe=new WeakMap,T(N,"styles",[at,x`
      // ...existing code...
    `]),c([y({type:Array})],N.prototype,"meals",1),c([y({type:String})],N.prototype,"title",1),N=c([I("cleverio-overview-view")],N);var he,ce,de,pe,ue,me,v=class extends ${constructor(){super();g(this,he);g(this,ce);g(this,de,[]);g(this,pe,[]);g(this,ue,null);g(this,me);T(this,"_onMealsChanged",e=>{this._meals=e.detail.meals,this._saveMealsToSensor()});this.hass=void 0,this.config=void 0,this._meals=[],this._persistedMeals=[]}get hass(){return m(this,he)}set hass(e){f(this,he,e)}get config(){return m(this,ce)}set config(e){f(this,ce,e)}get _meals(){return m(this,de)}set _meals(e){f(this,de,e)}get _persistedMeals(){return m(this,pe)}set _persistedMeals(e){f(this,pe,e)}get _dialogView(){return m(this,ue)}set _dialogView(e){f(this,ue,e)}get _dialogData(){return m(this,me)}set _dialogData(e){f(this,me,e)}setConfig(e){this.config=e,this._checkConfig(),this._updateConfig()}updated(e){e.has("hass")&&this._updateHass()}get _sensorID(){return this.config?.sensor}get _stateObj(){return this.hass?.states?.[this._sensorID]}get _attributes(){return this._stateObj?.attributes||{}}get _name(){return this._attributes.friendly_name||this._sensorID}_checkConfig(){if(!this.config?.sensor)throw new Error("Please define a sensor!")}_updateConfig(){this.requestUpdate()}_updateHass(){let e=this._stateObj,s=null;if(e)try{s=Xt(e.state),Array.isArray(s)&&(this._persistedMeals=s)}catch(i){console.error("Failed to decode meal plan:",i)}Array.isArray(this._persistedMeals)?this._meals=JSON.parse(JSON.stringify(this._persistedMeals)):(this._persistedMeals=[],this._meals=[]),this.requestUpdate()}render(){return b`
      <ha-card>
        <cleverio-overview-view
          .meals=${this._meals}
          .title=${this.config?.title||"Cleverio Pet Feeder"}
          @meals-changed=${this._onMealsChanged}
        ></cleverio-overview-view>
        <slot></slot>
      </ha-card>
    `}_saveMealsToSensor(){let e=Qt(this._meals);this.hass.callService("text","set_value",{entity_id:this._sensorID,value:e}),setTimeout(()=>this._updateHass(),500)}static async getConfigElement(){return await Promise.resolve().then(()=>(le(),ae)),document.createElement("cleverio-pf100-card-editor")}static getStubConfig(){return{sensor:"",title:"Cleverio Pet Feeder"}}static getCardSize(e){return 2}getNextSchedule(){return this._meals&&this._meals.length?this._meals[0].time:"-"}getTotalFoodPerDay(){return typeof vt=="function"?vt(this._meals||[]):{}}};he=new WeakMap,ce=new WeakMap,de=new WeakMap,pe=new WeakMap,ue=new WeakMap,me=new WeakMap,c([y({type:Object})],v.prototype,"hass",1),c([y({type:Object})],v.prototype,"config",1),c([X()],v.prototype,"_meals",1),c([X()],v.prototype,"_persistedMeals",1),c([X()],v.prototype,"_dialogView",1),c([X()],v.prototype,"_dialogData",1),v=c([I("cleverio-pf100-card")],v);export{v as CleverioPf100Card};
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
