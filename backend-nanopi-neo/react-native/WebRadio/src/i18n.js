import i18next from 'i18next';
import moment from 'moment';
import locale from 'react-native-locale-detector';

import translations from '../locales/translations';

const i18nextReactNativeDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  detect: () => locale,
  cacheUserLanguage: Function.prototype,
};

const getLang = (lng) => {
  const language = lng.split('-')[0];
  return Object.keys(translations).indexOf(language) !== -1 ? language : 'en';
};

/* eslint-disable import/no-named-as-default-member */
export default () => {
  i18next.use(i18nextReactNativeDetector)
    .init({
      fallbackLng: 'en',
      resources: translations,
      interpolation: {
        format(value, format) {
          if (value instanceof Date) return moment(value).format(format);
          return value;
        },
      },
    });

  i18next.on('languageChanged', (lng) => {
    moment.locale(getLang(lng));
  });
};
