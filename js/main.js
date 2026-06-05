const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");
const navLogo = document.getElementById("nav-logo");
const form = document.getElementById("inscripcion-form");
const formStatus = document.getElementById("form-status");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* Nav scroll + mobile menu */
function updateNavState() {
  const useDarkLogo = window.scrollY > 40 || nav.classList.contains("nav--open");
  nav.classList.toggle("nav--scrolled", window.scrollY > 40);
  if (navLogo) {
    navLogo.src = useDarkLogo ? "images/logo-dark.png" : "images/logo-light.png";
  }
}

window.addEventListener("scroll", updateNavState);

navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("nav--open");
  navToggle.setAttribute("aria-expanded", open);
  updateNavState();
});

document.querySelectorAll(".nav__link, .btn").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("nav--open");
    navToggle?.setAttribute("aria-expanded", "false");
    updateNavState();
  });
});

updateNavState();

/* Scroll reveal */
const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add("reveal--visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* Hero animates on load */
  const heroContent = document.querySelector(".hero__content");
  if (heroContent) {
    requestAnimationFrame(() => {
      heroContent.classList.add("reveal--visible");
    });
  }
}

/* Form → Google Sheets */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  if (typeof GOOGLE_SCRIPT_URL === "undefined" || GOOGLE_SCRIPT_URL.includes("TU_URL")) {
    showStatus(
      "error",
      "Falta configurar Google Sheets. Revisá js/config.js y scripts/google-apps-script.gs."
    );
    return;
  }

  const data = {
    jugadorNombre: form.jugadorNombre.value.trim(),
    jugadorApellido: form.jugadorApellido.value.trim(),
    edad: form.edad.value.trim(),
    club: form.club.value.trim(),
    posicion: form.posicion.value.trim(),
    responsableNombre: form.responsableNombre.value.trim(),
    responsableApellido: form.responsableApellido.value.trim(),
    telefono: form.telefono.value.trim(),
    email: form.email.value.trim(),
    comentarios: form.comentarios.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando…";
  formStatus.hidden = true;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    form.reset();
    showStatus(
      "success",
      "¡Inscripción enviada! Te contactaremos pronto con los próximos pasos."
    );
  } catch {
    showStatus(
      "error",
      "No pudimos enviar el formulario. Escribinos por WhatsApp o email."
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

function showStatus(type, message) {
  formStatus.hidden = false;
  formStatus.className = `form-status form-status--${type}`;
  formStatus.textContent = message;
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
