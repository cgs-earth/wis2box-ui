// Styles

import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
const usbrSkinTheme = {
  colors: {
    background: '#FFFFFF',
    primary: '#55677F',
    secondary: '#1B335F',
    error: '#E6000B',
    info: '#A1C6D5',
    success: '#00A087',
    warning: '#FCB95A',
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
