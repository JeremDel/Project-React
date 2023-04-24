import { getAuth } from "firebase/auth";

import { produce } from "immer"
import firebaseApp from '../initFirebase';
export async function addUserQuestionnaire(questionnaire) {
  // Get user id
  const uid = getAuth().currentUser.uid;

  // Append the current date to the questionnaire
  const newQuestionnaire = produce(questionnaire, draft => {
    draft.datetime = new Date();
  });

  // Get the document with the user id from the collection userQuestionnaires
  const myDoc = firebaseApp.firestore().collection('userQuestionnaires').doc(uid);
  myDoc.get().then((doc) => {
    if(doc.exists){
      // Update the questionnaires and store them in the document
      const data = doc.data();
      const questionnaires = data.questionnaires;
      const newQuestionnaires = [newQuestionnaire, ...questionnaires];
      myDoc.update({
        questionnaires: newQuestionnaires      });
    } else {
      // Create the document with the questionnaire
      myDoc.set({
        questionnaires: [newQuestionnaire]
      });
    }
  });
}