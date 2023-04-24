import { db } from './initFirebase';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

import { produce } from "immer"

export async function addUserQuestionnaire(questionnaire) {


  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  const q = produce(questionnaire, draft => {
    draft.uid = uid;
    draft.datetime = new Date();
  });  
  // questionnaire.uid = uid;
  // questionnaire.datetime = new Date();
  
  const coll = collection(db, "userQuestionnaires");
  const docRef = await addDoc(coll, q);
  return docRef;
}
