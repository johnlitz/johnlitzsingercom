// Polyfills for Node 24 compatibility with Astro/Rollup
// Can be removed when Astro officially supports Node 24

if (typeof URL.canParse !== 'function') {
  URL.canParse = function(url, base) {
    try { new URL(url, base); return true; } catch { return false; }
  };
}

// Ensure Headers.prototype.getSetCookie exists
if (typeof Headers !== 'undefined' && typeof Headers.prototype.getSetCookie !== 'function') {
  Headers.prototype.getSetCookie = function() {
    const all = [];
    this.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        all.push(value);
      }
    });
    return all;
  };
}
