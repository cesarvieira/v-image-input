import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import 'vuetify/styles';
import { VImageInput } from '../src/index';

const app = createApp(App);
app.use(createVuetify({
  components: {
    ...components,
    VImageInput,
  },
  directives,
}));
// app.component('VImageInput', VImageInput);
app.mount('#app');
