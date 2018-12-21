class Browser {
    isMobile() {
        return window.innerWidth < 640;
    }

    isTablet() {
        return window.innerWidth >= 640 && window.innerWidth <= 1024;
    }

    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }

    currentDisplayName() {
        if (this.isMobile()) {
            return 'mobile';
        }

        if (this.isTablet()) {
            return 'tablet';
        }

        return 'desktop';
    }
}

module.exports = Browser;