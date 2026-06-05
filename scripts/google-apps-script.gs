/**
 * THE HOCKEY EVOLUTION — Formulario → Google Sheets
 *
 * PASOS:
 * 1. Creá una Google Sheet nueva.
 * 2. En la primera fila, poné estos encabezados (columna A → K):
 *    Fecha | Jugador Nombre | Jugador Apellido | Año Nacimiento | Club | Posición |
 *    Responsable Nombre | Responsable Apellido | Teléfono | Email | Comentarios
 * 3. Extensiones → Apps Script → pegá este código.
 * 4. Reemplazá SHEET_ID con el ID de tu hoja (está en la URL del Sheet).
 * 5. Desplegar → Nueva implementación → Tipo: Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 6. Copiá la URL del despliegue y pegala en js/config.js (GOOGLE_SCRIPT_URL).
 */

const SHEET_ID = "1Qk1vemoUPYLCTcoM8C0ThfN7ip1tId-y57o5y6KhiCE";
const SHEET_NAME = "Inscripciones";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.jugadorNombre || "",
      data.jugadorApellido || "",
      data.anioNacimiento || "",
      data.club || "",
      data.posicion || "",
      data.responsableNombre || "",
      data.responsableApellido || "",
      data.telefono || "",
      data.email || "",
      data.comentarios || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
