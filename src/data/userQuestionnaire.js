import { db } from './initFirebase';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";


export async function addUserQuestionnaire(questionnaire) {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  questionnaire.uid = uid;
  questionnaire.datetime = new Date();
  
  const coll = collection(db, "userQuestionnaires");
  const docRef = await addDoc(coll, questionnaire);
  return docRef;
}
