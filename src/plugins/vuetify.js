// Styles

import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
const usbrSkinTheme = {
  colors: {
    background: '#FFFFFF',
    primary: '#003E51',
    secondary: '#C69214',
    error: '#B00020',
    info: '#DDCBA4',
    success: '#007396',
    warning: '#FB8C00',
  }
}

// Vuetify
import { createVuetify } from "vuetify";

// i18n
import i18n from "../locales/i18n";
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { useI18n } from 'vue-i18n';

export default createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'usbrSkinTheme',
    themes: {
      usbrSkinTheme,
    },
  },
  locale: createVueI18nAdapter({
    i18n,
    useI18n
  }),
});
