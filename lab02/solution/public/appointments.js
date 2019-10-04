let user;

firebase.auth().onAuthStateChanged(function(newUser) {
  user = newUser;
  if (user) {
    const db = firebase.firestore();
    const appColl = db.collection('customers').doc(user.email).collection('appointments');
    appColl.orderBy('time').onSnapshot(function(snapshot) {
      const div = document.getElementById('appointments');
      div.innerHTML = '';
      snapshot.docs.forEach(appointment => {
        div.innerHTML += formatDate(appointment.data().time) + '<br/>';
      })
      if (div.innerHTML == '') {
        div.innerHTML = 'No appointments scheduled';
      }
    });
  }
});

const timeslots = document.getElementById('timeslots');
getOpenTimes().forEach(time => {
  timeslots.add(new Option(formatDate(time), time));
});

document.getElementById('makeAppointment').addEventListener('click', function(ev) {
  const millis = parseInt(timeslots.selectedOptions[0].value);
  if (millis > 0) {
    const db = firebase.firestore();
    db.collection('customers').doc(user.email).collection('appointments').add({
      time: millis
    })
    timeslots.remove(timeslots.selectedIndex);
  }
})

function getOpenTimes() {
  const retVal = [];
  let startDate = new Date();
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);
  let millis = startDate.getTime();
  while (retVal.length < 5) {
    const hours = Math.floor(Math.random() * 5) + 1;
    millis += hours * 3600 * 1000;
    if (isDuringOfficeHours(millis)) {
      retVal.push(millis);
    }
  }
  return retVal;
}

function isDuringOfficeHours(millis) {
  const aDate = new Date(millis);
  return aDate.getDay() != 0 && aDate.getDay() != 6 &&
         aDate.getHours() >= 9 && aDate.getHours() <= 17;
}

function formatDate(millis) {
  const aDate = new Date(millis);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return days[aDate.getDay()] + ' ' + aDate.getDate() + ' ' +
         months[aDate.getMonth()] + ', ' + aDate.getHours() + ':' +
         (aDate.getMinutes() < 10? '0'+aDate.getMinutes(): aDate.getMinutes());
}
