import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from '../locales/en.json'


//import json_fi from './locales/fi/translation.json';

export interface En {
    translation: string;
}


export interface ILocale {
    en: En;

    [key: string]: any;
}

// the translations
const resources: ILocale = {
    en: {
        translation: "",
    },
};

//Get locales from config-file by customer
const locales = () => {
    const currentLang = "en";
    if (currentLang) {
        const json = require(`../locales/${currentLang}.json`);
        resources[currentLang] = { translation: json };
    }
};

locales();

//Get locales from config-file by customer
const getCurrentLang = () => {
    const currentLang = localStorage.getItem("language");
    return currentLang ? currentLang : "en";
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: getCurrentLang(),

        //keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
