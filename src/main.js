import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./firebase";
import { createRouter, createWebHistory } from "vue-router";

import { createApp } from 'vue'
import App from "./App.vue";
import Leaderboard from "./components/Leaderboard.vue";

import "./assets/main.css";

const app = createApp(App);

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/leaderboard",
            component: Leaderboard,
        },
    ],
});

app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
        // ...
    ],
});

app.use(router);
app.mount("#app");