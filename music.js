"use strict";

/* =========================================
   MINOO LAKANI — MUSIC CATALOG
   Enhances the crawlable HTML catalog with
   search, language filters, and navigation.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".catalog-card"));
  const languageSections = Array.from(
    document.querySelectorAll("[data-language-section]")
  );
  const songCount = document.getElementById("songCount");
  const searchInput = document.getElementById("songSearch");
  const emptyMessage = document.getElementById("emptyMessage");
  const filterButtons = Array.from(
    document.querySelectorAll(".filter-button")
  );
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");

  let activeFilter = "All";
  let searchTerm = "";

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .toLocaleLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/\u200c/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function pluralizeSongs(total) {
    return `${total} ${total === 1 ? "Song" : "Songs"}`;
  }

  function updateCatalog() {
    const normalizedSearch = normalizeText(searchTerm);
    let visibleTotal = 0;

    cards.forEach((card) => {
      const language = card.dataset.language || "";
      const searchableText = normalizeText(
        card.dataset.search || card.textContent
      );
      const matchesLanguage =
        activeFilter === "All" || language === activeFilter;
      const matchesSearch =
        normalizedSearch === "" || searchableText.includes(normalizedSearch);
      const isVisible = matchesLanguage && matchesSearch;

      card.hidden = !isVisible;
      if (isVisible) visibleTotal += 1;
    });

    languageSections.forEach((section) => {
      const sectionCards = Array.from(
        section.querySelectorAll(".catalog-card")
      );
      const sectionVisibleTotal = sectionCards.filter(
        (card) => !card.hidden
      ).length;
      const sectionCount = section.querySelector(
        ".language-song-count"
      );

      section.hidden = sectionVisibleTotal === 0;
      if (sectionCount) {
        sectionCount.textContent = pluralizeSongs(sectionVisibleTotal);
      }
    });

    if (songCount) {
      const isDefaultView =
        activeFilter === "All" && searchTerm.trim() === "";
      songCount.textContent = isDefaultView
        ? pluralizeSongs(cards.length)
        : `${visibleTotal} of ${cards.length} Songs`;
    }

    if (emptyMessage) {
      emptyMessage.textContent = cards.length
        ? "No songs match your search."
        : "No songs are available yet.";
      emptyMessage.hidden = cards.length > 0 && visibleTotal > 0;
    }
  }

  cards.forEach((card) => {
    const image = card.querySelector(".catalog-cover");
    const coverWrap = card.querySelector(".catalog-cover-wrap");

    if (!image || !coverWrap) return;

    const showPlaceholder = () => {
      coverWrap.classList.add("image-missing");
    };

    image.addEventListener("error", showPlaceholder);
    if (image.complete && image.naturalWidth === 0) {
      showPlaceholder();
    }
  });

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value;
      updateCatalog();
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && searchInput.value !== "") {
        searchInput.value = "";
        searchTerm = "";
        updateCatalog();
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "All";

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      updateCatalog();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation && menuToggle) {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  updateCatalog();
});