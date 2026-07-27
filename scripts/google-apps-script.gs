/**
 * THE HOCKEY EVOLUTION — Formularios → Google Sheets + Email
 *
 * IMPORTANTE: Este script debe estar DENTRO de tu Google Sheet.
 * Abrí la Sheet → Extensiones → Apps Script → pegá este código.
 *
 * HOJAS:
 * 1. "Inscripciones" (formulario de consulta del sitio)
 *    Fecha | Jugador Nombre | Jugador Apellido | Año Nacimiento | Club |
 *    Posición | Responsable Nombre | Responsable Apellido | Teléfono | Email | Comentarios
 *
 * 2. "Devoluciones" (formulario post-camp)
 *    Fecha | Jugador Nombre | Jugador Apellido | Email |
 *    Valoración General | Valoración Staff | Valoración Contenido |
 *    Lo mejor | A mejorar | ¿Volvería? | ¿Recomendaría? | Comentarios |
 *
 * PASOS:
 * 1. Creá la hoja "Devoluciones" con los encabezados de arriba (fila 1).
 * 2. Cambiá NOTIFY_EMAIL si querés recibir las consultas en otro correo.
 * 3. Ejecutá "probarEscritura" y "probarDevolucion" (▶).
 * 4. Implementar → NUEVA implementación → Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 5. Copiá la URL /exec NUEVA en js/config.js (si cambió).
 * 6. Subí los archivos a GitHub.
 *
 * VERIFICAR: abrí la URL /exec en el navegador. Debe decir {"status":"ok","version":6}
 */

const SCRIPT_VERSION = 6;
const NOTIFY_EMAIL = "javitelechea@gmail.com";

function getSheetByName_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function getInscripcionesSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName("Inscripciones") || ss.getSheets()[0];
}

function appendInscripcion_(p) {
  if (!p || !p.jugadorNombre) {
    throw new Error("Faltan datos del formulario.");
  }

  getInscripcionesSheet_().appendRow([
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

function appendDevolucion_(p) {
  if (!p || !p.valoracionGeneral) {
    throw new Error("Faltan datos de la devolución.");
  }

  getSheetByName_("Devoluciones").appendRow([
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

function sendInscripcionEmail_(p) {
  if (!NOTIFY_EMAIL) return;

  const jugador = [p.jugadorNombre, p.jugadorApellido].filter(Boolean).join(" ");
  const responsable = [p.responsableNombre, p.responsableApellido]
    .filter(Boolean)
    .join(" ");

  const subject = "Nueva consulta — " + (jugador || "The Hockey Evolution");

  const body =
    "Nueva consulta desde el formulario de The Hockey Evolution\n\n" +
    "Jugador: " +
    jugador +
    "\n" +
    "Año de nacimiento: " +
    (p.anioNacimiento || "—") +
    "\n" +
    "Club: " +
    (p.club || "—") +
    "\n" +
    "Posición: " +
    (p.posicion || "—") +
    "\n\n" +
    "Responsable: " +
    responsable +
    "\n" +
    "Teléfono: " +
    (p.telefono || "—") +
    "\n" +
    "Email: " +
    (p.email || "—") +
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

function isDevolucion_(p) {
  return p && p.formType === "devolucion";
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

function probarDevolucion() {
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
    const p = e.parameter;
    const devolucion = isDevolucion_(p);

    if (devolucion) {
      appendDevolucion_(p);
    } else {
      appendInscripcion_(p);
    }

    if (p.soloSheet !== "1") {
      try {
        if (devolucion) {
          sendDevolucionEmail_(p);
        } else {
          sendInscripcionEmail_(p);
        }
      } catch (mailErr) {
        console.error("No se pudo enviar el email:", mailErr.message);
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, version: SCRIPT_VERSION })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: err.message,
        version: SCRIPT_VERSION,
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", version: SCRIPT_VERSION })
  ).setMimeType(ContentService.MimeType.JSON);
}
