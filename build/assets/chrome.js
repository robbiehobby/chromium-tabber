const g=(e,t)=>t.some(n=>e instanceof n);let B,p;function x(){return B||(B=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function v(){return p||(p=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const m=new WeakMap,h=new WeakMap,f=new WeakMap;function k(e){const t=new Promise((n,r)=>{const i=()=>{e.removeEventListener("success",c),e.removeEventListener("error",o)},c=()=>{n(u(e.result)),i()},o=()=>{r(e.error),i()};e.addEventListener("success",c),e.addEventListener("error",o)});return f.set(t,e),t}function O(e){if(m.has(e))return;const t=new Promise((n,r)=>{const i=()=>{e.removeEventListener("complete",c),e.removeEventListener("error",o),e.removeEventListener("abort",o)},c=()=>{n(),i()},o=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",c),e.addEventListener("error",o),e.addEventListener("abort",o)});m.set(e,t)}let w={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return m.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return u(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function S(e){w=e(w)}function j(e){return v().includes(e)?function(...t){return e.apply(I(this),t),u(this.request)}:function(...t){return u(e.apply(I(this),t))}}function T(e){return typeof e=="function"?j(e):(e instanceof IDBTransaction&&O(e),g(e,x())?new Proxy(e,w):e)}function u(e){if(e instanceof IDBRequest)return k(e);if(h.has(e))return h.get(e);const t=T(e);return t!==e&&(h.set(e,t),f.set(t,e)),t}const I=e=>f.get(e);function A(e,t,{blocked:n,upgrade:r,blocking:i,terminated:c}={}){const o=indexedDB.open(e,t),d=u(o);return r&&o.addEventListener("upgradeneeded",s=>{r(u(o.result),s.oldVersion,s.newVersion,u(o.transaction),s)}),n&&o.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),d.then(s=>{c&&s.addEventListener("close",()=>c()),i&&s.addEventListener("versionchange",a=>i(a.oldVersion,a.newVersion,a))}).catch(()=>{}),d}const V=["get","getKey","getAll","getAllKeys","count"],W=["put","add","delete","clear"],y=new Map;function E(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(y.get(t))return y.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=W.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||V.includes(n)))return;const c=async function(o,...d){const s=this.transaction(o,i?"readwrite":"readonly");let a=s.store;return r&&(a=a.index(d.shift())),(await Promise.all([a[n](...d),i&&s.done]))[0]};return y.set(t,c),c}S(e=>({...e,get:(t,n,r)=>E(t,n)||e.get(t,n,r),has:(t,n)=>!!E(t,n)||e.has(t,n)}));const _=["continue","continuePrimaryKey","advance"],M={},D=new WeakMap,C=new WeakMap,F={get(e,t){if(!_.includes(t))return e[t];let n=M[t];return n||(n=M[t]=function(...r){D.set(this,C.get(this)[t](...r))}),n}};async function*K(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,F);for(C.set(n,t),f.set(n,I(t));t;)yield n,t=await(D.get(n)||t.continue()),D.delete(n)}function P(e,t){return t===Symbol.asyncIterator&&g(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&g(e,[IDBIndex,IDBObjectStore])}S(e=>({...e,get(t,n,r){return P(t,n)?K:e.get(t,n,r)},has(t,n){return P(t,n)||e.has(t,n)}}));const L=A("nanotab",1,{upgrade(e){e.createObjectStore("key_value")}});function l(){}l.get=async e=>(await L).get("key_value",e);l.set=async(e,t)=>(await L).put("key_value",t,e);const N={color:{light:null,dark:null},image:{style:"cover",size:100,opacity:100,hue:0,grayscale:0,blur:0},closeTab:{pinned:!0,grouped:!0}};function b(){}b.getSettings=async()=>{const e=structuredClone(N);let t=await l.get("settings");if(!Object.keys(t).length)try{t=(await chrome.storage.local.get(["page"])).page||e}catch{t=e}return t};b.saveSettings=async(e,t=!1)=>{await l.set("settings",e),window.localStorage.setItem("page-color",JSON.stringify(e.color));try{await chrome.storage.local.set({page:e})}catch{}t&&window.location.reload()};b.openShortcuts=()=>{try{chrome.tabs.create({url:"chrome://extensions/shortcuts"})}catch{}};export{b as c,N as d};
