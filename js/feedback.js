const form = document.getElementById("devolucion-form");
const formStatus = document.getElementById("form-status");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  const hasWeb3Forms = isConfigured(WEB3FORMS_ACCESS_KEY, "TU_CLAVE_WEB3FORMS");
  const hasGoogleSheets = isConfigured(
    GOOGLE_SCRIPT_URL_DEVOLUCION,
    "TU_URL_DEVOLUCION"
  );

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
    email: form.email.value.trim(),
    valoracionGeneral: getRadioValue(form, "valoracionGeneral"),
    valoracionStaff: getRadioValue(form, "valoracionStaff"),
    valoracionContenido: getRadioValue(form, "valoracionContenido"),
    loMejor: form.loMejor.value.trim(),
    aMejorar: form.aMejorar.value.trim(),
    volveria: form.volveria.value.trim(),
    recomendaria: form.recomendaria.value.trim(),
    comentarios: form.comentarios.value.trim(),
  };

  if (
    !data.valoracionGeneral ||
    !data.valoracionStaff ||
    !data.valoracionContenido
  ) {
    showStatus("error", "Completá las tres valoraciones del 1 al 5.");
    return;
  }

  if (!data.loMejor) {
    showStatus("error", "Contanos qué fue lo que más te gustó.");
    return;
  }

  if (!data.volveria || !data.recomendaria) {
    showStatus("error", "Completá si volverías y si la recomendarías.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando…";
  formStatus.hidden = true;

  try {
    if (hasWeb3Forms) {
      await submitToWeb3Forms(data);
    }

    if (hasGoogleSheets) {
      await submitToGoogleSheets(data);
    } else if (!hasWeb3Forms) {
      throw new Error("Sin canal de envío");
    }

    form.reset();
    showStatus(
      "success",
      "¡Gracias por tu devolución! Nos ayuda un montón a seguir creciendo."
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

function getRadioValue(formEl, name) {
  const checked = formEl.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

function isConfigured(value, placeholder) {
  return typeof value === "string" && value && !value.includes(placeholder);
}

function submitToWeb3Forms(data) {
  const jugador = [data.jugadorNombre, data.jugadorApellido]
    .filter(Boolean)
    .join(" ");

  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Nueva devolución — ${jugador || "The Hockey Evolution"}`,
      from_name: "The Hockey Evolution",
      name: jugador || "Jugadora",
      email: data.email || "noreply@hockeyevolution.com.ar",
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
  const body = new FormData();
  const payload = { ...data, soloSheet: "1" };
  Object.entries(payload).forEach(([key, value]) => {
    body.append(key, value == null ? "" : String(value));
  });

  // no-cors: Google redirige la respuesta; no podemos leerla, pero el POST sí llega.
  return fetch(GOOGLE_SCRIPT_URL_DEVOLUCION, {
    method: "POST",
    mode: "no-cors",
    body,
  });
}

function showStatus(type, message) {
  formStatus.hidden = false;
  formStatus.className = `form-status form-status--${type}`;
  formStatus.textContent = message;
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
