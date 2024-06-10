import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Conexão com o Banco
export const connect = "https://medwork-dev-api.vercel.app";
// export const connect = "http://localhost:8800";


//FireBase Authentication
const firebaseConfig = {
  apiKey: "AIzaSyB27iQVJ8BfNZUYDpNUzHOemCqlk8uuzo8",
  authDomain: "medwork-ldn.firebaseapp.com",
  projectId: "medwork-ldn",
  storageBucket: "medwork-ldn.appspot.com",
  messagingSenderId: "433605411368",
  appId: "1:433605411368:web:f7403222c24f64d3a02b1d",
  measurementId: "G-ZV4Y4XN505"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app); 