//Flávia Glenda Guimarães Carvalho
//Lucas Randal Abreu Balderrama
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyACnc2LoI-Q0c6w9HKzomLGCF9vaYx5RRI",
  authDomain: "toki-flavia-lucas.firebaseapp.com",
  projectId: "toki-flavia-lucas",
  storageBucket: "toki-flavia-lucas.appspot.com",
  messagingSenderId: "9207517684",
  appId: "1:9207517684:web:94f1537ce9d4cc6aede9a1",
  measurementId: "G-5JKXS56LPD"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
