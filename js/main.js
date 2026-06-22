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

/* Form → Web3Forms (principal) + Google Sheets (respaldo opcional) */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  const hasWeb3Forms = isConfigured(WEB3FORMS_ACCESS_KEY, "TU_CLAVE_WEB3FORMS");
  const hasGoogleSheets = isConfigured(GOOGLE_SCRIPT_URL, "TU_URL");

  if (!hasWeb3Forms && !hasGoogleSheets) {
    showStatus(
      "error",
      "Falta configurar el formulario. Revisá js/config.js."
    );
    return;
  }

  const data = {
    jugadorNombre: form.jugadorNombre.value.trim(),
    jugadorApellido: form.jugadorApellido.value.trim(),
    anioNacimiento: form.anioNacimiento.value.trim(),
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
    if (hasWeb3Forms) {
      await submitToWeb3Forms(data);
    } else {
      await submitToGoogleSheets(data);
    }

    if (hasGoogleSheets && hasWeb3Forms) {
      submitToGoogleSheets(data).catch(() => {});
    }

    form.reset();
    showStatus(
      "success",
      "¡Consulta enviada! Te contactaremos pronto con más información."
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

function isConfigured(value, placeholder) {
  return typeof value === "string" && value && !value.includes(placeholder);
}

function submitToWeb3Forms(data) {
  const jugador = [data.jugadorNombre, data.jugadorApellido].filter(Boolean).join(" ");
  const responsable = [data.responsableNombre, data.responsableApellido].filter(Boolean).join(" ");

  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Nueva consulta — ${jugador || "The Hockey Evolution"}`,
      from_name: "The Hockey Evolution",
      name: responsable || jugador,
      email: data.email,
      ...data,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      if (!result.success) {
        throw new Error(result.message || "Error al enviar");
      }
    });
}

function submitToGoogleSheets(data) {
  return fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams(data).toString(),
  });
}

function showStatus(type, message) {
  formStatus.hidden = false;
  formStatus.className = `form-status form-status--${type}`;
  formStatus.textContent = message;
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
