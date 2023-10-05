import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// font awesome configuration
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCalendar, faClipboard, faClipboardCheck, faGear, faMoon, faPencil, faSun, faTrash } from '@fortawesome/free-solid-svg-icons'

library.add(faCalendar, faClipboard, faClipboardCheck, faGear, faMoon, faPencil, faSun, faTrash)

// set default theme based on user preferences
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
