import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get,
    onValue,
    push,
    update,
    remove
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";


const firebaseConfig = {

    apiKey: "AIzaSyCkISubqLptN4zDYfwcLrhEAs12JrI4UpE",

    authDomain: "que-edad-tengo.firebaseapp.com",

    databaseURL:
        "https://que-edad-tengo-default-rtdb.firebaseio.com",

    projectId: "que-edad-tengo",

    storageBucket:
        "que-edad-tengo.firebasestorage.app",

    messagingSenderId: "707267047232",

    appId:
        "1:707267047232:web:432f8f52fd26191eca94a5"
};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


export {
    database,
    ref,
    set,
    get,
    onValue,
    push,
    update,
    remove
};