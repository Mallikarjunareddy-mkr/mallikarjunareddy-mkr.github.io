(function(global){
  "use strict";

  const $Util = {
    escapeHTML(str){ const div=document.createElement('div'); div.textContent=str; return div.innerHTML; },
    css(el,styles){ if(typeof styles==='string') el.style.cssText=styles; else Object.assign(el.style,styles); },
    debounce(fn,delay){ let t; return function(...args){ clearTimeout(t); t=setTimeout(()=>fn.apply(this,args),delay); }; }
  };

  class MiniElement {
    constructor(elements){
      if(elements instanceof Element) this.elements=[elements];
      else if(Array.isArray(elements)) this.elements=elements;
      else if(elements instanceof NodeList) this.elements=Array.from(elements);
      else this.elements=[];
    }

    // ---------------- Core Methods ----------------
    Child(child){ this.elements.forEach(el=>{ if(typeof child==="string") el.insertAdjacentHTML("beforeend",child); else el.appendChild(child); }); return this; }
    Text(txt){ if(txt===undefined) return this.elements[0]?.textContent; this.elements.forEach(el=>el.textContent=txt); return this; }
    HTML(html){ if(html===undefined) return this.elements[0]?.innerHTML; this.elements.forEach(el=>el.innerHTML=html); return this; }
    Remove(){ this.elements.forEach(el=>el.remove()); return this; }
    Empty(){ this.elements.forEach(el=>el.innerHTML=""); return this; }
    ToggleClass(cls){ this.elements.forEach(el=>el.classList.toggle(cls)); return this; }
    AddClass(cls){ this.elements.forEach(el=>el.classList.add(cls)); return this; }
    RemoveClass(cls){ this.elements.forEach(el=>el.classList.remove(cls)); return this; }
    Show(){ this.elements.forEach(el=>el.style.display=""); return this; }
    Hide(){ this.elements.forEach(el=>el.style.display="none"); return this; }
    css(styles){ this.elements.forEach(el=>$Util.css(el,styles)); return this; }
    attr(k,v){ if(v===undefined) return this.elements[0]?.getAttribute(k); this.elements.forEach(el=>el.setAttribute(k,v)); return this; }
    on(events,handler){ events.split(" ").forEach(e=>this.elements.forEach(el=>el.addEventListener(e,handler))); return this; }

    // ---------------- UI Components ----------------
    Dropdown(targetSel){
      const btn=this.elements[0], dd=$(targetSel).elements[0];
      btn.addEventListener("click",()=>{ dd.classList.toggle("show"); btn.setAttribute("aria-expanded",dd.classList.contains("show")); });
      document.addEventListener("click",e=>{ if(!btn.contains(e.target) && !dd.contains(e.target)) dd.classList.remove("show"); });
      return this;
    }

    Modal({title,content,width="500px"}){
      const overlay=document.createElement("div"); overlay.className="modal-overlay";
      const box=document.createElement("div"); box.className="modal-box"; box.style.maxWidth=width;
      box.innerHTML=`<h3>${$Util.escapeHTML(title)}</h3>${content}<button class='closeBtn'>Close</button>`;
      overlay.appendChild(box); document.body.appendChild(overlay);
      overlay.querySelector(".closeBtn").addEventListener("click",()=>overlay.remove());
      overlay.addEventListener("click",e=>{if(e.target===overlay) overlay.remove();});
      document.addEventListener("keydown",function escListener(e){if(e.key==="Escape"){overlay.remove();document.removeEventListener("keydown",escListener);}});
      return this;
    }

    Card({title,content,click}){
      const card=document.createElement("div"); card.className="card";
      card.innerHTML=`<h3>${$Util.escapeHTML(title)}</h3><p>${$Util.escapeHTML(content)}</p>`;
      if(click) card.addEventListener("click",click);
      this.Child(card); return $(card);
    }

    Gallery(imgArr){
      this.elements.forEach(parent=>{
        imgArr.forEach(src=>{
          const img=document.createElement("img"); img.src=src; img.style.cursor="pointer";
          parent.appendChild(img);
          img.addEventListener("click",()=>$(parent).Modal({title:"Image Preview",content:`<img src='${src}' style='width:100%;border-radius:6px;'>`}));
        });
      });
      return this;
    }

    Alert(msg,type="info",duration=2000){
      const el=document.createElement("div"); el.textContent=msg; el.className="alert "+type;
      document.body.appendChild(el); setTimeout(()=>el.remove(),duration); return this;
    }

    Animate(props,duration=300,easing="linear",callback=null){
      const easingFuncs={linear:t=>t,easeIn:t=>t*t,easeOut:t=>t*(2-t),easeInOut:t=>t<0.5?2*t*t:-1+(4-2*t)*t};
      this.elements.forEach(el=>{
        const start={}; for(let p in props) start[p]=parseFloat(getComputedStyle(el)[p])||0;
        const startTime=performance.now();
        const tick=time=>{
          let t=(time-startTime)/duration; if(t>1) t=1; const ease=easingFuncs[easing](t);
          for(let p in props) el.style[p]=start[p]+(props[p]-start[p])*ease+(p==="opacity"?"":"px");
          if(t<1) requestAnimationFrame(tick); else{ if(callback) callback(); }
        };
        requestAnimationFrame(tick);
      });
      return this;
    }
  }

  // ---------------- $ Selector / Creator ----------------
  const $ = (selectorOrTag, attrs)=>{
    let el;
    if(/^</.test(selectorOrTag)){
      const div=document.createElement("div"); div.innerHTML=selectorOrTag.trim(); el=div.firstChild;
      if(attrs) for(let k in attrs){ if(k==="style") $Util.css(el,attrs.style); else el.setAttribute(k,attrs[k]); }
      return new MiniElement(el);
    } else if(!selectorOrTag.startsWith("#") && !selectorOrTag.startsWith(".")){
      el=document.createElement(selectorOrTag);
      if(attrs) for(let k in attrs){ if(k==="style") $Util.css(el,attrs.style); else el.setAttribute(k,attrs[k]); }
      return new MiniElement(el);
    } else {
      el=document.querySelectorAll(selectorOrTag); return new MiniElement(el);
    }
  };

  global.$ = $;

})(window);
