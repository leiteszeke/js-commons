// Helpers
const { extend } = require('../objects');

let localeObject = {};
let language;

const langFiles = {
    es: require('./locales/es.json'),
    en: require('./locales/en.json'),
    pt: require('./locales/pt.json'),
};

const localeFiles = {
    en_US: require('./locales/en_US.json'),
    es_AR: require('./locales/es_AR.json'),
    es_CL: require('./locales/es_CL.json'),
    es_MX: require('./locales/es_MX.json'),
    es_UY: require('./locales/es_UY.json'),
    pt_BR: require('./locales/pt_BR.json'),
};

module.exports = {
    getInstance() {
        const locale = this.getLocale();
        const language = (locale.split("_"))[0];

        localeObject = extend(true, langFiles[language], localeFiles[locale]);
    },

    setLanguage(lang) {
        language = lang;
    },

    getLocale() {
        if (typeof language !== 'undefined') {
            return language;
        }

        const body = document.getElementsByTagName('body')[0];

        if (body.getAttribute('data-language') !== null) {
            return body.getAttribute('data-language');
        }

        const html = document.getElementsByTagName('html')[0];

        if (html.getAttribute('lang') !== null) {
            return html.getAttribute('lang');
        }

        return 'es_AR';
    },

    getLanguage() {
        const locale = this.getLocale();
        const language = (locale.split("_"))[0];

        return language;
    },

    exists(search) {
        return this.translate(search).length > 0;
    },

    translate(search, params = {}) {
        this.getInstance();
        let translate = localeObject;
        const levels = search.split('.');

        levels.forEach( (value) => {
            if (typeof translate[value] === 'undefined') {
                translate = '';

                // eslint-disable-next-line
                console.warn(`"${ search }" has not translation for ${ this.getLocale() }`);

                return;
            }

            translate = translate[value];
        });

        if (translate !== '' && params) {
            Object.entries(params)
            .map( ([key, value]) => {
                translate = translate.replace(new RegExp(`%${ key }%`, 'g'), value);
            });
        }

        return translate;
    },
};