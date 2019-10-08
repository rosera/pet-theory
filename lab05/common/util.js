function decodeBase64Json(data) {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

async function attemptFlakeyOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        resolve('Success');
      }
      else {
        reject('Failure');
      }
    }, 2000 + Math.random() * 2000)
  })
}

module.exports = {
  decodeBase64Json,
  attemptFlakeyOperation
}
