import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const STATE_REF = doc(db, 'moodboards', 'main')

export async function loadState() {
  const snap = await getDoc(STATE_REF)
  return snap.exists() ? snap.data() : null
}

export async function saveState(state) {
  await setDoc(STATE_REF, state)
}
