"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const head = document.head;
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");
  const footer = document.querySelector("footer");

  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/webp";
    icon.href = "../brand-logo.webp";
    head.appendChild(icon);
  }

  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "../site.webmanifest";
    head.appendChild(manifest);
  }

  if (!document.querySelector('meta[name="theme-color"]')) {
    const theme = document.createElement("meta");
    theme.name = "theme-color";
    theme.content = "#17100c";
    head.appendChild(theme);
  }

  if (navigation) {
    const destinationMap = new Map([
      ["../index.html#home", "../index.html"],
      ["../index.html#about", "../about.html"],
      ["../index.html#contact", "../contact.html"]
    ]);

    navigation.querySelectorAll("a").forEach((link) => {
      const replacement = destinationMap.get(link.getAttribute("href"));
      if (replacement) link.setAttribute("href", replacement);
    });

    const addNavigationLink = (label, href, beforeSelector = null) => {
      if (navigation.querySelector(`a[href="${href}"]`)) return;
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      const before = beforeSelector ? navigation.querySelector(beforeSelector) : null;
      if (before) navigation.insertBefore(link, before);
      else navigation.appendChild(link);
    };

    addNavigationLink("Gallery", "../gallery.html", 'a[href="../contact.html"]');
    addNavigationLink("Press", "../press-kit.html", 'a[href="../contact.html"]');

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        if (menuButton) menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (footer && !footer.querySelector(".footer-links")) {
    const style = document.createElement("style");
    style.textContent = ".footer-links{margin:0 auto 18px;display:flex;flex-wrap:wrap;justify-content:center;gap:9px 18px}.footer-links a{color:var(--cream);font-size:.66rem;letter-spacing:.1em;text-decoration:none;text-transform:uppercase}.footer-links a:hover,.footer-links a:focus-visible{color:var(--soft-gold)}";
    head.appendChild(style);

    const links = [
      ["Biography", "../about.html"],
      ["Discography", "../music.html"],
      ["Press Kit", "../press-kit.html"],
      ["News", "../news.html"],
      ["Gallery", "../gallery.html"],
      ["Contact", "../contact.html"],
      ["Milestones", "../achievements.html"]
    ];

    const wrapper = document.createElement("div");
    wrapper.className = "footer-links";
    links.forEach(([label, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      wrapper.appendChild(link);
    });
    footer.insertBefore(wrapper, footer.firstChild);
  }
});
