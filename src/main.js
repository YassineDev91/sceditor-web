import "./style.css";

import { createApp } from "vue";
import { createPinia } from 'pinia'


import App from "./App.vue";
import VueKonva from "vue-konva";



createApp(App).use(VueKonva).mount("#app");
