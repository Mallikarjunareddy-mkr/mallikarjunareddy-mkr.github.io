(function(global) {
  // 1️⃣ body() - write static HTML
  function body(htmlString) {
    document.body.insertAdjacentHTML("beforeend", htmlString);
  }

  // 2️⃣ css() - write static CSS
  function css(cssString) {
    const style = document.createElement("style");
    style.textContent = cssString;
    document.head.appendChild(style);
  }

  // 3️⃣ Mini JS Helper Functions
  function setAttrs(el, attrs) {
    if (!attrs) return;
    for (let key in attrs) {
      if (key === "style") {
        Object.assign(el.style, attrs[key].split(";").reduce((s, prop) => {
          if (!prop.trim()) return s;
          const [k, v] = prop.split(":");
          s[k.trim()] = v.trim();
          return s;
        }, {}));
      } else if (key === "text") {
        el.textContent = attrs[key];
      } else {
        el.setAttribute(key, attrs[key]);
      }
    }
  }

  function createFromTagString(tagString, attrs) {
    const tagMatch = tagString.match(/^<(\w+)(.*?)>$/);
    if (!tagMatch) return null;
    const tag = tagMatch[1];
    const attrString = tagMatch[2];
    const el = document.createElement(tag);

    if (attrString) {
      const regex = /(\w+)=["'](.*?)["']/g;
      let m;
      while ((m = regex.exec(attrString)) !== null) {
        el.setAttribute(m[1], m[2]);
      }
    }

    setAttrs(el, attrs);
    return el;
  }

  function MiniStruct(selectorOrTag, attrs) {
    if (/^</.test(selectorOrTag)) {
      const el = createFromTagString(selectorOrTag, attrs);
      if (el) document.body.appendChild(el);
      return el;
    }

    const el = document.querySelector(selectorOrTag);
    if (el) setAttrs(el, attrs);
    return el;
  }

  Element.prototype.Addevent = function(events) {
    for (let evt in events) {
      this.addEventListener(evt, events[evt]);
    }
  };

  Element.prototype.Child = function(children) {
    if (Array.isArray(children)) {
      children.forEach(c => this.Child(c));
      return this;
    }
    if (!/^</.test(children)) return this;

    const childEl = createFromTagString(children);
    if (childEl) this.appendChild(childEl);
    return childEl;
  };

  global.body = body;
  global.css = css;
  global.$ = MiniStruct;

})(window);
