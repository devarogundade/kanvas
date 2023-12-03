import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export async function upload(file, name) {
    const firebaseApp = initializeApp(firebaseConfig);
    getAnalytics(firebaseApp);

    return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error);
                console.error('firebase', error);
                reject(error);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref)
                resolve(url);
            }
        );
    });
}