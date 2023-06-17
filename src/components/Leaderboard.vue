<script setup>
import { useCollection, useFirestore } from "vuefire";
import { collection } from "firebase/firestore";

const db = useFirestore();
let collectionRef, todos;

try {
    collectionRef = new URLSearchParams(window.location.search).get("ref");
    todos = useCollection(collection(db, window.atob(collectionRef)));
    console.log(`refs (plaintext) "${window.atob(collectionRef)}"`);
} catch (err) {
    console.error(
        `refs (original) "${collectionRef}" is incorrectly encoded. If you are seeing this error, the ref you tried accessing does not exist!`
    );
}
</script>

<template>
    <div class="leaderboard">
        <div v-for="(entry, index) in entries" :key="entry.id">
            <LeaderboardItem
                :data="entry"
                @updatePoints="updatePoints"
                @removeEntry="removeEntry"
            ></LeaderboardItem>
            <hr v-if="index !== entries.length - 1" />
        </div>
    </div>
    <input type="text" ref="userUsername" placeholder="new username" />
    <input type="number" ref="userPoints" placeholder="new user points" />
    <button @click="newEntry" class="non-icon-button">create new user</button>
</template>

<script>
import LeaderboardItem from "./LeaderboardItem.vue";

let id = 0;

export default {
    components: { LeaderboardItem },
    data() {
        return {
            entries: [
                { id: id++, position: 1, name: "bossman", points: 100 },
                { id: id++, position: 2, name: "pengo", points: 50 },
                { id: id++, position: 3, name: "hologram", points: 3 },
                { id: id++, position: 4, name: "bruxon", points: 1 },
            ],
        };
    },
    methods: {
        updatePoints(entry, amount) {
            entry.points = Math.max((entry.points += amount), 0);
            this.reorder();
        },
        removeEntry(entry) {
            this.entries = this.entries.filter((curr) => curr.id !== entry.id);
            this.reorder();
        },
        newEntry() {
            let username = this.$refs.userUsername;
            let points = this.$refs.userPoints;

            let entry = {
                id: id++,
                position: 0,
                name: username.value,
                points: points.value,
            };

            username.value = "";
            points.value = "";

            this.entries.push(entry);
            this.reorder();
        },
        reorder() {
            this.entries = this.entries
                .sort((a, b) => b.points - a.points)
                .map((entry, index) => {
                    entry.position = index + 1;
                    return entry;
                });
        },
    },
};
</script>
