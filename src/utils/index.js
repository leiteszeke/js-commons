const axios = require('axios');

const utils = {
    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    colorWithOpacity(hex, alpha) {
        const { r, g, b } = utils.hexToRgb(hex);
        return `rgba(${ r }, ${ g }, ${ b }, ${ alpha })`;
    },

    download(url, filename, data = {}) {
        return axios.get(url, {
            headers: data.headers,
            params: data.data,
            responseType: 'blob',
        })
            .then(response => {
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(new Blob([response.data]));
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();

                return response;
            });

    },
};

module.exports = utils;