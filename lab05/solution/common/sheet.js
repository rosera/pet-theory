const {google} = require('googleapis');

const SHEET_ID = '[SHEET-ID]';

async function reset() {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const sheetsService = google.sheets({version: 'v4', auth});
  let values = [
    ['', 'Report 12', 'Report 34', 'Report 56'],
    ['SMS', '', '', ''],
    ['Email', '', '', '']
  ];
  const resource = {values};
  await sheetsService.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A1:D4',
    valueInputOption: 'RAW',
    resource,
  });
}

async function update(service, reportId, status) {
  const cols = {12: 'B', 34: 'C', 56: 'D'};
  const col = cols[reportId];
  const rows = {sms: 2, email: 3};
  const row = rows[service];
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const sheetsService = google.sheets({version: 'v4', auth});
  let values = [[status]];
  const resource = {values};
  await sheetsService.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Sheet1!${col}${row}`,
    valueInputOption: 'RAW',
    resource,
  });
}

module.exports = {
  reset,
  update
}

