import Vue from "vue";
import App from "/mnt/c/Users/jaisal/projects/leaderbored/new/views/leaderboard.vue";

export function createApp(data) {
    const mergedData = Object.assign(App.data ? App.data() : {}, data);
    App.data = () => (mergedData)
 
    const app = new Vue({
        data,
        render: h => h(App),
    });
    return { app };
}