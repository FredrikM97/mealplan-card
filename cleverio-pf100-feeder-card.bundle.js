var Ee=Object.create;var rt=Object.defineProperty;var ke=Object.getOwnPropertyDescriptor;var qt=(r,t)=>(t=Symbol[r])?t:Symbol.for("Symbol."+r),j=r=>{throw TypeError(r)};var Lt=(r,t,e)=>t in r?rt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var Rt=(r,t)=>rt(r,"name",{value:t,configurable:!0});var C=(r,t)=>()=>(r&&(t=r(r=0)),t);var Me=(r,t)=>{for(var e in t)rt(r,e,{get:t[e],enumerable:!0})};var Bt=r=>[,,,Ee(r?.[qt("metadata")]??null)],Ft=["class","method","getter","setter","accessor","field","value","get","set"],I=r=>r!==void 0&&typeof r!="function"?j("Function expected"):r,Ce=(r,t,e,s,o)=>({kind:Ft[r],name:t,metadata:s,addInitializer:i=>e._?j("Already initialized"):o.push(I(i||null))}),Te=(r,t)=>Lt(t,qt("metadata"),r[3]),y=(r,t,e,s)=>{for(var o=0,i=r[t>>1],a=i&&i.length;o<a;o++)t&1?i[o].call(e):s=i[o].call(e,s);return s},E=(r,t,e,s,o,i)=>{var a,d,l,c,u,n=t&7,v=!!(t&8),p=!!(t&16),S=n>3?r.length+1:n?v?1:2:0,jt=Ft[n+5],Ht=n>3&&(r[S-1]=[]),Se=r[S]||(r[S]=[]),$=n&&(!p&&!v&&(o=o.prototype),n<5&&(n>3||!p)&&ke(n<4?o:{get[e](){return zt(this,i)},set[e](_){return It(this,i,_)}},e));n?p&&n<4&&Rt(i,(n>2?"set ":n>1?"get ":"")+e):Rt(o,e);for(var ht=s.length-1;ht>=0;ht--)c=Ce(n,e,l={},r[3],Se),n&&(c.static=v,c.private=p,u=c.access={has:p?_=>Pe(o,_):_=>e in _},n^3&&(u.get=p?_=>(n^1?zt:De)(_,o,n^4?i:$.get):_=>_[e]),n>2&&(u.set=p?(_,ut)=>It(_,o,ut,n^4?i:$.set):(_,ut)=>_[e]=ut)),d=(0,s[ht])(n?n<4?p?i:$[jt]:n>4?void 0:{get:$.get,set:$.set}:o,c),l._=1,n^4||d===void 0?I(d)&&(n>4?Ht.unshift(d):n?p?i=d:$[jt]=d:o=d):typeof d!="object"||d===null?j("Object expected"):(I(a=d.get)&&($.get=a),I(a=d.set)&&($.set=a),I(a=d.init)&&Ht.unshift(a));return n||Te(r,o),$&&rt(o,e,$),p?n^4?i:$:o},f=(r,t,e)=>Lt(r,typeof t!="symbol"?t+"":t,e),pt=(r,t,e)=>t.has(r)||j("Cannot "+e),Pe=(r,t)=>Object(t)!==t?j('Cannot use the "in" operator on this value'):r.has(t),zt=(r,t,e)=>(pt(r,t,"read from private field"),e?e.call(r):t.get(r)),T=(r,t,e)=>t.has(r)?j("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),It=(r,t,e,s)=>(pt(r,t,"write to private field"),s?s.call(r,e):t.set(r,e),e),De=(r,t,e)=>(pt(r,t,"access private method"),e);var ot,it,mt,Vt,q,Wt,w,Jt,gt,ft=C(()=>{ot=globalThis,it=ot.ShadowRoot&&(ot.ShadyCSS===void 0||ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,mt=Symbol(),Vt=new WeakMap,q=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==mt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(it&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Vt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Vt.set(e,t))}return t}toString(){return this.cssText}},Wt=r=>new q(typeof r=="string"?r:r+"",void 0,mt),w=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,o,i)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+r[i+1],r[0]);return new q(e,r,mt)},Jt=(r,t)=>{if(it)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),o=ot.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=e.cssText,r.appendChild(s)}},gt=it?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Wt(e)})(r):r});var Ue,Oe,Ne,je,He,Re,k,Kt,ze,Ie,L,B,at,Yt,A,F=C(()=>{ft();ft();({is:Ue,defineProperty:Oe,getOwnPropertyDescriptor:Ne,getOwnPropertyNames:je,getOwnPropertySymbols:He,getPrototypeOf:Re}=Object),k=globalThis,Kt=k.trustedTypes,ze=Kt?Kt.emptyScript:"",Ie=k.reactiveElementPolyfillSupport,L=(r,t)=>r,B={toAttribute(r,t){switch(t){case Boolean:r=r?ze:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},at=(r,t)=>!Ue(r,t),Yt={attribute:!0,type:String,converter:B,reflect:!1,useDefault:!1,hasChanged:at};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Yt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),o=this.getPropertyDescriptor(t,s,e);o!==void 0&&Oe(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){let{get:o,set:i}=Ne(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:o,set(a){let d=o?.call(this);i?.call(this,a),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Yt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=Re(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,s=[...je(e),...He(e)];for(let o of s)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,o]of e)this.elementProperties.set(s,o)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let o=this._$Eu(e,s);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let o of s)e.unshift(gt(o))}else t!==void 0&&e.push(gt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Jt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:B).toAttribute(e,s.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=s.getPropertyOptions(o),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:B;this._$Em=o,this[o]=a.fromAttribute(e,i.type)??this._$Ej?.get(o)??null,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){let o=this.constructor,i=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??at)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:i},a){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??e??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[o,i]of s){let{wrapped:a}=i,d=this[o];a!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,i,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[L("elementProperties")]=new Map,A[L("finalized")]=new Map,Ie?.({ReactiveElement:A}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.1.0")});function ie(r,t){if(!wt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Zt!==void 0?Zt.createHTML(t):t}function H(r,t,e=r,s){if(t===O)return t;let o=s!==void 0?e._$Co?.[s]:e._$Cl,i=K(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(r),o._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=H(r,o._$AS(r,t.values),o,s)),t}var W,nt,Zt,se,M,re,qe,U,J,K,wt,Le,bt,V,Gt,Qt,P,Xt,te,oe,At,g,os,is,O,m,ee,D,Be,Y,yt,Z,R,vt,_t,$t,xt,Fe,ae,lt=C(()=>{W=globalThis,nt=W.trustedTypes,Zt=nt?nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,se="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,re="?"+M,qe=`<${re}>`,U=document,J=()=>U.createComment(""),K=r=>r===null||typeof r!="object"&&typeof r!="function",wt=Array.isArray,Le=r=>wt(r)||typeof r?.[Symbol.iterator]=="function",bt=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Gt=/-->/g,Qt=/>/g,P=RegExp(`>|${bt}(?:([^\\s"'>=/]+)(${bt}*=${bt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xt=/'/g,te=/"/g,oe=/^(?:script|style|textarea|title)$/i,At=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),g=At(1),os=At(2),is=At(3),O=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),ee=new WeakMap,D=U.createTreeWalker(U,129);Be=(r,t)=>{let e=r.length-1,s=[],o,i=t===2?"<svg>":t===3?"<math>":"",a=V;for(let d=0;d<e;d++){let l=r[d],c,u,n=-1,v=0;for(;v<l.length&&(a.lastIndex=v,u=a.exec(l),u!==null);)v=a.lastIndex,a===V?u[1]==="!--"?a=Gt:u[1]!==void 0?a=Qt:u[2]!==void 0?(oe.test(u[2])&&(o=RegExp("</"+u[2],"g")),a=P):u[3]!==void 0&&(a=P):a===P?u[0]===">"?(a=o??V,n=-1):u[1]===void 0?n=-2:(n=a.lastIndex-u[2].length,c=u[1],a=u[3]===void 0?P:u[3]==='"'?te:Xt):a===te||a===Xt?a=P:a===Gt||a===Qt?a=V:(a=P,o=void 0);let p=a===P&&r[d+1].startsWith("/>")?" ":"";i+=a===V?l+qe:n>=0?(s.push(c),l.slice(0,n)+se+l.slice(n)+M+p):l+M+(n===-2?d:p)}return[ie(r,i+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},Y=class r{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let i=0,a=0,d=t.length-1,l=this.parts,[c,u]=Be(t,e);if(this.el=r.createElement(c,s),D.currentNode=this.el.content,e===2||e===3){let n=this.el.content.firstChild;n.replaceWith(...n.childNodes)}for(;(o=D.nextNode())!==null&&l.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let n of o.getAttributeNames())if(n.endsWith(se)){let v=u[a++],p=o.getAttribute(n).split(M),S=/([.?@])?(.*)/.exec(v);l.push({type:1,index:i,name:S[2],strings:p,ctor:S[1]==="."?vt:S[1]==="?"?_t:S[1]==="@"?$t:R}),o.removeAttribute(n)}else n.startsWith(M)&&(l.push({type:6,index:i}),o.removeAttribute(n));if(oe.test(o.tagName)){let n=o.textContent.split(M),v=n.length-1;if(v>0){o.textContent=nt?nt.emptyScript:"";for(let p=0;p<v;p++)o.append(n[p],J()),D.nextNode(),l.push({type:2,index:++i});o.append(n[v],J())}}}else if(o.nodeType===8)if(o.data===re)l.push({type:2,index:i});else{let n=-1;for(;(n=o.data.indexOf(M,n+1))!==-1;)l.push({type:7,index:i}),n+=M.length-1}i++}}static createElement(t,e){let s=U.createElement("template");return s.innerHTML=t,s}};yt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??U).importNode(e,!0);D.currentNode=o;let i=D.nextNode(),a=0,d=0,l=s[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Z(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new xt(i,this,t)),this._$AV.push(c),l=s[++d]}a!==l?.index&&(i=D.nextNode(),a++)}return D.currentNode=U,o}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=H(this,t,e),K(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==O&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Le(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&K(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Y.createElement(ie(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{let i=new yt(o,this),a=i.u(this.options);i.p(e),this.T(a),this._$AH=i}}_$AC(t){let e=ee.get(t.strings);return e===void 0&&ee.set(t.strings,e=new Y(t)),e}k(t){wt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,o=0;for(let i of t)o===e.length?e.push(s=new r(this.O(J()),this.O(J()),this,this.options)):s=e[o],s._$AI(i),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,i){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(t,e=this,s,o){let i=this.strings,a=!1;if(i===void 0)t=H(this,t,e,0),a=!K(t)||t!==this._$AH&&t!==O,a&&(this._$AH=t);else{let d=t,l,c;for(t=i[0],l=0;l<i.length-1;l++)c=H(this,d[s+l],e,l),c===O&&(c=this._$AH[l]),a||(a=!K(c)||c!==this._$AH[l]),c===m?t=m:t!==m&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}a&&!o&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},vt=class extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},_t=class extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},$t=class extends R{constructor(t,e,s,o,i){super(t,e,s,o,i),this.type=5}_$AI(t,e=this){if((t=H(this,t,e,0)??m)===O)return;let s=this._$AH,o=t===m&&s!==m||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==m&&(s===m||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},xt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}},Fe=W.litHtmlPolyfillSupport;Fe?.(Y,Z),(W.litHtmlVersions??(W.litHtmlVersions=[])).push("3.3.0");ae=(r,t,e)=>{let s=e?.renderBefore??t,o=s._$litPart$;if(o===void 0){let i=e?.renderBefore??null;s._$litPart$=o=new Z(t.insertBefore(J(),i),i,void 0,e??{})}return o._$AI(r),o}});var G,b,Ve,ne=C(()=>{F();F();lt();lt();G=globalThis,b=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ae(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}};b._$litElement$=!0,b.finalized=!0,G.litElementHydrateSupport?.({LitElement:b});Ve=G.litElementPolyfillSupport;Ve?.({LitElement:b});(G.litElementVersions??(G.litElementVersions=[])).push("4.2.0")});var le=C(()=>{});var N=C(()=>{F();lt();ne();le()});var fe={};Me(fe,{CleverioPf100CardEditor:()=>st});var st,Ct=C(()=>{N();st=class extends b{constructor(){super(),this.config={sensor:"",title:""}}setConfig(t){this.config={...t}}_onInput(t){let{name:e,value:s}=t.target;this.config={...this.config,[e]:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config}}))}render(){return g`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor||""} @input=${this._onInput} />
      </label>
      <label>Title:
        <input name="title" .value=${this.config.title||""} @input=${this._onInput} />
      </label>
    `}};f(st,"properties",{config:{type:Object}});customElements.define("cleverio-pf100-card-editor",st)});N();var de=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};F();var We={attribute:!0,type:String,converter:B,reflect:!1,hasChanged:at},Je=(r=We,t,e)=>{let{kind:s,metadata:o}=e,i=globalThis.litPropertyMetadata.get(o);if(i===void 0&&globalThis.litPropertyMetadata.set(o,i=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),i.set(e.name,r),s==="accessor"){let{name:a}=e;return{set(d){let l=t.get.call(this);t.set.call(this,d),this.requestUpdate(a,l,r)},init(d){return d!==void 0&&this.C(a,void 0,r,d),d}}}if(s==="setter"){let{name:a}=e;return function(d){let l=this[a];t.call(this,d),this.requestUpdate(a,l,r)}}throw Error("Unsupported decorator location: "+s)};function Q(r){return(t,e)=>typeof e=="object"?Je(r,t,e):((s,o,i)=>{let a=o.hasOwnProperty(i);return o.constructor.createProperty(i,s),a?Object.getOwnPropertyDescriptor(o,i):void 0})(r,t,e)}function X(r){return Q({...r,state:!0,attribute:!1})}function St(r){let t={Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,Saturday:0,Sunday:0};return r.forEach(e=>{if(e.enabled){for(let s=0;s<7;s++)if(e.daysMask&1<<s){let o=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][s];t[o]+=e.portion}}}),t}function ce(r,t){let e=0;return r.forEach(s=>{s.enabled&&s.daysMask&1<<["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(t)&&(e+=s.portion)}),e}function he(r){let t=r.map(e=>`${e.time},${e.portion},${e.daysMask},${e.enabled?1:0}`).join(";");return btoa(t)}function ue(r){try{return atob(r).split(";").filter(Boolean).map(e=>{let[s,o,i,a]=e.split(",");return{time:s,portion:Number(o),daysMask:Number(i),enabled:a==="1"}})}catch{throw new Error("Invalid base64")}}function tt(r,t){return!Array.isArray(r)||!Array.isArray(t)||r.length!==t.length?!1:r.every((e,s)=>e.time===t[s].time&&e.portion===t[s].portion&&e.daysMask===t[s].daysMask&&e.enabled===t[s].enabled)}N();N();var z=w`
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
`,pe=w`
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
`;var et=class extends b{constructor(){super(),this.meals=[],this.title="Cleverio Pet Feeder"}render(){let t=this.meals.filter(o=>o.enabled).length,e=new Date().toLocaleDateString("en-US",{weekday:"long"}),s=ce(this.meals.filter(o=>o.enabled),e)*6;return g`
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
    `}_onManageSchedules(){this.dispatchEvent(new CustomEvent("manage-schedules",{bubbles:!0,composed:!0}))}};f(et,"properties",{meals:{type:Array},title:{type:String}}),f(et,"styles",[z,w`
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
    `]);customElements.define("cleverio-overview-view",et);N();var Et=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],Ye={Monday:"Mon",Tuesday:"Tue",Wednesday:"Wed",Thursday:"Thu",Friday:"Fri",Saturday:"Sat",Sunday:"Sun"};function Ze(r){return r.reduce((t,e)=>t|ge(e),0)}function me(r){return Et.filter((t,e)=>(r&1<<e)!==0)}function ge(r){return 1<<Et.indexOf(r)}function Ge(){return["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Monday"]}function Qe(r){if(r===31)return"Weekdays";if(r===96)return"Weekend";if(r===127)return"Every day";let t=me(r);return t.length===1?t[0]:t.length===0?"":t.map(e=>Ye[e]).join(", ")}var ct={DAYS:Et,daysArrayToBitmask:Ze,bitmaskToDaysArray:me,getDayBit:ge,getUIDays:Ge,getDaysLabel:Qe};N();var kt=class extends b{static get properties(){return{meal:{type:Object},_time:{state:!0},_portion:{state:!0},_daysMask:{state:!0}}}constructor(){super(),this.meal={time:"",portion:1,daysMask:0,enabled:!0},this._time="",this._portion=1,this._daysMask=0}updated(t){t.has("meal")&&this.meal&&(this._time=this.meal.time||"",this._portion=this.meal.portion||1,this._daysMask=this.meal.daysMask||0)}render(){return g`
      <form class="edit-form" @submit=${this._onSave}>
        <h3 class="edit-title" style="margin-top:0; text-align:left;">Edit Meal</h3>
        <div class="edit-days-row" style="justify-content:flex-start;">
          ${ct.DAYS.map((t,e)=>g`
            <ha-button outlined class="day-btn${this._daysMask&1<<e?" selected":""}" @click=${s=>this._toggleDay(s,e)}>${t.slice(0,2)}</ha-button>
          `)}
        </div>
        <div class="edit-fields-row">
          <label>Time:
            <ha-textfield class="edit-time" type="time" required .value=${this._time} @input=${t=>this._time=t.target.value}></ha-textfield>
          </label>
        </div>
        <div class="edit-portion-row">
          <label style="position:relative; display:block;">
            <span style="display:flex; align-items:center; gap:0.5em;">
              Portion:
              <span class="portion-helper-inline">(1 portion = 6g)</span>
            </span>
            <ha-textfield class="edit-portion" type="number" min="1" required .value=${this._portion} @input=${t=>this._portion=Number(t.target.value)}></ha-textfield>
          </label>
        </div>
        <span class="suggested-label">Suggested:</span>
        <div class="suggested-times-btn-row">
          ${["07:00","12:00","18:00"].map(t=>g`<ha-button outlined class="suggested-time-btn" @click=${e=>this._suggestTime(e,t)}>${t}</ha-button>`)}
        </div>
        <div class="edit-divider"></div>
        <menu>
          <ha-button class="back-to-list-btn" @click=${this._onBack}>Back</ha-button>
          <ha-button class="edit-save-btn" type="submit">Save</ha-button>
        </menu>
      </form>
    `}_toggleDay(t,e){t.preventDefault(),this._daysMask^=1<<e}_suggestTime(t,e){t.preventDefault(),this._time=e}_onBack(t){t.preventDefault(),this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_onSave(t){t.preventDefault();let e={...this.meal,time:this._time,portion:this._portion,daysMask:this._daysMask,enabled:!0};this.dispatchEvent(new CustomEvent("save",{detail:{meal:e},bubbles:!0,composed:!0}))}};f(kt,"styles",[z,w`
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
    `]);var Mt=class extends b{static get properties(){return{meals:{type:Array},_localMeals:{state:!0},_view:{state:!0},_editIdx:{state:!0}}}constructor(){super(),this.meals=[],this._localMeals=[],this._view="table",this._editIdx=null}updated(t){t.has("meals")&&(this._localMeals=this.meals.map(e=>({...e})),this._view="table",this._editIdx=null)}render(){return this._view==="edit"?this._renderEditView():g`
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
            ${this._localMeals.length===0?g`<tr><td colspan="5" style="text-align:center;color:#888;">No schedules yet</td></tr>`:this._localMeals.map((t,e)=>g`
                  <tr>
                    <td>${t.time}</td>
                    <td>${t.portion}</td>
                    <td>${ct.getDaysLabel(t.daysMask||0)}</td>
                    <td><ha-checkbox class="enabled-checkbox" .checked=${t.enabled} @change=${s=>this._toggleEnabled(e,s)}></ha-checkbox></td>
                    <td><span class="action-btns">
                      <button type="button" class="edit-row-btn icon-btn" @click=${()=>this._emitEditMeal(e)} aria-label="Edit schedule">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                      </button>
                      <button type="button" class="delete-row-btn icon-btn" @click=${()=>this._delete(e)} aria-label="Delete schedule">
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
          <button class="save-btn" @click=${this._save} .disabled=${tt(this._localMeals,this.meals)} style=${tt(this._localMeals,this.meals)?"":"background: var(--error-color, #e53935); color: var(--text-primary-color, #fff); box-shadow: 0 0 0 2px var(--error-color, #e53935)33;"}>Save</button>
        </div>
        <div class="save-helper" style="color:${tt(this._localMeals,this.meals)?"var(--secondary-text-color, #888)":"var(--error-color, #e53935)"};">
          ${tt(this._localMeals,this.meals)?"No changes to save.":"You have unsaved changes."}
        </div>
      </div>
    `}_toggleEnabled(t,e){this._localMeals[t].enabled=e.target.checked,this.requestUpdate()}_emitEditMeal(t){this.dispatchEvent(new CustomEvent("edit-meal",{detail:{meal:this._localMeals[t]},bubbles:!0,composed:!0}))}_delete(t){this._localMeals.splice(t,1),this.requestUpdate()}_add(){this._editIdx=null,this._view="edit"}_cancel(){this.dispatchEvent(new CustomEvent("close-dialog",{bubbles:!0,composed:!0}))}_save(){this.dispatchEvent(new CustomEvent("save",{detail:{meals:this._localMeals},bubbles:!0,composed:!0}))}_renderEditView(){let t=this._editIdx!=null?this._localMeals[this._editIdx]:{time:"",portion:1,daysMask:0,enabled:!0};return g`
      <cleverio-edit-view
        .meal=${t}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></cleverio-edit-view>
    `}_onEditSave(t){let e=t.detail.meal;this._editIdx!=null?this._localMeals[this._editIdx]=e:this._localMeals=[...this._localMeals,e],this._view="table",this._editIdx=null,this.requestUpdate()}_onEditBack(){this._view="table",this._editIdx=null,this.requestUpdate()}};f(Mt,"styles",[z,pe,w`
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
    `]);Ct();var be,ye,ve,_e,$e,xe,we,Ae,h,Tt,Pt,Dt,Ut,Ot,Nt;Ae=[de("cleverio-pf100-card")];var x=class extends(we=b,xe=[Q({type:Object})],$e=[Q({type:Object})],_e=[X()],ve=[X()],ye=[X()],be=[X()],we){constructor(){super();T(this,Tt,y(h,8,this)),y(h,11,this);T(this,Pt,y(h,12,this)),y(h,15,this);T(this,Dt,y(h,16,this,[])),y(h,19,this);T(this,Ut,y(h,20,this,[])),y(h,23,this);T(this,Ot,y(h,24,this,null)),y(h,27,this);T(this,Nt,y(h,28,this)),y(h,31,this);f(this,"_onManageSchedules",()=>{this._dialogView="schedules",this._dialogData=null});f(this,"_onEditMeal",e=>{this._dialogView="edit",this._dialogData=e.detail.meal});f(this,"_onEditBack",()=>{this._dialogView="schedules",this._dialogData=null});f(this,"_onDialogClose",()=>{this._dialogView=null,this._dialogData=void 0});f(this,"_onSaveSchedules",e=>{this._meals=e.detail.meals,this._saveMealsToSensor(),this._dialogView=null,this._dialogData=void 0});f(this,"_onSaveEdit",e=>{let s=e.detail.meal,o=!1;this._meals=this._meals.map(i=>i.time===s.time&&i.daysMask===s.daysMask?(o=!0,s):i),o||(this._meals=[...this._meals,s]),this._saveMealsToSensor(),this._dialogView=null,this._dialogData=void 0});this.hass=void 0,this.config=void 0,this._meals=[],this._persistedMeals=[],this._dialogView=null,this._dialogData=void 0}setConfig(e){this.config=e,this._checkConfig(),this._updateConfig()}updated(e){e.has("hass")&&this._updateHass()}get _sensorID(){return this.config?.sensor}get _stateObj(){return this.hass?.states?.[this._sensorID]}get _attributes(){return this._stateObj?.attributes||{}}get _name(){return this._attributes.friendly_name||this._sensorID}_checkConfig(){if(!this.config?.sensor)throw new Error("Please define a sensor!")}_updateConfig(){this.requestUpdate()}_updateHass(){let e=this._stateObj,s=null;if(e)try{s=ue(e.state),Array.isArray(s)&&(this._persistedMeals=s)}catch(o){console.error("Failed to decode meal plan:",o)}Array.isArray(this._persistedMeals)?this._meals=JSON.parse(JSON.stringify(this._persistedMeals)):(this._persistedMeals=[],this._meals=[]),this.requestUpdate()}render(){return g`
      <ha-card>
        <cleverio-overview-view
          .meals=${this._meals}
          .title=${this.config?.title||"Cleverio Pet Feeder"}
          @manage-schedules=${this._onManageSchedules}
        ></cleverio-overview-view>
        <slot></slot>
        ${this._dialogView?g`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose}>
                ${this._dialogView==="schedules"?g`<cleverio-schedules-view
                      .meals=${this._meals}
                      @edit-meal=${this._onEditMeal}
                      @close-dialog=${this._onDialogClose}
                      @save=${this._onSaveSchedules}
                    ></cleverio-schedules-view>`:this._dialogView==="edit"?g`<cleverio-edit-view
                      .meal=${this._dialogData}
                      @back=${this._onEditBack}
                      @save=${this._onSaveEdit}
                    ></cleverio-edit-view>`:""}
              </ha-dialog>
            `:""}
      </ha-card>
    `}_saveMealsToSensor(){let e=he(this._meals);this.hass.callService("text","set_value",{entity_id:this._sensorID,value:e}),setTimeout(()=>this._updateHass(),500)}static async getConfigElement(){return await Promise.resolve().then(()=>(Ct(),fe)),document.createElement("cleverio-pf100-card-editor")}static getStubConfig(){return{sensor:"",title:"Cleverio Pet Feeder"}}static getCardSize(e){return 2}getNextSchedule(){return this._meals&&this._meals.length?this._meals[0].time:"-"}getTotalFoodPerDay(){return typeof St=="function"?St(this._meals||[]):{}}};h=Bt(we),Tt=new WeakMap,Pt=new WeakMap,Dt=new WeakMap,Ut=new WeakMap,Ot=new WeakMap,Nt=new WeakMap,E(h,4,"hass",xe,x,Tt),E(h,4,"config",$e,x,Pt),E(h,4,"_meals",_e,x,Dt),E(h,4,"_persistedMeals",ve,x,Ut),E(h,4,"_dialogView",ye,x,Ot),E(h,4,"_dialogData",be,x,Nt),x=E(h,0,"CleverioPf100Card",Ae,x),y(h,1,x);export{x as CleverioPf100Card};
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
