import { initializeApp,  } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  apiKey: "AIzaSyCztTVwo8RHfsUMrBtnngGAy6FQ362KyEM",
  authDomain: "itxchange-e32b2.firebaseapp.com",
  projectId: "itxchange-e32b2",
  storageBucket: "itxchange-e32b2.appspot.com",
  messagingSenderId: "850556544435",
  appId: "1:850556544435:web:dd8e7b1dd0bd09c21157c6",
  measurementId: "G-51EBPLRHVS"
};

export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp);

export { storage };
