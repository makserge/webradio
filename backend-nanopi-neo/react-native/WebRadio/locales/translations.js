import en from './en/translation.json';

const addLanguage = (language) => (
  {
    translation: language
  }
);

const languages = {
  en: addLanguage(en),
};

export default languages;
