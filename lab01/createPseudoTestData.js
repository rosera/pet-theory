const fs = require('fs');
const faker = require('faker');

function getRandomCustomerEmail(firstName, lastName) {
  const provider = faker.internet.domainName();
  const email = faker.internet.email(firstName, lastName, provider);
  return email.toLowerCase();
}

function getRandomPetType() {
  const petTypes = ['dog', 'cat', 'iguana', 'frog', 'parakeet', 'alpaca',
                    'ferret', 'rabbit', 'mouse', 'hamster', 'guinea pig',
                    'gecko', 'gerbil', 'rat', 'turtle'];
  return faker.random.arrayElement(petTypes);
}

async function createTestData(recordCount) {
  const fileName = `pets_${recordCount}.csv`;
  var f = fs.createWriteStream(fileName);
  f.write('customerId,customerName,customerEmail,customerPhone,petName,petType\n')
  for (let i=0; i<recordCount; i++) {
    const customerId = faker.random.number();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const customerName = `${firstName} ${lastName}`;
    const customerEmail = getRandomCustomerEmail(firstName, lastName);
    const customerPhone = faker.phone.phoneNumber();
    const petName = faker.name.firstName();
    const petType = getRandomPetType();
    f.write(`${customerId},${customerName},${customerEmail},${customerPhone},` +
            `${petName},${petType}\n`);
  }
  console.log(`Created file ${fileName} containing ${recordCount} records.`);
}

recordCount = parseInt(process.argv[2]);
if (process.argv.length != 3 || recordCount < 1 || isNaN(recordCount)) {
  console.error('Include the number of test data records to create. Example:');
  console.error('    node createTestData.js 100');
  process.exit(1);
}
createTestData(recordCount);

