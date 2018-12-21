import Browser from './browser';
import Dom from './dom';
import i18n from './i18n';
import Utils from './utils';

const commons = {
    browser: new Browser(),
    dom: new Dom(),
    i18n,
    utils: new Utils(),
};

export default commons;