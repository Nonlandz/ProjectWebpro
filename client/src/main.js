import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueSweetalert2 from "vue-sweetalert2";
import { firebaseApp } from "./firebase";
import { VueFire } from "vuefire";

import "sweetalert2/dist/sweetalert2.min.css";
import "./style.css";

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
});
app.use(router);
app.use(VueSweetalert2);
app.mount("#app");

