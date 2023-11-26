import './assets/main.css'
import './assets/tailwind.css'
import './assets/output.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";
import router from './router'

createApp(App).use(createVuestic())
.use(router)
.mount('#app')
