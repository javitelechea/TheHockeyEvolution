/**
 * THE HOCKEY EVOLUTION — Formulario → Google Sheets
 *
 * PASOS:
 * 1. Creá una Google Sheet nueva.
 * 2. Renombrá la pestaña a "Inscripciones"
 * 3. En la fila 1, encabezados (A → K):
 *    Fecha | Jugador Nombre | Jugador Apellido | Año Nacimiento | Club | Posición |
 *    Responsable Nombre | Responsable Apellido | Teléfono | Email | Comentarios
 * 4. Extensiones → Apps Script → pegá este código.
 * 5. Reemplazá SHEET_ID con el ID de tu hoja.
 * 6. Implementar → Nueva implementación → Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 7. Copiá la URL /exec en js/config.js
 * 8. Cada cambio de código: Administrar implementaciones → Nueva versión
 */

const SHEET_ID = "1Qk1vemoUPYLCTcoM8C0ThfN7ip1tId-y57o5y6KhiCE";
const SHEET_NAME = "Inscripciones";

function appendInscripcion(p) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(
      'No existe la pestaña "' + SHEET_NAME + '". Renombrá la hoja en Google Sheets.'
    );
  }

  sheet.appendRow([
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

function doGet(e) {
  const p = e.parameter;

  if (p.jugadorNombre) {
    try {
      appendInscripcion(p);
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

function doPost(e) {
  try {
    appendInscripcion(e.parameter);
    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
