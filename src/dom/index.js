class Dom {
    /**
     * Checks wheter an element has a given parent.
     *
     * @param element (target element)
     * @param value (value of class, id, dataAttribute.. to compare)
     * @param type (by default is most common use case class, can be passed id, data-attrName)
     *
     * @return bool
     */
    nodeInParent(elem, value, type = 'class') {
        if (typeof elem.classList === 'undefined' || elem.classList.contains('content') || elem.tagName === 'BODY') {
            return false;
        }

        const dataAttr = type.substring(5);

        switch (type) {
            case 'class':
                if (typeof elem.classList === 'undefined' || false === elem.classList.contains(value)) {
                    return this.nodeInParent(elem.parentNode, value, type);
                }
                break;

            case 'id':
                if (value !== elem.id) {
                    return this.nodeInParent(elem.parentNode, value, type);
                }
                break;

            case /data(-\w+)/.test(type):
                if (value !== elem.dataset[dataAttr]) {
                    return this.nodeInParent(elem.parentNode, value, type);
                }
                break;
        }

        return true;
    }
}

module.exports = Dom;