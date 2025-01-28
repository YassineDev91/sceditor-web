import "./style.css";

import { createApp } from "vue";
import { createPinia } from 'pinia'


import App from "./App.vue";
import VueKonva from "vue-konva";

const pinia = createPinia()


createApp(App).use(VueKonva).use(pinia).mount("#app");
