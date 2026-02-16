// Polyfills for Node 24 compatibility with Astro/Rollup
// Can be removed when Astro officially supports Node 24

if (typeof URL.canParse !== 'function') {
  URL.canParse = function(url, base) {
    try { new URL(url, base); return true; } catch { return false; }
  };
}

// Patch Headers.prototype.getSetCookie for Node 24
// Node 24 may expose Headers globally but without getSetCookie,
// or the undici Headers used by Astro may lack it.
const patchHeaders = (HeadersClass) => {
  if (HeadersClass && typeof HeadersClass.prototype.getSetCookie !== 'function') {
    HeadersClass.prototype.getSetCookie = function() {
      const all = [];
      this.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          all.push(value);
        }
      });
      return all;
    };
  }
};

// Patch global Headers if available
if (typeof Headers !== 'undefined') {
  patchHeaders(Headers);
}

// Also patch when undici is loaded (Astro uses undici internally)
const Module = require('module');
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  const result = originalLoad.apply(this, arguments);
  if (request === 'undici' && result && result.Headers) {
    patchHeaders(result.Headers);
  }
  return result;
};
