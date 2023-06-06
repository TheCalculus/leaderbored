<template>
    <Leaderboard ref="leaderboard" />
    <ThemeSwitcher />
</template>
<script>
import Leaderboard from "./components/Leaderboard.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";

export default {
    components: {
        Leaderboard,
        ThemeSwitcher,
    },
};
</script>
