let user;

firebase.auth().onAuthStateChanged(function(newUser) {
  user = newUser;
  if (user) {
    const db = firebase.firestore();
    db.collection("pets").doc(user.email).onSnapshot(function(doc) {
      const pet = doc.data();
      if (pet) {
        document.getElementById('customerName').setAttribute('value', pet.customerName);
        document.getElementById('customerPhone').setAttribute('value', pet.customerPhone);
        document.getElementById('petName').setAttribute('value', pet.petName);
        document.getElementById('petType').setAttribute('value', pet.petType);
      }
      document.getElementById('customerEmail').innerText = user.email;
    });
  }
});

document.getElementById('savePet').addEventListener('click', function(ev) {
  const db = firebase.firestore();
  var docRef = db.collection('pets').doc(user.email);
  docRef.set({
    customerName: document.getElementById('customerName').value,
    customerEmail: user.email,
    customerPhone: document.getElementById('customerPhone').value,
    petName: document.getElementById('petName').value,
    petType: document.getElementById('petType').value,
  })
})
