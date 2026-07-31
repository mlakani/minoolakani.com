"use strict";

(function loadTawkChat() {
  if (window.__MINOO_TAWK_LOADED__) return;
  window.__MINOO_TAWK_LOADED__ = true;

  const start = () => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/6a6bb0bbc89d501d46edead2/1juqaknlh";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 2500 });
  } else {
    window.addEventListener("load", () => window.setTimeout(start, 300), { once: true });
  }
})();
