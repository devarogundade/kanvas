import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from "vuex";

import App from './App.vue'
import router from './router'

const store = createStore({
    state() {
        return {
            userChoice: "",
        };
    },
    getters: {
        getChoice(state) {
            return state.userChoice;
        },
    },
    mutations: {
        setChoice(state, payload) {
            state.userChoice = payload;
        },
    },
});


const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
