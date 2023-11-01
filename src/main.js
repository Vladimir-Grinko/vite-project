import { createApp } from "vue";
import App from "./App.vue";
import { loadMessages, locale } from "devextreme/localization";
import ruMessages from "devextreme/localization/messages/ru.json";

locale("ru");
loadMessages(ruMessages);
document.body.setAttribute("data-theme", "light");

document.body.oncontextmenu = function () {
  return false;
};

createApp(App).mount("#app");
