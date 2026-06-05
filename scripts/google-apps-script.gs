/**
 * THE HOCKEY EVOLUTION — Formulario → Google Sheets
 *
 * IMPORTANTE: Este script debe estar DENTRO de tu Google Sheet.
 * Abrí la Sheet → Extensiones → Apps Script → pegá este código.
 *
 * PASOS:
 * 1. Fila 1: Fecha | Jugador Nombre | Jugador Apellido | Año Nacimiento | Club |
 *    Posición | Responsable Nombre | Responsable Apellido | Teléfono | Email | Comentarios
 * 2. Ejecutá "probarEscritura" (▶) — debe aparecer una fila en la hoja.
 * 3. Implementar → NUEVA implementación → Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 4. Copiá la URL /exec NUEVA en js/config.js
 * 5. Subí config.js y main.js a GitHub
 *
 * NOTA: No pruebes con ?jugadorNombre= en el navegador — Google pierde los parámetros.
 * El formulario de la web envía por POST y eso sí funciona.
 */

const SCRIPT_VERSION = 4;

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

function doPost(e) {
  try {
    appendInscripcion_(e.parameter);
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
