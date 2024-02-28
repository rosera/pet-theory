const fs  = require('fs');
const csv = require('csv-parse');
const { Firestore } = require("@google-cloud/firestore");

const projectId    = 'PROJECT_ID'
const collectionId = 'customers'

const resource = {
  type: "global",
};

async function writeToFirestore(records) {
  const db = new Firestore({  
//        projectId: projectId 
  });
  const batch = db.batch()

  records.forEach((record)=>{
    console.log(`Write: ${record}`)
    const docRef = db.collection(collectionId).doc(record.email);
    // Create new document
    // batch.create(docRef, record)
    // Merge or create new doc
    batch.set(docRef, record, { merge: true})
  })

  batch.commit().then(() => {
    console.log('Batch executed')
  }).catch(err => {
    console.log(`writeToFirestore: ${err}`)
  })
  return 
}

async function importCsv(csvFilename) {
  const parser = csv.parse({ columns: true, delimiter: ',' }, async function (err, records) {
    if (err) {
      console.error('csv-parse:', err);
      return;
    }
    try {
      console.log(`Call write to Firestore`);
      await writeToFirestore(records);
      console.log(`Wrote ${records.length} records`);
    } catch (err) {
      console.error(`importCsv: ${err}`);
      process.exit(1);
    }
  }); 

  await fs.createReadStream(csvFilename).pipe(parser);
}

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

importCsv(process.argv[2]).catch(err => console.error(err));
