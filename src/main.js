import { createApp } from "vue";
import App from "./App.vue";
import { loadMessages, locale } from "devextreme/localization";
import ruMessages from "devextreme/localization/messages/ru.json";

locale("ru");
loadMessages(ruMessages);

createApp(App).mount("#app");
