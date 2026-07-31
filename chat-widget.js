"use strict";

(function restoreHomepageStreamingCard() {
  if (!document.querySelector(".streaming-card")) return;

  const style = document.createElement("style");
  style.textContent = `
    @media (min-width: 761px) {
      .hero-grid {
        grid-template-columns: minmax(390px, 0.9fr) minmax(440px, 1.1fr) !important;
        grid-template-rows: auto auto !important;
      }

      .streaming-card {
        grid-column: 1 / -1 !important;
        width: min(680px, 88%) !important;
        min-height: 0 !important;
        margin: -155px 0 0 3% !important;
        padding: 16px 20px 18px !important;
        border-radius: 20px !important;
      }

      .streaming-label {
        margin: 0 0 12px !important;
      }

      .streaming-inner {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 20px !important;
      }

      .streaming-inner > img {
        width: 145px !important;
        height: 145px !important;
        flex: 0 0 145px !important;
        aspect-ratio: 1 / 1 !important;
        object-fit: cover !important;
      }

      .streaming-inner h2 {
        font-size: clamp(1.85rem, 2.6vw, 2.45rem) !important;
      }

      .streaming-inner p {
        margin-bottom: 14px !important;
      }
    }

    @media (max-width: 760px) {
      .streaming-card {
        width: min(92%, 560px) !important;
        margin: 24px auto 0 !important;
      }

      .streaming-inner {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
      }

      .streaming-inner > img {
        width: 118px !important;
        height: 118px !important;
        flex: 0 0 118px !important;
      }
    }

    @media (max-width: 480px) {
      .streaming-inner {
        flex-direction: column !important;
        text-align: center !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

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
