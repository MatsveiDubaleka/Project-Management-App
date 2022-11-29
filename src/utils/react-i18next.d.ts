import 'react-i18next';
import ru from './locales/ru/translation.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof ru;
  }
}
