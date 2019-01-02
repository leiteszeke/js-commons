const numeral = require('numeral');
const i18n = require('../i18n');

let listeners = {
    'maskFloat': []
};

numeral.register('locale', 'default', {
    delimiters: {
        thousands: i18n.translate('format.money.thousands_separator'),
        decimal: i18n.translate('format.money.decimals_separator')
    },
    abbreviations: {},
    currency: {
        symbol: i18n.translate('format.money.currency')
    }
});

module.exports = {
    getPatterns() {
        let patterns = {};

        const dec = i18n.translate('format.money.decimals_separator');
        const thou = i18n.translate('format.money.thousands_separator');

        patterns = {
            decimalSeparator: new RegExp(dec.replace('.', '\\.')),
            thousandSeparator: new RegExp(thou.replace('.', '\\.'), 'g'),
        };

        patterns.number = new RegExp(`^\\d*(${ patterns.decimalSeparator.source }\\d+)?$`);
        patterns.incompleteNumber = new RegExp(`^(([1-9]\\d{0,2}(${ patterns.thousandSeparator.source }\\d{3})*)|0)?(${ patterns.decimalSeparator.source }0{0,2})$`);

        return patterns;
    },

    /**
     * Converts a function to a curry function
     *
     * If number of arguments is less than n, returns a function that waits for the remaining arguments
     * If the number of arguments is equal or greater than n, applies the function
     *
     * @param {Function} f
     * @param {integer} n number of function's parameters
     * @param {Array} args function's arguments
     */
    curry(f, n = undefined, args = []) {
        if ( "undefined" === typeof n ) {
            n = f.length;
        }

        return args.length < n ? c => this.curry(f, n, args.concat(c)) : f(...args);
    },

    /**
     * Masks a number input
     *
     * @param {Element} input
     * @param {Object} [settings={}]
     * @param {string} [settings.mask]
     * @param {number} [settings.decimals=3]
     * @param {string} [value]
     * @return {boolean} - whether it was possible to format input or not
     */
    mask(input, { mask, decimals = 3 } = {}, value) {
        typeof value == 'undefined' && (value = input.value);
        typeof mask == 'undefined' && (mask = `0,0[.]0[${'0'.repeat(decimals - 1)}]`);
        value = numeral(value).value();

        if ( !isNaN(value) ) {

            if ( value > 999999999.999999 ) {
                value = 999999999.999999;
            }

            const power = Math.pow(10, decimals);
            const formattedValue = numeral( Math.trunc(value * power) / power ).format(mask);
            const cursorPosition = this.boundNumber(input.selectionStart + formattedValue.length - input.value.length, 0, formattedValue.length);

            input.value = formattedValue;
            input.defaultValue = formattedValue;

            input.setSelectionRange(cursorPosition, cursorPosition);
            return true;
        }

        return false;
    },

    /**
     * Bounds number between two limits
     *
     * @param {number} num
     * @param {number} min - lower limit
     * @param {number} max - higher limit
     * @return {number}
     */
    boundNumber(num, min, max) {
      [ max, min ] = [ Math.max(min, max), Math.min(max, min) ];
      return Math.max(min, Math.min(num, max));
    },

    /**
     * Restricts the typing of non-numeric characters, and masks the input value
     *
     * @param {Element} input
     * @param {Object} [settings={}]
     * @param {false|Function} [settings.onUpdate=false]
     * @param {integer} [settings.decimals=3]
    */
    maskFloat(input, { onUpdate = false, decimals = 3, maskTo } = {}) {
        // Make sure the patterns exist
        const patterns = this.getPatterns();

        // Partially bind arguments to the mask function and store the curried result in mask
        const maskIt = this.curry(this.mask.bind(this), 3)(input, { decimals, maskTo });

        const changeListener = () => maskIt(undefined)
        const inputListener = (e) => {
            if (e.data === "-") {
                input.value = input.defaultValue;
                return false;
            }

            const oldValue = input.defaultValue;
            let value = input.value || "0";

            // Check if the value is an incomplete number (e.i. '1.' or '124,523.00' )
            if ( patterns.incompleteNumber.test(value) ) {
                input.defaultValue = value;
                input.value = value;
                updateCallback(oldValue, false);
                return;
            }

            // Strip all thousand separators from the value so it becomes easier to parse
            value = value.replace(patterns.thousandSeparator, '');

            // Check if the value represents a complete number (e.i. '124135', '062462.43' or '2354.5')
            if ( !patterns.number.test(value) ) {
                value = oldValue;
            }

            // mask the input's new value
            this.mask(input); //maskIt(value);
            updateCallback(oldValue, true);
        }

        // The callback after formatting the input
        let updateCallback;

        if ( onUpdate instanceof Function ) {
            updateCallback = (oldValue, completeNumber) => {
                if ( input.value != oldValue ) {
                    onUpdate(input.value, completeNumber);
                }
            };
        } else {
            updateCallback = () => {};
        }

        // Save the initial value of the input in defaultValue property
        input.defaultValue = input.value;

        // Bind the input event
        input.addEventListener("input", inputListener);
        listeners['maskFloat'].push({ 'input': input, 'evt': 'input', 'fn': inputListener });
        // On change the input value should be masked no matter if the number is not complete
        input.addEventListener('change', changeListener);
        listeners['maskFloat'].push({ 'input': input, 'evt': 'change', 'fn': changeListener });
    },

    demaskFloat() {

    },

    formatNumber() {

    },

    deformatNumber() {

    }
};