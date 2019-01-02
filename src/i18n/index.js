// Dependencies
const Sentry = require('@sentry/browser');
// Helpers
const { extend } = require('../objects');

let localeObject = {};
let language;

module.exports = {
    getInstance() {
        const locale = this.getLocale();
        const language = (locale.split("_"))[0];

        const original = require(`./locales/${ language }.json`);
        const instance = require(`./locales/${ locale }.json`);

        localeObject = extend(true, original, instance);
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

    translate(search, options = {}) {
        this.getInstance();
        let translate = localeObject;
        const levels = search.split('.');
        const { env, params } = options;

        levels.forEach( (value) => {
            if (typeof translate[value] === 'undefined') {
                translate = '';

                if (env === 'develop') {
                    // eslint-disable-next-line
                    console.warn(`"${ search }" has not translation for ${ this.getLocale() }`);
                }

                Sentry.captureMessage(`"${ search }" has not translation for ${ this.getLocale() }`);
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