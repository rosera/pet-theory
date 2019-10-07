const SERVICE_URL = '[URL]';
let idToken;

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  idToken = googleUser.getAuthResponse().id_token;
  displayStatus(`${profile.getName()} signed in, id: ${profile.getId()}.`);
}

document.getElementById('callApi').addEventListener('click', async function(ev) {
  displayStatus('Calling REST API...');
  const customerId = document.getElementById('customerId').value;
  const url = `${SERVICE_URL}/v1/customer/${customerId}`;
  const myInit = {method: 'GET', headers: {'Authorization': idToken}};
  var myRequest = new Request(url, myInit);
  const response = await fetch(myRequest);
  const responseObject = await response.json();
  displayApiResult(responseObject);
})

function displayApiResult(responseObject) {
  let output = '';
  if (responseObject.status == 'fail') {
    output = responseObject.data.title;
  }
  if (responseObject.status == 'success') {
    const keys = Object.keys(responseObject.data).sort();
    const props = keys.map(key => `${key}: ${responseObject.data[key]}`);
    output = props.join('<br>');
  }
  displayStatus(output);
}

document.getElementById('signOut').addEventListener('click', function(ev) {
  idToken = '';
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    displayStatus('User signed out');
  });
})

function displayStatus(html) {
  document.getElementById('status').innerHTML = html;
}
