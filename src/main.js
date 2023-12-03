import "./assets/main.css";
import "./assets/tailwind.css";
import "./assets/output.css";
import 'element-plus/dist/index.css'
import './permission.js'

import { createApp } from "vue";
import App from "./App.vue";
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css"


import router from "./router";
import store from './store'

createApp(App).use(createVuestic()).use(router).use(store).mount("#app");
