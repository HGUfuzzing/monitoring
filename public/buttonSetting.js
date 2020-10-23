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

function Server() {
    this.name = "";
    this.programs = [];
}

/**
 * Listener
 */

window.addEventListener('load', (event) => {
    refreshButtons();

    setInterval(function(){ 
        refreshButtons();
    }, 2000);
});

refreshButton.addEventListener('click', refreshButtons);
cancelButton.addEventListener('click', cancelFuzzSection);


 /**
  * Function
  */
var numPrograms = [];
var namePrograms = [];
var nameClients = [];

//++
var nameServers = [];
var numServer = 0;
var numJsonValuesPerProgram = 0;
var tablesCode = [];
var HTTPPrograms = [];

var check = 1;

function refreshButtons(){
    if(check === 1) {
        saveServerNames()
            .then(saveProgramNames())
            .then(makeHTMLTables())
            .then(showAllTables());
    }
}

function saveServerNames(){
    check = 0;
    return new Promise(function(resolve, reject){
        FIREBASE_DATABASE.ref('/').once('value')
        .then(function(snapshot) {
            nameServers = [];
            snapshot.forEach(function(childSnapshot){
                var server = new Server();
                server.name = childSnapshot.key;
                server.programs = new Array();
                nameServers.push(server);
            })
        });
    });
}

function saveProgramNames(){
    return new Promise(function (resolve, reject) {
        var idx = 0;
        for(var i = 0; i < nameServers.length; i++){
            FIREBASE_DATABASE.ref('/' + nameServers[i].name).on
            ('value', function(snapshot) {
                
                snapshot.forEach(function(childSnapshot){
                    var programName = childSnapshot.key;
                    nameServers[idx]["programs"].push(programName);
                });
                idx++;
            });
        }

        console.dir(nameServers);
    });
}

function makeHTMLTables () {

    return new Promise (function (resolve, reject) {
        innerHTMLString ="";
        var pKey = [];
        var pValue = [];
        idx=0;
        cumulative = 0;
        var real_num = 0;
        var num = 0;
        for(var i = 0; i < nameServers.length; i++) {
            
            innerHTMLString += "<div class = \"" + "Server-table\"" + ">";
            innerHTMLString += "<h4>" + nameServers[i].name+ "</h4>";
            for(var j = 0; j < nameServers[i].programs.length; j++){
                FIREBASE_DATABASE.ref('/' + nameServers[i].name + '/' + nameServers[i].programs[j]).on
                ('value', function(snapshot){
                    pKey = [];
                    pValue = [];
                    snapshot.forEach(function(childSnapshot) {
                        pKey.push(childSnapshot.key);
                        pValue.push(childSnapshot.val());
                    });

                    
                    innerHTMLString += "<table id = \"" + "tabless" + "\">";
                    innerHTMLString += "<caption>" + snapshot.key + "</caption>";
                    for (var d=0; d<pKey.length; d++){
                        innerHTMLString += "<tr>" + "<th>" + pKey[d] + "</th>" + "<td>" + pValue[d] + "</td>" + "</tr>";
                    }
                    innerHTMLString += "</table>";    

                    num++;
                });
                real_num++;
            }
            innerHTMLString += "</div>";
        }
        //while(real_num != num);
        fuzzSection.innerHTML = innerHTMLString;
        console.log(innerHTMLString);
    });
}

function showAllTables() {
    check = 1;
    return new Promise (function (resolve, reject) {
        showingSection = true;
        fuzzSection.style.visibility = "visible";
    })
}


function cancelFuzzSection(){
    showingSection = false;
    fuzzSection.style.visibility = "hidden";
}