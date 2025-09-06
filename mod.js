// mod.js
// MiniJS ES Module - Shortened JS helpers

// Helper: set attributes
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

// Helper: create element from tag string
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

// $() - select or create
export function $(selectorOrTag, attrs) {
  if (/^</.test(selectorOrTag)) {
    const el = createFromTagString(selectorOrTag, attrs);
    if (el) document.body.appendChild(el);
    return el;
  }
  const el = document.querySelector(selectorOrTag);
  if (el) setAttrs(el, attrs);
  return el;
}

// Add multiple events
export function Addevent(el, events) {
  for (let evt in events) el.addEventListener(evt, events[evt]);
}

// Append children
export function Child(el, children) {
  if (Array.isArray(children)) {
    children.forEach(c => Child(el, c));
    return el;
  }
  if (!/^</.test(children)) return el;

  const childEl = createFromTagString(children);
  if (childEl) el.appendChild(childEl);
  return childEl;
}

// Attribute helper
export function Attr(el, key, value) {
  if (value === undefined) return el.getAttribute(key);
  el.setAttribute(key, value);
}

// CSS helper
export function Css(el, styles) {
  for (let k in styles) el.style[k] = styles[k];
}

// Value helper (input/select)
export function Val(el, value) {
  if (value === undefined) return el.value;
  el.value = value;
}

// HTML helper
export function Html(el, html) {
  if (html === undefined) return el.innerHTML;
  el.innerHTML = html;
}

// Show / Hide
export function Show(el) { el.style.display = ""; }
export function Hide(el) { el.style.display = "none"; }

// Toggle class
export function ToggleClass(el, className) { el.classList.toggle(className); }

// Prototype helpers for convenience
HTMLElement.prototype.Addevent = function(events){ Addevent(this, events); };
HTMLElement.prototype.Child = function(children){ return Child(this, children); };
HTMLElement.prototype.Attr = function(k,v){ return Attr(this,k,v); };
HTMLElement.prototype.Css = function(styles){ return Css(this,styles); };
HTMLElement.prototype.Val = function(v){ return Val(this,v); };
HTMLElement.prototype.Html = function(html){ return Html(this,html); };
HTMLElement.prototype.Show = function(){ Show(this); };
HTMLElement.prototype.Hide = function(){ Hide(this); };
HTMLElement.prototype.ToggleClass = function(c){ ToggleClass(this,c); };
