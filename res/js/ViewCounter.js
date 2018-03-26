// var counterElement = document.getElementById("viewCounter");
var xhttp = new XMLHttpRequest;
//open GET request to view counter (Math.random is used to prevent caching of result)
xhttp.open("GET", "/viewCounter" + Math.random()*50, true);
//send request
xhttp.send();
//set element data to response
// xhttp.onreadystatechange = ()=>{
//     if(xhttp.readyState == 4 && xhttp.status == 200){
//         counterElement.innerHTML = xhttp.response;
//     }
// }