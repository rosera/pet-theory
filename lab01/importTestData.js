const csv = require('csv-parse');
const fs  = require('fs');

function writeToDatabase(records) {
  for(const record of records) {
    console.log(`ID: ${record.id} Email: ${record.email} Name: ${record.name} Phone: ${record.phone}`);
  };
  return ;
}

async function importCsv(csvFilename) {
  const parser = csv.parse(
    { columns: true, delimiter: ',' }, 
    async function (pErr, records) {
      // Gracefully handle parsing errors.
      if (pErr) {
        console.error('Error parsing CSV:', pErr);
        return;
      }

      try {
        console.log(`Call write to Firestore`);
        await writeToDatabase(records);
        console.log(`Wrote ${records.length} records`);

      // Gracefully handle database errors.
      } catch (ioErr) {
        console.error(ioErr);
        process.exit(1);
      }
    }
  ); 

  await fs.createReadStream(csvFilename).pipe(parser);
}

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

importCsv(process.argv[2]).catch(e => console.error(e));
