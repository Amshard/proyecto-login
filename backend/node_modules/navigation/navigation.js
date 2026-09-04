'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class StateContext {
    constructor() {
        this.oldState = null;
        this.oldData = {};
        this.oldHash = null;
        this.oldUrl = null;
        this.previousState = null;
        this.previousData = {};
        this.previousHash = null;
        this.previousUrl = null;
        this.state = null;
        this.data = {};
        this.hash = null;
        this.url = null;
        this.asyncData = undefined;
        this.title = null;
        this.history = false;
        this.historyAction = null;
        this.crumbs = [];
        this.nextCrumb = null;
    }
    clear() {
        this.oldState = null;
        this.oldData = {};
        this.oldUrl = null;
        this.previousState = null;
        this.previousData = {};
        this.previousUrl = null;
        this.state = null;
        this.data = {};
        this.url = null;
        this.asyncData = undefined;
        this.title = null;
        this.history = false;
        this.crumbs = [];
        this.nextCrumb = null;
    }
    includeCurrentData(data, keys) {
        if (!keys) {
            keys = [];
            for (var key in this.data)
                keys.push(key);
        }
        var newData = {};
        for (var i = 0; i < keys.length; i++)
            newData[keys[i]] = this.data[keys[i]];
        for (var key in data)
            newData[key] = data[key];
        return newData;
    }
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}
function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Crumb {
    constructor(data, state, url, crumblessUrl, last, hash) {
        this.data = data ? data : {};
        this.state = state;
        this.hash = hash;
        this.last = last;
        this.title = state.title;
        this.url = url;
        this.crumblessUrl = crumblessUrl;
    }
}

class EventHandlerCache {
    constructor(name) {
        this.handlerId = 1;
        this.handlers = {};
        this.name = name;
    }
    onEvent(handler) {
        if (!handler[this.name]) {
            var id = this.name + this.handlerId++;
            handler[this.name] = id;
            this.handlers[id] = handler;
        }
        else {
            throw new Error('Cannot add the same handler more than once');
        }
    }
    offEvent(handler) {
        delete this.handlers[handler[this.name]];
        delete handler[this.name];
    }
}

function createFluentNavigator(states, stateHandler, stateContext = new StateContext(), rewrite) {
    function getCrumbTrail(state, navigationData, crumbs, nextCrumb) {
        if (!state.trackCrumbTrail)
            return [];
        crumbs = crumbs.slice();
        if (nextCrumb)
            crumbs.push(nextCrumb);
        return state.truncateCrumbTrail(state, navigationData, crumbs);
    }
    function navigateLink(state, data, hash, crumbs, url) {
        var fluentContext = new StateContext();
        fluentContext.state = state;
        fluentContext.url = url;
        fluentContext.crumbs = crumbs;
        fluentContext.data = data;
        fluentContext.hash = hash;
        fluentContext.nextCrumb = new Crumb(data, state, url, stateHandler.getLink(state, data, hash), false, hash);
        return createFluentNavigator(states, stateHandler, fluentContext, rewrite);
    }
    return {
        url: stateContext.url,
        navigate: function (stateKey, navigationData, hash) {
            var state = states[stateKey];
            var { crumbs, nextCrumb } = stateContext;
            if (!state)
                throw new Error(stateKey + ' is not a valid State');
            if (typeof navigationData === 'function')
                navigationData = navigationData(stateContext.data);
            var url = stateHandler.getLink(state, navigationData, hash, crumbs, nextCrumb);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            rewrite(url, state, navigationData, crumbs, nextCrumb);
            var data = Object.assign(Object.assign({}, state.defaults), navigationData);
            var crumbs = getCrumbTrail(state, data, crumbs, nextCrumb);
            return navigateLink(state, data, hash, crumbs, url);
        },
        navigateBack: function (distance) {
            var { crumbs } = stateContext;
            if (!(distance <= crumbs.length && distance > 0))
                throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + stateContext.crumbs.length + ')');
            var { state, data, url } = crumbs[crumbs.length - distance];
            var crumbs = crumbs.slice(0, crumbs.length - distance);
            rewrite(url, state, data, crumbs);
            return navigateLink(state, data, null, crumbs, url);
        },
        refresh: function (navigationData, hash) {
            var { state, crumbs } = stateContext;
            if (typeof navigationData === 'function')
                navigationData = navigationData(stateContext.data);
            var url = stateHandler.getLink(state, navigationData, hash, crumbs);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            rewrite(url, state, navigationData, crumbs);
            var data = Object.assign(Object.assign({}, state.defaults), navigationData);
            var crumbs = getCrumbTrail(state, data, crumbs);
            return navigateLink(state, data, hash, crumbs, url);
        }
    };
}

class HTML5HistoryManager {
    constructor(applicationPath = '') {
        this.navigateHistory = null;
        this.onNavigate = null;
        this.applicationPath = '';
        this.disabled = (typeof window === 'undefined') || !(window.history && window.history.pushState);
        this.applicationPath = HTML5HistoryManager.prependSlash(applicationPath);
    }
    init(navigateHistory, rewriteUrl) {
        if (!this.rewriteUrl)
            this.rewriteUrl = rewriteUrl;
        if (!this.disabled && !this.navigateHistory) {
            this.navigateHistory = e => {
                if (!this.onNavigate)
                    navigateHistory((e.state && e.state.navigationLink) || undefined);
            };
            window.addEventListener('popstate', this.navigateHistory);
        }
    }
    addHistory(url, replace) {
        var _a, _b, _c, _d, _e;
        if (!this.disabled && (((_a = window.history.state) === null || _a === void 0 ? void 0 : _a.navigationLink) || ((_c = (_b = window.navigation) === null || _b === void 0 ? void 0 : _b.currentEntry.getState()) === null || _c === void 0 ? void 0 : _c.navigationLink) || this.getUrl(window.location)) !== url) {
            const currentState = !replace ? null : (_d = window.navigation) === null || _d === void 0 ? void 0 : _d.currentEntry.getState();
            if (!replace)
                window.history.pushState({ navigationLink: url }, null, this.getHref(url));
            else
                window.history.replaceState(Object.assign(Object.assign({}, window.history.state), { navigationLink: url }), null, this.getHref(url));
            (_e = window.navigation) === null || _e === void 0 ? void 0 : _e.updateCurrentEntry({ state: Object.assign(Object.assign({}, currentState), { navigationLink: url }) });
        }
    }
    navigate(url, replace, controller, stateContext) {
        if (!replace) {
            if (!controller)
                return window.navigation.navigate(this.getHref(url), { history: 'push', state: { navigationLink: url }, info: { stateContext } });
            else
                controller.redirect(this.getHref(url), { history: 'push', state: { navigationLink: url } });
        }
        else {
            if (!controller)
                return window.navigation.navigate(this.getHref(url), { history: 'replace', state: Object.assign(Object.assign({}, window.navigation.currentEntry.getState()), { navigationLink: url }), info: { stateContext } });
            else
                controller.redirect(this.getHref(url), { history: 'replace', state: Object.assign(Object.assign({}, window.navigation.currentEntry.getState()), { navigationLink: url }) });
        }
        return null;
    }
    interceptHistory(intercept) {
        var _a;
        if (this.onNavigate)
            window.navigation.removeEventListener('navigate', this.onNavigate);
        if (!this.disabled && !!intercept) {
            this.onNavigate = (e) => {
                var _a;
                if (!this.canInterceptHistory(e))
                    return;
                const navigationLink = ((_a = e.destination.getState()) === null || _a === void 0 ? void 0 : _a.navigationLink) || this.getUrl(new URL(e.destination.url));
                if (e.cancelable) {
                    e.intercept({
                        focusReset: 'manual',
                        scroll: 'manual',
                        precommitHandler() {
                            return __awaiter(this, void 0, void 0, function* () {
                                return intercept(navigationLink, e);
                            });
                        }
                    });
                }
                else {
                    intercept(navigationLink, e);
                }
            };
            (_a = window.navigation) === null || _a === void 0 ? void 0 : _a.addEventListener('navigate', this.onNavigate);
        }
    }
    canInterceptHistory(e) {
        return e.navigationType === 'traverse' && e.canIntercept;
    }
    getCurrentUrl(destination) {
        var _a, _b, _c, _d;
        if (destination)
            return ((_a = destination.getState()) === null || _a === void 0 ? void 0 : _a.navigationLink) || this.getUrl(new URL(destination.url));
        return ((_b = window.history.state) === null || _b === void 0 ? void 0 : _b.navigationLink) || ((_d = (_c = window.navigation) === null || _c === void 0 ? void 0 : _c.currentEntry.getState()) === null || _d === void 0 ? void 0 : _d.navigationLink) || this.getUrl(window.location);
    }
    getHref(url) {
        var _a;
        if (url == null)
            throw new Error('The Url is invalid');
        return this.applicationPath + HTML5HistoryManager.prependSlash(((_a = this.rewriteUrl) === null || _a === void 0 ? void 0 : _a.call(this, url)) || url);
    }
    getUrl(hrefElement) {
        return hrefElement.pathname.substring(this.applicationPath.length) + hrefElement.search + hrefElement.hash;
    }
    stop() {
        if (this.navigateHistory)
            window.removeEventListener('popstate', this.navigateHistory);
        if (this.onNavigate)
            window.navigation.removeEventListener('navigate', this.onNavigate);
        this.navigateHistory = null;
        this.onNavigate = null;
    }
    static prependSlash(url) {
        return (url && url.substring(0, 1) !== '/') ? '/' + url : url;
    }
}

class HashHistoryManager extends HTML5HistoryManager {
    constructor(replaceQueryIdentifier = false) {
        super('');
        this.replaceQueryIdentifier = false;
        this.replaceQueryIdentifier = replaceQueryIdentifier;
    }
    getHref(url) {
        if (url == null)
            throw new Error('The Url is invalid');
        return '#' + this.encode(super.getHref(url));
    }
    getUrl(hrefElement) {
        return this.decode(hrefElement.hash.substring(1));
    }
    encode(url) {
        if (!this.replaceQueryIdentifier)
            return url;
        return url.replace('?', '#');
    }
    decode(hash) {
        if (!this.replaceQueryIdentifier)
            return hash;
        return hash.replace('#', '?');
    }
}

class TypeConverter {
    constructor(key, name) {
        this.key = key;
        this.name = name;
    }
    convertFrom(val, separable = false) {
        return null;
    }
    convertTo(val) {
        return null;
    }
}

class ArrayConverter extends TypeConverter {
    constructor(converter, key) {
        super(key, converter.name + 'array');
        this.converter = converter;
    }
    convertFrom(val, separable) {
        var arr = [];
        if (typeof val === 'string') {
            if (!separable) {
                var vals = val.split(ArrayConverter.SEPARATOR);
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i].length !== 0)
                        arr.push(this.converter.convertFrom(vals[i].replace(/0-/g, '-')));
                    else
                        throw new Error('Empty string is not a valid array item');
                }
            }
            else {
                if (val.length !== 0)
                    arr.push(this.converter.convertFrom(val));
                else
                    throw new Error('Empty string is not a valid array item');
            }
        }
        else {
            for (var i = 0; i < val.length; i++) {
                if (val[i].length !== 0)
                    arr.push(this.converter.convertFrom(val[i]));
                else
                    throw new Error('Empty string is not a valid array item');
            }
        }
        return arr;
    }
    convertTo(val) {
        var vals = [];
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            if (val[i] != null && val[i].toString()) {
                var convertedValue = this.converter.convertTo(val[i]).val;
                arr.push(convertedValue);
                vals.push(convertedValue.replace(/-/g, '0-'));
            }
            else {
                throw new Error('Invalid navigation data, arrays cannnot contain null, undefined or empty string');
            }
        }
        return { val: vals.join(ArrayConverter.SEPARATOR), arrayVal: arr };
    }
}
ArrayConverter.SEPARATOR = '1-';

class BooleanConverter extends TypeConverter {
    constructor(key) {
        super(key, 'boolean');
    }
    convertFrom(val) {
        if (val !== 'true' && val !== 'false')
            throw new Error(val + ' is not a valid boolean');
        return val === 'true';
    }
    convertTo(val) {
        return { val: '' + val };
    }
}

class DateConverter extends TypeConverter {
    constructor(key) {
        super(key, 'date');
    }
    convertFrom(val) {
        var dateParts = val.split('-');
        if (dateParts.length !== 3)
            throw new Error(val + ' is not a valid date');
        var date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
        if (isNaN(+date))
            throw new Error(val + ' is not a valid date');
        return date;
    }
    convertTo(val) {
        var year = val.getFullYear();
        var month = ('0' + (val.getMonth() + 1)).slice(-2);
        var day = ('0' + val.getDate()).slice(-2);
        return { val: year + '-' + month + '-' + day };
    }
}

class NumberConverter extends TypeConverter {
    constructor(key) {
        super(key, 'number');
    }
    convertFrom(val) {
        if (isNaN(+val))
            throw new Error(val + ' is not a valid number');
        return +val;
    }
    convertTo(val) {
        return { val: '' + val };
    }
}

class StringConverter extends TypeConverter {
    constructor(key) {
        super(key, 'string');
    }
    convertFrom(val) {
        if (typeof val !== 'string')
            throw new Error(val + ' is not a valid string');
        return val;
    }
    convertTo(val) {
        return { val: '' + val };
    }
}

class ConverterFactory {
    constructor() {
        this.keyToConverterList = {};
        this.nameToConverterList = {};
        var converterArray = [
            new StringConverter('0'), new BooleanConverter('1'),
            new NumberConverter('2'), new DateConverter('3')
        ];
        for (var i = 0; i < converterArray.length; i++) {
            var converter = converterArray[i];
            var arrayConverter = new ArrayConverter(converter, 'a' + converter.key);
            this.keyToConverterList[converter.key] = this.nameToConverterList[converter.name] = converter;
            this.keyToConverterList[arrayConverter.key] = this.nameToConverterList[arrayConverter.name] = arrayConverter;
        }
    }
    getConverterFromKey(key) {
        return this.keyToConverterList[key];
    }
    getConverterFromName(name) {
        var converter = this.nameToConverterList[name];
        if (!converter)
            throw new Error('No TypeConverter found for ' + name);
        return converter;
    }
}

class NavigationDataManager {
    constructor() {
        this.converterFactory = new ConverterFactory();
    }
    formatData(state, navigationData, crumbTrail) {
        var data = {};
        var arrayData = {};
        for (var key in navigationData) {
            var val = navigationData[key];
            if (val != null && val.length !== 0)
                this.formatDataItem(state, key, val, data, arrayData);
        }
        if (state.trackCrumbTrail && crumbTrail.length > 0)
            this.formatDataItem(state, state.crumbTrailKey, crumbTrail, data, arrayData);
        return { data: data, arrayData: arrayData };
    }
    formatDataItem(state, key, val, data, arrayData) {
        var formattedData = this.formatURLObject(key, val, state);
        val = formattedData.val;
        if (val !== state.formattedDefaults[key]) {
            data[key] = val;
            arrayData[key] = formattedData.arrayVal;
        }
    }
    static decodeUrlValue(urlValue) {
        return urlValue.replace(/0_/g, '_');
    }
    static encodeUrlValue(urlValue) {
        return urlValue.replace(/_/g, '0_');
    }
    formatURLObject(key, urlObject, state, encode = false) {
        encode = encode || state.trackTypes;
        var defaultType = state.defaultTypes[key] || 'string';
        var converter = this.getConverter(urlObject);
        var convertedValue = converter.convertTo(urlObject);
        var formattedValue = convertedValue.val;
        var formattedArray = convertedValue.arrayVal;
        if (encode) {
            formattedValue = NavigationDataManager.encodeUrlValue(formattedValue);
            if (formattedArray)
                formattedArray[0] = NavigationDataManager.encodeUrlValue(formattedArray[0]);
        }
        if (state.trackTypes && converter.name !== defaultType) {
            formattedValue += NavigationDataManager.SEPARATOR + converter.key;
            if (formattedArray)
                formattedArray[0] = formattedArray[0] + NavigationDataManager.SEPARATOR + converter.key;
        }
        return { val: formattedValue, arrayVal: formattedArray };
    }
    parseData(data, state, separableData) {
        var newData = {};
        for (var key in data) {
            if (!NavigationDataManager.isDefault(key, data, state, !!separableData[key]))
                newData[key] = this.parseURLString(key, data[key], state, false, !!separableData[key]);
        }
        for (var key in state.defaults) {
            if (newData[key] == null || !newData[key].toString())
                newData[key] = state.defaults[key];
        }
        return newData;
    }
    static isDefault(key, data, state, separable) {
        var val = data[key];
        var arrayDefaultVal = state.formattedArrayDefaults[key];
        if (!separable || !arrayDefaultVal) {
            return val === state.formattedDefaults[key];
        }
        else {
            if (typeof val === 'string')
                val = [val];
            if (val.length !== arrayDefaultVal.length)
                return false;
            for (var i = 0; i < val.length; i++) {
                if (val[i] !== arrayDefaultVal[i])
                    return false;
            }
            return true;
        }
    }
    parseURLString(key, val, state, decode = false, separable = false) {
        decode = decode || state.trackTypes;
        var defaultType = state.defaultTypes[key] || 'string';
        var urlValue = typeof val === 'string' ? val : val[0];
        var converterKey = this.converterFactory.getConverterFromName(defaultType).key;
        if (state.trackTypes && urlValue.indexOf(NavigationDataManager.SEPARATOR) > -1) {
            var arr = urlValue.split(NavigationDataManager.SEPARATOR);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = NavigationDataManager.decodeUrlValue(urlValue);
        if (typeof val === 'string')
            val = urlValue;
        else
            val[0] = urlValue;
        return this.converterFactory.getConverterFromKey(converterKey).convertFrom(val, separable);
    }
    getConverter(obj) {
        var fullName = NavigationDataManager.getTypeName(obj);
        if (fullName === 'array') {
            var arr = obj;
            var subName = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subName = NavigationDataManager.getTypeName(arr[i]);
                    break;
                }
            }
            fullName = subName + fullName;
        }
        return this.converterFactory.getConverterFromName(fullName);
    }
    static getTypeName(obj) {
        var typeName = typeof obj;
        if (typeName === 'object') {
            typeName = Object.prototype.toString.call(obj);
            typeName = typeName.substring(8, typeName.length - 1).toLowerCase();
        }
        return typeName;
    }
}
NavigationDataManager.SEPARATOR = '1_';

class State {
    constructor() {
        this.defaults = {};
        this.defaultTypes = {};
        this.formattedDefaults = {};
        this.formattedArrayDefaults = {};
        this.trackCrumbTrail = false;
        this.trackTypes = true;
    }
    unloading(state, data, url, unload, history) {
        unload();
    }
    ;
    navigating(data, url, navigate, history) {
        navigate();
    }
    ;
    dispose() {
    }
    ;
    navigated(data, asyncData) {
    }
    ;
    urlEncode(state, key, val, queryString, index) {
        return encodeURIComponent(val);
    }
    urlDecode(state, key, val, queryString) {
        return decodeURIComponent(val);
    }
    validate(data) {
        return true;
    }
    truncateCrumbTrail(state, data, crumbs) {
        return crumbs;
    }
    rewriteNavigation(data) {
        return null;
    }
}

class Segment {
    constructor(path, optional, defaults) {
        this.pattern = '';
        this.params = [];
        this.subSegments = [];
        this.subSegmentPattern = /[{]{0,1}[^{}]+[}]{0,1}/g;
        this.escapePattern = /[\.+*\^$\[\](){}']/g;
        this.path = path;
        this.optional = optional;
        this.parse(defaults);
    }
    parse(defaults) {
        if (this.path.length === 0)
            return;
        var matches = this.path.match(this.subSegmentPattern);
        for (var i = 0; i < matches.length; i++) {
            var subSegment = matches[i];
            if (subSegment.slice(0, 1) === '{') {
                var param = subSegment.substring(1, subSegment.length - 1);
                var optional = param.slice(-1) === '?';
                var splat = param.slice(0, 1) === '*';
                var name = optional ? param.slice(0, -1) : param;
                name = splat ? name.slice(1) : name;
                this.params.push({ name: name, splat: splat });
                this.optional = this.optional && optional && this.path.length === subSegment.length;
                if (this.path.length === subSegment.length)
                    optional = this.optional;
                this.subSegments.push({ name: name, param: true, splat: splat, optional: optional });
                var subPattern = !splat ? '[^/]+' : '.+';
                this.pattern += !this.optional ? `(${subPattern})` : `(\/${subPattern})`;
                this.pattern += optional ? '?' : '';
            }
            else {
                this.optional = false;
                this.subSegments.push({ name: subSegment, param: false, splat: false, optional: false });
                this.pattern += subSegment.replace(this.escapePattern, '\\$&');
            }
        }
        if (!this.optional)
            this.pattern = '\/' + this.pattern;
    }
    build(data, defaults, urlEncode) {
        var routePath = '';
        var blank = false;
        var optional = false;
        for (var i = 0; i < this.subSegments.length; i++) {
            var subSegment = this.subSegments[i];
            if (!subSegment.param) {
                routePath += subSegment.name;
            }
            else {
                var val = data[subSegment.name];
                var defaultVal = defaults[subSegment.name];
                optional = subSegment.optional && (!val || val === defaultVal);
                if (this.optional || !optional) {
                    val = val || defaultVal;
                    blank = blank || !val;
                    if (val) {
                        if (!subSegment.splat || typeof val === 'string') {
                            routePath += urlEncode(subSegment.name, val);
                        }
                        else {
                            var encodedVals = [];
                            for (var i = 0; i < val.length; i++)
                                encodedVals[i] = urlEncode(subSegment.name, val[i]);
                            routePath += encodedVals.join('/');
                        }
                    }
                }
            }
        }
        return { path: !blank ? routePath : null, optional: optional && this.optional };
    }
}

class Route {
    constructor(path, defaults) {
        this.segments = [];
        this.params = [];
        this.path = path;
        this.defaults = defaults ? defaults : {};
        this.parse();
    }
    parse() {
        var subPaths = this.path.split('/').reverse();
        var segment;
        var pattern = '';
        for (var i = 0; i < subPaths.length; i++) {
            segment = new Segment(subPaths[i], segment ? segment.optional : true, this.defaults);
            this.segments.unshift(segment);
            pattern = segment.pattern + pattern;
            var params = [];
            for (var j = 0; j < segment.params.length; j++) {
                var param = segment.params[j];
                params.push({ name: param.name, optional: segment.optional, splat: param.splat });
            }
            this.params = params.concat(this.params);
        }
        this.pattern = new RegExp('^' + pattern + '$', 'i');
    }
    match(path, urlDecode) {
        var matches = this.pattern.exec(path);
        if (!matches)
            return null;
        var data = {};
        for (var i = 1; i < matches.length; i++) {
            var param = this.params[i - 1];
            if (matches[i]) {
                var val = !param.optional ? matches[i] : matches[i].substring(1);
                if (val.indexOf('/') === -1) {
                    data[param.name] = urlDecode(this, param.name, val);
                }
                else {
                    var vals = val.split('/');
                    var decodedVals = [];
                    for (var j = 0; j < vals.length; j++)
                        decodedVals[j] = urlDecode(this, param.name, vals[j]);
                    data[param.name] = decodedVals;
                }
            }
        }
        return data;
    }
    build(data, urlEncode) {
        data = data || {};
        var route = '';
        var optional = true;
        var blank = false;
        for (var i = this.segments.length - 1; i >= 0; i--) {
            var segment = this.segments[i];
            var pathInfo = segment.build(data, this.defaults, (name, val) => {
                var encodedValue = urlEncode(this, name, val);
                blank = blank || !encodedValue;
                return encodedValue;
            });
            if (blank)
                return null;
            optional = optional && pathInfo.optional;
            if (!optional) {
                if (pathInfo.path == null)
                    return null;
                route = '/' + pathInfo.path + route;
            }
        }
        return route.length !== 0 ? route : '/';
    }
}

class Router {
    constructor() {
        this.routes = [];
    }
    addRoute(path, defaults) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = path.substring(0, 1) === '/' ? path.substring(1) : path;
        var route = new Route(path, defaults);
        this.routes.push(route);
        return route;
    }
    match(path, fromRoute, urlDecode) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = (path.substring(0, 1) === '/' || path.length === 0) ? path : '/' + path;
        var startMatching = !fromRoute;
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            if (startMatching) {
                var data = route.match(path, urlDecode);
                if (data)
                    return { route: route, data: data };
            }
            else {
                startMatching = route === fromRoute;
            }
        }
        return null;
    }
    sort(compare) {
        this.routes.sort(compare);
    }
}

class StateRouter {
    getData(path, fromRoute) {
        var match = this.router.match(path, fromRoute, StateRouter.urlDecode);
        if (!match)
            return null;
        var separableData = {};
        var { route, route: { _splat: splat, _state: state, params }, data } = match;
        if (splat) {
            for (var i = 0; i < params.length; i++) {
                var param = params[i];
                if (param.splat)
                    separableData[param.name] = true;
            }
        }
        return { state, data, separableData, route };
    }
    getRoute(state, data, arrayData = {}) {
        var routeInfo = state['_routeInfo'];
        var paramsKey = '';
        for (var key in routeInfo.params) {
            if (data[key])
                paramsKey += routeInfo.params[key] + ',';
        }
        paramsKey = paramsKey.slice(0, -1);
        var routeMatch = routeInfo.matches[paramsKey];
        var routePath = null;
        if (routeMatch) {
            var combinedData = StateRouter.getCombinedData(routeMatch.route, data, arrayData);
            routePath = routeMatch.route.build(combinedData, StateRouter.urlEncode);
        }
        else {
            var bestMatch = StateRouter.findBestMatch(routeInfo.routes, data, arrayData);
            if (bestMatch) {
                routePath = bestMatch.routePath;
                routeMatch = { route: bestMatch.route, data: bestMatch.data };
                routeInfo.matches[paramsKey] = routeMatch;
            }
        }
        return { route: routePath, data: routeMatch ? routeMatch.data : {} };
    }
    static findBestMatch(routes, data, arrayData) {
        var bestMatch;
        var bestMatchCount = -1;
        var bestMatchParamCount = -1;
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var combinedData = StateRouter.getCombinedData(route, data, arrayData);
            var routePath = route.build(combinedData, StateRouter.urlEncode);
            if (routePath) {
                var count = 0;
                var routeData = {};
                for (var j = 0; j < route.params.length; j++) {
                    if (combinedData[route.params[j].name]) {
                        routeData[route.params[j].name] = {};
                        count++;
                    }
                }
                if (count > bestMatchCount || (count === bestMatchCount && route.params.length < bestMatchParamCount)) {
                    bestMatch = { route: route, data: routeData, routePath: routePath };
                    bestMatchCount = count;
                    bestMatchParamCount = route.params.length;
                }
            }
        }
        return bestMatch;
    }
    static getCombinedData(route, data, arrayData) {
        if (!route['_splat'])
            return data;
        var combinedData = {};
        for (var key in data)
            combinedData[key] = data[key];
        for (var i = 0; i < route.params.length; i++) {
            var param = route.params[i];
            var arr = arrayData[param.name];
            if (param.splat && arr)
                combinedData[param.name] = arr;
        }
        return combinedData;
    }
    static urlEncode(route, name, val) {
        var state = route['_state'];
        return state.urlEncode(state, name, val, false);
    }
    static urlDecode(route, name, val) {
        var state = route['_state'];
        return state.urlDecode(state, name, val, false);
    }
    addRoutes(states) {
        this.router = new Router();
        for (var i = 0; i < states.length; i++) {
            this.addStateRoutes(states[i]);
        }
    }
    addStateRoutes(state) {
        var routeInfo = { routes: [], params: {}, matches: {} };
        var count = 0;
        var routes = StateRouter.getRoutes(state);
        for (var i = 0; i < routes.length; i++) {
            var route = this.router.addRoute(routes[i], state.formattedDefaults);
            var splat = false;
            for (var j = 0; j < route.params.length; j++) {
                var param = route.params[j];
                if (!routeInfo.params[param.name]) {
                    routeInfo.params[param.name] = count;
                    count++;
                }
                splat = splat || param.splat;
            }
            routeInfo.routes.push(route);
            route['_state'] = state;
            route['_splat'] = splat;
            route.defaults = StateRouter.getCombinedData(route, state.formattedDefaults, state.formattedArrayDefaults);
        }
        state['_routeInfo'] = routeInfo;
    }
    static getRoutes(state) {
        var routes = [];
        var route = state.route;
        if (typeof route === 'string') {
            routes = routes.concat(StateRouter.expandRoute(route));
        }
        else {
            for (var i = 0; i < route.length; i++) {
                routes = routes.concat(StateRouter.expandRoute(route[i]));
            }
        }
        return routes;
    }
    static expandRoute(route) {
        var routes = [];
        var subRoutes = route.split('+');
        var expandedRoute = '';
        for (var i = 0; i < subRoutes.length; i++) {
            expandedRoute += subRoutes[i];
            routes.push(expandedRoute);
        }
        return routes;
    }
}

class StateHandler {
    constructor() {
        this.navigationDataManager = new NavigationDataManager();
        this.router = new StateRouter();
    }
    buildStates(states) {
        var builtStates = [];
        var stateKeys = {};
        for (var i = 0; i < states.length; i++) {
            var stateObject = states[i];
            var state = new State();
            for (var key in stateObject)
                state[key] = stateObject[key];
            if (!state.key)
                throw new Error('State key is mandatory');
            if (state.route == null)
                state.route = state.key;
            if (state.trackCrumbTrail) {
                state.trackCrumbTrail = true;
                state.crumbTrailKey = 'crumb';
                var trackCrumbTrail = stateObject.trackCrumbTrail;
                if (typeof trackCrumbTrail === 'string')
                    state.crumbTrailKey = trackCrumbTrail;
                state.defaultTypes[state.crumbTrailKey] = 'stringarray';
            }
            for (var key in state.defaults) {
                if (!state.defaultTypes[key])
                    state.defaultTypes[key] = this.navigationDataManager.getConverter(state.defaults[key]).name;
                var formattedData = this.navigationDataManager.formatURLObject(key, state.defaults[key], state);
                state.formattedDefaults[key] = formattedData.val;
                if (formattedData.arrayVal)
                    state.formattedArrayDefaults[key] = formattedData.arrayVal;
            }
            if (stateKeys[state.key])
                throw new Error('A State with key ' + state.key + ' already exists');
            stateKeys[state.key] = true;
            builtStates.push(state);
        }
        this.router.addRoutes(builtStates);
        return builtStates;
    }
    getLink(state, navigationData, hash, crumbs, nextCrumb) {
        var crumbTrail = [];
        if (crumbs) {
            crumbs = crumbs.slice();
            if (nextCrumb)
                crumbs.push(nextCrumb);
            crumbs = state.truncateCrumbTrail(state, Object.assign(Object.assign({}, state.defaults), navigationData), crumbs);
            for (var i = 0; i < crumbs.length; i++)
                crumbTrail.push(crumbs[i].crumblessUrl);
        }
        return this.getNavigationLink(state, navigationData, hash, crumbTrail);
    }
    getNavigationLink(state, navigationData, hash, crumbTrail) {
        var { data, arrayData } = this.navigationDataManager.formatData(state, navigationData, crumbTrail);
        var routeInfo = this.router.getRoute(state, data, arrayData);
        if (routeInfo.route == null)
            return null;
        var query = [];
        for (var key in data) {
            if (!routeInfo.data[key]) {
                var arr = arrayData[key];
                if (!arr) {
                    var encodedKey = state.urlEncode(state, null, key, true);
                    var encodedValue = state.urlEncode(state, key, data[key], true);
                    query.push(encodedKey + (encodedValue ? '=' + encodedValue : ''));
                }
                else {
                    for (var i = 0; i < arr.length; i++) {
                        var encodedKey = state.urlEncode(state, null, key, true, i);
                        var encodedValue = state.urlEncode(state, key, arr[i], true);
                        query.push(encodedKey + (encodedValue ? '=' + encodedValue : ''));
                    }
                }
            }
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        if (hash)
            routeInfo.route += '#' + hash;
        return routeInfo.route;
    }
    parseLink(url, fromRoute, err = '') {
        var hashIndex = url.indexOf('#');
        var pathAndQuery = hashIndex < 0 ? url : url.substring(0, hashIndex);
        var queryIndex = pathAndQuery.indexOf('?');
        var path = queryIndex < 0 ? pathAndQuery : pathAndQuery.substring(0, queryIndex);
        var query = queryIndex >= 0 ? pathAndQuery.substring(queryIndex + 1) : null;
        var match = this.router.getData(path, fromRoute);
        if (!match)
            throw new Error('The Url ' + url + ' is invalid' + (err || '\nNo match found'));
        var { state, data, separableData, route } = match;
        try {
            var navigationData = this.getNavigationData(query, state, data || {}, separableData);
        }
        catch (e) {
            err += '\n' + e.message;
        }
        if (navigationData) {
            var hash = hashIndex >= 0 ? url.substring(hashIndex + 1) : null;
            return Object.assign(Object.assign({}, navigationData), { hash });
        }
        return this.parseLink(url, route, err);
    }
    getNavigationData(query, state, data, separableData) {
        if (query) {
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                var key = state.urlDecode(state, null, param[0], true);
                var val = state.urlDecode(state, key, param[1] || '', true);
                separableData[key] = true;
                var arr = data[key];
                if (!arr) {
                    data[key] = val;
                }
                else {
                    if (typeof arr === 'string')
                        data[key] = arr = [arr];
                    arr.push(val);
                }
            }
        }
        data = this.navigationDataManager.parseData(data, state, separableData);
        var crumbTrail = data[state.crumbTrailKey];
        delete data[state.crumbTrailKey];
        var valid = state.validate(data);
        if (valid) {
            data[state.crumbTrailKey] = this.getCrumbs(crumbTrail);
            return { state, data };
        }
        return null;
    }
    getCrumbs(crumbTrail) {
        var crumbs = [];
        var len = crumbTrail ? crumbTrail.length : 0;
        for (var i = 0; i < len; i++) {
            var crumblessUrl = crumbTrail[i];
            if (crumblessUrl.substring(0, 1) !== '/')
                crumblessUrl = '/' + crumblessUrl;
            var { state, data, hash } = this.parseLink(crumblessUrl);
            delete data[state.crumbTrailKey];
            var url = this.getNavigationLink(state, data, hash, crumbTrail.slice(0, i));
            crumbs.push(new Crumb(data, state, url, crumblessUrl, i + 1 === len, hash));
        }
        return crumbs;
    }
}

class StateNavigator {
    constructor(stateInfos, historyManager) {
        this.stateHandler = new StateHandler();
        this.onBeforeNavigateCache = new EventHandlerCache('beforeNavigateHandler');
        this.onNavigateCache = new EventHandlerCache('navigateHandler');
        this.rewriteCache = { rewrites: {} };
        this.stateContext = new StateContext();
        this.states = {};
        this.onBeforeNavigate = (handler) => this.onBeforeNavigateCache.onEvent(handler);
        this.offBeforeNavigate = (handler) => this.onBeforeNavigateCache.offEvent(handler);
        this.onNavigate = (handler) => this.onNavigateCache.onEvent(handler);
        this.offNavigate = (handler) => this.onNavigateCache.offEvent(handler);
        if (stateInfos)
            this.configure(stateInfos, historyManager);
    }
    configure(stateInfos, historyManager) {
        if (this.historyManager)
            this.historyManager.stop();
        this.historyManager = historyManager ? historyManager : new HashHistoryManager();
        this.historyManager.init((url = this.historyManager.getCurrentUrl()) => {
            this.navigateLink(url, undefined, true);
        }, (url) => this.rewriteCache.rewrites[url]);
        if (this.isStateInfos(stateInfos)) {
            var states = this.stateHandler.buildStates(stateInfos);
            this.states = {};
            for (var i = 0; i < states.length; i++)
                this.states[states[i].key] = states[i];
        }
        else {
            this.stateHandler = stateInfos.stateHandler;
            this.states = stateInfos.states;
            this.rewriteCache = stateInfos.rewriteCache;
        }
    }
    isStateInfos(stateInfos) {
        return !stateInfos.stateHandler;
    }
    ;
    createStateContext(state, data, hash, crumbs, url, asyncData, history, historyAction, currentContext) {
        var stateContext = new StateContext();
        stateContext.oldState = currentContext.state;
        stateContext.oldData = currentContext.data;
        stateContext.oldHash = currentContext.hash;
        stateContext.oldUrl = currentContext.url;
        stateContext.state = state;
        stateContext.url = url;
        stateContext.asyncData = asyncData;
        stateContext.title = state.title;
        stateContext.history = history;
        stateContext.historyAction = historyAction;
        stateContext.crumbs = crumbs;
        stateContext.data = data;
        stateContext.hash = hash;
        stateContext.nextCrumb = new Crumb(data, state, url, this.stateHandler.getLink(state, data, hash), false, hash);
        if (stateContext.crumbs.length > 0) {
            var previousStateCrumb = stateContext.crumbs.slice(-1)[0];
            stateContext.previousState = previousStateCrumb.state;
            stateContext.previousData = previousStateCrumb.data;
            stateContext.previousHash = previousStateCrumb.hash;
            stateContext.previousUrl = previousStateCrumb.url;
        }
        return stateContext;
    }
    navigate(stateKey, navigationData, historyAction) {
        var url = this.getNavigationLink(stateKey, navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }
    getNavigationLink(stateKey, navigationData, hash) {
        if (!this.states[stateKey])
            throw new Error(stateKey + ' is not a valid State');
        var { crumbs, nextCrumb } = this.stateContext;
        var url = this.stateHandler.getLink(this.states[stateKey], navigationData, hash, crumbs, nextCrumb);
        this.rewrite(url, this.states[stateKey], navigationData, crumbs, nextCrumb);
        return url;
    }
    canNavigateBack(distance) {
        return distance <= this.stateContext.crumbs.length && distance > 0;
    }
    navigateBack(distance, historyAction) {
        var url = this.getNavigationBackLink(distance);
        this.navigateLink(url, historyAction);
    }
    getNavigationBackLink(distance) {
        if (!this.canNavigateBack(distance))
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.stateContext.crumbs.length + ')');
        var { url, state, data } = this.stateContext.crumbs[this.stateContext.crumbs.length - distance];
        this.rewrite(url, state, data, this.stateContext.crumbs.slice(0, this.stateContext.crumbs.length - distance));
        return url;
    }
    refresh(navigationData, historyAction) {
        var url = this.getRefreshLink(navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }
    getRefreshLink(navigationData, hash) {
        var { crumbs } = this.stateContext;
        var url = this.stateHandler.getLink(this.stateContext.state, navigationData, hash, crumbs);
        this.rewrite(url, this.stateContext.state, navigationData, crumbs);
        return url;
    }
    navigateLink(url, historyAction = 'add', history = false, suspendNavigation = (_, resumeNavigation) => resumeNavigation(), currentContext = this.stateContext) {
        if (history && this.stateContext.url === url)
            return;
        var context = this.stateContext;
        var { state, data, hash, crumbs } = this.parseLink(url);
        for (var id in this.onBeforeNavigateCache.handlers) {
            var handler = this.onBeforeNavigateCache.handlers[id];
            if (context !== this.stateContext || !handler(state, data, url, history, currentContext))
                return;
        }
        var navigateContinuation = (asyncData) => {
            var nextContext = this.createStateContext(state, data, hash, crumbs, url, asyncData, history, historyAction, currentContext);
            if (context === this.stateContext) {
                suspendNavigation(nextContext, () => {
                    if (context === this.stateContext)
                        this.resumeNavigation(nextContext);
                });
            }
        };
        var unloadContinuation = () => {
            if (context === this.stateContext)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (currentContext.state)
            currentContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    }
    resumeNavigation(stateContext) {
        this.stateContext = stateContext;
        var { oldState, state, data, asyncData, url, crumbs, history, historyAction } = stateContext;
        this.rewriteCache.rewrites = {};
        this.rewrite(url, state, data, crumbs);
        if (this.stateContext.oldState && this.stateContext.oldState !== state)
            this.stateContext.oldState.dispose();
        state.navigated(this.stateContext.data, asyncData);
        for (var id in this.onNavigateCache.handlers) {
            if (stateContext === this.stateContext)
                this.onNavigateCache.handlers[id](oldState, state, data, asyncData, stateContext);
        }
        if (stateContext === this.stateContext) {
            if (!history && historyAction !== 'none')
                this.historyManager.addHistory(url, historyAction === 'replace', this.stateContext);
            if (this.stateContext.title && (typeof document !== 'undefined'))
                document.title = this.stateContext.title;
        }
    }
    rewrite(url, state, navigationData, crumbs, nextCrumb) {
        var _a;
        if (url && !this.rewriteCache.rewrites[url]) {
            navigationData = Object.assign(Object.assign({}, state.defaults), navigationData);
            var rewrittenNavigation = (_a = state.rewriteNavigation) === null || _a === void 0 ? void 0 : _a.call(state, navigationData);
            if (rewrittenNavigation) {
                if (crumbs) {
                    crumbs = crumbs.slice();
                    if (nextCrumb)
                        crumbs.push(nextCrumb);
                    crumbs = state.truncateCrumbTrail(state, navigationData, crumbs);
                }
                crumbs = state.trackCrumbTrail ? crumbs : [];
                var { stateKey, navigationData, hash } = rewrittenNavigation;
                state = this.states[stateKey];
                if (state) {
                    var rewrittenUrl = this.stateHandler.getLink(state, navigationData, hash, crumbs);
                    if (rewrittenUrl) {
                        this.rewriteCache.rewrites[url] = rewrittenUrl;
                    }
                }
            }
        }
    }
    parseLink(url) {
        var { state, data, hash } = this.stateHandler.parseLink(url);
        var _a = data, _b = state.crumbTrailKey, crumbs = _a[_b], data = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return { state, data, hash, crumbs };
    }
    fluent(withContext = false) {
        var stateContext = !withContext ? undefined : this.stateContext;
        return createFluentNavigator(this.states, this.stateHandler, stateContext, this.rewrite.bind(this));
    }
    start(url, serverRendered = false) {
        var _a;
        if (url == null && serverRendered && !this.historyManager.disabled && ((_a = window.history.state) === null || _a === void 0 ? void 0 : _a.navigationLink)) {
            delete window.history.state.navigationLink;
            window.history.replaceState(window.history.state, null);
        }
        this.navigateLink(url != null ? url : this.historyManager.getCurrentUrl());
    }
    ;
}

exports.Crumb = Crumb;
exports.HTML5HistoryManager = HTML5HistoryManager;
exports.HashHistoryManager = HashHistoryManager;
exports.State = State;
exports.StateContext = StateContext;
exports.StateNavigator = StateNavigator;
