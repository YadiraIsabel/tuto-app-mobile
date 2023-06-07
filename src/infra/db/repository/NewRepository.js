import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import db from "../util/FBConnection";

const TABLE_NEWS = "news";
const MERGE_OPTION = { merge: true };
const NewRepository = {
    getAll: async () => await getDocs(collection(db, TABLE_NEWS)),
    findById: async (id) => await getDoc(doc(db, TABLE_NEWS, id)),
    store: async (nNew) => await addDoc(collection(db, TABLE_NEWS), nNew),
    update: async (id, tNew) => await setDoc(doc(db, TABLE_NEWS, id), tNew, MERGE_OPTION),
    delete: async (id) => await deleteDoc(doc(db, TABLE_NEWS, id))

}
export default NewRepository;