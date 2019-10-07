const express = require('express');
const app = express();
const cors = require('cors');
const Firestore = require('@google-cloud/firestore');
const db = new Firestore();
app.use(cors({ origin: true }));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Pet Theory REST API listening on port', port);
});

app.get('/v1', async (req, res) => {
  res.json({status: 'running'});
});

app.get('/v1/customer/:id', async (req, res) => {
  const customerId = req.params.id;
  const customer = await getCustomer(customerId);
  if (customer) {
    res.json({status: 'success', data: await getAmounts(customer)});
  }
  else {
    res.status(404);
    res.json({status: 'fail', data: {title: `Customer "${customerId}" not found`}});
  }
});

async function getCustomer(id) {
  const queryRef = db.collection('customers').where('id', '==', id);
  const querySnapshot = await queryRef.get();
  let retVal;
  querySnapshot.forEach(docSnapshot => {
    retVal = docSnapshot.data();
  });
  return retVal;
}

async function getAmounts(customer) {
  const retVal = {proposed:0, approved:0, rejected:0};
  const collRef = db.collection(`customers/${customer.email}/treatments`);
  const querySnapshot = await collRef.get();
  querySnapshot.forEach(docSnapshot => {
    const treatment = docSnapshot.data();
    retVal[treatment.status] += treatment.cost;
  });
  return retVal;
}

sync function getUid(req) {
  const idToken = req.headers['authorization'];
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const uid = payload['sub'];
    console.log(`uid: ${uid}`);
    return uid;
  }
  catch (ex) {
    console.error(ex);
    return '';
  }
}

async function hasRestApiAccess(uid) {
  const doc = await db.collection('admin').doc('users').get();
  if (doc.exists) {
    const users = doc.data();
    if (users.hasOwnProperty('rest-api-users')) {
      return users['rest-api-users'].includes(uid);
    }
  }
  console.error('Did not find admin/users/rest-api-users in Firestore');
  return false;
}

