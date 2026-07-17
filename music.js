"use strict";

/* =========================================
   MINOO LAKANI — MUSIC CATALOG
   Builds the catalog, search, filters, and
   separate language sections.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const songs = Array.isArray(window.songCatalog)
    ? window.songCatalog
    : [];

  const catalogContainer =
    document.getElementById("songCatalogGrid");
  const songCount = document.getElementById("songCount");
  const searchInput = document.getElementById("songSearch");
  const emptyMessage = document.getElementById("emptyMessage");
  const filterButtons =
    document.querySelectorAll(".filter-button");

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");

  const preferredLanguageOrder = ["English", "Persian"];

  let activeFilter = "All";
  let searchTerm = "";

  if (catalogContainer) {
    catalogContainer.classList.remove("catalog-grid");
    catalogContainer.style.width = "min(1400px, 100%)";
    catalogContainer.style.margin = "0 auto";
  }

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
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
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
    coverPlaceholder.className =
      "catalog-cover-placeholder";
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
      const alternateTitle =
        document.createElement("p");

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
    const normalizedSearch = normalizeText(searchTerm);

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
     GROUP SONGS BY LANGUAGE
  ========================================= */

  function groupSongsByLanguage(visibleSongs) {
    const groupedSongs = new Map();

    preferredLanguageOrder.forEach((language) => {
      groupedSongs.set(language, []);
    });

    visibleSongs.forEach((song) => {
      const language = song.language || "Other";

      if (!groupedSongs.has(language)) {
        groupedSongs.set(language, []);
      }

      groupedSongs.get(language).push(song);
    });

    return Array.from(groupedSongs.entries())
      .filter(([, languageSongs]) => {
        return languageSongs.length > 0;
      });
  }

  function createLanguageSection(
    language,
    languageSongs
  ) {
    const section = document.createElement("section");
    const headingId =
      `${language.toLowerCase().replace(/\s+/g, "-")}-songs`;

    section.className = "catalog-language-section";
    section.setAttribute("aria-labelledby", headingId);
    section.style.marginBottom =
      "clamp(58px, 7vw, 92px)";

    const heading = document.createElement("div");
    heading.className = "catalog-heading";
    heading.style.marginBottom = "26px";

    const headingCopy = document.createElement("div");

    const eyebrow = document.createElement("p");
    eyebrow.className = "catalog-eyebrow";
    eyebrow.textContent = language;

    const title = document.createElement("h2");
    title.id = headingId;
    title.textContent = `${language} Songs`;

    const count = document.createElement("p");
    count.className = "song-count";

    const songWord =
      languageSongs.length === 1 ? "Song" : "Songs";

    count.textContent =
      `${languageSongs.length} ${songWord}`;

    headingCopy.append(eyebrow, title);
    heading.append(headingCopy, count);

    const grid = document.createElement("div");
    grid.className = "catalog-grid";

    languageSongs.forEach((song) => {
      grid.appendChild(createSongCard(song));
    });

    section.append(heading, grid);

    return section;
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
    if (!catalogContainer || !emptyMessage) {
      return;
    }

    const visibleSongs = getVisibleSongs();
    const languageGroups =
      groupSongsByLanguage(visibleSongs);

    catalogContainer.replaceChildren();

    const fragment =
      document.createDocumentFragment();

    languageGroups.forEach(
      ([language, languageSongs]) => {
        fragment.appendChild(
          createLanguageSection(
            language,
            languageSongs
          )
        );
      }
    );

    catalogContainer.appendChild(fragment);
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

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;

        filterButton.classList.toggle(
          "active",
          isActive
        );

        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      renderCatalog();
    });
  });

  /* =========================================
     INITIAL CATALOG
  ========================================= */

  renderCatalog();
});
