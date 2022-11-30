import 'react-i18next';
import ru from './locales/ru/translation.json';
import by from './locales/by/translation.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: [typeof ru, typeof by];
  }
}
