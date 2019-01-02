module.exports = {
    checkWindow() {
        return typeof window !== 'undefined';
    },

    isMobile() {
        if (this.checkWindow()) {
            return;
        }

        return window.innerWidth < 640;
    },

    isTablet() {
        if (this.checkWindow()) {
            return;
        }

        return window.innerWidth >= 640 && window.innerWidth <= 1024;
    },

    isDesktop() {
        if (this.checkWindow()) {
            return;
        }

        return !this.isMobile() && !this.isTablet();
    },

    currentDisplayName() {
        if (this.checkWindow()) {
            return;
        }

        if (this.isMobile()) {
            return 'mobile';
        }

        if (this.isTablet()) {
            return 'tablet';
        }

        return 'desktop';
    }
};