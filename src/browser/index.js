const browser = {
    isMobile() {
        return window.innerWidth < 640;
    },

    isTablet() {
        return window.innerWidth >= 640 && window.innerWidth <= 1024;
    },

    isDesktop() {
        return !browser.isMobile() && !browser.isTablet();
    },

    currentDisplayName() {
        if (browser.isMobile()) {
            return 'mobile';
        }

        if (browser.isTablet()) {
            return 'tablet';
        }

        return 'desktop';
    }
};

module.exports = browser;