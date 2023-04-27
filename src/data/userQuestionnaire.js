import { getAuth } from "firebase/auth";

import { produce } from "immer"
import firebaseApp from '../initFirebase';
export async function addUserQuestionnaire(questionnaire) {
  // Get user id
  const uid = getAuth().currentUser.uid;

  const newQuestionnaire = produce(questionnaire, draft => {
    // Add some information
    // Append the current date to the questionnaire
    draft.datetime = new Date();
 
     // Cleanup user questionnaire unused fields
     draft.themes.forEach(theme => {
       theme.questions.forEach(question => {
         if (! question.hasOwnProperty('selectedOptions')) {
           question.selectedOptions = [];
         }
         
         let selectedOptions = question.selectedOptions;
 
         let answers = question.answers.filter((element, index) => {
             return selectedOptions.indexOf(index) > -1;
         }).map(answer => answer.label);
         
         question.answers = answers;
 
         if (question.hasOwnProperty('id'))
           delete question.id;
 
         delete question.selectedOptions;
       });
 
       theme.questions = theme.questions.filter(question => question.answers.length > 0);
 
       if (theme.hasOwnProperty('defaultPoints'))
         delete theme.defaultPoints;

       if (theme.hasOwnProperty('defaultRecommendation'))
         delete theme.defaultRecommendation;

       if (theme.hasOwnProperty('flow'))
         delete theme.flow;
 
       delete theme.type;
       delete theme.valid;
     });
     delete draft.valid;
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