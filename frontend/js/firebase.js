// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAZbKi-aA3gWIAyBymltCAQ0buP9qyovTQ",
  authDomain: "infinite-running-f5a0e.firebaseapp.com",
  projectId: "infinite-running-f5a0e",
  storageBucket: "infinite-running-f5a0e.appspot.com",
  messagingSenderId: "896131196621",
  appId: "1:896131196621:web:80e500042f05d036136b84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider()

export { app, auth, provider, signInWithPopup}

// const userSignIn = async() => {
//     signInWithPopup(auth, provider)
//     .then((result) => {
//         const user = result.user
//         sessionStorage.setItem('user', JSON.stringify({name: result.user.displayName.split(' ')[0], img: result.user.photoURL}))

//         icon_google.style.display = 'none'
//         message_google.style.display = 'none'
        
//         perfil_name.style.display = 'block'
//         perfil_img.style.display = 'block'
//         perfil_name.innerText = JSON.parse(sessionStorage.getItem('user')).name
//         perfil_img.src = `${JSON.parse(sessionStorage.getItem('user')).img}`

//     }).catch((error) => {
//         const errorCode = error.code
//         const errorMessage = error.mesage
//     })
// }
// const icon_google = document.querySelector('.icon_google')
// const message_google = document.querySelector('.message_google')
// const perfil_name = document.querySelector('.perfil_name')
// const perfil_img = document.querySelector('.perfil_img')

// icon_google.addEventListener('click', userSignIn)