const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 650) closeMenu();
  });
}

// Reveal sections gently as they enter the viewport.
const revealItems = document.querySelectorAll(
  ".section-heading, .about-lead, .fact, .skill-card, .project-card, .timeline-item, .experience-card"
);
revealItems.forEach((item) => item.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Subtle pointer tilt for the hero orb on devices that support hover.
const heroArt = document.querySelector(".hero-art");
const orb = document.querySelector(".orb-core");
if (heroArt && orb && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  heroArt.addEventListener("pointermove", (event) => {
    const box = heroArt.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    orb.style.transform = `translate(${x * 12}px, ${y * 12}px) rotateY(${x * 18}deg) rotateX(${-y * 12}deg)`;
  });
  heroArt.addEventListener("pointerleave", () => {
    orb.style.transform = "";
  });
}


// Satellite delivers the profile artwork before the portfolio is revealed.
const spaceIntro = document.getElementById("spaceIntro");
const introStatus = document.getElementById("introStatus");
const skipIntro = document.getElementById("skipIntro");
let introFinished = false;
const introStorageKey = "bavadharaniPortfolioIntroCompleted";
function finishIntro() {
  if (introFinished || !spaceIntro) return;
  introFinished = true;
  // Remember completion for this browser tab/session so internal page links
  // and returning from Details/Certificates never replay the satellite intro.
  try { sessionStorage.setItem(introStorageKey, "true"); } catch (error) { /* storage may be unavailable */ }
  if (introStatus) introStatus.textContent = "Profile delivered · Opening portfolio";
  document.body.classList.remove("intro-loading");
  document.body.classList.add("intro-ready");
  spaceIntro.classList.add("is-done");
  window.setTimeout(() => spaceIntro.remove(), 1000);
}
if (spaceIntro) {
  let alreadyCompleted = false;
  try { alreadyCompleted = sessionStorage.getItem(introStorageKey) === "true"; } catch (error) { /* storage may be unavailable */ }
  if (alreadyCompleted) {
    // Show the portfolio immediately without replaying the animation.
    introFinished = true;
    document.body.classList.remove("intro-loading");
    document.body.classList.add("intro-ready");
    spaceIntro.remove();
  } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishIntro();
  } else {
    window.setTimeout(finishIntro, 5300);
  }
}
if (skipIntro) skipIntro.addEventListener("click", finishIntro);


// Create lightweight floating glass bubbles for the full-page starfield.
const bubbleLayer = document.querySelector(".ambient-bubbles");
if (bubbleLayer) {
  const bubbleCount = window.matchMedia("(max-width: 650px)").matches ? 12 : 22;
  for (let i = 0; i < bubbleCount; i += 1) {
    const bubble = document.createElement("span");
    bubble.className = "ambient-bubble";
    bubble.style.setProperty("--x", `${(i * 37 + 11) % 100}%`);
    bubble.style.setProperty("--size", `${12 + ((i * 17) % 38)}px`);
    bubble.style.setProperty("--duration", `${17 + ((i * 7) % 19)}s`);
    bubble.style.setProperty("--delay", `${-((i * 11) % 31)}s`);
    bubbleLayer.appendChild(bubble);
  }
}
