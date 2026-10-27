import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import {
    VApp,
    VAppBar,
    VCard,
    VCardText,
    VCardTitle,
    VChip,
    VContainer,
    VMain,
    VForm,
    VTextField,
    VAlert,
    VBtn,
    VMenu,
    VList,
    VListItem,
} from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import App from './App.vue'
import { router } from './router'

const vuetify = createVuetify({
  components: { VApp, VAppBar, VCard, VCardText, VCardTitle, VChip, VContainer, VMain, VForm, VTextField, VAlert, VBtn, VMenu, VList, VListItem, },
  directives,
  theme: {
    defaultTheme: 'light',
    themes: { light: { colors: { primary: '#276749' } } },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
