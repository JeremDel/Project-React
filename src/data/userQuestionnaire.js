import { db } from './initFirebase';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

import { produce } from "immer"

export async function addUserQuestionnaire(questionnaire) {


  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  const q = produce(questionnaire, draft => {

    // Add some informations
    draft.uid = uid;
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

      delete theme.type;
      delete theme.valid;
    });
    delete draft.valid;
  });  
  
  const coll = collection(db, "userQuestionnaires");
  const docRef = await addDoc(coll, q);
  return docRef;
}
