"use strict";

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
