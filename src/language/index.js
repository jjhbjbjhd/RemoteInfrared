import { createI18n } from 'vue-i18n';

function getMessage() {
    const jsons = require.context('./lang', false, /\.json$/);
    const messages = {};
    jsons.keys().forEach((key) => {
      const messageKey = key.replace(/\.\/(.+)\.json/, '$1');
      messages[messageKey] = jsons(key);
    });
    return messages;
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: getMessage()
});
export default i18n;

