import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from './locales/en.json'
/* import translationRU from './locales/ru.json'; */

const resources = {
    en: {
        translation: translationEN,
    },
    /*ru: {
        translation: translationRU,
    },*/
}

// @ts-ignore
const tg = window['Telegram'].WebApp
const lang = tg.initDataUnsafe?.user?.language_code !== 'ru' ? 'en' : 'ru' // @ts-ignore

i18n.use(initReactI18next)
    .init({
        resources,
        lng: lang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })
    .then()

export default i18n
