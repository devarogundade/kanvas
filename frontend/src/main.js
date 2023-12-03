import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from "vuex";
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'
import utils from './plugins/utils'

const store = createStore({
    state() {
        return {
            userChoice: "",
            wallet: null,
            player: null
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
        setWallet(state, wallet) {
            state.wallet = wallet
        },
        setPlayer(state, player) {
            state.player = player
        }
    },
});


const app = createApp(App)

app.use(VueAxios, axios)
app.use(utils)
app.use(store)
app.use(router)

app.mount('#app')
