(() => {
  "use strict";

  const navLinks = [...document.querySelectorAll("nav a[href^='#']")];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  // Smooth scrolling with the sticky navigation offset.
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      const navHeight = document.querySelector("nav")?.offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  // Highlight the section currently in view.
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  // Lightweight reveal animation. Respects reduced-motion preferences.
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.querySelectorAll(".card, .stat, .chip, .pcard, .logo").forEach(el => {
      el.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
  }

  // Keyboard shortcut: P = print/save as PDF.
  document.addEventListener("keydown", event => {
    const tag = document.activeElement?.tagName;
    if (event.key.toLowerCase() === "p" && !["INPUT", "TEXTAREA"].includes(tag)) {
      window.print();
    }
  });
})();
