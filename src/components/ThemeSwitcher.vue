<template>
    <button @click="toggleTheme" ref="themeSwitch" class="non-icon-button">
        &#9788; / &#9728;
    </button>
</template>
<script>
const themesList = ["dark", "light"];
const themesIcon = ["&#9788;", "&#9728"];

let theme = localStorage.getItem("theme");

export default {
    mounted() {
        if (theme == null) this.themeInitialiser();
        this.applyTheme();
    },
    methods: {
        themeInitialiser() {
            let themePreference =
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
            document.documentElement.classList.add(themePreference);
            localStorage.setItem("theme", themesList.indexOf(themePreference));
            theme = themesList.indexOf(themePreference);
        },
        toggleTheme() {
            theme = 1 - theme;
            localStorage.setItem("theme", theme);

            this.applyTheme();
        },
        applyTheme() {
            document.documentElement.classList.remove(themesList[1 - theme]);
            document.documentElement.classList.add(themesList[theme]);

            this.$refs.themeSwitch.innerHTML = themesIcon[theme];
        },
    },
};
</script>
