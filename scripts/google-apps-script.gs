/**
 * Cole este código no editor de Apps Script da planilha (Extensões > Apps Script),
 * publique como Web App e use a URL gerada como GOOGLE_SHEETS_WEBHOOK_URL.
 * Veja instruções completas no final deste arquivo.
 */

var SHEET_NAME = "Leads"; // nome da aba da planilha
var DEFAULT_HEADERS = [
  "id",
  "name",
  "email",
  "phone",
  "data",
  "hora",
  "qualificado",
  "utm_source",
  "utm_campaign",
  "utm_medium",
  "utm_content",
  "utm_term",
  "fbclid",
];

function doPost(e) {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(DEFAULT_HEADERS);
  }

  // Sempre lê o cabeçalho real da planilha (linha 1), em vez de presumir uma
  // ordem fixa de colunas — assim o script nunca desalinha dados mesmo que
  // alguém reordene ou adicione colunas manualmente na planilha.
  var headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];

  var idCol = headers.indexOf("id");
  if (idCol === -1) {
    throw new Error('Cabeçalho "id" não encontrado na linha 1 da planilha.');
  }

  var data = JSON.parse(e.postData.contents);
  var values = sheet.getDataRange().getValues();

  var rowIndex = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][idCol] === data.id) {
      rowIndex = i + 1; // linhas do Sheets começam em 1
      break;
    }
  }

  var tz = Session.getScriptTimeZone();
  var now = new Date();
  var dateStr = Utilities.formatDate(now, tz, "dd/MM/yyyy");
  var timeStr = Utilities.formatDate(now, tz, "HH:mm:ss");

  if (rowIndex === -1) {
    var row = headers.map(function (h) {
      if (h === "data") return dateStr;
      if (h === "hora") return timeStr;
      if (h === "qualificado") return "";
      return data[h] || "";
    });
    sheet.appendRow(row);
  } else {
    headers.forEach(function (h, colIdx) {
      // nunca sobrescreve data/hora (mantém o primeiro toque) nem qualificado (preenchimento manual)
      if (h === "data" || h === "hora" || h === "qualificado") return;
      if (data[h] !== undefined && data[h] !== "") {
        sheet.getRange(rowIndex, colIdx + 1).setValue(data[h]);
      }
    });
  }

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * COMO CONFIGURAR
 *
 * 1. Crie (ou abra) a planilha do Google Sheets e renomeie a primeira aba para "Leads".
 * 2. Na linha 1, garanta que existam as colunas (na ordem que preferir):
 *    id, name, email, phone, data, hora, qualificado, utm_source, utm_campaign,
 *    utm_medium, utm_content, utm_term, fbclid
 * 3. Vá em Extensões > Apps Script.
 * 4. Apague o conteúdo padrão do arquivo Code.gs e cole este arquivo inteiro (só o código, sem este comentário se preferir).
 * 5. Clique em Implantar > Nova implantação.
 *    - Tipo: "Web App" (Aplicativo da Web)
 *    - Executar como: "Eu" (sua conta)
 *    - Quem pode acessar: "Qualquer pessoa"
 * 6. Autorize as permissões pedidas (é a sua própria planilha, é seguro).
 * 7. Copie a URL do Web App gerada (termina em /exec).
 * 8. No projeto Next.js, defina a variável de ambiente:
 *      GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
 *    - Em desenvolvimento: crie um arquivo .env.local na raiz do projeto com essa linha.
 *    - Em produção (Vercel): adicione essa env var nas configurações do projeto.
 * 9. Sempre que o código do Apps Script for alterado, é preciso criar uma
 *    "Nova implantação" (ou gerenciar implantações > editar > nova versão) para as mudanças valerem.
 */
