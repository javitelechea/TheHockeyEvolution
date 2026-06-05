/**
 * THE HOCKEY EVOLUTION — Formulario → Google Sheets
 *
 * CONFIGURACIÓN:
 * 1. Creá la Google Sheet y copiá su ID en SHEET_ID (está en la URL).
 * 2. Fila 1, encabezados: Fecha | Jugador Nombre | Jugador Apellido | Año Nacimiento |
 *    Club | Posición | Responsable Nombre | Responsable Apellido | Teléfono | Email | Comentarios
 * 3. Pegá este código en Apps Script.
 * 4. Ejecutá la función "probarEscritura" (▶) para verificar que escribe en la hoja.
 * 5. Implementar → Administrar implementaciones → Nueva versión → Implementar
 * 6. Pegá la URL /exec en js/config.js
 */

const SHEET_ID = "1Qk1vemoUPYLCTcoM8C0ThfN7ip1tId-y57o5y6KhiCE";

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("Inscripciones") || ss.getSheets()[0];
  if (!sheet) throw new Error("No se encontró ninguna hoja en el archivo.");
  return sheet;
}

function appendInscripcion_(p) {
  if (!p.jugadorNombre) {
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

/** Ejecutá esto manualmente en Apps Script para probar que escribe en la hoja */
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
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e.parameter && e.parameter.jugadorNombre) {
    try {
      appendInscripcion_(e.parameter);
      return ContentService.createTextOutput(
        JSON.stringify({ success: true })
      ).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: err.message })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
