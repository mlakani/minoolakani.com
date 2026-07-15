"use strict";

/* =========================================
   MINOO LAKANI — HOMEPAGE FEATURED SONGS
   Reads featured songs from songs.js.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const songGrid = document.querySelector("#music .song-grid");

  const allSongs = Array.isArray(window.songCatalog)
    ? window.songCatalog
    : [];

  if (!songGrid || allSongs.length === 0) {
    return;
  }

  const featuredSongs = allSongs
    .filter((song) => song.featured === true)
    .slice(0, 5);

  if (featuredSongs.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();

  featuredSongs.forEach((song) => {
    const article = document.createElement("article");

    const link = document.createElement("a");
    link.href = song.link || "music.html";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute(
      "aria-label",
      `Listen to ${song.title}`
    );

    link.style.display = "block";
    link.style.color = "inherit";
    link.style.textDecoration = "none";

    const cover = document.createElement("div");
    cover.className = "cover";

    cover.style.background = `
      linear-gradient(
        rgba(0, 0, 0, 0.04),
        rgba(0, 0, 0, 0.18)
      ),
      url("${song.image}") center / cover no-repeat,
      linear-gradient(
        145deg,
        #8a684d,
        #2c1d17
      )
    `;

    const title = document.createElement("h3");
    title.textContent = song.title;
    title.dir = "auto";

    link.append(cover, title);
    article.appendChild(link);
    fragment.appendChild(article);
  });

  songGrid.replaceChildren(fragment);
});
