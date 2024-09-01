import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import colors from 'vuetify/lib/util/colors.mjs';
import '@mdi/font/css/materialdesignicons.css';
import './style.css';
import App from './App.vue';

const vuetify = createVuetify({
    theme: {
        themes: {
            light: {
                colors: {
                    primary: colors.red.darken3,
                    secondary: colors.red.lighten4
                }
            },
            dark: {
                colors: {
                    primary: colors.red.darken3,
                    secondary: colors.red.lighten4
                }
            }
        }
    }
});

const app = createApp(App);
app.use(vuetify);
app.mount('#app');
