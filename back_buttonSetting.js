const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();

/**
 * Variable
 */
const buttonSection = document.getElementById("button-section");
const fuzzSection = document.getElementById("result-section");

const refreshButton = document.getElementById("refresh");
const cancelButton = document.getElementById("cancel");

var showingSection = false;
var currentSelected = "";


//++
var numServer = 0;
var numProgramsPerServer = 0;
var numJsonValuesPerProgram = 0;


/**
 * Listener
 */

window.addEventListener('load', (event) => {
    showFuzzSection(currentSelected);

    // setInterval(function(){ 
    //     refreshButtons();
    //     showFuzzSection(currentSelected);
        
    // }, 3000);
});

refreshButton.addEventListener('click', refreshButtons);
cancelButton.addEventListener('click', cancelFuzzSection);


 /**
  * Function
  */
var numPrograms = 0;
var namePrograms = [];
var nameClients = [];

function refreshButtons(){
    
    // Server의 개수 + Server의 관점에서 보기
    FIREBASE_DATABASE.ref('/').once('value')
    .then(function(snapshot) {
        numServer = snapshot.numChildren();
        nameServers = [];
        snapshot.forEach(function(childSnapshot){
            var serverName = childSnapshot.key;
            nameServers.push(serverName);
            console.log("Server name: "+ serverName);

            //Server's Program
            childSnapshot.ref(serverName).once('value').then(function(SSnapshot){
                var programName = SSnapshot.key;
                console.log("Program name: " + programName);
            });
        });
    });

    
    FIREBASE_DATABASE.ref('fuzzing').once('value')
        .then(function(snapshot) {
            namePrograms = [];
            snapshot.forEach(function(childSnapshot){
                var nameData = childSnapshot.child("name").val();
                namePrograms.push(nameData);
            });
        });

    console.log("Server 개수: " + numServer);
    showFuzzSection();
}

function showFuzzSection() {
    var idx = 1;
    var innerHTMLString = "";
    innerHTMLString += "<tr>     <th>Client ID</th>      <th>Runtime</th>     <th>Total paths</th>     <th>Unique crashes</th>     <th>Unique Hangs</th>       <th>Last Update</th>       <th>Status</th>       </tr>"; //table header

    showingSection = true;
    fuzzSection.style.visibility = "visible";
    FIREBASE_DATABASE.ref('fuzzing').once('value')
        .then(function(snapshot){
            snapshot.forEach(function(childSnapshot) { 
                var clntName = childSnapshot.key.replace(/ /g, ".").replace(/-/g, "/");
                var cyclesDone, lastUpdate, runTime, status, totalPaths, uniqueCrashes, uniqueHangs;

                cyclesDone = childSnapshot.child("cycles_done").val();
                lastUpdate = childSnapshot.child("last_update").val();
                runTime = childSnapshot.child("runtime").val();
                status = childSnapshot.child("status").val();
                totalPaths = childSnapshot.child("total_paths").val();
                uniqueCrashes = childSnapshot.child("unique_crashes").val();
                uniqueHangs = childSnapshot.child("unique_hangs").val();

                innerHTMLString += "<tr id='row'" + (idx++) + ">    <td>" + clntName + "</td>    <td>" + runTime + "</td>    <td>" + totalPaths + "</td>    <td>" + uniqueCrashes + "</td>    <td>" + uniqueHangs + "</td>    <td>" + lastUpdate + "</td>    <td class='status'>" + status + "</td>    </tr>"
            });
            //실행 순서로 인해 여기다 꼭 넣어야 함...
            fuzzSection.innerHTML = innerHTMLString;
            
            var all = document.getElementsByClassName('status');
            for (var i = 0; i < all.length; i++) {
                if( all[i].textContent == "false" )
                    all[i].style.color = 'red';
                else
                    all[i].style.color = 'blue'; 
            }
            
        })
        .catch( (error) => (
            console.log(error)
        ));
}

function showOneProgram(){}

function cancelFuzzSection(){
    showingSection = false;
    fuzzSection.style.visibility = "hidden";
}