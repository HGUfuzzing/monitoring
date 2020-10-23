const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions -> Done~

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();



exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.sessionAdded = functions.database.ref('/fuzzing/{programID}').onCreate((snapshot, context) => {
    const programName = context.params.programID;
    const fuzzData = snapshot.val(); // fuzzData.name/title/crash ... 

    console.log("Create Action! :" + snapshot.val());
});

exports.sessionDeleted = functions.database.ref('/fuzzing/{programID}').onDelete((snapshot, context) => {
    console.log("Delete Action! : ");

    //(아직) 해당하는 버튼 삭제하기 == 현재 DB에 존재하는 버튼으로 전체 새로고침 
});

exports.sessionHall = functions.database.ref('/fuzzing/{programID}').onUpdate((change, context) => {
    console.log("Update Action! : ");
    //(현재) 일단 {programID}의 개수를 가져와서 그것만큼의 button을 생성하는 걸로!

});

exports.sessionHall = functions.database.ref('/fuzzing/{programID}').onWrite((change, context) => {
    console.log("Write Action!");
    //(완) 일단 {programID}의 개수를 가져와서 
    //(미완) 그것만큼의 button을 생성하는 걸로! - buttonSetting 의 역할

    //여기서는 notification을 보냄.. 현재 onWrite시 제대로 작동하는 것은 확인..

    // change.after.ref.parent.once('value')
    // .then((data) => {
    //     const snapshot = data.val();
    //     numPrograms = 0;
    //     for(let key in snapshot){
    //         numPrograms++;
    //     }
    //     return numPrograms
    // }).then((numPrograms) => {
    //     console.log(numPrograms);

    //     var updates = {};
    //     updates['/info/num'] =  numPrograms;
    // });

    return Promise;
});