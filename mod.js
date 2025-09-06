(function(global) {
  // Helper to set attributes, styles, and text
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

  // Helper to create element from "<tag ...>" string
  function createFromTagString(tagString, attrs) {
    const tagMatch = tagString.match(/^<(\w+)(.*?)>$/);
    if (!tagMatch) return null;

    const tag = tagMatch[1];
    const attrString = tagMatch[2]; // like ' id="demo" class="box"'
    const el = document.createElement(tag);

    // Parse inline attributes
    if (attrString) {
      const regex = /(\w+)=["'](.*?)["']/g;
      let m;
      while ((m = regex.exec(attrString)) !== null) {
        el.setAttribute(m[1], m[2]);
      }
    }

    // Set additional attributes from second argument
    setAttrs(el, attrs);
    return el;
  }

  // Main() - write raw HTML into body
  function Main(htmlString) {
    document.body.insertAdjacentHTML("beforeend", htmlString);
  }

  // $() - select existing or create element dynamically
  function MiniStruct(selectorOrTag, attrs) {
    if (/^</.test(selectorOrTag)) {
      const el = createFromTagString(selectorOrTag, attrs);
      if (el) document.body.appendChild(el);
      return el;
    }

    // Select existing element
    const el = document.querySelector(selectorOrTag);
    if (el) setAttrs(el, attrs);
    return el;
  }

  // Add multiple events
  Element.prototype.Addevent = function(events) {
    for (let evt in events) {
      this.addEventListener(evt, events[evt]);
    }
  };

  // Add children using "<div id='...'>" style
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

  // Expose Main() and $()
  global.Main = Main;
  global.$ = MiniStruct;

})(window);
