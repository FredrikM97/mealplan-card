var It=Object.defineProperty;var Lt=(i,t,e)=>t in i?It(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var w=(i,t)=>()=>(i&&(t=i(i=0)),t);var c=(i,t,e)=>Lt(i,typeof t!="symbol"?t+"":t,e);var J,G,X,vt,U,_t,m,$t,tt,et=w(()=>{J=globalThis,G=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),vt=new WeakMap,U=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(G&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=vt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&vt.set(e,t))}return t}toString(){return this.cssText}},_t=i=>new U(typeof i=="string"?i:i+"",void 0,X),m=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new U(e,i,X)},$t=(i,t)=>{if(G)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=J.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},tt=G?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return _t(e)})(i):i});var jt,Bt,qt,Wt,Ft,Yt,$,xt,Vt,Jt,O,st,At,wt,y,K=w(()=>{et();et();({is:jt,defineProperty:Bt,getOwnPropertyDescriptor:qt,getOwnPropertyNames:Wt,getOwnPropertySymbols:Ft,getPrototypeOf:Yt}=Object),$=globalThis,xt=$.trustedTypes,Vt=xt?xt.emptyScript:"",Jt=$.reactiveElementPolyfillSupport,O=(i,t)=>i,st={toAttribute(i,t){switch(t){case Boolean:i=i?Vt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},At=(i,t)=>!jt(i,t),wt={attribute:!0,type:String,converter:st,reflect:!1,useDefault:!1,hasChanged:At};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),$.litPropertyMetadata??($.litPropertyMetadata=new WeakMap);y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=wt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Bt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=qt(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let h=r?.call(this);o?.call(this,a),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??wt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...Wt(e),...Ft(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(tt(r))}else t!==void 0&&e.push(tt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:st).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:st;this._$Em=r,this[r]=a.fromAttribute(e,o.type)??this._$Ej?.get(r)??null,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){let r=this.constructor,o=this[t];if(s??(s=r.getPropertyOptions(t)),!((s.hasChanged??At)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},a){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:a}=o,h=this[r];a!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,o,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[O("elementProperties")]=new Map,y[O("finalized")]=new Map,Jt?.({ReactiveElement:y}),($.reactiveElementVersions??($.reactiveElementVersions=[])).push("2.1.0")});function Ot(i,t){if(!dt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(t):t}function M(i,t,e=i,s){if(t===E)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=z(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=M(i,r._$AS(i,t.values),r,s)),t}var R,Z,St,Dt,x,Tt,Gt,k,H,z,dt,Kt,rt,N,kt,Et,A,Mt,Ct,Ut,ct,b,de,ce,E,p,Pt,S,Zt,I,it,L,C,ot,at,nt,lt,Qt,Nt,Q=w(()=>{R=globalThis,Z=R.trustedTypes,St=Z?Z.createPolicy("lit-html",{createHTML:i=>i}):void 0,Dt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt="?"+x,Gt=`<${Tt}>`,k=document,H=()=>k.createComment(""),z=i=>i===null||typeof i!="object"&&typeof i!="function",dt=Array.isArray,Kt=i=>dt(i)||typeof i?.[Symbol.iterator]=="function",rt=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,kt=/-->/g,Et=/>/g,A=RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mt=/'/g,Ct=/"/g,Ut=/^(?:script|style|textarea|title)$/i,ct=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),b=ct(1),de=ct(2),ce=ct(3),E=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Pt=new WeakMap,S=k.createTreeWalker(k,129);Zt=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",a=N;for(let h=0;h<e;h++){let n=i[h],d,u,l=-1,f=0;for(;f<n.length&&(a.lastIndex=f,u=a.exec(n),u!==null);)f=a.lastIndex,a===N?u[1]==="!--"?a=kt:u[1]!==void 0?a=Et:u[2]!==void 0?(Ut.test(u[2])&&(r=RegExp("</"+u[2],"g")),a=A):u[3]!==void 0&&(a=A):a===A?u[0]===">"?(a=r??N,l=-1):u[1]===void 0?l=-2:(l=a.lastIndex-u[2].length,d=u[1],a=u[3]===void 0?A:u[3]==='"'?Ct:Mt):a===Ct||a===Mt?a=A:a===kt||a===Et?a=N:(a=A,r=void 0);let v=a===A&&i[h+1].startsWith("/>")?" ":"";o+=a===N?n+Gt:l>=0?(s.push(d),n.slice(0,l)+Dt+n.slice(l)+x+v):n+x+(l===-2?h:v)}return[Ot(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},I=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,a=0,h=t.length-1,n=this.parts,[d,u]=Zt(t,e);if(this.el=i.createElement(d,s),S.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(r=S.nextNode())!==null&&n.length<h;){if(r.nodeType===1){if(r.hasAttributes())for(let l of r.getAttributeNames())if(l.endsWith(Dt)){let f=u[a++],v=r.getAttribute(l).split(x),Y=/([.?@])?(.*)/.exec(f);n.push({type:1,index:o,name:Y[2],strings:v,ctor:Y[1]==="."?ot:Y[1]==="?"?at:Y[1]==="@"?nt:C}),r.removeAttribute(l)}else l.startsWith(x)&&(n.push({type:6,index:o}),r.removeAttribute(l));if(Ut.test(r.tagName)){let l=r.textContent.split(x),f=l.length-1;if(f>0){r.textContent=Z?Z.emptyScript:"";for(let v=0;v<f;v++)r.append(l[v],H()),S.nextNode(),n.push({type:2,index:++o});r.append(l[f],H())}}}else if(r.nodeType===8)if(r.data===Tt)n.push({type:2,index:o});else{let l=-1;for(;(l=r.data.indexOf(x,l+1))!==-1;)n.push({type:7,index:o}),l+=x.length-1}o++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};it=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??k).importNode(e,!0);S.currentNode=r;let o=S.nextNode(),a=0,h=0,n=s[0];for(;n!==void 0;){if(a===n.index){let d;n.type===2?d=new L(o,o.nextSibling,this,t):n.type===1?d=new n.ctor(o,n.name,n.strings,this,t):n.type===6&&(d=new lt(o,this,t)),this._$AV.push(d),n=s[++h]}a!==n?.index&&(o=S.nextNode(),a++)}return S.currentNode=k,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},L=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),z(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Kt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=I.createElement(Ot(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new it(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=Pt.get(t.strings);return e===void 0&&Pt.set(t.strings,e=new I(t)),e}k(t){dt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(H()),this.O(H()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,r){let o=this.strings,a=!1;if(o===void 0)t=M(this,t,e,0),a=!z(t)||t!==this._$AH&&t!==E,a&&(this._$AH=t);else{let h=t,n,d;for(t=o[0],n=0;n<o.length-1;n++)d=M(this,h[s+n],e,n),d===E&&(d=this._$AH[n]),a||(a=!z(d)||d!==this._$AH[n]),d===p?t=p:t!==p&&(t+=(d??"")+o[n+1]),this._$AH[n]=d}a&&!r&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ot=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},at=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},nt=class extends C{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=M(this,t,e,0)??p)===E)return;let s=this._$AH,r=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},lt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}},Qt=R.litHtmlPolyfillSupport;Qt?.(I,L),(R.litHtmlVersions??(R.litHtmlVersions=[])).push("3.3.0");Nt=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new L(t.insertBefore(H(),o),o,void 0,e??{})}return r._$AI(i),r}});var j,g,Xt,Rt=w(()=>{K();K();Q();Q();j=globalThis,g=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};g._$litElement$=!0,g.finalized=!0,j.litElementHydrateSupport?.({LitElement:g});Xt=j.litElementPolyfillSupport;Xt?.({LitElement:g});(j.litElementVersions??(j.litElementVersions=[])).push("4.2.0")});var Ht=w(()=>{});var P=w(()=>{K();Q();Rt();Ht()});var te={};var F,ht=w(()=>{P();F=class extends g{setConfig(t){this.config={...t}}getConfig(){return this.config}_onInput(t){let e=t.target.name;this.config={...this.config,[e]:t.target.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config}}))}render(){return b`
      <div>
        <label>Title
          <input name="title" .value=${this.config?.title||""} @input=${this._onInput} />
        </label>
        <label>Sensor entity
          <input name="sensor" .value=${this.config?.sensor||""} @input=${this._onInput} />
        </label>
      </div>
    `}};c(F,"properties",{config:{type:Object}}),c(F,"styles",m`
    :host { display: block; padding: 8px; }
    label { display: flex; flex-direction: column; margin-bottom: 12px; }
    input { padding: 4px 8px; font-size: 1em; }
  `);customElements.define("cleverio-pf100-card-editor",F)});var _={DAYS:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],DAY_GROUPS:[{mask:31,label:"Weekdays"},{mask:96,label:"Weekend"},{mask:127,label:"Every day"}],getUIDays(){return[..._.DAYS.slice(1),_.DAYS[0]]},getDayBit(i){return 1<<_.DAYS.indexOf(i)},daysArrayToBitmask(i){return i.reduce((t,e)=>t|_.getDayBit(e),0)},bitmaskToDaysArray(i){return _.DAYS.filter((t,e)=>i&1<<e)},getDaysLabel(i){for(let e of _.DAY_GROUPS)if(i===e.mask)return e.label;let t=_.DAYS.filter((e,s)=>i&1<<s);return t.length===1?t[0]:t.map(e=>e.slice(0,3)).join(", ")}},V=_;function ut(i){if(!i||i==="unknown")return[];let t;try{t=atob(i)}catch{throw new Error("Invalid base64")}let e=new Uint8Array([...t].map(r=>r.charCodeAt(0)));if(e.length%5!==0)throw new Error("Invalid meal plan length");let s=[];for(let r=0;r<e.length;r+=5){let[o,a,h,n,d]=e.slice(r,r+5);s.push({time:`${a.toString().padStart(2,"0")}:${h.toString().padStart(2,"0")}`,daysMask:o,portion:n||1,enabled:d===1,status:d})}return s}function mt(i){let t=[];return i.forEach(e=>{let[s,r]=e.time.split(":").map(Number);t.push(e.daysMask,s,r,Number(e.portion),e.enabled?1:0)}),btoa(String.fromCharCode(...t))}function gt(i){let t=new Date,e=t.getDay()===0?6:t.getDay()-1,s=(i||[]).filter(r=>r.enabled&&r.daysMask&1<<e);if(!s.length)return"-";s.sort((r,o)=>r.time.localeCompare(o.time));for(let r of s)if(r.time>t.toTimeString().slice(0,5))return r.time;return s[0].time}function bt(i){let t=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],e={Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,Saturday:0,Sunday:0};for(let s of i||[])if(s.enabled){for(let r=0;r<7;r++)if(s.daysMask&1<<r){let o=t[r];e[o]+=s.portion||0}}return e}function ft(i,t){if(!t)return 0;let s=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(t);if(s===-1)return 0;let r=0;for(let o of i||[])o.enabled&&o.daysMask&1<<s&&(r+=o.portion||0);return r}function T(i,t){if(!Array.isArray(i)||!Array.isArray(t)||i.length!==t.length)return!1;let e=o=>`${o.time}|${o.portion}|${o.daysMask}`,s=new Map(i.map(o=>[e(o),o.enabled])),r=new Map(t.map(o=>[e(o),o.enabled]));if(s.size!==r.size)return!1;for(let[o,a]of s.entries())if(!r.has(o)||r.get(o)!==a)return!1;return!0}P();P();var D=m`
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
`,zt=m`
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
`;var B=class extends g{constructor(){super(),this.meals=[],this.title="Cleverio Pet Feeder"}render(){let t=this.meals.filter(r=>r.enabled).length,e=new Date().toLocaleDateString("en-US",{weekday:"long"}),s=ft(this.meals.filter(r=>r.enabled),e)*6;return b`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${this.title||"Cleverio Pet Feeder"}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this.meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${t}</span>
          <div class="overview-grams">Today: ${s}g (active)</div>
          <button class="manage-btn" @click=${this._onManageSchedules}>Manage schedules</button>
        </section>
      </ha-card>
    `}_onManageSchedules(){this.dispatchEvent(new CustomEvent("manage-schedules",{bubbles:!0,composed:!0}))}};c(B,"properties",{meals:{type:Array},title:{type:String}}),c(B,"styles",[m([D]),m`
      .overview-card {
        width: 100%;
        height: 100%; /* Only main card fills grid cell */
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
    `]);customElements.define("cleverio-overview-view",B);P();P();var q=class extends g{constructor(){super(),this.meal={time:"",portion:1,daysMask:0,enabled:!0},this._time="",this._portion=1,this._daysMask=0}updated(t){t.has("meal")&&this.meal&&(this._time=this.meal.time||"",this._portion=this.meal.portion||1,this._daysMask=this.meal.daysMask||0)}render(){return b`
      <form class="edit-form" @submit=${this._onSave}>
        <h3 class="edit-title" style="margin-top:0; text-align:left;">Edit Meal</h3>
        <div class="edit-days-row" style="justify-content:flex-start;">
          ${V.DAYS.map((t,e)=>b`
            <button type="button" class="day-btn${this._daysMask&1<<e?" selected":""}" @click=${s=>this._toggleDay(s,e)}>${t.slice(0,2)}</button>
          `)}
        </div>
        <div class="edit-fields-row">
          <label>Time:
            <input class="edit-time" type="time" required .value=${this._time} @input=${t=>this._time=t.target.value}>
          </label>
        </div>
        <div class="edit-portion-row">
          <label style="position:relative; display:block;">
            <span style="display:flex; align-items:center; gap:0.5em;">
              Portion:
              <span class="portion-helper-inline">(1 portion = 6g)</span>
            </span>
            <input class="edit-portion" type="number" min="1" required .value=${this._portion} @input=${t=>this._portion=Number(t.target.value)}>
          </label>
        </div>
        <span class="suggested-label">Suggested:</span>
        <div class="suggested-times-btn-row">
          ${["07:00","12:00","18:00"].map(t=>b`<button type="button" class="suggested-time-btn" @click=${e=>this._suggestTime(e,t)}>${t}</button>`)}
        </div>
        <div class="edit-divider"></div>
        <menu>
          <button type="button" class="button back-to-list-btn" @click=${this._onBack}>Back</button>
          <button type="submit" class="button edit-save-btn">Save</button>
        </menu>
      </form>
    `}_toggleDay(t,e){t.preventDefault(),this._daysMask^=1<<e}_suggestTime(t,e){t.preventDefault(),this._time=e}_onBack(t){t.preventDefault(),this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_onSave(t){t.preventDefault();let e={...this.meal,time:this._time,portion:this._portion,daysMask:this._daysMask,enabled:!0};this.dispatchEvent(new CustomEvent("save",{detail:{meal:e},bubbles:!0,composed:!0}))}};c(q,"properties",{meal:{type:Object},_time:{state:!0},_portion:{state:!0},_daysMask:{state:!0}}),c(q,"styles",[m([D]),m`
      .edit-form {
        max-width: 320px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--ha-card-section-margin, 1em);
        /* Remove border, background, border-radius to avoid double border */
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
      /* Remove the checkmark span entirely */
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
      .edit-form input[type="time"],
      .edit-form input[type="number"] {
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
      .edit-form input[type="time"]:focus,
      .edit-form input[type="number"]:focus {
        border: 1.5px solid var(--primary-color);
        background: var(--input-background-color, var(--ha-card-background));
      }
      .edit-portion { width: 100%; min-width: 0; }
      .portion-helper {
        display: none;
      }
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
      .suggested-time-btn {
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
      .suggested-time-btn:active, .suggested-time-btn:focus {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: var(--text-primary-color);
      }
      menu { display: flex; gap: 1em; justify-content: flex-end; margin-top: 1em; }
      .edit-save-btn, .back-to-list-btn {
        border-radius: var(--ha-card-border-radius, 8px);
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        font-weight: 500;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        padding: var(--ha-card-button-padding, 0.5em 1em);
      }
    `]);customElements.define("cleverio-edit-view",q);var W=class extends g{constructor(){super(),this.meals=[],this._localMeals=[],this._view="table",this._editIdx=null}updated(t){t.has("meals")&&(this._localMeals=this.meals.map(e=>({...e})),this._view="table",this._editIdx=null)}render(){return this._view==="edit"?this._renderEditView():b`
      <dialog class="schedules-dialog ha-card-style" open>
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
            ${this._localMeals.length===0?b`<tr><td colspan="5" style="text-align:center;color:#888;">No schedules yet</td></tr>`:this._localMeals.map((t,e)=>b`
                  <tr>
                    <td>${t.time}</td>
                    <td>${t.portion}</td>
                    <td>${V.getDaysLabel(t.daysMask||0)}</td>
                    <td><input type="checkbox" class="enabled-checkbox" .checked=${t.enabled} @input=${s=>this._toggleEnabled(e,s)}></td>
                    <td><span class="action-btns">
                      <button type="button" class="edit-row-btn icon-btn" @click=${()=>this._edit(e)} aria-label="Edit schedule">
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
          <button class="save-btn" @click=${this._save} .disabled=${T(this._localMeals,this.meals)} style=${T(this._localMeals,this.meals)?"":"background: var(--error-color, #e53935); color: var(--text-primary-color, #fff); box-shadow: 0 0 0 2px var(--error-color, #e53935)33;"}>Save</button>
        </div>
        <div class="save-helper" style="color:${T(this._localMeals,this.meals)?"var(--secondary-text-color, #888)":"var(--error-color, #e53935)"};">
          ${T(this._localMeals,this.meals)?"No changes to save.":"You have unsaved changes."}
        </div>
      </dialog>
    `}_toggleEnabled(t,e){this._localMeals[t].enabled=e.target.checked,this.requestUpdate()}_edit(t){this._editIdx=t,this._view="edit"}_delete(t){this._localMeals.splice(t,1),this.requestUpdate()}_add(){this._editIdx=null,this._view="edit"}_cancel(){this.dispatchEvent(new CustomEvent("close-dialog",{bubbles:!0,composed:!0}))}_save(){this.dispatchEvent(new CustomEvent("save",{detail:{meals:this._localMeals},bubbles:!0,composed:!0}))}_renderEditView(){let t=this._editIdx!=null?this._localMeals[this._editIdx]:{time:"",portion:1,daysMask:0,enabled:!0};return b`
      <dialog class="schedules-dialog ha-card-style edit-dialog-narrow" open>
        <cleverio-edit-view
          .meal=${t}
          @save=${this._onEditSave}
          @back=${this._onEditBack}
        ></cleverio-edit-view>
      </dialog>
    `}_onEditSave(t){let e=t.detail.meal;this._editIdx!=null?this._localMeals[this._editIdx]=e:this._localMeals=[...this._localMeals,e],this._view="table",this._editIdx=null,this.requestUpdate()}_onEditBack(){this._view="table",this._editIdx=null,this.requestUpdate()}};c(W,"properties",{meals:{type:Array},_localMeals:{state:!0},_view:{state:!0},_editIdx:{state:!0}}),c(W,"styles",[m([D]),m([zt]),m`
      dialog.schedules-dialog {
        max-width: 420px;
        min-width: 280px;
        width: 100%;
        margin: 0;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: var(--ha-card-border-width, 1.5px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,0.08));
        overflow: hidden;
      }
      dialog.schedules-dialog.edit-dialog-narrow {
        max-width: 340px;
        min-width: 220px;
      }
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
    `]);customElements.define("cleverio-schedules-dialog",W);ht();var pt=class extends HTMLElement{constructor(){super();c(this,"_config");c(this,"_hass");c(this,"_meals",[]);c(this,"_persistedMeals",[]);c(this,"_unsaved",!1);c(this,"_overlayView",null);this._meals=[],this._persistedMeals=[],this._unsaved=!1,this.attachShadow({mode:"open"})}setConfig(e){this._config=e,this._checkConfig(),this._updateConfig()}set hass(e){this._hass=e,this._updateHass()}getSensorID(){return this._config?.sensor}getState(){if(!(!this._hass||!this._config))return this._hass.states?.[this.getSensorID()]}getAttributes(){return this.getState()?.attributes||{}}getName(){return this.getAttributes().friendly_name||this.getSensorID()}_checkConfig(){if(!this._config?.sensor)throw new Error("Please define a sensor!")}_updateConfig(){this._render()}_updateHass(){let e=this.getState(),s=null;if(e)try{s=ut(e.state),Array.isArray(s)&&(this._persistedMeals=s)}catch(r){console.error("Failed to decode meal plan:",r)}Array.isArray(this._persistedMeals)?this._meals=JSON.parse(JSON.stringify(this._persistedMeals)):(this._persistedMeals=[],this._meals=[]),this._render()}_render(){if(!this.shadowRoot)return;this.shadowRoot.innerHTML="";let e=document.createElement("cleverio-overview-view");e.meals=this._meals,e.title=this._config?.title||"Cleverio Pet Feeder",e.addEventListener("manage-schedules",()=>{this._showSchedulesDialog()}),this.shadowRoot.appendChild(e),this._overlayView==="schedules"&&this._renderSchedulesDialog()}_showSchedulesDialog(){this._overlayView="schedules",this._render()}_closeOverlay(){this._overlayView=null,this._render()}_renderSchedulesDialog(){let e=this.shadowRoot.querySelector("cleverio-schedules-dialog");e&&e.remove();let s=document.createElement("cleverio-schedules-dialog");s.meals=this._meals,s.addEventListener("close-dialog",()=>this._closeOverlay()),s.addEventListener("save",r=>{this._meals=r.detail.meals,this._saveMealsToSensor(),this._closeOverlay()}),this.shadowRoot.appendChild(s)}_saveMealsToSensor(){let e=mt(this._meals);this._hass.callService("text","set_value",{entity_id:this.getSensorID(),value:e}),setTimeout(()=>this._updateHass(),500)}getNextSchedule(){return gt(this.feedingTimes||this._meals||[])}getTotalFoodPerDay(){return bt(this.feedingTimes||this._meals||[])}static async getConfigElement(){return await Promise.resolve().then(()=>(ht(),te)),document.createElement("cleverio-pf100-card-editor")}static getStubConfig(){return{sensor:"",title:"Cleverio Pet Feeder"}}static getCardSize(e){return 2}};customElements.define("cleverio-pf100-card",pt);
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
*/
//# sourceMappingURL=cleverio-pf100-feeder-card.bundle.js.map
