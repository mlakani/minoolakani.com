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

(function installChatLauncher() {
  if (window.__MINOO_TAWK_LOADED__) return;
  if (document.querySelector(".minoo-chat-launcher")) return;

  const style = document.createElement("style");
  style.textContent = `
    .minoo-chat-launcher {
      position: fixed;
      right: 20px;
      bottom: 22px;
      z-index: 2147483000;
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 50%;
      background: #b69a59;
      color: #fff;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
      cursor: pointer;
    }

    .minoo-chat-launcher:hover,
    .minoo-chat-launcher:focus-visible {
      background: #c4a765;
      outline: 3px solid rgba(255, 255, 255, 0.65);
      outline-offset: 3px;
    }

    .minoo-chat-launcher:disabled {
      cursor: wait;
      opacity: 0.8;
    }

    .minoo-chat-launcher svg {
      width: 31px;
      height: 31px;
      fill: currentColor;
    }

    @media (max-width: 480px) {
      .minoo-chat-launcher {
        right: 16px;
        bottom: 18px;
        width: 58px;
        height: 58px;
      }
    }
  `;
  document.head.appendChild(style);

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "minoo-chat-launcher";
  launcher.setAttribute("aria-label", "Open live chat");
  launcher.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>';
  document.body.appendChild(launcher);

  const loadChat = () => {
    if (window.__MINOO_TAWK_LOADED__) return;
    window.__MINOO_TAWK_LOADED__ = true;
    launcher.disabled = true;
    launcher.setAttribute("aria-busy", "true");

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = () => {
      launcher.remove();
      window.Tawk_API.maximize();
    };
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/6a6bb0bbc89d501d46edead2/1juqaknlh";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.onerror = () => {
      window.__MINOO_TAWK_LOADED__ = false;
      launcher.disabled = false;
      launcher.removeAttribute("aria-busy");
    };
    document.head.appendChild(script);
  };

  launcher.addEventListener("click", loadChat, { once: true });
})();
