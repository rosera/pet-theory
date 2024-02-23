const csv = require('csv-parse');
const fs  = require('fs');

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

function writeToDatabase(records) {
  records.forEach((record, i) => {
    console.log(`ID: ${record.id} Email: ${record.email} Name: ${record.name} Phone: ${record.phone}`);
  });
  return ;
}

async function importCsv(csvFilename) {
  const parser = csv.parse({ columns: true, delimiter: ',' }, async function (err, records) {
    if (err) {
      console.error('Error parsing CSV:', err);
      return;
    }
    try {
      console.log(`Call write to Firestore`);
      await writeToDatabase(records);
      console.log(`Wrote ${records.length} records`);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }); 

  await fs.createReadStream(csvFilename).pipe(parser);
}

importCsv(process.argv[2]).catch(e => console.error(e));
