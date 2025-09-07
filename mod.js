(function(global){

  // ---------------- Utilities
  const $Util = {
    extend(target,...sources){ sources.forEach(s=>Object.assign(target,s)); return target; },
    each(arr,fn){ arr.forEach(fn); },
    isArray(obj){ return Array.isArray(obj); },
    trim(str){ return str.trim(); },
    css(el,styles){ if(typeof styles==="string") el.style.cssText=styles; else Object.assign(el.style,styles); }
  };

  // ---------------- MiniElement wrapper
  class MiniElement {
    constructor(elements){
      if(elements instanceof Element) this.elements = [elements];
      else if(Array.isArray(elements)) this.elements = elements;
      else if(elements instanceof NodeList) this.elements = Array.from(elements);
    }

    // ---------------- DOM
    Child(child){ this.elements.forEach(el=>{ if(typeof child==="string") el.insertAdjacentHTML("beforeend",child); else el.appendChild(child); }); return this; }
    TextChild(text){ this.elements.forEach(el=>{ const span=document.createElement("span"); span.textContent=text; el.appendChild(span); }); return this; }
    Text(txt){ if(txt===undefined) return this.elements[0].textContent; this.elements.forEach(el=>el.textContent=txt); return this; }
    Remove(){ this.elements.forEach(el=>el.remove()); return this; }
    ToggleClass(cls){ this.elements.forEach(el=>el.classList.toggle(cls)); return this; }
    AddClass(cls){ this.elements.forEach(el=>el.classList.add(cls)); return this; }
    RemoveClass(cls){ this.elements.forEach(el=>el.classList.remove(cls)); return this; }
    Show(){ this.elements.forEach(el=>el.style.display=""); return this; }
    Hide(){ this.elements.forEach(el=>el.style.display="none"); return this; }
    RemoveChildren(){ this.elements.forEach(el=>el.innerHTML=""); return this; }
    css(styles){ this.elements.forEach(el=>$Util.css(el,styles)); return this; }

    // ---------------- Events
    on(event, selectorOrHandler, handler=null){
      if(typeof selectorOrHandler==="function"){ this.elements.forEach(el=>el.addEventListener(event,selectorOrHandler)); }
      else { this.elements.forEach(el=>el.addEventListener(event,e=>{ if(e.target.matches(selectorOrHandler)) handler(e); })); }
      return this;
    }
    off(event,handler){ this.elements.forEach(el=>el.removeEventListener(event,handler)); return this; }

    // ---------------- Animations
    FadeIn(duration=300){ this.elements.forEach(el=>Mini.Anim.FadeIn(el,duration)); return this; }
    FadeOut(duration=300){ this.elements.forEach(el=>Mini.Anim.FadeOut(el,duration)); return this; }
    SlideUp(duration=300){ this.elements.forEach(el=>Mini.Anim.SlideUp(el,duration)); return this; }
    SlideDown(duration=300){ this.elements.forEach(el=>Mini.Anim.SlideDown(el,duration)); return this; }
  }

  // ---------------- $ selector / creator
  const $ = (selectorOrTag,attrs)=>{
    let el;
    if(/^</.test(selectorOrTag)){ 
      const div=document.createElement("div"); div.innerHTML=selectorOrTag.trim(); el=div.firstChild; _parseAttrs(el,attrs); return new MiniElement(el);
    } else if(!selectorOrTag.startsWith("#") && !selectorOrTag.startsWith(".")){ 
      el=document.createElement(selectorOrTag); _parseAttrs(el,attrs); return new MiniElement(el);
    } else { 
      el=document.querySelectorAll(selectorOrTag); 
      return new MiniElement(el); 
    }
  };

  function _parseAttrs(el,attrs){
    if(!attrs) return;
    for(let k in attrs){
      if(k==="style") $Util.css(el,attrs.style);
      else if(k==="class") el.className=attrs[k];
      else if(k==="text") el.textContent=attrs[k];
      else el.setAttribute(k,attrs[k]);
    }
  }

  // ---------------- Mini Core
  const Mini = {

    // ---------------- Animations
    Anim:{
      FadeIn(el,duration=300){ el.style.opacity=0; el.style.display=""; let last=+new Date(); const tick=()=>{ let op=parseFloat(el.style.opacity); op+=(new Date()-last)/duration; el.style.opacity=Math.min(op,1); last=new Date(); if(op<1) requestAnimationFrame(tick); }; tick(); },
      FadeOut(el,duration=300){ let last=+new Date(); const tick=()=>{ let op=parseFloat(el.style.opacity||1); op-=(new Date()-last)/duration; el.style.opacity=Math.max(op,0); last=new Date(); if(op>0) requestAnimationFrame(tick); else el.style.display="none"; }; tick(); },
      SlideUp(el,duration=300){ el.style.transition=`height ${duration}ms`; el.style.height=el.offsetHeight+"px"; requestAnimationFrame(()=>el.style.height="0px"); setTimeout(()=>el.style.display="none",duration); },
      SlideDown(el,duration=300){ el.style.display="block"; const h=el.scrollHeight; el.style.height="0px"; el.style.transition=`height ${duration}ms`; requestAnimationFrame(()=>el.style.height=h+"px"); setTimeout(()=>el.style.height="",duration); }
    },

    // ---------------- AJAX / Fetch
    Fetch({url,method="GET",headers={},body=null}){
      return fetch(url,{method,headers,body}).then(r=>r.json());
    },

    // ---------------- Alerts / Modal
    Alert(msg,type="success",duration=1500){
      const alertBox=$("<div>",{text:msg,style:{position:"fixed",top:"20px",right:"20px",padding:"10px 20px",background:type==="success"?"#4caf50":"#f44336",color:"white",borderRadius:"4px",zIndex:1000}});
      document.body.appendChild(alertBox.elements[0]);
      setTimeout(()=>alertBox.Remove(),duration);
      return alertBox;
    },

    Modal({title="Modal",content="",width="300px"}){
      const overlay=$("<div>",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:"rgba(0,0,0,0.5)",zIndex:1000}});
      const box=$("<div>",{style:{background:"white",padding:"20px",borderRadius:"8px",width,maxWidth:"90%"}});
      box.Child([$("<h2>",{text:title}),$("<p>",{text:content}),$("<button>",{text:"Close"}).on("click",()=>overlay.Remove())]);
      overlay.Child(box);
      document.body.appendChild(overlay.elements[0]);
      return overlay;
    },

    // ---------------- Card / Gallery / Dropdown / Tabs
    Card(container,text,options={type:"task"}){
      const card=$("<div>",{class:options.type}); card.TextChild(text);
      const delBtn=$("<button>",{text:"Delete"}); card.Child(delBtn);
      if(container) $(container).Child(card);
      delBtn.on("click",e=>{ e.stopPropagation(); card.Remove(); Mini.Alert(`${options.type} deleted!`); });
      card.on("click",()=>card.ToggleClass("done"));
      return card;
    },

    Gallery(container,imagesArray){
      const parent=$(container); parent.RemoveChildren();
      imagesArray.forEach(src=>{
        const img=$("<img>",{src,style:"width:200px;height:150px;margin:5px;border-radius:6px;object-fit:cover;cursor:pointer"});
        img.on("click",()=>Mini.Modal({title:"Gallery",content:`<img src='${src}' style='width:100%;border-radius:6px'>`}));
        parent.Child(img);
      });
    },

    Dropdown(btnSelector,menuSelector){
      const btn=$(btnSelector), menu=$(menuSelector);
      btn.on("click",()=>menu.ToggleClass("show"));
      document.addEventListener("click",e=>{ if(!btn.elements[0].contains(e.target) && !menu.elements[0].contains(e.target)) menu.Hide(); });
    },

    Tabs(containerSelector){
      const container=$(containerSelector);
      const tabs=container.elements[0].querySelectorAll(".tab-header div");
      const contents=container.elements[0].querySelectorAll(".tab-content div");
      tabs.forEach((tab,i)=>{
        tab.addEventListener("click",()=>{
          tabs.forEach(t=>t.classList.remove("active"));
          contents.forEach(c=>c.style.display="none");
          tab.classList.add("active"); contents[i].style.display="block";
        });
      });
    },

    // ---------------- Reactive binding
    Bind(el,obj,key){ 
      Object.defineProperty(obj,key,{set(v){ $(el).Text(v); },get(){ return $(el).Text(); }});
      $(el).Text(obj[key]);
    },

    BindList(container,array,renderFunc){
      const parent=$(container); parent.RemoveChildren();
      array.forEach(item=>renderFunc(item,parent));
    },

    // ---------------- Plugin system
    plugins:{},
    Plugin(name,fn){ Mini.plugins[name]=fn; Mini[name]=fn; }
  };

  global.$ = $;
  global.Mini = Mini;

})(window);
