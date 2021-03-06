import {h /** @jsx h */, Component} from "preact";
import withSideEffect from "preact-side-effect";
import deepEqual from "deep-equal";
import {TAG_NAMES, TAG_PROPERTIES} from "./HelmetConstants.js";

const HELMET_ATTRIBUTE = "data-preact-helmet";

const encodeSpecialCharacters = (str) => {
    return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;");
};

const getInnermostProperty = (propsList, property) => {
    for (let i = propsList.length - 1; i >= 0; i--) {
        const props = propsList[i];

        if (props[property]) {
            return props[property];
        }
    }
    return null;
};

const getTitleFromPropsList = (propsList) => {
    const innermostTitle = getInnermostProperty(propsList, "title");
    const innermostTemplate = getInnermostProperty(propsList, "titleTemplate");

    if (innermostTemplate && innermostTitle) {
        // use function arg to avoid need to escape $ characters
        return innermostTemplate.replace(/%s/g, () => innermostTitle);
    }

    const innermostDefaultTitle = getInnermostProperty(propsList, "defaultTitle");

    return innermostTitle || innermostDefaultTitle || "";
};

const getOnChangeClientState = (propsList) => {
    return getInnermostProperty(propsList, "onChangeClientState") ||(() => {});
};

const getAttributesFromPropsList = (tagType, propsList) => {
    return propsList
        .filter(props => typeof props[tagType] !== "undefined")
        .map(props => props[tagType])
        .reduce((tagAttrs, current) => {
            return {...tagAttrs, ...current};
        }, {});
};

const getBaseTagFromPropsList = (primaryAttributes, propsList) => {
    return propsList
        .filter(props => typeof props[TAG_NAMES.BASE] !== "undefined")
        .map(props => props[TAG_NAMES.BASE])
        .reverse()
        .reduce((innermostBaseTag, tag) => {
            if (!innermostBaseTag.length) {
                const keys = Object.keys(tag);

                for (let i = 0; i < keys.length; i++) {
                    const attributeKey = keys[i];
                    const lowerCaseAttributeKey = attributeKey.toLowerCase();

                    if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 &&
                        tag[lowerCaseAttributeKey]) {
                        return innermostBaseTag.concat(tag);
                    }
                }
            }

            return innermostBaseTag;
        }, []);
};

const getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
    // Calculate list of tags, giving priority innermost component (end of the propslist)
    const approvedSeenTags = {};

    return propsList
        .filter(props => typeof props[tagName] !== "undefined")
        .map(props => props[tagName])
        .reverse()
        .reduce((approvedTags, instanceTags) => {
            const instanceSeenTags = {};

            instanceTags.filter(tag => {
                let primaryAttributeKey;
                const keys = Object.keys(tag);
                for (let i = 0; i < keys.length; i++) {
                    const attributeKey = keys[i];
                    const lowerCaseAttributeKey = attributeKey.toLowerCase();

                    // Special rule with link tags, since rel and href are both primary tags, rel takes priority
                    if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1
                        && !(primaryAttributeKey === TAG_PROPERTIES.REL && tag[primaryAttributeKey].toLowerCase() === "canonical")
                        && !(lowerCaseAttributeKey === TAG_PROPERTIES.REL && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
                        primaryAttributeKey = lowerCaseAttributeKey;
                    }
                    // Special case for innerHTML which doesn't work lowercased
                    if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === TAG_PROPERTIES.INNER_HTML || attributeKey === TAG_PROPERTIES.CSS_TEXT || attributeKey === TAG_PROPERTIES.ITEM_PROP)) {
                        primaryAttributeKey = attributeKey;
                    }
                }

                if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
                    return false;
                }

                const value = tag[primaryAttributeKey].toLowerCase();

                if (!approvedSeenTags[primaryAttributeKey]) {
                    approvedSeenTags[primaryAttributeKey] = {};
                }

                if (!instanceSeenTags[primaryAttributeKey]) {
                    instanceSeenTags[primaryAttributeKey] = {};
                }

                if (!approvedSeenTags[primaryAttributeKey][value]) {
                    instanceSeenTags[primaryAttributeKey][value] = true;
                    return true;
                }

                return false;
            })
            .reverse()
            .forEach(tag => approvedTags.push(tag));

            // Update seen tags with tags from this instance
            const keys = Object.keys(instanceSeenTags);
            for (let i = 0; i < keys.length; i++) {
                const attributeKey = keys[i];
                const tagUnion = Object.assign(
                    {},
                    approvedSeenTags[attributeKey],
                    instanceSeenTags[attributeKey]
                );

                approvedSeenTags[attributeKey] = tagUnion;
            }

            return approvedTags;
        }, [])
        .reverse();
};

const updateTitle = (title, attributes) => {
    document.title = title || document.title;
    updateAttributes(TAG_NAMES.TITLE, attributes);
};

const updateAttributes = (tagName, attributes) => {
    const htmlTag = document.getElementsByTagName(tagName)[0];
    const helmetAttributeString = htmlTag.getAttribute(HELMET_ATTRIBUTE);
    const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
    const attributesToRemove = [].concat(helmetAttributes);
    const attributeKeys = Object.keys(attributes);

    for (let i = 0; i < attributeKeys.length; i++) {
        const attribute = attributeKeys[i];
        const value = attributes[attribute] || "";
        htmlTag.setAttribute(attribute, value);

        if (helmetAttributes.indexOf(attribute) === -1) {
            helmetAttributes.push(attribute);
        }

        const indexToSave = attributesToRemove.indexOf(attribute);
        if (indexToSave !== -1) {
            attributesToRemove.splice(indexToSave, 1);
        }
    }

    for (let i = attributesToRemove.length - 1; i >= 0; i--) {
        htmlTag.removeAttribute(attributesToRemove[i]);
    }

    if (helmetAttributes.length === attributesToRemove.length) {
        htmlTag.removeAttribute(HELMET_ATTRIBUTE);
    } else {
        htmlTag.setAttribute(HELMET_ATTRIBUTE, helmetAttributes.join(","));
    }
};

const updateTags = (type, tags) => {
    const headElement = document.head || document.querySelector("head");
    const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
    const oldTags = Array.prototype.slice.call(tagNodes);
    const newTags = [];
    let indexToDelete;

    if (tags && tags.length) {
        tags.forEach(tag => {
            const newElement = document.createElement(type);

            for (const attribute in tag) {
                if (tag.hasOwnProperty(attribute)) {
                    if (attribute === "innerHTML") {
                        newElement.innerHTML = tag.innerHTML;
                    } else if (attribute === "cssText") {
                        if (newElement.styleSheet) {
                            newElement.styleSheet.cssText = tag.cssText;
                        } else {
                            newElement.appendChild(document.createTextNode(tag.cssText));
                        }
                    } else {
                        const value = (typeof tag[attribute] === "undefined") ? "" : tag[attribute];
                        newElement.setAttribute(attribute, value);
                    }
                }
            }

            newElement.setAttribute(HELMET_ATTRIBUTE, "true");

            // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
            if (oldTags.some((existingTag, index) => {
                indexToDelete = index;
                return newElement.isEqualNode(existingTag);
            })) {
                oldTags.splice(indexToDelete, 1);
            } else {
                newTags.push(newElement);
            }
        });
    }

    oldTags.forEach(tag => tag.parentNode.removeChild(tag));
    newTags.forEach(tag => headElement.appendChild(tag));

    return {
        oldTags,
        newTags
    };
};

const generateHtmlAttributesAsString = (attributes) => Object.keys(attributes)
    .reduce((str, key) => {
        const attr = typeof attributes[key] !== "undefined"
            ? `${key}="${attributes[key]}"`
            : `${key}`;
        return str ? `${str} ${attr}` : attr;
    }, "");

const generateTitleAsString = (type, title, attributes) => {
    const attributeString = generateHtmlAttributesAsString(attributes);
    return attributeString
        ? `<${type} ${HELMET_ATTRIBUTE} ${attributeString}>${encodeSpecialCharacters(title)}</${type}>`
        : `<${type} ${HELMET_ATTRIBUTE}>${encodeSpecialCharacters(title)}</${type}>`;
};

const generateTagsAsString = (type, tags) => tags.reduce((str, tag) => {
    const attributeHtml = Object.keys(tag)
        .filter(attribute => !(attribute === "innerHTML" || attribute === "cssText"))
        .reduce((string, attribute) => {
            const attr = typeof tag[attribute] === "undefined"
                ? attribute
                : `${attribute}="${encodeSpecialCharacters(tag[attribute])}"`;
            return string ? `${string} ${attr}` : attr;
        }, "");

    const tagContent = tag.innerHTML || tag.cssText || "";

    const isSelfClosing = [TAG_NAMES.NOSCRIPT, TAG_NAMES.SCRIPT, TAG_NAMES.STYLE].indexOf(type) === -1;

    return `${str}<${type} ${HELMET_ATTRIBUTE} ${attributeHtml}${isSelfClosing ? `>` : `>${tagContent}</${type}>`}`;
}, "");

const generateTitleAsPreactComponent = (type, title, attributes) => {
    // assigning into an array to define toString function on it
    const initProps = {
        key: title,
        [HELMET_ATTRIBUTE]: true
    };
    const props = Object.keys(attributes).reduce((obj, key) => {
        obj[key] = attributes[key];
        return obj;
    }, initProps);

    return [h(TAG_NAMES.TITLE, props, title)];
};

const generateTagsAsPreactComponent = (type, tags) => tags.map((tag, i) => {
    const mappedTag = {
        key: i,
        [HELMET_ATTRIBUTE]: true
    };

    Object.keys(tag).forEach((attribute) => {
        const mappedAttribute = attribute;

        if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
            const content = tag.innerHTML || tag.cssText;
            mappedTag.dangerouslySetInnerHTML = {__html: content};
        } else {
            mappedTag[mappedAttribute] = tag[attribute];
        }
    });

    return h(type, mappedTag);
});

const getMethodsForTag = (type, tags) => {
    switch (type) {
        case TAG_NAMES.TITLE:
            return {
                toComponent: () => generateTitleAsPreactComponent(type, tags.title, tags.titleAttributes),
                toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes)
            };
        case TAG_NAMES.HTML:
            return {
                toComponent: () => tags,
                toString: () => generateHtmlAttributesAsString(tags)
            };
        default:
            return {
                toComponent: () => generateTagsAsPreactComponent(type, tags),
                toString: () => generateTagsAsString(type, tags)
            };
    }
};

const mapStateOnServer = ({htmlAttributes, title, titleAttributes, baseTag, metaTags, linkTags, scriptTags, noscriptTags, styleTags}) => ({
    htmlAttributes: getMethodsForTag(TAG_NAMES.HTML, htmlAttributes),
    title: getMethodsForTag(TAG_NAMES.TITLE, {title, titleAttributes}),
    base: getMethodsForTag(TAG_NAMES.BASE, baseTag),
    meta: getMethodsForTag(TAG_NAMES.META, metaTags),
    link: getMethodsForTag(TAG_NAMES.LINK, linkTags),
    script: getMethodsForTag(TAG_NAMES.SCRIPT, scriptTags),
    noscript: getMethodsForTag(TAG_NAMES.NOSCRIPT, noscriptTags),
    style: getMethodsForTag(TAG_NAMES.STYLE, styleTags)
});


/**
 * @param {Object} htmlAttributes: {"lang": "en", "amp": undefined}
 * @param {String} title: "Title"
 * @param {String} defaultTitle: "Default Title"
 * @param {String} titleTemplate: "MySite.com - %s"
 * @param {Object} titleAttributes: {"itemprop": "name"}
 * @param {Object} base: {"target": "_blank", "href": "http://mysite.com/"}
 * @param {Array} meta: [{"name": "description", "content": "Test description"}]
 * @param {Array} link: [{"rel": "canonical", "href": "http://mysite.com/example"}]
 * @param {Array} script: [{"type": "text/javascript", "src": "http://mysite.com/js/test.js"}]
 * @param {Array} noscript: [{"innerHTML": "<img src='http://mysite.com/js/test.js'"}]
 * @param {Array} style: [{"type": "text/css", "cssText": "div{ display: block; color: blue; }"}]
 * @param {Function} onChangeClientState: "(newState) => console.log(newState)"
 */
const Helmet = (WrappedComponent) => class HelmetWrapper extends Component {
    // WrappedComponent.peek comes from react-side-effect:
    // For testing, you may use a static peek() method available on the returned component.
    // It lets you get the current state without resetting the mounted instance stack.
    // Don’t use it for anything other than testing.
    static peek = WrappedComponent.peek

    static rewind = () => {
        let mappedState = WrappedComponent.rewind();
        if (!mappedState) {
            // provide fallback if mappedState is undefined
            mappedState = mapStateOnServer({
                htmlAttributes: {},
                title: "",
                titleAttributes: {},
                baseTag: [],
                metaTags: [],
                linkTags: [],
                scriptTags: [],
                noscriptTags: [],
                styleTags: []
            });
        }

        return mappedState;
    }

    static set canUseDOM(canUseDOM) {
        WrappedComponent.canUseDOM = canUseDOM;
    }

    shouldComponentUpdate(nextProps) {
        const props = {...nextProps};
        if (!props.children || !props.children.length) {
            delete props.children;
        }
        return !deepEqual(this.props, props);
    }

    render() {
        return (<WrappedComponent {...this.props} />);
    }
};

const reducePropsToState = (propsList) => ({
    htmlAttributes: getAttributesFromPropsList(TAG_NAMES.HTML, propsList),
    title: getTitleFromPropsList(propsList),
    titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
    baseTag: getBaseTagFromPropsList([TAG_PROPERTIES.HREF], propsList),
    metaTags: getTagsFromPropsList(TAG_NAMES.META, [TAG_PROPERTIES.NAME, TAG_PROPERTIES.CHARSET, TAG_PROPERTIES.HTTPEQUIV, TAG_PROPERTIES.PROPERTY, TAG_PROPERTIES.ITEM_PROP], propsList),
    linkTags: getTagsFromPropsList(TAG_NAMES.LINK, [TAG_PROPERTIES.REL, TAG_PROPERTIES.HREF], propsList),
    scriptTags: getTagsFromPropsList(TAG_NAMES.SCRIPT, [TAG_PROPERTIES.SRC, TAG_PROPERTIES.INNER_HTML], propsList),
    noscriptTags: getTagsFromPropsList(TAG_NAMES.NOSCRIPT, [TAG_PROPERTIES.INNER_HTML], propsList),
    styleTags: getTagsFromPropsList(TAG_NAMES.STYLE, [TAG_PROPERTIES.CSS_TEXT], propsList),
    onChangeClientState: getOnChangeClientState(propsList)
});

const handleClientStateChange = (newState) => {
    const {
        htmlAttributes,
        title,
        titleAttributes,
        baseTag,
        metaTags,
        linkTags,
        scriptTags,
        noscriptTags,
        styleTags,
        onChangeClientState
    } = newState;

    updateAttributes("html", htmlAttributes);

    updateTitle(title, titleAttributes);

    const tagUpdates = {
        baseTag: updateTags(TAG_NAMES.BASE, baseTag),
        metaTags: updateTags(TAG_NAMES.META, metaTags),
        linkTags: updateTags(TAG_NAMES.LINK, linkTags),
        scriptTags: updateTags(TAG_NAMES.SCRIPT, scriptTags),
        noscriptTags: updateTags(TAG_NAMES.NOSCRIPT, noscriptTags),
        styleTags: updateTags(TAG_NAMES.STYLE, styleTags)
    };

    const addedTags = {};
    const removedTags = {};

    Object.keys(tagUpdates).forEach(tagType => {
        const {newTags, oldTags} = tagUpdates[tagType];

        if (newTags.length) {
            addedTags[tagType] = newTags;
        }
        if (oldTags.length) {
            removedTags[tagType] = tagUpdates[tagType].oldTags;
        }
    });

    onChangeClientState(newState, addedTags, removedTags);
};

const NullComponent = () => null;

const HelmetSideEffects = withSideEffect(
    reducePropsToState,
    handleClientStateChange,
    mapStateOnServer
)(NullComponent);

export default Helmet(HelmetSideEffects);
