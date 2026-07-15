"use strict";

/* =========================================
   MINOO LAKANI — MUSIC CATALOG
   This file builds and controls music.html.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const songs = Array.isArray(window.songCatalog)
    ? window.songCatalog
    : [];

  const catalogGrid = document.getElementById("songCatalogGrid");
  const songCount = document.getElementById("songCount");
  const searchInput = document.getElementById("songSearch");
  const emptyMessage = document.getElementById("emptyMessage");
  const filterButtons = document.querySelectorAll(".filter-button");

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");

  let activeFilter = "All";
  let searchTerm = "";

  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navigation.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }

  /* =========================================
     SEARCH NORMALIZATION
  ========================================= */

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .toLocaleLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/\u200c/g, " ")
      .trim();
  }

  /* =========================================
     CREATE ONE SONG CARD
  ========================================= */

  function createSongCard(song) {
    const card = document.createElement("a");

    card.className = "catalog-card";
    card.href = song.link || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute(
      "aria-label",
      `Listen to ${song.title}`
    );

    const coverWrap = document.createElement("div");
    coverWrap.className = "catalog-cover-wrap";

    const coverImage = document.createElement("img");
    coverImage.className = "catalog-cover";
    coverImage.src = song.image;
    coverImage.alt = `${song.title} cover artwork`;
    coverImage.loading = "lazy";
    coverImage.decoding = "async";

    const coverPlaceholder = document.createElement("div");
    coverPlaceholder.className = "catalog-cover-placeholder";
    coverPlaceholder.textContent = song.title;
    coverPlaceholder.setAttribute("aria-hidden", "true");

    coverImage.addEventListener("error", () => {
      coverWrap.classList.add("image-missing");
    });

    const listenLabel = document.createElement("span");
    listenLabel.className = "catalog-listen";
    listenLabel.textContent = "Listen";

    coverWrap.append(
      coverImage,
      coverPlaceholder,
      listenLabel
    );

    const cardCopy = document.createElement("div");
    cardCopy.className = "catalog-card-copy";

    const language = document.createElement("p");
    language.className = "catalog-language";
    language.textContent = song.language || "Music";

    const title = document.createElement("h3");
    title.className = "catalog-song-title";
    title.textContent = song.title;
    title.dir = "auto";

    cardCopy.append(language, title);

    if (song.alternateTitle) {
      const alternateTitle = document.createElement("p");

      alternateTitle.className =
        "catalog-alternate-title";

      alternateTitle.textContent =
        song.alternateTitle;

      alternateTitle.dir = "auto";

      cardCopy.appendChild(alternateTitle);
    }

    card.append(coverWrap, cardCopy);

    return card;
  }

  /* =========================================
     FILTER SONGS
  ========================================= */

  function getVisibleSongs() {
    const normalizedSearch =
      normalizeText(searchTerm);

    return songs.filter((song) => {
      const matchesLanguage =
        activeFilter === "All" ||
        song.language === activeFilter;

      const searchableText = normalizeText(
        [
          song.title,
          song.alternateTitle,
          song.language
        ].join(" ")
      );

      const matchesSearch =
        normalizedSearch === "" ||
        searchableText.includes(normalizedSearch);

      return matchesLanguage && matchesSearch;
    });
  }

  /* =========================================
     UPDATE SONG COUNT
  ========================================= */

  function updateSongCount(visibleTotal) {
    if (!songCount) {
      return;
    }

    const songWord =
      visibleTotal === 1 ? "Song" : "Songs";

    if (
      activeFilter === "All" &&
      searchTerm.trim() === ""
    ) {
      songCount.textContent =
        `${visibleTotal} ${songWord}`;

      return;
    }

    songCount.textContent =
      `${visibleTotal} of ${songs.length} Songs`;
  }

  /* =========================================
     RENDER CATALOG
  ========================================= */

  function renderCatalog() {
    if (!catalogGrid || !emptyMessage) {
      return;
    }

    const visibleSongs = getVisibleSongs();

    catalogGrid.replaceChildren();

    const fragment =
      document.createDocumentFragment();

    visibleSongs.forEach((song) => {
      fragment.appendChild(
        createSongCard(song)
      );
    });

    catalogGrid.appendChild(fragment);

    updateSongCount(visibleSongs.length);

    if (songs.length === 0) {
      emptyMessage.textContent =
        "No songs are available yet.";

      emptyMessage.hidden = false;

      return;
    }

    emptyMessage.textContent =
      "No songs match your search.";

    emptyMessage.hidden =
      visibleSongs.length !== 0;
  }

  /* =========================================
     SEARCH CONTROL
  ========================================= */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value;

      renderCatalog();
    });

    searchInput.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Escape" &&
          searchInput.value !== ""
        ) {
          searchInput.value = "";
          searchTerm = "";

          renderCatalog();
        }
      }
    );
  }

  /* =========================================
     LANGUAGE FILTERS
  ========================================= */

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      button.classList.contains("active")
        ? "true"
        : "false"
    );

    button.addEventListener("click", () => {
      activeFilter =
        button.dataset.filter || "All";

      filterButtons.forEach(
        (filterButton) => {
          const isActive =
            filterButton === button;

          filterButton.classList.toggle(
            "active",
            isActive
          );

          filterButton.setAttribute(
            "aria-pressed",
            String(isActive)
          );
        }
      );

      renderCatalog();
    });
  });

  /* =========================================
     INITIAL CATALOG
  ========================================= */

  renderCatalog();
});
