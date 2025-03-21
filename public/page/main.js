"use strict";var s={data:"",style:"cover",size:"100",opacity:"100",hue:"0",grayscale:"0",blur:"0"},h={protectPinned:!0,protectGroups:!0},c={color:"",image:s,tab:h};var t={form:document.getElementById("form"),formToggle:document.getElementById("formToggle"),color:document.querySelector('input[name="color"]'),colorHex:document.getElementById("colorHex"),imageSettings:document.getElementById("imageSettings"),imageChoose:document.getElementById("imageChoose"),imageData:document.querySelector('input[name="imageData"]'),imageSize:document.querySelector('input[name="imageSize"]'),imageOpacity:document.querySelector('input[name="imageOpacity"]'),imageHue:document.querySelector('input[name="imageHue"]'),imageGrayscale:document.querySelector('input[name="imageGrayscale"]'),imageBlur:document.querySelector('input[name="imageBlur"]'),imageRemove:document.getElementById("imageRemove"),imageOverlay:document.getElementById("imageOverlay"),shortcutLink:document.getElementById("shortcutLink"),tabShortcut:document.getElementById("tabShortcut"),tabProtectPinned:document.querySelector('input[name="tabProtectPinned"]'),tabProtectGroups:document.querySelector('input[name="tabProtectGroups"]'),reset:document.getElementById("reset")},S=!1,r=!1,n="",m=!1;function b(){function l(){let e=structuredClone(c),a=new FormData(t.form);e.color=r?String(a.get("color")):"",e.image.data=n,e.image.style=String(a.get("imageStyle")),e.image.size=String(a.get("imageSize")),e.image.opacity=String(a.get("imageOpacity")),e.image.hue=String(a.get("imageHue")),e.image.grayscale=String(a.get("imageGrayscale")),e.image.blur=String(a.get("imageBlur")),e.tab.protectPinned=t.tabProtectPinned.checked,e.tab.protectGroups=t.tabProtectGroups.checked,chrome.storage.local.set({settings:e})}function i(e=""){(!e||!r)&&(window.matchMedia("(prefers-color-scheme: dark)").matches?t.color.value="#16191e":t.color.value="#e4e6e6",r=!1),document.documentElement.style.backgroundColor=r?e:"",r?t.colorHex.innerText=e:t.colorHex.innerText=chrome.i18n.getMessage("bgColorChoose")}function o(){n?(t.imageSettings.classList.remove("hidden"),t.imageChoose.classList.add("hidden"),t.imageData.disabled=!0,t.imageRemove.classList.remove("hidden")):(t.imageSettings.classList.add("hidden"),t.imageChoose.classList.remove("hidden"),t.imageData.disabled=!1,t.imageRemove.classList.add("hidden"))}function u(e){if(e===!1&&(n="",m=!1),o(),!S&&n)t.imageOverlay.style.backgroundImage=`url("${n}")`;else if((!e||e.size===0)&&!m&&!n)t.imageOverlay.style.backgroundImage="",t.imageData.value="";else if(e&&m){if(m=!1,e.size===0)return;if(e.size>8e6){alert(chrome.i18n.getMessage("bgImageTooLarge"));return}let a=new FileReader;a.onloadend=()=>{n=String(a.result),t.imageOverlay.style.backgroundImage=`url("${n}")`,l(),o()},a.readAsDataURL(e)}}function d(e=structuredClone(s)){e.style==="cover"?(t.imageSize.disabled=!0,t.imageOverlay.style.backgroundSize=e.style):(t.imageSize.disabled=!1,t.imageOverlay.style.backgroundSize=`${e.size}%`),t.imageOverlay.style.backgroundRepeat=e.style==="repeat"?"repeat":"",t.imageOverlay.style.opacity=`${e.opacity}%`;let a=[];e.hue&&a.push(`hue-rotate(${e.hue}deg)`),e.grayscale&&a.push(`grayscale(${e.grayscale})`),e.blur&&a.push(`blur(${e.blur}px)`),t.imageOverlay.style.filter=a.length?a.join(" "):"",t.imageSize.value=e.size,t.imageOpacity.value=e.opacity,t.imageHue.value=e.hue,t.imageGrayscale.value=e.grayscale,t.imageBlur.value=e.blur,document.querySelectorAll('input[name="style"]').forEach(g=>{g.checked=g.value===e.style})}function y(){let e=new FormData(t.form);(this==null?void 0:this.name)==="color"&&(r=!0),(this==null?void 0:this.name)==="imageData"&&(m=!0),e.get("style")||e.set("style","center"),i(String(e.get("color"))),u(e.get("imageData")),d({data:n,style:String(e.get("imageStyle")),size:String(t.imageSize.value),opacity:String(e.get("imageOpacity")),hue:String(e.get("imageHue")),grayscale:String(e.get("imageGrayscale")),blur:String(e.get("imageBlur"))}),S=!0}document.querySelectorAll("input, select").forEach(e=>{e.addEventListener("input",y),e.name==="color"&&e.addEventListener("input",l),e.name!=="image"&&e.addEventListener("change",l)}),chrome.commands.getAll().then(e=>{let a=e.filter(g=>g.name==="close-tab");!a.length||!a[0].shortcut||(t.tabShortcut.classList.add("text-primary"),t.tabShortcut.innerText=a[0].shortcut.split("").join(" "))});function f(e=null){e==="color"?i():e==="image"&&(u(!1),d()),l()}t.imageRemove.addEventListener("click",()=>{window.confirm(chrome.i18n.getMessage("bgImageRemoveConfirm"))&&f("image")}),t.reset.addEventListener("click",()=>{window.confirm(chrome.i18n.getMessage("bgColorResetConfirm"))&&f("color")}),y()}chrome.storage.local.get(["settings"]).then(l=>{if(l.settings){let{settings:i}=l;i={...c,...i},r=!!i.color,n=i.image.data,i.color&&(t.color.value=i.color),t.imageSize.value=i.image.size,t.imageOpacity.value=i.image.opacity,t.imageHue.value=i.image.hue,t.imageGrayscale.value=i.image.grayscale,t.imageBlur.value=i.image.blur,t.tabProtectPinned.checked=i.tab.protectPinned,t.tabProtectGroups.checked=i.tab.protectGroups;let o=document.querySelector(`input[name="imageStyle"][value="${i.image.style}"]`);o&&(o.checked=!0)}b()});t.shortcutLink.addEventListener("click",()=>{chrome.tabs.create({url:"chrome://extensions/shortcuts"})});
