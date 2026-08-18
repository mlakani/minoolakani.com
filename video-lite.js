"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-lite[data-video-id]").forEach((preview) => {
    preview.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const videoId = preview.dataset.videoId || "";
      if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;

      event.preventDefault();

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = preview.dataset.videoTitle || "Minoo Lakani music video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;

      preview.replaceWith(iframe);
      iframe.focus();
    });
  });
});
