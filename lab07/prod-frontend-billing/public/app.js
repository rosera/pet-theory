// Title: GSP328 Challenge Lab
// Author: Rich Rose

//const REST_API_SERVICE = "data/billing.json"
//const REST_API_SERVICE = "http://localhost:8080/billing"
//const REST_API_SERVICE = "https://XXXX-SERVICE.run.app" 
const REST_API_SERVICE = new URL("https://billing-service-st43nxgwmq-uc.a.run.app" + "/billing");

function setTileData(items){
  
  const dynamicView = items.map((item) => {
    return `<tr>
        <td>${item.ref}</td>
        <td>${item.month}</td>
        <td>${item.provider}</td>
        <td>${item.date}</td>
        <td>${item.procedure}</td>
        <td>${item.amount}</td>
        <td>${item.status}</td>
      </tr>`;
  });

  let header = `<div class="table-wrapper">
    <table>
      <thead>
      <tr>
        <th>Ref</th>
        <th>Month</th>
        <th>Provider</th>
        <th>Date</th>
        <th>Procedure</th>
        <th>Amount</th>
        <th>Status</th>
      </thead><tbody>`;
      

  let footer = `</tbody></table>
		</div>`

  return (header + dynamicView.join("") + footer);  
}

//let headers = new Headers();

//headers.append('Content-Type', 'application/json');
//headers.append('Accept', 'application/json');
//headers.append('Access-Control-Allow-Origin', '*');
//headers.append('Content-Type', 'application/json');
//headers.append('Accept', 'application/json');

async function fetchLocalData3(file){
  try {
//    const response = await(fetch(file, {
//       mode: 'no-cors'	    
//       headers: headers
//    }) );
//    const local = await response.json();
    let response = fetch(`http://localhost:8080/backend`)
      .then(res => res.json())

    return response;
  }
  catch (error) {
    console.log(`Fetch: ${error}`);
    return '';
  }
}

async function fetchLocalData2(file){
  try{
    const response = await fetch(file)
      .then (res => res.json());

    return response;
  
  } catch (error) {
    console.log(`Fetch: ${error}`);
  }
}


async function fetchLocalData(file){
  try{
    let data = {};	  
    const response = await fetch('/', {
      method: 'POST',
      headers: {
//	'Content-Type': 'plain/text'
	'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const text = await response.text();
    let test = JSON.parse(text);	  

    if (!response.ok) {
      console.log(`Error: Fetch: status code: ${response.status}`);
      console.log(`Data: ${response.text}`);
      return '';
    }
    else {
      console.log(`Success: Fetch status code: ${response.status}`);
      console.log(`Success: Fetch Text: ${response.text}`);
    //  const text = await response.text();
      return test;
    }
  } catch(error){
    console.log(`Catch Fetch error: ${error}`);
  }
	
}


async function getPageInfo(){
  const info = await fetchLocalData(REST_API_SERVICE)
  htmlContent = document.querySelector('#info');
  console.log(`Data Returned: ${info.bills[0].month}`);
 
  htmlContent.innerHTML = setTileData(info.bills);
}


window.addEventListener('load', () => {
  getPageInfo();
});

