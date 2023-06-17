<template>
    <div class="grid-container">
        <span class="ranking" :class="getPositionClass(data.position)">
            {{ data.position }}
        </span>
        <span class="username">{{ data.name }}</span>
        <span class="points">{{ data.points }}</span>
        <div>
            <button @click="updatePoints(10)">&#43;</button>
            <button @click="updatePoints(-10)">&#8722;</button>
            <button @click="removeEntry">&#10005;</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["data"],
    methods: {
        getPositionClass(position) {
            switch (position) {
                case 1:
                    return "position-color-1";
                case 2:
                    return "position-color-2";
                case 3:
                    return "position-color-3";
                default:
                    return "";
            }
        },
        updatePoints(points) {
            this.$emit("updatePoints", this.data, points);
        },
        removeEntry() {
            this.$emit("removeEntry", this.data);
        },
    },
};
</script>

<style scoped src="../assets/lb_item.css">
</style>