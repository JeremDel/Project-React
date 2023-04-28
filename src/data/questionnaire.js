
import firebaseApp from '../initFirebase';

function getQuestionnaire() {
  return new Promise((resolve, reject) => {

    const myDoc = firebaseApp.firestore().collection('questionnaires').doc('default');
    myDoc.get().then((doc) => {
      if(doc.exists){
        // Update the questionnaires and store them in the document
        return resolve(doc.data());
      } 
      
      reject('Could not find questionnaire in firebase (1)')
    })
    .catch(() => {
      reject('Could not find questionnaire in firebase (2)')
    });
  });
}


export default getQuestionnaire;
