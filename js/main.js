/**
 * Portfolio — interactions & config
 * Update CONTACT and LINKS with your real URLs before deploy.
 */

const CONFIG = {
  telegram: "https://t.me/andyou_work",
  github: "https://github.com/andyouuu",
  email: "mailto:andyouworkk@gmail.com",
  githubRepos: {
    "horizon-travel": "https://github.com/andyouuu/Horizon-travel",
    "crm-requests": "https://github.com/andyouuu/CRM-REQUEST",
    "tech-electronics-store": "https://github.com/andyouuu/TechStore",
    "autoservice-telegram-bot": "https://github.com/andyouuu/autoservice-telegram-bot",
  },
  projectDemos: {
    "horizon-travel": "https://andyouuu.github.io/Horizon-travel/",
    "crm-requests": "https://andyouuu.github.io/CRM-REQUEST/",
    "tech-electronics-store": "https://andyouuu.github.io/TechStore/",
    "autoservice-telegram-bot": "https://t.me/autoservicereq_bot",
  },
};

(function init() {
  applyContactLinks();
  applyProjectLinks();
  initHeader();
  initMobileNav();
  initReveal();
  initCounters();
  initSmoothScroll();
  initImageLightbox();
  initHeroMotion();
})();

function setExternalLink(el, url) {
  if (!el || !url) return;
  el.href = url;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
}

function applyContactLinks() {
  const tg = document.getElementById("link-telegram");
  const gh = document.getElementById("link-github");
  const em = document.getElementById("link-email");
  const discuss = document.getElementById("btn-discuss");
  const heroDiscuss = document.getElementById("btn-hero-discuss");

  setExternalLink(tg, CONFIG.telegram);
  setExternalLink(gh, CONFIG.github);
  if (em) em.href = CONFIG.email;
  setExternalLink(discuss, CONFIG.telegram);
  setExternalLink(heroDiscuss, CONFIG.telegram);

  const tgHint = tg?.querySelector(".contact-link__hint");
  const ghHint = gh?.querySelector(".contact-link__hint");
  const emHint = em?.querySelector(".contact-link__hint");
  if (tgHint) tgHint.textContent = "@andyou_work";
  if (ghHint) ghHint.textContent = "github.com/andyouuu";
  if (emHint) emHint.textContent = "andyouworkk@gmail.com";
}

function applyProjectLinks() {
  document.querySelectorAll("[data-github]").forEach((el) => {
    setExternalLink(el, CONFIG.githubRepos[el.getAttribute("data-github")]);
  });

  document.querySelectorAll("[data-project]").forEach((el) => {
    setExternalLink(el, CONFIG.projectDemos[el.getAttribute("data-project")]);
  });
}

function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  menu.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", close);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) close();
  });
}

function initReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll(".reveal");

  if (prefersReduced) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

function initCounters() {
  const values = document.querySelectorAll(".stat-card__value[data-count]");
  if (!values.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateValue = (el) => {
    const target = Number(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();

    el.classList.add("is-counting");

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.remove("is-counting");
      }
    };

    requestAnimationFrame(tick);
  };

  const setFinal = (el) => {
    const target = el.getAttribute("data-count");
    const suffix = el.getAttribute("data-suffix") || "";
    el.textContent = `${target}${suffix}`;
  };

  if (prefersReduced) {
    values.forEach(setFinal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  values.forEach((el) => observer.observe(el));
}

function initImageLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const imgEl = lightbox.querySelector(".lightbox__img");
  const captionEl = document.getElementById("lightbox-caption");
  const loader = lightbox.querySelector(".lightbox__loader");
  const closeTriggers = lightbox.querySelectorAll("[data-lightbox-close]");
  const closeBtn = lightbox.querySelector(".lightbox__close");

  let lastFocused = null;
  let isOpen = false;

  const getFullSrc = (thumbImg) => {
    const full = thumbImg.getAttribute("data-full");
    if (full) return full;
    return thumbImg.getAttribute("src") || thumbImg.currentSrc || "";
  };

  const open = (thumbImg) => {
    const fullSrc = getFullSrc(thumbImg);
    if (!fullSrc) return;

    lastFocused = document.activeElement;
    isOpen = true;

    imgEl.classList.remove("is-loaded");
    loader.hidden = false;
    imgEl.src = fullSrc;
    imgEl.alt = thumbImg.getAttribute("alt") || "";
    captionEl.textContent = thumbImg.getAttribute("alt") || "";

    const onLoad = () => {
      imgEl.classList.add("is-loaded");
      loader.hidden = true;
      imgEl.removeEventListener("load", onLoad);
    };

    imgEl.addEventListener("load", onLoad);
    if (imgEl.complete) onLoad();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-lightbox");
    closeBtn.focus();
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-lightbox");

    imgEl.removeAttribute("src");
    imgEl.classList.remove("is-loaded");
    loader.hidden = false;

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  document.querySelectorAll(".project-showcase").forEach((showcase) => {
    showcase.querySelectorAll(".project-showcase__thumb, .project-showcase__main .project-card__media").forEach((zone) => {
      const thumbImg = zone.querySelector("img");
      if (!thumbImg) return;

      zone.classList.add("is-zoomable");
      zone.setAttribute("role", "button");
      zone.setAttribute("tabindex", "0");
      zone.setAttribute(
        "aria-label",
        `Открыть изображение: ${thumbImg.getAttribute("alt") || "скриншот проекта"}`
      );

      const handleOpen = () => open(thumbImg);

      const fullSrc = thumbImg.getAttribute("data-full");
      if (fullSrc) {
        zone.addEventListener(
          "mouseenter",
          () => {
            const preload = new Image();
            preload.src = fullSrc;
          },
          { once: true }
        );
      }

      zone.addEventListener("click", handleOpen);
      zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      });
    });
  });

  closeTriggers.forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
  });
}

function initHeroMotion() {
  const visual = document.querySelector(".hero__visual");
  if (!visual) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const stage = visual.querySelector(".hero-stage");
  const showcase = visual.querySelector(".hero-stage__showcase");
  if (!stage || !showcase) return;

  let raf = 0;
  const onMove = (e) => {
    if (window.innerWidth < 1024) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      showcase.style.transform = `translate3d(${x * 12}px, ${y * 8}px, 0) rotateX(${y * -2.5}deg) rotateY(${x * 4}deg)`;
    });
  };

  const onLeave = () => {
    showcase.style.transform = "";
  };

  stage.addEventListener("mousemove", onMove);
  stage.addEventListener("mouseleave", onLeave);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}
