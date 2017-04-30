var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint max-nested-callbacks: [1, 5] */

/** @jsx h */

var _preact = require("preact");

var _preactRenderToString = require("preact-render-to-string");

var _Helmet = require("../Helmet");

var _Helmet2 = _interopRequireDefault(_Helmet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HELMET_ATTRIBUTE = "data-preact-helmet";

describe("Helmet", function () {
    var headElement = void 0;

    var container = document.createElement("div");
    var child = void 0;

    beforeEach(function () {
        headElement = headElement || document.head || document.querySelector("head");
    });

    afterEach(function () {
        child = unmountComponentAtNode(container, child);
    });

    describe("api", function () {
        describe("title", function () {
            it("can update page title", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    defaultTitle: "Fallback",
                    title: "Test Title"
                }), container, child);

                expect(document.title).to.equal("Test Title");
            });

            it("can update page title with multiple children", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, { title: "Test Title" }),
                    (0, _preact.h)(_Helmet2.default, { title: "Child One Title" }),
                    (0, _preact.h)(_Helmet2.default, { title: "Child Two Title" })
                ), container, child);

                expect(document.title).to.equal("Child Two Title");
            });

            it("will set title based on deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, { title: "Main Title" }),
                    (0, _preact.h)(_Helmet2.default, { title: "Nested Title" })
                ), container, child);

                expect(document.title).to.equal("Nested Title");
            });

            it("will set title using deepest nested component with a defined title", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, { title: "Main Title" }),
                    (0, _preact.h)(_Helmet2.default, null)
                ), container, child);

                expect(document.title).to.equal("Main Title");
            });

            it("will use defaultTitle if no title is defined", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    defaultTitle: "Fallback",
                    title: "",
                    titleTemplate: "This is a %s of the titleTemplate feature"
                }), container, child);

                expect(document.title).to.equal("Fallback");
            });

            it("will use a titleTemplate if defined", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    defaultTitle: "Fallback",
                    title: "Test",
                    titleTemplate: "This is a %s of the titleTemplate feature"
                }), container, child);

                expect(document.title).to.equal("This is a Test of the titleTemplate feature");
            });

            it("will replace multiple title strings in titleTemplate", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    title: "Test",
                    titleTemplate: "This is a %s of the titleTemplate feature. Another %s."
                }), container, child);

                expect(document.title).to.equal("This is a Test of the titleTemplate feature. Another Test.");
            });

            it("will use a titleTemplate based on deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        title: "Test",
                        titleTemplate: "This is a %s of the titleTemplate feature"
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        title: "Second Test",
                        titleTemplate: "A %s using nested titleTemplate attributes"
                    })
                ), container, child);

                expect(document.title).to.equal("A Second Test using nested titleTemplate attributes");
            });

            it("will merge deepest component title with nearest upstream titleTemplate", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        title: "Test",
                        titleTemplate: "This is a %s of the titleTemplate feature"
                    }),
                    (0, _preact.h)(_Helmet2.default, { title: "Second Test" })
                ), container, child);

                expect(document.title).to.equal("This is a Second Test of the titleTemplate feature");
            });

            it("will render dollar characters in a title correctly when titleTemplate present", function () {
                var dollarTitle = "te$t te$$t te$$$t te$$$$t";

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, { title: dollarTitle,
                    titleTemplate: "This is a %s"
                }), container, child);

                expect(document.title).to.equal("This is a te$t te$$t te$$$t te$$$$t");
            });

            it("will not encode all characters with HTML character entity equivalents", function () {
                var chineseTitle = "膣膗 鍆錌雔";

                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, { title: chineseTitle })
                ), container, child);

                expect(document.title).to.equal(chineseTitle);
            });

            it("page title with prop itemprop", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    defaultTitle: "Fallback",
                    title: "Test Title with itemProp",
                    titleAttributes: { itemprop: "name" }
                }), container, child);

                var titleTag = document.getElementsByTagName("title")[0];
                expect(document.title).to.equal("Test Title with itemProp");
                expect(titleTag.getAttribute("itemprop")).to.equal("name");
            });
        });

        describe("title attributes", function () {
            it("update title attributes", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    titleAttributes: {
                        itemprop: "name"
                    }
                }), container, child);

                var titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("itemprop")).to.equal("name");
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("itemprop");
            });

            it("set attributes based on the deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        titleAttributes: {
                            "lang": "en",
                            "hidden": undefined
                        }
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        titleAttributes: {
                            "lang": "ja"
                        }
                    })
                ), container, child);

                var titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("lang")).to.equal("ja");
                expect(titleTag.getAttribute("hidden")).to.equal("");
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang,hidden");
            });

            it("handle valueless attributes", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    titleAttributes: {
                        "hidden": undefined
                    }
                }), container, child);

                var titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("hidden")).to.equal("");
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("hidden");
            });

            it("clears title attributes that are handled within helmet", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    titleAttributes: {
                        "lang": "en",
                        "hidden": undefined
                    }
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var titleTag = document.getElementsByTagName("title")[0];

                expect(titleTag.getAttribute("lang")).to.be.null;
                expect(titleTag.getAttribute("hidden")).to.be.null;
                expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
            });
        });

        describe("html attributes", function () {
            it("update html attributes", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    htmlAttributes: {
                        "class": "myClassName",
                        "lang": "en"
                    }
                }), container, child);

                var htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("class")).to.equal("myClassName");
                expect(htmlTag.getAttribute("lang")).to.equal("en");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("class,lang");
            });

            it("set attributes based on the deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        htmlAttributes: {
                            "lang": "en"
                        }
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        htmlAttributes: {
                            "lang": "ja"
                        }
                    })
                ), container, child);

                var htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("lang")).to.equal("ja");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang");
            });

            it("handle valueless attributes", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    htmlAttributes: {
                        "amp": undefined
                    }
                }), container, child);

                var htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("amp")).to.equal("");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("amp");
            });

            it("clears html attributes that are handled within helmet", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    htmlAttributes: {
                        "lang": "en",
                        "amp": undefined
                    }
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("lang")).to.be.null;
                expect(htmlTag.getAttribute("amp")).to.be.null;
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
            });

            it("updates with multiple additions and removals - overwrite and new", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    htmlAttributes: {
                        "lang": "en",
                        "amp": undefined
                    }
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    htmlAttributes: {
                        "lang": "ja",
                        "id": "html-tag",
                        "title": "html tag"
                    }
                }), container, child);

                var htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("amp")).to.equal(null);
                expect(htmlTag.getAttribute("lang")).to.equal("ja");
                expect(htmlTag.getAttribute("id")).to.equal("html-tag");
                expect(htmlTag.getAttribute("title")).to.equal("html tag");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang,amp,id,title");
            });

            it("updates with multiple additions and removals - all new", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    htmlAttributes: {
                        "lang": "en",
                        "amp": undefined
                    }
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    htmlAttributes: {
                        "id": "html-tag",
                        "title": "html tag"
                    }
                }), container, child);

                var htmlTag = document.getElementsByTagName("html")[0];

                expect(htmlTag.getAttribute("amp")).to.equal(null);
                expect(htmlTag.getAttribute("lang")).to.equal(null);
                expect(htmlTag.getAttribute("id")).to.equal("html-tag");
                expect(htmlTag.getAttribute("title")).to.equal("html tag");
                expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("lang,amp,id,title");
            });

            context("initialized outside of helmet", function () {
                before(function () {
                    var htmlTag = document.getElementsByTagName("html")[0];
                    htmlTag.setAttribute("test", "test");
                });

                it("will not be cleared", function () {
                    child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                    var htmlTag = document.getElementsByTagName("html")[0];

                    expect(htmlTag.getAttribute("test")).to.equal("test");
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
                });

                it("will be overwritten if specified in helmet", function () {
                    child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                        htmlAttributes: {
                            "test": "helmet-attr"
                        }
                    }), container, child);

                    var htmlTag = document.getElementsByTagName("html")[0];

                    expect(htmlTag.getAttribute("test")).to.equal("helmet-attr");
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal("test");
                });

                it("can be cleared once it is managed in helmet", function () {
                    child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                        htmlAttributes: {
                            "test": "helmet-attr"
                        }
                    }), container, child);

                    child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                    var htmlTag = document.getElementsByTagName("html")[0];

                    expect(htmlTag.getAttribute("test")).to.equal(null);
                    expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).to.equal(null);
                });
            });
        });

        describe("onChangeClientState", function () {
            it("when handling client state change, calls the function with new state, addedTags and removedTags ", function () {
                var spy = sinon.spy();
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        base: { "href": "http://mysite.com/" },
                        link: [{ "href": "http://localhost/helmet", "rel": "canonical" }],
                        meta: [{ "charset": "utf-8" }],
                        script: [{ "src": "http://localhost/test.js", "type": "text/javascript" }],
                        title: "Main Title",
                        onChangeClientState: spy
                    })
                ), container, child);

                expect(spy.called).to.equal(true);
                var newState = spy.getCall(0).args[0];
                var addedTags = spy.getCall(0).args[1];
                var removedTags = spy.getCall(0).args[2];

                expect(newState).to.contain({ title: "Main Title" });
                expect(newState.baseTag).to.contain({ href: "http://mysite.com/" });
                expect(newState.metaTags).to.contain({ "charset": "utf-8" });
                expect(newState.linkTags).to.contain({ "href": "http://localhost/helmet", "rel": "canonical" });
                expect(newState.scriptTags).to.contain({ "src": "http://localhost/test.js", "type": "text/javascript" });

                expect(addedTags).to.have.property("baseTag");
                expect(addedTags.baseTag).to.have.deep.property("[0]");
                expect(addedTags.baseTag[0].outerHTML).to.equal("<base href=\"http://mysite.com/\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(addedTags).to.have.property("metaTags");
                expect(addedTags.metaTags).to.have.deep.property("[0]");
                expect(addedTags.metaTags[0].outerHTML).to.equal("<meta charset=\"utf-8\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(addedTags).to.have.property("linkTags");
                expect(addedTags.linkTags).to.have.deep.property("[0]");
                expect(addedTags.linkTags[0].outerHTML).to.equal("<link href=\"http://localhost/helmet\" rel=\"canonical\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(addedTags).to.have.property("scriptTags");
                expect(addedTags.scriptTags).to.have.deep.property("[0]");
                expect(addedTags.scriptTags[0].outerHTML).to.equal("<script src=\"http://localhost/test.js\" type=\"text/javascript\" " + HELMET_ATTRIBUTE + "=\"true\"></script>");

                expect(removedTags).to.be.empty;
            });

            it("calls the deepest defined callback with the deepest state", function () {
                var spy = sinon.spy();
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, { title: "Main Title", onChangeClientState: spy }),
                    (0, _preact.h)(_Helmet2.default, { title: "Deeper Title" })
                ), container, child);

                expect(spy.callCount).to.equal(2);
                expect(spy.getCall(0).args[0]).to.contain({ title: "Main Title" });
                expect(spy.getCall(1).args[0]).to.contain({ title: "Deeper Title" });
            });
        });

        describe("base tag", function () {
            it("can update base tag", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    base: { "href": "http://mysite.com/" }
                }), container, child);

                var existingTags = headElement.querySelectorAll("base[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);

                var filteredTags = [].slice.call(existingTags).filter(function (tag) {
                    return tag.getAttribute("href") === "http://mysite.com/";
                });

                expect(filteredTags.length).to.equal(1);
            });

            it("will clear the base tag if one is not specified", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    base: { "href": "http://mysite.com/" }
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var existingTags = headElement.querySelectorAll("base[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'href' will not be accepted", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    base: { "property": "won't work" }
                }), container, child);

                var existingTags = headElement.querySelectorAll("base[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("will set base tag based on deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        base: { "href": "http://mysite.com/" }
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        base: { "href": "http://mysite.com/public" }
                    })
                ), container, child);

                var existingTags = headElement.querySelectorAll("base[" + HELMET_ATTRIBUTE + "]");
                var firstTag = Array.prototype.slice.call(existingTags)[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(1);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("href")).to.equal("http://mysite.com/public");
                expect(firstTag.outerHTML).to.equal("<base href=\"http://mysite.com/public\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("won't render tag when primary attribute is null", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    base: { "href": undefined }
                }), container, child);

                var tagNodes = headElement.querySelectorAll("base[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("meta tags", function () {
            it("can update meta tags", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    meta: [{ "charset": "utf-8" }, { "name": "description", "content": "Test description" }, { "http-equiv": "content-type", "content": "text/html" }, { "property": "og:type", "content": "article" }, { "itemprop": "name", "content": "Test name itemprop" }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);

                var filteredTags = [].slice.call(existingTags).filter(function (tag) {
                    return tag.getAttribute("charset") === "utf-8" || tag.getAttribute("name") === "description" && tag.getAttribute("content") === "Test description" || tag.getAttribute("http-equiv") === "content-type" && tag.getAttribute("content") === "text/html" || tag.getAttribute("itemprop") === "name" && tag.getAttribute("content") === "Test name itemprop";
                });

                expect(filteredTags.length).to.be.at.least(4);
            });

            it("will clear all meta tags if none are specified", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    meta: [{ "name": "description", "content": "Test description" }]
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'name', 'http-equiv', 'property', 'charset', or 'itemprop' will not be accepted", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    meta: [{ "href": "won't work" }]
                }), container, child);

                var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("will set meta tags based on deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        meta: [{ "charset": "utf-8" }, { "name": "description", "content": "Test description" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        meta: [{ "name": "description", "content": "Inner description" }, { "name": "keywords", "content": "test,meta,tags" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);

                var firstTag = existingTags[0];
                var secondTag = existingTags[1];
                var thirdTag = existingTags[2];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(3);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("charset")).to.equal("utf-8");
                expect(firstTag.outerHTML).to.equal("<meta charset=\"utf-8\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("name")).to.equal("description");
                expect(secondTag.getAttribute("content")).to.equal("Inner description");
                expect(secondTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner description\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[2]").that.is.an.instanceof(Element);
                expect(thirdTag).to.have.property("getAttribute");
                expect(thirdTag.getAttribute("name")).to.equal("keywords");
                expect(thirdTag.getAttribute("content")).to.equal("test,meta,tags");
                expect(thirdTag.outerHTML).to.equal("<meta name=\"keywords\" content=\"test,meta,tags\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("will allow duplicate meta tags if specified in the same component", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    meta: [{ "name": "description", "content": "Test description" }, { "name": "description", "content": "Duplicate description" }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];
                var secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("name")).to.equal("description");
                expect(firstTag.getAttribute("content")).to.equal("Test description");
                expect(firstTag.outerHTML).to.equal("<meta name=\"description\" content=\"Test description\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("name")).to.equal("description");
                expect(secondTag.getAttribute("content")).to.equal("Duplicate description");
                expect(secondTag.outerHTML).to.equal("<meta name=\"description\" content=\"Duplicate description\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("will override duplicate meta tags with single meta tag in a nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        meta: [{ "name": "description", "content": "Test description" }, { "name": "description", "content": "Duplicate description" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        meta: [{ "name": "description", "content": "Inner description" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(1);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("name")).to.equal("description");
                expect(firstTag.getAttribute("content")).to.equal("Inner description");
                expect(firstTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner description\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("will override single meta tag with duplicate meta tags in a nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        meta: [{ "name": "description", "content": "Test description" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        meta: [{ "name": "description", "content": "Inner description" }, { "name": "description", "content": "Inner duplicate description" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];
                var secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("name")).to.equal("description");
                expect(firstTag.getAttribute("content")).to.equal("Inner description");
                expect(firstTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner description\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("name")).to.equal("description");
                expect(secondTag.getAttribute("content")).to.equal("Inner duplicate description");
                expect(secondTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner duplicate description\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("won't render tag when primary attribute is null", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    meta: [{ "name": undefined, "content": "Inner duplicate description" }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("link tags", function () {
            it("can update link tags", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    link: [{ "href": "http://localhost/helmet", "rel": "canonical" }, { "href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css" }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);

                var filteredTags = [].slice.call(existingTags).filter(function (tag) {
                    return tag.getAttribute("href") === "http://localhost/style.css" && tag.getAttribute("rel") === "stylesheet" && tag.getAttribute("type") === "text/css" || tag.getAttribute("href") === "http://localhost/helmet" && tag.getAttribute("rel") === "canonical";
                });

                expect(filteredTags.length).to.be.at.least(2);
            });

            it("will clear all link tags if none are specified", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    link: [{ "href": "http://localhost/helmet", "rel": "canonical" }]
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'href' or 'rel' will not be accepted, even if they are valid for other tags", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    link: [{ "http-equiv": "won't work" }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags 'rel' and 'href' will properly use 'rel' as the primary identification for this tag, regardless of ordering", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "href": "http://localhost/helmet", "rel": "canonical" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "canonical", "href": "http://localhost/helmet/new" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "href": "http://localhost/helmet/newest", "rel": "canonical" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(1);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/newest");
                expect(firstTag.outerHTML).to.equal("<link href=\"http://localhost/helmet/newest\" rel=\"canonical\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("tags with rel='stylesheet' will use the href as the primary identification of the tag, regardless of ordering", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css", "media": "all" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "stylesheet", "href": "http://localhost/inner.css", "type": "text/css", "media": "all" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];
                var secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.equal(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/style.css");
                expect(firstTag.getAttribute("rel")).to.equal("stylesheet");
                expect(firstTag.getAttribute("type")).to.equal("text/css");
                expect(firstTag.getAttribute("media")).to.equal("all");
                expect(firstTag.outerHTML).to.equal("<link href=\"http://localhost/style.css\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("rel")).to.equal("stylesheet");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/inner.css");
                expect(secondTag.getAttribute("type")).to.equal("text/css");
                expect(secondTag.getAttribute("media")).to.equal("all");
                expect(secondTag.outerHTML).to.equal("<link rel=\"stylesheet\" href=\"http://localhost/inner.css\" type=\"text/css\" media=\"all\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("will set link tags based on deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "canonical", "href": "http://localhost/helmet" }, { "href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css", "media": "all" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "canonical", "href": "http://localhost/helmet/innercomponent" }, { "href": "http://localhost/inner.css", "rel": "stylesheet", "type": "text/css", "media": "all" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];
                var secondTag = existingTags[1];
                var thirdTag = existingTags[2];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.at.least(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/style.css");
                expect(firstTag.getAttribute("rel")).to.equal("stylesheet");
                expect(firstTag.getAttribute("type")).to.equal("text/css");
                expect(firstTag.getAttribute("media")).to.equal("all");
                expect(firstTag.outerHTML).to.equal("<link href=\"http://localhost/style.css\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
                expect(secondTag.getAttribute("rel")).to.equal("canonical");
                expect(secondTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/innercomponent\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[2]").that.is.an.instanceof(Element);
                expect(thirdTag).to.have.property("getAttribute");
                expect(thirdTag.getAttribute("href")).to.equal("http://localhost/inner.css");
                expect(thirdTag.getAttribute("rel")).to.equal("stylesheet");
                expect(thirdTag.getAttribute("type")).to.equal("text/css");
                expect(thirdTag.getAttribute("media")).to.equal("all");
                expect(thirdTag.outerHTML).to.equal("<link href=\"http://localhost/inner.css\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("will allow duplicate link tags if specified in the same component", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    link: [{ "rel": "canonical", "href": "http://localhost/helmet" }, { "rel": "canonical", "href": "http://localhost/helmet/component" }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];
                var secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.at.least(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet");
                expect(firstTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("rel")).to.equal("canonical");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
                expect(secondTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/component\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("will override duplicate link tags with a single link tag in a nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "canonical", "href": "http://localhost/helmet" }, { "rel": "canonical", "href": "http://localhost/helmet/component" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "canonical", "href": "http://localhost/helmet/innercomponent" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(1);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
                expect(firstTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/innercomponent\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("will override single link tag with duplicate link tags in a nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "canonical", "href": "http://localhost/helmet" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        link: [{ "rel": "canonical", "href": "http://localhost/helmet/component" }, { "rel": "canonical", "href": "http://localhost/helmet/innercomponent" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];
                var secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.equal(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
                expect(firstTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/component\" " + HELMET_ATTRIBUTE + "=\"true\">");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("rel")).to.equal("canonical");
                expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
                expect(secondTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/innercomponent\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });

            it("won't render tag when primary attribute is null", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    link: [{ "rel": "icon", "sizes": "192x192", "href": null }, { "rel": "canonical", "href": "http://localhost/helmet/component" }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.be.equal(1);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("rel")).to.equal("canonical");
                expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
                expect(firstTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/component\" " + HELMET_ATTRIBUTE + "=\"true\">");
            });
        });

        describe("script tags", function () {
            it("can update script tags", function () {
                var scriptInnerHTML = "\n                  {\n                    \"@context\": \"http://schema.org\",\n                    \"@type\": \"NewsArticle\",\n                    \"url\": \"http://localhost/helmet\"\n                  }\n                ";
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    script: [{ "src": "http://localhost/test.js", "type": "text/javascript" }, { "src": "http://localhost/test2.js", "type": "text/javascript" }, {
                        type: "application/ld+json",
                        innerHTML: scriptInnerHTML
                    }]
                }), container, child);

                var existingTags = headElement.getElementsByTagName("script");

                expect(existingTags).to.not.equal(undefined);

                var filteredTags = [].slice.call(existingTags).filter(function (tag) {
                    return tag.getAttribute("src") === "http://localhost/test.js" && tag.getAttribute("type") === "text/javascript" || tag.getAttribute("src") === "http://localhost/test2.js" && tag.getAttribute("type") === "text/javascript" || tag.getAttribute("type") === "application/ld+json" && tag.innerHTML === scriptInnerHTML;
                });

                expect(filteredTags.length).to.be.at.least(3);
            });

            it("will clear all scripts tags if none are specified", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    script: [{ "src": "http://localhost/test.js", "type": "text/javascript" }]
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var existingTags = headElement.querySelectorAll("script[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'src' will not be accepted", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    script: [{ "property": "won't work" }]
                }), container, child);

                var existingTags = headElement.querySelectorAll("script[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("will set script tags based on deepest nested component", function () {
                child = (0, _preact.render)((0, _preact.h)(
                    "div",
                    null,
                    (0, _preact.h)(_Helmet2.default, {
                        script: [{ "src": "http://localhost/test.js", "type": "text/javascript" }]
                    }),
                    (0, _preact.h)(_Helmet2.default, {
                        script: [{ "src": "http://localhost/test2.js", "type": "text/javascript" }]
                    })
                ), container, child);

                var tagNodes = headElement.querySelectorAll("script[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                var firstTag = existingTags[0];
                var secondTag = existingTags[1];

                expect(existingTags).to.not.equal(undefined);

                expect(existingTags.length).to.be.at.least(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("src")).to.equal("http://localhost/test.js");
                expect(firstTag.getAttribute("type")).to.equal("text/javascript");
                expect(firstTag.outerHTML).to.equal("<script src=\"http://localhost/test.js\" type=\"text/javascript\" " + HELMET_ATTRIBUTE + "=\"true\"></script>");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag).to.have.property("getAttribute");
                expect(secondTag.getAttribute("src")).to.equal("http://localhost/test2.js");
                expect(secondTag.getAttribute("type")).to.equal("text/javascript");
                expect(secondTag.outerHTML).to.equal("<script src=\"http://localhost/test2.js\" type=\"text/javascript\" " + HELMET_ATTRIBUTE + "=\"true\"></script>");
            });

            it("sets undefined attribute values to empty strings", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    script: [{
                        src: "foo.js",
                        async: undefined
                    }]
                }), container, child);

                var existingTag = headElement.querySelector("script[" + HELMET_ATTRIBUTE + "]");

                expect(existingTag).to.not.equal(undefined);
                expect(existingTag.outerHTML).to.be.a("string").that.equals("<script src=\"foo.js\" async=\"\" " + HELMET_ATTRIBUTE + "=\"true\"></script>");
            });

            it("won't render tag when primary attribute (src) is null", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    script: [{
                        src: undefined,
                        type: "text/javascript"
                    }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("script[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });

            it("won't render tag when primary attribute (innerHTML) is null", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    script: [{
                        innerHTML: undefined
                    }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("script[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("noscript tags", function () {
            it("can update noscript tags", function () {
                var noscriptInnerHTML = "<link rel=\"stylesheet\" type=\"text/css\" href=\"foo.css\" />";
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, { noscript: [{ id: "bar", innerHTML: noscriptInnerHTML }] }), container, child);

                var existingTags = headElement.getElementsByTagName("noscript");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(1);
                expect(existingTags[0].innerHTML === noscriptInnerHTML && existingTags[0].id === "bar");
            });

            it("will clear all noscripts tags if none are specified", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, { noscript: [{ id: "bar" }] }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var existingTags = headElement.querySelectorAll("script[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'innerHTML' will not be accepted", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, { noscript: [{ "property": "won't work" }] }), container, child);

                var existingTags = headElement.querySelectorAll("noscript[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("won't render tag when primary attribute is null", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    noscript: [{
                        innerHTML: undefined
                    }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("noscript[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });

        describe("style tags", function () {
            it("can update style tags", function () {
                var cssText1 = "\n                    body {\n                        background-color: green;\n                    }\n                ";
                var cssText2 = "\n                    p {\n                        font-size: 12px;\n                    }\n                ";
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    style: [{
                        type: "text/css",
                        cssText: cssText1
                    }, {
                        cssText: cssText2
                    }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("style[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);

                var _existingTags = _slicedToArray(existingTags, 2),
                    firstTag = _existingTags[0],
                    secondTag = _existingTags[1];

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.be.equal(2);

                expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
                expect(firstTag).to.have.property("getAttribute");
                expect(firstTag.getAttribute("type")).to.equal("text/css");
                expect(firstTag.innerHTML).to.equal(cssText1);
                expect(firstTag.outerHTML).to.equal("<style type=\"text/css\" " + HELMET_ATTRIBUTE + "=\"true\">" + cssText1 + "</style>");

                expect(existingTags).to.have.deep.property("[1]").that.is.an.instanceof(Element);
                expect(secondTag.innerHTML).to.equal(cssText2);
                expect(secondTag.outerHTML).to.equal("<style " + HELMET_ATTRIBUTE + "=\"true\">" + cssText2 + "</style>");
            });

            it("will clear all style tags if none are specified", function () {
                var cssText = "\n                    body {\n                        background-color: green;\n                    }\n                ";
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    style: [{
                        type: "text/css",
                        cssText: cssText
                    }]
                }), container, child);

                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, null), container, child);

                var existingTags = headElement.querySelectorAll("style[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("tags without 'cssText' will not be accepted", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    style: [{ "property": "won't work" }]
                }), container, child);

                var existingTags = headElement.querySelectorAll("style[" + HELMET_ATTRIBUTE + "]");

                expect(existingTags).to.not.equal(undefined);
                expect(existingTags.length).to.equal(0);
            });

            it("won't render tag when primary attribute is null", function () {
                child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                    style: [{
                        cssText: undefined
                    }]
                }), container, child);

                var tagNodes = headElement.querySelectorAll("style[" + HELMET_ATTRIBUTE + "]");
                var existingTags = Array.prototype.slice.call(tagNodes);
                expect(existingTags).to.be.empty;
            });
        });
    });

    describe("misc", function () {
        it("throws in rewind() when a DOM is present", function () {
            child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                title: "Fancy title"
            }), container, child);

            expect(_Helmet2.default.rewind).to.throw("You may only call rewind() on the server. Call peek() to read the current state.");
        });

        it("lets you read current state in peek() whether or not a DOM is present", function () {
            child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                title: "Fancy title"
            }), container, child);

            expect(_Helmet2.default.peek().title).to.be.equal("Fancy title");
            _Helmet2.default.canUseDOM = false;
            expect(_Helmet2.default.peek().title).to.be.equal("Fancy title");
            _Helmet2.default.canUseDOM = true;
        });

        it("will html encode string", function () {
            child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                meta: [{ "name": "description", "content": "This is \"quoted\" text and & and '." }]
            }), container, child);

            var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
            var existingTag = existingTags[0];

            expect(existingTags).to.not.equal(undefined);

            expect(existingTags.length).to.be.equal(1);

            expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
            expect(existingTag).to.have.property("getAttribute");
            expect(existingTag.getAttribute("name")).to.equal("description");
            expect(existingTag.getAttribute("content")).to.equal("This is \"quoted\" text and & and '.");
            expect(existingTag.outerHTML).to.equal("<meta name=\"description\" content=\"This is &quot;quoted&quot; text and &amp; and '.\" " + HELMET_ATTRIBUTE + "=\"true\">");
        });

        it("will not change the DOM if it is receives identical props", function () {
            var spy = sinon.spy();
            child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                meta: [{ "name": "description", "content": "Test description" }],
                title: "Test Title",
                onChangeClientState: spy
            }), container, child);

            // Re-rendering will pass new props to an already mounted Helmet
            child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                meta: [{ "name": "description", "content": "Test description" }],
                title: "Test Title",
                onChangeClientState: spy
            }), container, child);

            expect(spy.callCount).to.equal(1);
        });

        /*
                TODO this test is disabled because I could not get it to pass...
                It seems that componentWillUnmount is called at a slightly different
                moment with Preact than with React but I think the difference is
                academic and the only reason this test fails is because we do a bit weird
                stuff in here with switching canUseDom on and off etc...
                SEE https://github.com/developit/preact/issues/534
        
                it("will only add new tags and will preserve tags when rendering additional Helmet instances", () => {
                    const spy = sinon.spy();
                    let addedTags;
                    let removedTags;
        
                    child = render(
                        <Helmet
                            link={[{"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css"}]}
                            meta={[{"name": "description", "content": "Test description"}]}
                            onChangeClientState={spy}
                        />,
                        container, child
                    );
        
                    expect(spy.called).to.equal(true);
                    addedTags = spy.getCall(0).args[1];
                    removedTags = spy.getCall(0).args[2];
        
                    expect(addedTags).to.have.property("metaTags");
                    expect(addedTags.metaTags).to.have.deep.property("[0]");
                    expect(addedTags.metaTags[0].outerHTML).to.equal(`<meta name="description" content="Test description" ${HELMET_ATTRIBUTE}>`);
                    expect(addedTags).to.have.property("linkTags");
                    expect(addedTags.linkTags).to.have.deep.property("[0]");
                    expect(addedTags.linkTags[0].outerHTML).to.equal(`<link href="http://localhost/style.css" rel="stylesheet" type="text/css" ${HELMET_ATTRIBUTE}>`);
                    expect(removedTags).to.be.empty;
        
                    // Re-rendering will pass new props to an already mounted Helmet
                    child = render(
                        <Helmet
                            link={[
                                {"href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css"},
                                {"href": "http://localhost/style2.css", "rel": "stylesheet", "type": "text/css"}
                            ]}
                            meta={[{"name": "description", "content": "New description"}]}
                            onChangeClientState={spy}
                        />,
                        container, child
                    );
        
                    expect(spy.callCount).to.equal(2);
                    addedTags = spy.getCall(1).args[1];
                    removedTags = spy.getCall(1).args[2];
        
                    expect(addedTags).to.have.property("metaTags");
                    expect(addedTags.metaTags).to.have.deep.property("[0]");
                    expect(addedTags.metaTags[0].outerHTML).to.equal(`<meta name="description" content="New description" ${HELMET_ATTRIBUTE}>`);
                    expect(addedTags).to.have.property("linkTags");
                    expect(addedTags.linkTags).to.have.deep.property("[0]");
                    expect(addedTags.linkTags[0].outerHTML).to.equal(`<link href="http://localhost/style2.css" rel="stylesheet" type="text/css" ${HELMET_ATTRIBUTE}>`);
                    expect(removedTags).to.have.property("metaTags");
                    expect(removedTags.metaTags).to.have.deep.property("[0]");
                    expect(removedTags.metaTags[0].outerHTML).to.equal(`<meta name="description" content="Test description" ${HELMET_ATTRIBUTE}>`);
                    expect(removedTags).to.not.have.property("linkTags");
                });
        */
        it("can not nest Helmets", function () {
            child = (0, _preact.render)((0, _preact.h)(
                _Helmet2.default,
                {
                    title: "Test Title"
                },
                (0, _preact.h)(_Helmet2.default, {
                    title: "Title you'll never see"
                })
            ), container, child);

            expect(document.title).to.equal("Test Title");
        });

        it("will recognize valid tags regardless of attribute ordering", function () {
            child = (0, _preact.render)((0, _preact.h)(_Helmet2.default, {
                meta: [{ "content": "Test Description", "name": "description" }]
            }), container, child);

            var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
            var existingTag = existingTags[0];

            expect(existingTags).to.not.equal(undefined);

            expect(existingTags.length).to.be.equal(1);

            expect(existingTags).to.have.deep.property("[0]").that.is.an.instanceof(Element);
            expect(existingTag).to.have.property("getAttribute");
            expect(existingTag.getAttribute("name")).to.equal("description");
            expect(existingTag.getAttribute("content")).to.equal("Test Description");
            expect(existingTag.outerHTML).to.equal("<meta content=\"Test Description\" name=\"description\" " + HELMET_ATTRIBUTE + "=\"true\">");
        });
    });

    describe("server", function () {
        var renderedHtmlAttributes = "lang=\"ga\" class=\"myClassName\"";
        var renderedTitle = "<title " + HELMET_ATTRIBUTE + ">Dangerous &lt;script&gt; include</title>";
        var renderedTitleWithItemProp = "<title " + HELMET_ATTRIBUTE + " itemprop=\"name\">Title with Itemprop</title>";
        var renderedBaseTag = "<base " + HELMET_ATTRIBUTE + " target=\"_blank\" href=\"http://localhost/\">";

        var renderedMetaTags = ["<meta " + HELMET_ATTRIBUTE + " charset=\"utf-8\">", "<meta " + HELMET_ATTRIBUTE + " name=\"description\" content=\"Test description &amp; encoding of special characters like &quot; &gt; &lt; `\">", "<meta " + HELMET_ATTRIBUTE + " http-equiv=\"content-type\" content=\"text/html\">", "<meta " + HELMET_ATTRIBUTE + " property=\"og:type\" content=\"article\">", "<meta " + HELMET_ATTRIBUTE + " itemprop=\"name\" content=\"Test name itemprop\">"].join("");

        var renderedLinkTags = ["<link " + HELMET_ATTRIBUTE + " href=\"http://localhost/helmet\" rel=\"canonical\">", "<link " + HELMET_ATTRIBUTE + " href=\"http://localhost/style.css\" rel=\"stylesheet\" type=\"text/css\">"].join("");

        var renderedScriptTags = ["<script " + HELMET_ATTRIBUTE + " src=\"http://localhost/test.js\" type=\"text/javascript\"></script>", "<script " + HELMET_ATTRIBUTE + " src=\"http://localhost/test2.js\" type=\"text/javascript\"></script>"].join("");

        var renderedNoscriptTags = ["<noscript " + HELMET_ATTRIBUTE + " id=\"foo\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/style.css\" /></noscript>", "<noscript " + HELMET_ATTRIBUTE + " id=\"bar\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/style2.css\" /></noscript>"].join("");

        var renderedStyleTags = ["<style " + HELMET_ATTRIBUTE + " type=\"text/css\">body {background-color: green;}</style>", "<style " + HELMET_ATTRIBUTE + " type=\"text/css\">p {font-size: 12px;}</style>"].join("");

        before(function () {
            _Helmet2.default.canUseDOM = false;
            _Helmet2.default.rewind();
        });

        after(function () {
            _Helmet2.default.rewind();
            _Helmet2.default.canUseDOM = true;
        });

        it("will html encode title", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                title: "Dangerous <script> include"
            }));

            var head = _Helmet2.default.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString()).to.equal(renderedTitle);
        });

        it("will render title as React component", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                title: "Dangerous <script> include"
            }));

            var head = _Helmet2.default.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toComponent");

            var titleComponent = head.title.toComponent();

            expect(titleComponent).to.be.an("array").that.has.length.of(1);

            titleComponent.forEach(function (title) {
                expect(title).to.be.an("object").that.contains.property("nodeName", "title");
            });

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                titleComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedTitle + "</div>");
        });

        it("will render title with itemprop name as React component", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                title: "Title with Itemprop",
                titleAttributes: { itemprop: "name" }
            }));

            var head = _Helmet2.default.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toComponent");

            var titleComponent = head.title.toComponent();

            expect(titleComponent).to.be.an("array").that.has.length.of(1);

            titleComponent.forEach(function (title) {
                expect(title).to.be.an("object").that.contains.property("nodeName", "title");
            });

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                titleComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedTitleWithItemProp + "</div>");
        });

        it("will render base tag as React component", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                base: { "target": "_blank", "href": "http://localhost/" }
            }));

            var head = _Helmet2.default.rewind();

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toComponent");

            var baseComponent = head.base.toComponent();

            expect(baseComponent).to.be.an("array").that.has.length.of(1);

            baseComponent.forEach(function (base) {
                expect(base).to.be.an("object").that.contains.property("nodeName", "base");
            });

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                baseComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedBaseTag + "</div>");
        });

        it("will render meta tags as React components", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                meta: [{ "charset": "utf-8" }, { "name": "description", "content": "Test description & encoding of special characters like \" > < `" }, { "http-equiv": "content-type", "content": "text/html" }, { "property": "og:type", "content": "article" }, { "itemprop": "name", "content": "Test name itemprop" }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toComponent");

            var metaComponent = head.meta.toComponent();

            expect(metaComponent).to.be.an("array").that.has.length.of(5);

            metaComponent.forEach(function (meta) {
                expect(meta).to.be.an("object").that.contains.property("nodeName", "meta");
            });

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                metaComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedMetaTags + "</div>");
        });

        it("will render link tags as React components", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                link: [{ "href": "http://localhost/helmet", "rel": "canonical" }, { "href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css" }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toComponent");

            var linkComponent = head.link.toComponent();

            expect(linkComponent).to.be.an("array").that.has.length.of(2);

            linkComponent.forEach(function (link) {
                expect(link).to.be.an("object").that.contains.property("nodeName", "link");
            });

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                linkComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedLinkTags + "</div>");
        });

        it("will render script tags as React components", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                script: [{ "src": "http://localhost/test.js", "type": "text/javascript" }, { "src": "http://localhost/test2.js", "type": "text/javascript" }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toComponent");

            var scriptComponent = head.script.toComponent();

            expect(scriptComponent).to.be.an("array").that.has.length.of(2);

            scriptComponent.forEach(function (script) {
                expect(script).to.be.an("object").that.contains.property("nodeName", "script");
            });

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                scriptComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedScriptTags + "</div>");
        });

        it("will render noscript tags as React components", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                noscript: [{ id: "foo", innerHTML: '<link rel="stylesheet" type="text/css" href="/style.css" />' }, { id: "bar", innerHTML: '<link rel="stylesheet" type="text/css" href="/style2.css" />' }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.noscript).to.exist;
            expect(head.noscript).to.respondTo("toComponent");

            var noscriptComponent = head.noscript.toComponent();

            expect(noscriptComponent).to.be.an("array").that.has.length.of(2);

            noscriptComponent.forEach(function (noscript) {
                expect(noscript).to.be.an("object").that.contains.property("nodeName", "noscript");
            });

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                noscriptComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedNoscriptTags + "</div>");
        });

        it("will render style tags as React components", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                style: [{
                    "type": "text/css",
                    "cssText": "body {background-color: green;}"
                }, {
                    "type": "text/css",
                    "cssText": "p {font-size: 12px;}"
                }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toComponent");

            var styleComponent = head.style.toComponent();

            expect(styleComponent).to.be.an("array").that.has.length.of(2);

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                styleComponent
            ));

            expect(markup).to.be.a("string").that.equals("<div>" + renderedStyleTags + "</div>");
        });

        it("will render title tag as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                title: "Dangerous <script> include"
            }));

            var head = _Helmet2.default.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString()).to.be.a("string").that.equals(renderedTitle);
        });

        it("will render title with itemprop name as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                title: "Title with Itemprop",
                titleAttributes: { itemprop: "name" }
            }));

            var head = _Helmet2.default.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            var titleString = head.title.toString();
            expect(titleString).to.be.a("string").that.equals(renderedTitleWithItemProp);
        });

        it("will render base tags as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                base: { "target": "_blank", "href": "http://localhost/" }
            }));

            var head = _Helmet2.default.rewind();

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toString");

            expect(head.base.toString()).to.be.a("string").that.equals(renderedBaseTag);
        });

        it("will render meta tags as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                meta: [{ "charset": "utf-8" }, { "name": "description", "content": "Test description & encoding of special characters like \" > < `" }, { "http-equiv": "content-type", "content": "text/html" }, { "property": "og:type", "content": "article" }, { "itemprop": "name", "content": "Test name itemprop" }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toString");

            expect(head.meta.toString()).to.be.a("string").that.equals(renderedMetaTags);
        });

        it("will render link tags as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                link: [{ "href": "http://localhost/helmet", "rel": "canonical" }, { "href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css" }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toString");

            expect(head.link.toString()).to.be.a("string").that.equals(renderedLinkTags);
        });

        it("will render script tags as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                script: [{ "src": "http://localhost/test.js", "type": "text/javascript" }, { "src": "http://localhost/test2.js", "type": "text/javascript" }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toString");

            expect(head.script.toString()).to.be.a("string").that.equals(renderedScriptTags);
        });

        it("will render style tags as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                style: [{
                    "type": "text/css",
                    "cssText": "body {background-color: green;}"
                }, {
                    "type": "text/css",
                    "cssText": "p {font-size: 12px;}"
                }]
            }));

            var head = _Helmet2.default.rewind();

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toString");

            expect(head.style.toString()).to.be.a("string").that.equals(renderedStyleTags);
        });

        it("will render html attributes as component", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                htmlAttributes: {
                    lang: "ga",
                    className: "myClassName"
                }
            }));

            var _Helmet$rewind = _Helmet2.default.rewind(),
                htmlAttributes = _Helmet$rewind.htmlAttributes;

            var attrs = htmlAttributes.toComponent();

            expect(attrs).to.exist;

            var markup = (0, _preactRenderToString.render)((0, _preact.h)("html", _extends({ lang: "en" }, attrs)));

            expect(markup).to.be.a("string").that.equals("<html " + renderedHtmlAttributes + "></html>");
        });

        it("will render html attributes as string", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                htmlAttributes: {
                    lang: "ga",
                    class: "myClassName"
                }
            }));

            var head = _Helmet2.default.rewind();

            expect(head.htmlAttributes).to.exist;
            expect(head.htmlAttributes).to.respondTo("toString");

            expect(head.htmlAttributes.toString()).to.be.a("string").that.equals(renderedHtmlAttributes);
        });

        it("will not encode all characters with HTML character entity equivalents", function () {
            var chineseTitle = "膣膗 鍆錌雔";
            var stringifiedChineseTitle = "<title " + HELMET_ATTRIBUTE + ">" + chineseTitle + "</title>";

            (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                (0, _preact.h)(_Helmet2.default, { title: chineseTitle })
            ));

            var head = _Helmet2.default.rewind();

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");

            expect(head.title.toString()).to.be.a("string").that.equals(stringifiedChineseTitle);
        });

        it("rewind() provides a fallback object for empty Helmet state", function () {
            (0, _preactRenderToString.render)((0, _preact.h)("div", null));

            var head = _Helmet2.default.rewind();

            expect(head.htmlAttributes).to.exist;
            expect(head.htmlAttributes).to.respondTo("toString");
            expect(head.htmlAttributes.toString()).to.equal("");
            expect(head.htmlAttributes).to.respondTo("toComponent");
            expect(head.htmlAttributes.toComponent()).to.be.an("object").that.is.empty;

            expect(head.title).to.exist;
            expect(head.title).to.respondTo("toString");
            expect(head.title.toString()).to.equal("<title " + HELMET_ATTRIBUTE + "></title>");
            expect(head.title).to.respondTo("toComponent");

            var markup = (0, _preactRenderToString.render)((0, _preact.h)(
                "div",
                null,
                head.title.toComponent()
            ));

            expect(markup).to.be.a("string").that.equals("<div><title " + HELMET_ATTRIBUTE + "></title></div>");

            expect(head.base).to.exist;
            expect(head.base).to.respondTo("toString");
            expect(head.base.toString()).to.equal("");
            expect(head.base).to.respondTo("toComponent");
            expect(head.base.toComponent()).to.be.an("array").that.is.empty;

            expect(head.meta).to.exist;
            expect(head.meta).to.respondTo("toString");
            expect(head.meta.toString()).to.equal("");
            expect(head.meta).to.respondTo("toComponent");
            expect(head.meta.toComponent()).to.be.an("array").that.is.empty;

            expect(head.link).to.exist;
            expect(head.link).to.respondTo("toString");
            expect(head.link.toString()).to.equal("");
            expect(head.link).to.respondTo("toComponent");
            expect(head.link.toComponent()).to.be.an("array").that.is.empty;

            expect(head.script).to.exist;
            expect(head.script).to.respondTo("toString");
            expect(head.script.toString()).to.equal("");
            expect(head.script).to.respondTo("toComponent");
            expect(head.script.toComponent()).to.be.an("array").that.is.empty;

            expect(head.noscript).to.exist;
            expect(head.noscript).to.respondTo("toString");
            expect(head.noscript.toString()).to.equal("");
            expect(head.noscript).to.respondTo("toComponent");
            expect(head.noscript.toComponent()).to.be.an("array").that.is.empty;

            expect(head.style).to.exist;
            expect(head.style).to.respondTo("toString");
            expect(head.style.toString()).to.equal("");
            expect(head.style).to.respondTo("toComponent");
            expect(head.style.toComponent()).to.be.an("array").that.is.empty;
        });

        it("does not render undefined attribute values", function () {
            (0, _preactRenderToString.render)((0, _preact.h)(_Helmet2.default, {
                script: [{
                    src: "foo.js",
                    async: undefined
                }]
            }));

            var _Helmet$rewind2 = _Helmet2.default.rewind(),
                script = _Helmet$rewind2.script;

            var stringifiedScriptTag = script.toString();

            expect(stringifiedScriptTag).to.be.a("string").that.equals("<script " + HELMET_ATTRIBUTE + " src=\"foo.js\" async></script>");
        });
    });
});

function unmountComponentAtNode(container, child) {
    // render an empty string to force the components to unmount
    return (0, _preact.render)("", container, child);
}