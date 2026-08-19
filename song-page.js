"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const head = document.head;
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");
  const footer = document.querySelector("footer");

  const youtubeByPage = {
    "dream.html": "https://www.youtube.com/watch?v=yX3tIs7DEGs",
    "my-own-heart.html": "https://www.youtube.com/watch?v=G5dfKaHd3hM",
    "tell-me-you-love-me.html": "https://www.youtube.com/watch?v=WIdqgvEyUHo",
    "ghost-of-you.html": "https://www.youtube.com/watch?v=ln9XzcbFAcM",
    "america-my-home.html": "https://www.youtube.com/watch?v=UqhHzM4NDR4",
    "corazon-con-corazon.html": "https://www.youtube.com/watch?v=cjG7mWh01mU",
    "ghesye-manoto.html": "https://www.youtube.com/watch?v=h9TM3NI-89o",
    "delamo-shekasti.html": "https://www.youtube.com/watch?v=P3IGulIgkuA",
    "eshgh-o-afsaneh.html": "https://www.youtube.com/watch?v=KL5Ex1lB4d4",
    "begoo-mano-doost-dari.html": "https://www.youtube.com/watch?v=ficN_pDo5fA",
    "hese-naab.html": "https://www.youtube.com/watch?v=PPXv0jFVqnI",
    "rade-paye-to.html": "https://www.youtube.com/watch?v=XYZINlBfOHA",
    "ghashangtarin-dalil.html": "https://www.youtube.com/watch?v=2sFA149pHDM",
    "khaterate-to.html": "https://www.youtube.com/watch?v=AvKesDc-OB8",
    "harfe-negah.html": "https://www.youtube.com/watch?v=-CQ_N-XT3XI",
    "iran-khaneh-mast.html": "https://www.youtube.com/watch?v=kJn6pnlasko"
  };

  const currentPage = location.pathname.split("/").pop();
  const youtubeUrl = youtubeByPage[currentPage];
  const actions = document.querySelector(".song-actions");
  if (youtubeUrl && actions && !actions.querySelector('a[href*="youtube.com/watch"]')) {
    const youtube = document.createElement("a");
    youtube.className = "song-action song-action-primary";
    youtube.href = youtubeUrl;
    youtube.target = "_blank";
    youtube.rel = "noopener noreferrer";
    youtube.textContent = "Watch on YouTube";
    actions.insertBefore(youtube, actions.firstChild);
    const existingPrimary = actions.querySelectorAll(".song-action-primary");
    existingPrimary.forEach((link, index) => { if (index > 0) link.classList.replace("song-action-primary", "song-action-secondary"); });
  }

  if (actions) {
    const kicker = document.querySelector(".song-kicker")?.textContent || "";
    const isPersian = /Persian/i.test(kicker) || document.querySelector('.song-title[lang="fa"]');
    const isSpanish = /Spanish/i.test(kicker) || document.documentElement.lang === "es";
    const catalogHref = isPersian ? "../music.html#persian-songs" : isSpanish ? "../music.html#spanish-songs" : "../music.html#english-songs";
    const catalogLabel = isPersian ? "More Persian Songs" : isSpanish ? "More Spanish Songs" : "More English Songs";
    if (!actions.querySelector(`a[href="${catalogHref}"]`)) {
      const catalogLink = document.createElement("a");
      catalogLink.className = "song-action song-action-secondary";
      catalogLink.href = catalogHref;
      catalogLink.textContent = catalogLabel;
      const genericCatalog = actions.querySelector('a[href="../music.html"]');
      if (genericCatalog) actions.insertBefore(catalogLink, genericCatalog);
      else actions.appendChild(catalogLink);
    }
  }

  if (youtubeUrl) {
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try {
        const data = JSON.parse(script.textContent);
        if (data && data["@type"] === "MusicRecording") {
          const sameAs = Array.isArray(data.sameAs) ? data.sameAs : (data.sameAs ? [data.sameAs] : []);
          if (!sameAs.includes(youtubeUrl)) sameAs.unshift(youtubeUrl);
          data.sameAs = sameAs;
          if (data.potentialAction && data.potentialAction["@type"] === "ListenAction") {
            const target = Array.isArray(data.potentialAction.target) ? data.potentialAction.target : [data.potentialAction.target].filter(Boolean);
            if (!target.includes(youtubeUrl)) target.unshift(youtubeUrl);
            data.potentialAction.target = target;
          }
          script.textContent = JSON.stringify(data);
        }
      } catch (_) {}
    });
  }

  if (!document.querySelector('link[rel="icon"]')) { const icon=document.createElement("link"); icon.rel="icon"; icon.type="image/webp"; icon.href="../brand-logo-192.webp"; head.appendChild(icon); }
  if (!document.querySelector('link[rel="manifest"]')) { const manifest=document.createElement("link"); manifest.rel="manifest"; manifest.href="../site.webmanifest"; head.appendChild(manifest); }
  if (!document.querySelector('meta[name="theme-color"]')) { const theme=document.createElement("meta"); theme.name="theme-color"; theme.content="#17100c"; head.appendChild(theme); }

  if (navigation) {
    const destinationMap = new Map([["../index.html#home","../index.html"],["../index.html#about","../about.html"],["../index.html#contact","../contact.html"]]);
    navigation.querySelectorAll("a").forEach((link)=>{ const replacement=destinationMap.get(link.getAttribute("href")); if(replacement) link.setAttribute("href",replacement); });
    const addNavigationLink=(label,href,beforeSelector=null)=>{ if(navigation.querySelector(`a[href="${href}"]`)) return; const link=document.createElement("a"); link.href=href; link.textContent=label; const before=beforeSelector?navigation.querySelector(beforeSelector):null; if(before) navigation.insertBefore(link,before); else navigation.appendChild(link); };
    addNavigationLink("Gallery","../gallery.html",'a[href="../contact.html"]'); addNavigationLink("Press","../press-kit.html",'a[href="../contact.html"]');
    navigation.querySelectorAll("a").forEach((link)=>link.addEventListener("click",()=>{navigation.classList.remove("open"); if(menuButton) menuButton.setAttribute("aria-expanded","false");}));
  }
  if(menuButton&&navigation) menuButton.addEventListener("click",()=>{const isOpen=navigation.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(isOpen));});

  document.querySelectorAll(".song-actions").forEach((actions)=>{ if(actions.querySelector('a[href*="youtube.com/channel/"]')) return; const subscribe=document.createElement("a"); subscribe.className="song-action song-action-secondary"; subscribe.href="https://www.youtube.com/channel/UCB_L4vDkhGpfcNPKvk8laMw?sub_confirmation=1"; subscribe.target="_blank"; subscribe.rel="noopener noreferrer"; subscribe.textContent="Subscribe on YouTube"; actions.appendChild(subscribe); });

  if(footer&&!footer.querySelector(".footer-links")){ const style=document.createElement("style"); style.textContent=".footer-links{margin:0 auto 18px;display:flex;flex-wrap:wrap;justify-content:center;gap:9px 18px}.footer-links a{color:var(--cream);font-size:.66rem;letter-spacing:.1em;text-decoration:none;text-transform:uppercase}.footer-links a:hover,.footer-links a:focus-visible{color:var(--soft-gold)}"; head.appendChild(style); const links=[["Biography","../about.html"],["Discography","../music.html"],["Videos","../videos.html"],["YouTube","https://www.youtube.com/channel/UCB_L4vDkhGpfcNPKvk8laMw?sub_confirmation=1"],["Press Kit","../press-kit.html"],["News","../news.html"],["Gallery","../gallery.html"],["Contact","../contact.html"],["Milestones","../achievements.html"]]; const wrapper=document.createElement("div"); wrapper.className="footer-links"; links.forEach(([label,href])=>{const link=document.createElement("a");link.href=href;link.textContent=label;if(href.startsWith("https://")){link.target="_blank";link.rel="noopener noreferrer";}wrapper.appendChild(link);});footer.insertBefore(wrapper,footer.firstChild); }

  const relatedSongs=document.querySelector(".related-songs"); if(relatedSongs&&!document.querySelector(".youtube-subscribe-section")){ const subscribeSection=document.createElement("section"); subscribeSection.className="youtube-subscribe-section"; subscribeSection.setAttribute("aria-labelledby","youtube-subscribe-title"); subscribeSection.innerHTML=`<div class="youtube-subscribe-inner"><p class="eyebrow">Hear the next song first</p><h2 id="youtube-subscribe-title">Subscribe on YouTube</h2><p>Follow Minoo Lakani for new Persian, English, and Spanish songs, lyric videos, and visual stories.</p><p class="youtube-subscribe-persian" lang="fa" dir="rtl">برای شنیدن ترانه‌های تازهٔ فارسی و انگلیسی، کانال رسمی مینو لکانی را دنبال کنید.</p><a class="song-action song-action-primary" href="https://www.youtube.com/channel/UCB_L4vDkhGpfcNPKvk8laMw?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Subscribe on YouTube</a></div>`; relatedSongs.before(subscribeSection); }
  if(!document.querySelector('script[data-minoo-chat]')){const chat=document.createElement("script");chat.src="../chat-widget.js?v=3";chat.defer=true;chat.dataset.minooChat="true";document.body.appendChild(chat);}
});
