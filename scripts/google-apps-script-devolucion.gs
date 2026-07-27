/**
 * THE HOCKEY EVOLUTION — Devoluciones del camp → Google Sheets + Email
 *
 * IMPORTANTE: Usá una Google Sheet NUEVA, separada de Inscripciones.
 * Abrí esa Sheet → Extensiones → Apps Script → pegá este código.
 *
 * PASOS:
 * 1. Creá un Google Sheet nuevo, por ejemplo "THE — Devoluciones Camp".
 * 2. En la fila 1 de la primera hoja:
 *    Fecha | Jugador Nombre | Jugador Apellido | Email |
 *    Valoración General | Valoración Staff | Valoración Contenido |
 *    Lo mejor | A mejorar | ¿Volvería? | ¿Recomendaría? | Comentarios
 * 3. Cambiá NOTIFY_EMAIL si hace falta.
 * 4. Ejecutá "probarEscritura" (▶).
 * 5. Implementar → Nueva implementación → Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 6. Copiá la URL /exec en js/config.js → GOOGLE_SCRIPT_URL_DEVOLUCION
 * 7. Subí config.js a GitHub.
 *
 * VERIFICAR: abrí la URL /exec. Debe decir {"status":"ok","version":1,"form":"devolucion"}
 */

const SCRIPT_VERSION = 1;
const NOTIFY_EMAIL = "javitelechea@gmail.com";

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  if (!sheet) throw new Error("No se encontró ninguna hoja.");
  return sheet;
}

function appendDevolucion_(p) {
  if (!p || !p.valoracionGeneral) {
    throw new Error("Faltan datos de la devolución.");
  }

  getSheet_().appendRow([
    new Date(),
    p.jugadorNombre || "",
    p.jugadorApellido || "",
    p.email || "",
    p.valoracionGeneral || "",
    p.valoracionStaff || "",
    p.valoracionContenido || "",
    p.loMejor || "",
    p.aMejorar || "",
    p.volveria || "",
    p.recomendaria || "",
    p.comentarios || "",
  ]);
}

function sendDevolucionEmail_(p) {
  if (!NOTIFY_EMAIL) return;

  const jugador = [p.jugadorNombre, p.jugadorApellido].filter(Boolean).join(" ");
  const subject = "Nueva devolución — " + (jugador || "The Hockey Evolution");

  const body =
    "Nueva devolución del camp — The Hockey Evolution\n\n" +
    "Jugadora: " +
    (jugador || "Anónima") +
    "\n" +
    "Email: " +
    (p.email || "—") +
    "\n\n" +
    "Valoración general: " +
    (p.valoracionGeneral || "—") +
    "/5\n" +
    "Staff: " +
    (p.valoracionStaff || "—") +
    "/5\n" +
    "Contenido: " +
    (p.valoracionContenido || "—") +
    "/5\n\n" +
    "Lo que más le gustó:\n" +
    (p.loMejor || "—") +
    "\n\n" +
    "Qué mejoraría:\n" +
    (p.aMejorar || "—") +
    "\n\n" +
    "¿Volvería?: " +
    (p.volveria || "—") +
    "\n" +
    "¿Recomendaría?: " +
    (p.recomendaria || "—") +
    "\n\n" +
    "Comentarios:\n" +
    (p.comentarios || "—") +
    "\n\n" +
    "—\n" +
    "Enviado el " +
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm"
    );

  const mailOptions = {
    to: NOTIFY_EMAIL,
    subject: subject,
    body: body,
  };
  if (p.email) {
    mailOptions.replyTo = p.email;
  }
  MailApp.sendEmail(mailOptions);
}

function probarEscritura() {
  appendDevolucion_({
    jugadorNombre: "Prueba",
    jugadorApellido: "Devolucion",
    email: "test@test.com",
    valoracionGeneral: "5",
    valoracionStaff: "5",
    valoracionContenido: "4",
    loMejor: "Los ejercicios y el staff",
    aMejorar: "Nada",
    volveria: "Sí",
    recomendaria: "Sí",
    comentarios: "Prueba de devolución",
  });
}

function probarEmail() {
  sendDevolucionEmail_({
    jugadorNombre: "Prueba",
    jugadorApellido: "Email",
    email: "test@test.com",
    valoracionGeneral: "5",
    valoracionStaff: "5",
    valoracionContenido: "4",
    loMejor: "Los ejercicios",
    aMejorar: "Nada",
    volveria: "Sí",
    recomendaria: "Sí",
    comentarios: "Prueba de mail de devolución",
  });
}

function doPost(e) {
  try {
    appendDevolucion_(e.parameter);
    if (e.parameter.soloSheet !== "1") {
      try {
        sendDevolucionEmail_(e.parameter);
      } catch (mailErr) {
        console.error("No se pudo enviar el email:", mailErr.message);
      }
    }
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        version: SCRIPT_VERSION,
        form: "devolucion",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: err.message,
        version: SCRIPT_VERSION,
        form: "devolucion",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "ok",
      version: SCRIPT_VERSION,
      form: "devolucion",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
