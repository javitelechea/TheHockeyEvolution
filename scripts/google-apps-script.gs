/**
 * THE HOCKEY EVOLUTION — Formulario → Google Sheets + Email
 *
 * IMPORTANTE: Este script debe estar DENTRO de tu Google Sheet.
 * Abrí la Sheet → Extensiones → Apps Script → pegá este código.
 *
 * PASOS:
 * 1. Fila 1: Fecha | Jugador Nombre | Jugador Apellido | Año Nacimiento | Club |
 *    Posición | Responsable Nombre | Responsable Apellido | Teléfono | Email | Comentarios
 * 2. Cambiá NOTIFY_EMAIL si querés recibir las consultas en otro correo.
 * 3. Ejecutá "probarEscritura" (▶) — debe aparecer una fila en la hoja.
 * 4. Ejecutá "probarEmail" (▶) — debe llegarte un mail de prueba (autorizá el envío si lo pide).
 * 5. Implementar → NUEVA implementación → Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 6. Copiá la URL /exec NUEVA en js/config.js
 * 7. Subí config.js y main.js a GitHub
 *
 * VERIFICAR: abrí la URL /exec en el navegador. Debe decir {"status":"ok","version":5}
 * Si dice version 4, el script viejo sigue activo — repetí los pasos 4 a 6.
 *
 * NOTA: No pruebes con ?jugadorNombre= en el navegador — Google pierde los parámetros.
 * El formulario de la web envía por POST y eso sí funciona.
 */

const SCRIPT_VERSION = 5;
const NOTIFY_EMAIL = "javitelechea@gmail.com";

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Inscripciones") || ss.getSheets()[0];
  if (!sheet) throw new Error("No se encontró ninguna hoja.");
  return sheet;
}

function appendInscripcion_(p) {
  if (!p || !p.jugadorNombre) {
    throw new Error("Faltan datos del formulario.");
  }

  getSheet_().appendRow([
    new Date(),
    p.jugadorNombre || "",
    p.jugadorApellido || "",
    p.anioNacimiento || "",
    p.club || "",
    p.posicion || "",
    p.responsableNombre || "",
    p.responsableApellido || "",
    p.telefono || "",
    p.email || "",
    p.comentarios || "",
  ]);
}

function sendInscripcionEmail_(p) {
  if (!NOTIFY_EMAIL) return;

  const jugador = [p.jugadorNombre, p.jugadorApellido].filter(Boolean).join(" ");
  const responsable = [p.responsableNombre, p.responsableApellido].filter(Boolean).join(" ");

  const subject = "Nueva consulta — " + (jugador || "The Hockey Evolution");

  const body =
    "Nueva consulta desde el formulario de The Hockey Evolution\n\n" +
    "Jugador: " + jugador + "\n" +
    "Año de nacimiento: " + (p.anioNacimiento || "—") + "\n" +
    "Club: " + (p.club || "—") + "\n" +
    "Posición: " + (p.posicion || "—") + "\n\n" +
    "Responsable: " + responsable + "\n" +
    "Teléfono: " + (p.telefono || "—") + "\n" +
    "Email: " + (p.email || "—") + "\n\n" +
    "Comentarios:\n" + (p.comentarios || "—") + "\n\n" +
    "—\n" +
    "Enviado el " +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");

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
  appendInscripcion_({
    jugadorNombre: "Prueba",
    jugadorApellido: "Script",
    anioNacimiento: "2012",
    club: "Test",
    posicion: "Delantero",
    responsableNombre: "Responsable",
    responsableApellido: "Test",
    telefono: "111111",
    email: "test@test.com",
    comentarios: "Prueba desde Apps Script",
  });
}

function probarEmail() {
  sendInscripcionEmail_({
    jugadorNombre: "Prueba",
    jugadorApellido: "Email",
    anioNacimiento: "2012",
    club: "Test",
    posicion: "Delantero",
    responsableNombre: "Responsable",
    responsableApellido: "Test",
    telefono: "111111",
    email: "test@test.com",
    comentarios: "Prueba de envío por mail desde Apps Script",
  });
}

function doPost(e) {
  try {
    appendInscripcion_(e.parameter);
    if (e.parameter.soloSheet !== "1") {
      try {
        sendInscripcionEmail_(e.parameter);
      } catch (mailErr) {
        console.error("No se pudo enviar el email:", mailErr.message);
      }
    }
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, version: SCRIPT_VERSION })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message, version: SCRIPT_VERSION })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", version: SCRIPT_VERSION })
  ).setMimeType(ContentService.MimeType.JSON);
}
