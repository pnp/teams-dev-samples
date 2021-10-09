(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TeamsFx = {}));
}(this, (function (exports) {
    'use strict';

    // Copyright (c) Microsoft Corporation.
    // Licensed under the MIT license.
    /**
     * Error code to trace the error types.
     * @beta
     */
    exports.ErrorCode = void 0;
    (function (ErrorCode) {
        /**
         * Invalid parameter error.
         */
        ErrorCode["InvalidParameter"] = "InvalidParameter";
        /**
         * Invalid configuration error.
         */
        ErrorCode["InvalidConfiguration"] = "InvalidConfiguration";
        /**
         * Internal error.
         */
        ErrorCode["InternalError"] = "InternalError";
        /**
         * Channel is not supported error.
         */
        ErrorCode["ChannelNotSupported"] = "ChannelNotSupported";
        /**
         * Runtime is not supported error.
         */
        ErrorCode["RuntimeNotSupported"] = "RuntimeNotSupported";
        /**
         * User failed to finish the AAD consent flow failed.
         */
        ErrorCode["ConsentFailed"] = "ConsentFailed";
        /**
         * The user or administrator has not consented to use the application error.
         */
        ErrorCode["UiRequiredError"] = "UiRequiredError";
        /**
         * Token is not within its valid time range error.
         */
        ErrorCode["TokenExpiredError"] = "TokenExpiredError";
        /**
         * Call service (AAD or simple authentication server) failed.
         */
        ErrorCode["ServiceError"] = "ServiceError";
        /**
         * Operation failed.
         */
        ErrorCode["FailedOperation"] = "FailedOperation";
    })(exports.ErrorCode || (exports.ErrorCode = {}));
    /**
     * @internal
     */
    class ErrorMessage {
    }
    // InvalidConfiguration Error
    ErrorMessage.InvalidConfiguration = "{0} in configuration is invalid: {1}.";
    ErrorMessage.ConfigurationNotExists = "Configuration does not exist. {0}";
    ErrorMessage.ResourceConfigurationNotExists = "{0} resource configuration does not exist.";
    ErrorMessage.MissingResourceConfiguration = "Missing resource configuration with type: {0}, name: {1}.";
    ErrorMessage.AuthenticationConfigurationNotExists = "Authentication configuration does not exist.";
    // RuntimeNotSupported Error
    ErrorMessage.BrowserRuntimeNotSupported = "{0} is not supported in browser.";
    ErrorMessage.NodejsRuntimeNotSupported = "{0} is not supported in Node.";
    // Internal Error
    ErrorMessage.FailToAcquireTokenOnBehalfOfUser = "Failed to acquire access token on behalf of user: {0}";
    // ChannelNotSupported Error
    ErrorMessage.OnlyMSTeamsChannelSupported = "{0} is only supported in MS Teams Channel";
    /**
     * Error class with code and message thrown by the SDK.
     *
     * @beta
     */
    class ErrorWithCode extends Error {
        /**
         * Constructor of ErrorWithCode.
         *
         * @param {string} message - error message.
         * @param {ErrorCode} code - error code.
         *
         * @beta
         */
        constructor(message, code) {
            if (!code) {
                super(message);
                return;
            }
            super(message);
            Object.setPrototypeOf(this, ErrorWithCode.prototype);
            this.name = `${new.target.name}.${code}`;
            this.code = code;
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter$1(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function e(e) { this.message = e; } e.prototype = new Error, e.prototype.name = "InvalidCharacterError"; var r = "undefined" != typeof window && window.atob && window.atob.bind(window) || function (r) { var t = String(r).replace(/=+$/, ""); if (t.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded."); for (var n, o, a = 0, i = 0, c = ""; o = t.charAt(i++); ~o && (n = a % 4 ? 64 * n + o : o, a++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * a & 6)) : 0)o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o); return c }; function t(e) { var t = e.replace(/-/g, "+").replace(/_/g, "/"); switch (t.length % 4) { case 0: break; case 2: t += "=="; break; case 3: t += "="; break; default: throw "Illegal base64url string!" }try { return function (e) { return decodeURIComponent(r(e).replace(/(.)/g, (function (e, r) { var t = r.charCodeAt(0).toString(16).toUpperCase(); return t.length < 2 && (t = "0" + t), "%" + t }))) }(t) } catch (e) { return r(t) } } function n(e) { this.message = e; } function o(e, r) { if ("string" != typeof e) throw new n("Invalid token specified"); var o = !0 === (r = r || {}).header ? 0 : 1; try { return JSON.parse(t(e.split(".")[o])) } catch (e) { throw new n("Invalid token specified: " + e.message) } } n.prototype = new Error, n.prototype.name = "InvalidTokenError";

    // Copyright (c) Microsoft Corporation.
    // Licensed under the MIT license.
    /**
     * Log level.
     *
     * @beta
     */
    exports.LogLevel = void 0;
    (function (LogLevel) {
        /**
         * Show verbose, information, warning and error message.
         */
        LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
        /**
         * Show information, warning and error message.
         */
        LogLevel[LogLevel["Info"] = 1] = "Info";
        /**
         * Show warning and error message.
         */
        LogLevel[LogLevel["Warn"] = 2] = "Warn";
        /**
         * Show error message.
         */
        LogLevel[LogLevel["Error"] = 3] = "Error";
    })(exports.LogLevel || (exports.LogLevel = {}));
    /**
     * Update log level helper.
     *
     * @param { LogLevel } level - log level in configuration
     *
     * @beta
     */
    function setLogLevel$1(level) {
        internalLogger.level = level;
    }
    /**
     * Get log level.
     *
     * @returns Log level
     *
     * @beta
     */
    function getLogLevel() {
        return internalLogger.level;
    }
    class InternalLogger {
        constructor() {
            this.level = undefined;
            this.defaultLogger = {
                verbose: console.debug,
                info: console.info,
                warn: console.warn,
                error: console.error,
            };
        }
        error(message) {
            this.log(exports.LogLevel.Error, (x) => x.error, message);
        }
        warn(message) {
            this.log(exports.LogLevel.Warn, (x) => x.warn, message);
        }
        info(message) {
            this.log(exports.LogLevel.Info, (x) => x.info, message);
        }
        verbose(message) {
            this.log(exports.LogLevel.Verbose, (x) => x.verbose, message);
        }
        log(logLevel, logFunction, message) {
            if (message.trim() === "") {
                return;
            }
            const timestamp = new Date().toUTCString();
            const logHeader = `[${timestamp}] : @microsoft/teamsfx : ${exports.LogLevel[logLevel]} - `;
            const logMessage = `${logHeader}${message}`;
            if (this.level !== undefined && this.level <= logLevel) {
                if (this.customLogger) {
                    logFunction(this.customLogger)(logMessage);
                }
                else if (this.customLogFunction) {
                    this.customLogFunction(logLevel, logMessage);
                }
                else {
                    logFunction(this.defaultLogger)(logMessage);
                }
            }
        }
    }
    /**
     * Logger instance used internally
     *
     * @internal
     */
    const internalLogger = new InternalLogger();
    /**
     * Set custom logger. Use the output functions if it's set. Priority is higher than setLogFunction.
     *
     * @param {Logger} logger - custom logger. If it's undefined, custom logger will be cleared.
     *
     * @example
     * ```typescript
     * setLogger({
     *   verbose: console.debug,
     *   info: console.info,
     *   warn: console.warn,
     *   error: console.error,
     * });
     * ```
     *
     * @beta
     */
    function setLogger(logger) {
        internalLogger.customLogger = logger;
    }
    /**
     * Set custom log function. Use the function if it's set. Priority is lower than setLogger.
     *
     * @param {LogFunction} logFunction - custom log function. If it's undefined, custom log function will be cleared.
     *
     * @example
     * ```typescript
     * setLogFunction((level: LogLevel, message: string) => {
     *   if (level === LogLevel.Error) {
     *     console.log(message);
     *   }
     * });
     * ```
     *
     * @beta
     */
    function setLogFunction(logFunction) {
        internalLogger.customLogFunction = logFunction;
    }

    // Copyright (c) Microsoft Corporation.
    /**
     * Parse jwt token payload
     *
     * @param token
     *
     * @returns Payload object
     *
     * @internal
     */
    function parseJwt(token) {
        try {
            const tokenObj = o(token);
            if (!tokenObj || !tokenObj.exp) {
                throw new ErrorWithCode("Decoded token is null or exp claim does not exists.", exports.ErrorCode.InternalError);
            }
            return tokenObj;
        }
        catch (err) {
            const errorMsg = "Parse jwt token failed in node env with error: " + err.message;
            internalLogger.error(errorMsg);
            throw new ErrorWithCode(errorMsg, exports.ErrorCode.InternalError);
        }
    }
    /**
     * @internal
     */
    function getUserInfoFromSsoToken(ssoToken) {
        if (!ssoToken) {
            const errorMsg = "SSO token is undefined.";
            internalLogger.error(errorMsg);
            throw new ErrorWithCode(errorMsg, exports.ErrorCode.InvalidParameter);
        }
        const tokenObject = parseJwt(ssoToken);
        const userInfo = {
            displayName: tokenObject.name,
            objectId: tokenObject.oid,
            preferredUserName: "",
        };
        if (tokenObject.ver === "2.0") {
            userInfo.preferredUserName = tokenObject.preferred_username;
        }
        else if (tokenObject.ver === "1.0") {
            userInfo.preferredUserName = tokenObject.upn;
        }
        return userInfo;
    }
    /**
     * Format string template with replacements
     *
     * ```typescript
     * const template = "{0} and {1} are fruit. {0} is my favorite one."
     * const formattedStr = formatString(template, "apple", "pear"); // formattedStr: "apple and pear are fruit. apple is my favorite one."
     * ```
     *
     * @param str string template
     * @param replacements replacement string array
     * @returns Formatted string
     *
     * @internal
     */
    function formatString(str, ...replacements) {
        const args = replacements;
        return str.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    }
    /**
     * @internal
     */
    function validateScopesType(value) {
        // string
        if (typeof value === "string" || value instanceof String) {
            return;
        }
        // empty array
        if (Array.isArray(value) && value.length === 0) {
            return;
        }
        // string array
        if (Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string")) {
            return;
        }
        const errorMsg = "The type of scopes is not valid, it must be string or string array";
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(errorMsg, exports.ErrorCode.InvalidParameter);
    }

    // Copyright (c) Microsoft Corporation.
    /**
     * Represent Microsoft 365 tenant identity, and it is usually used when user is not involved.
     *
     * @remarks
     * Only works in in server side.
     *
     * @beta
     */
    class M365TenantCredential {
        /**
         * Constructor of M365TenantCredential.
         *
         * @remarks
         * Only works in in server side.
         * @beta
         */
        constructor() {
            throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "M365TenantCredential"), exports.ErrorCode.RuntimeNotSupported);
        }
        /**
         * Get access token for credential.
         *
         * @remarks
         * Only works in in server side.
         * @beta
         */
        getToken(scopes, options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "M365TenantCredential"), exports.ErrorCode.RuntimeNotSupported);
            });
        }
    }

    // Copyright (c) Microsoft Corporation.
    /**
     * Represent on-behalf-of flow to get user identity, and it is designed to be used in Azure Function or Bot scenarios.
     *
     * @remarks
     * Can only be used in server side.
     *
     * @beta
     */
    class OnBehalfOfUserCredential {
        /**
         * Constructor of OnBehalfOfUserCredential
         *
         * @remarks
         * Can Only works in in server side.
         * @beta
         */
        constructor(ssoToken) {
            throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "OnBehalfOfUserCredential"), exports.ErrorCode.RuntimeNotSupported);
        }
        /**
         * Get access token from credential.
         * @remarks
         * Can only be used in server side.
         * @beta
         */
        getToken(scopes, options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "OnBehalfOfUserCredential"), exports.ErrorCode.RuntimeNotSupported);
            });
        }
        /**
         * Get basic user info from SSO token.
         * @remarks
         * Can only be used in server side.
         * @beta
         */
        getUserInfo() {
            throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "OnBehalfOfUserCredential"), exports.ErrorCode.RuntimeNotSupported);
        }
    }

    // Copyright (c) Microsoft Corporation.
    // Licensed under the MIT license.
    /**
     * Configuration used in initialization.
     * @internal
     */
    class Cache {
        static get(key) {
            return sessionStorage.getItem(key);
        }
        static set(key, value) {
            sessionStorage.setItem(key, value);
        }
        static remove(key) {
            sessionStorage.removeItem(key);
        }
        static clear() {
            sessionStorage.clear();
        }
    }

    function unwrapExports(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, basedir, module) {
        return module = {
            path: basedir,
            exports: {},
            require: function (path, base) {
                return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
            }
        }, fn(module, module.exports), module.exports;
    }

    function commonjsRequire() {
        throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var MicrosoftTeams_min = createCommonjsModule(function (module, exports) {
        !function (e, n) { module.exports = n(); }(window, function () { return function (e) { var n = {}; function t(r) { if (n[r]) return n[r].exports; var i = n[r] = { i: r, l: !1, exports: {} }; return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports } return t.m = e, t.c = n, t.d = function (e, n, r) { t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: r }); }, t.r = function (e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }); }, t.t = function (e, n) { if (1 & n && (e = t(e)), 8 & n) return e; if (4 & n && "object" == typeof e && e && e.__esModule) return e; var r = Object.create(null); if (t.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: e }), 2 & n && "string" != typeof e) for (var i in e) t.d(r, i, function (n) { return e[n] }.bind(null, i)); return r }, t.n = function (e) { var n = e && e.__esModule ? function () { return e.default } : function () { return e }; return t.d(n, "a", n), n }, t.o = function (e, n) { return Object.prototype.hasOwnProperty.call(e, n) }, t.p = "", t(t.s = 19) }([function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(4), i = t(6), o = t(3), a = function () { return function () { } }(); n.Communication = a; var s = function () { function e() { } return e.parentMessageQueue = [], e.childMessageQueue = [], e.nextMessageId = 0, e.callbacks = {}, e }(); function l(e, n, t) { var r; n instanceof Function ? t = n : n instanceof Array && (r = n); var o = a.parentWindow, l = b(e, r); if (i.GlobalVars.isFramelessWindow) a.currentWindow && a.currentWindow.nativeInterface && a.currentWindow.nativeInterface.framelessPostMessage(JSON.stringify(l)); else { var u = C(o); o && u ? o.postMessage(l, u) : p(o).push(l); } t && (s.callbacks[l.id] = t); } function u(e) { if (e && e.data && "object" == typeof e.data) { var n = e.source || e.originalEvent && e.originalEvent.source, t = e.origin || e.originalEvent && e.originalEvent.origin; d(n, t) && (c(n, t), n === a.parentWindow ? f(e) : n === a.childWindow && g(e)); } } function d(e, n) { return (!a.currentWindow || e !== a.currentWindow) && (!!(a.currentWindow && a.currentWindow.location && n && n === a.currentWindow.location.origin) || !!(r.validOriginRegExp.test(n.toLowerCase()) || i.GlobalVars.additionalValidOriginsRegexp && i.GlobalVars.additionalValidOriginsRegexp.test(n.toLowerCase()))) } function c(e, n) { i.GlobalVars.isFramelessWindow || a.parentWindow && !a.parentWindow.closed && e !== a.parentWindow ? a.childWindow && !a.childWindow.closed && e !== a.childWindow || (a.childWindow = e, a.childOrigin = n) : (a.parentWindow = e, a.parentOrigin = n), a.parentWindow && a.parentWindow.closed && (a.parentWindow = null, a.parentOrigin = null), a.childWindow && a.childWindow.closed && (a.childWindow = null, a.childOrigin = null), h(a.parentWindow), h(a.childWindow); } function f(e) { if ("id" in e.data && "number" == typeof e.data.id) { var n = e.data, t = s.callbacks[n.id]; t && (t.apply(null, n.args.concat([n.isPartialResponse])), m(e) || delete s.callbacks[n.id]); } else if ("func" in e.data && "string" == typeof e.data.func) { n = e.data; o.callHandler(n.func, n.args); } } function m(e) { return !0 === e.data.isPartialResponse } function g(e) { if ("id" in e.data && "func" in e.data) { var n = e.data, t = o.callHandler(n.func, n.args), r = t[0], i = t[1]; r && void 0 !== i ? v(n.id, Array.isArray(i) ? i : [i]) : l(n.func, n.args, function () { for (var e = [], t = 0; t < arguments.length; t++)e[t] = arguments[t]; if (a.childWindow) { var r = e.pop(); v(n.id, e, r); } }); } } function p(e) { return e === a.parentWindow ? s.parentMessageQueue : e === a.childWindow ? s.childMessageQueue : [] } function C(e) { return e === a.parentWindow ? a.parentOrigin : e === a.childWindow ? a.childOrigin : null } function h(e) { for (var n = C(e), t = p(e); e && n && t.length > 0;)e.postMessage(t.shift(), n); } function v(e, n, t) { var r = a.childWindow, i = T(e, n, t), o = C(r); r && o && r.postMessage(i, o); } function b(e, n) { return { id: s.nextMessageId++, func: e, timestamp: Date.now(), args: n || [] } } function T(e, n, t) { return { id: e, args: n || [], isPartialResponse: t } } function w(e, n) { return { func: e, args: n || [] } } n.initializeCommunication = function (e, n) { s.messageListener = function (e) { return u(e) }, a.currentWindow = a.currentWindow || window, a.parentWindow = a.currentWindow.parent !== a.currentWindow.self ? a.currentWindow.parent : a.currentWindow.opener, (a.parentWindow || n) && a.currentWindow.addEventListener("message", s.messageListener, !1), a.parentWindow || (i.GlobalVars.isFramelessWindow = !0, window.onNativeMessage = f); try { a.parentOrigin = "*", l("initialize", [r.version], e); } finally { a.parentOrigin = null; } }, n.uninitializeCommunication = function () { a.currentWindow.removeEventListener("message", s.messageListener, !1), a.parentWindow = null, a.parentOrigin = null, a.childWindow = null, a.childOrigin = null, s.parentMessageQueue = [], s.childMessageQueue = [], s.nextMessageId = 0, s.callbacks = {}; }, n.sendMessageToParent = l, n.waitForMessageQueue = function (e, n) { var t = a.currentWindow.setInterval(function () { 0 === p(e).length && (clearInterval(t), n()); }, 100); }, n.sendMessageEventToChild = function (e, n) { var t = a.childWindow, r = w(e, n), i = C(t); t && i ? t.postMessage(r, i) : p(t).push(r); }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(4), i = t(6), o = t(5); n.ensureInitialized = function () { for (var e = [], n = 0; n < arguments.length; n++)e[n] = arguments[n]; if (!i.GlobalVars.initializeCalled) throw new Error("The library has not yet been initialized"); if (i.GlobalVars.frameContext && e && e.length > 0) { for (var t = !1, r = 0; r < e.length; r++)if (e[r] === i.GlobalVars.frameContext) { t = !0; break } if (!t) throw new Error("This call is not allowed in the '" + i.GlobalVars.frameContext + "' context") } }, n.isAPISupportedByPlatform = function (e) { void 0 === e && (e = r.defaultSDKVersionForCompatCheck); var n = o.compareSDKVersions(i.GlobalVars.clientSupportedSDKVersion, e); return !isNaN(n) && n >= 0 }, n.processAdditionalValidOrigins = function (e) { var n = i.GlobalVars.additionalValidOrigins.concat(e.filter(function (e) { return "string" == typeof e && r.userOriginUrlValidationRegExp.test(e) })), t = {}; n = n.filter(function (e) { return !t[e] && (t[e] = !0, !0) }), i.GlobalVars.additionalValidOrigins = n, i.GlobalVars.additionalValidOrigins.length > 0 ? i.GlobalVars.additionalValidOriginsRegexp = o.generateRegExpFromUrls(i.GlobalVars.additionalValidOrigins) : i.GlobalVars.additionalValidOriginsRegexp = null; }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }), function (e) { e.desktop = "desktop", e.web = "web", e.android = "android", e.ios = "ios", e.rigel = "rigel", e.surfaceHub = "surfaceHub"; }(n.HostClientType || (n.HostClientType = {})), function (e) { e.settings = "settings", e.content = "content", e.authentication = "authentication", e.remove = "remove", e.task = "task", e.sidePanel = "sidePanel", e.stage = "stage", e.meetingStage = "meetingStage"; }(n.FrameContexts || (n.FrameContexts = {})), function (e) { e[e.Standard = 0] = "Standard", e[e.Edu = 1] = "Edu", e[e.Class = 2] = "Class", e[e.Plc = 3] = "Plc", e[e.Staff = 4] = "Staff"; }(n.TeamType || (n.TeamType = {})), function (e) { e[e.Admin = 0] = "Admin", e[e.User = 1] = "User", e[e.Guest = 2] = "Guest"; }(n.UserTeamRole || (n.UserTeamRole = {})), function (e) { e.Large = "large", e.Medium = "medium", e.Small = "small"; }(n.TaskModuleDimension || (n.TaskModuleDimension = {})), function (e) { e.Regular = "Regular", e.Private = "Private", e.Shared = "Shared"; }(n.ChannelType || (n.ChannelType = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(8), i = t(0), o = function () { function e() { } return e.handlers = {}, e }(); function a(e) { o.themeChangeHandler && o.themeChangeHandler(e), i.Communication.childWindow && i.sendMessageEventToChild("themeChange", [e]); } function s() { o.backButtonPressHandler && o.backButtonPressHandler() || r.navigateBack(); } function l(e) { o.loadHandler && o.loadHandler(e), i.Communication.childWindow && i.sendMessageEventToChild("load", [e]); } function u() { var e = function () { i.sendMessageToParent("readyToUnload", []); }; o.beforeUnloadHandler && o.beforeUnloadHandler(e) || e(); } n.initializeHandlers = function () { o.handlers.themeChange = a, o.handlers.backButtonPress = s, o.handlers.load = l, o.handlers.beforeUnload = u; }, n.callHandler = function (e, n) { var t = o.handlers[e]; return t ? [!0, t.apply(this, n)] : [!1, void 0] }, n.registerHandler = function (e, n, t, r) { void 0 === t && (t = !0), void 0 === r && (r = []), n ? (o.handlers[e] = n, t && i.sendMessageToParent("registerHandler", [e].concat(r))) : delete o.handlers[e]; }, n.removeHandler = function (e) { delete o.handlers[e]; }, n.registerOnThemeChangeHandler = function (e) { o.themeChangeHandler = e, e && i.sendMessageToParent("registerHandler", ["themeChange"]); }, n.handleThemeChange = a, n.registerBackButtonHandler = function (e) { o.backButtonPressHandler = e, e && i.sendMessageToParent("registerHandler", ["backButton"]); }, n.registerOnLoadHandler = function (e) { o.loadHandler = e, e && i.sendMessageToParent("registerHandler", ["load"]); }, n.registerBeforeUnloadHandler = function (e) { o.beforeUnloadHandler = e, e && i.sendMessageToParent("registerHandler", ["beforeUnload"]); }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(5); n.version = "1.10.0", n.defaultSDKVersionForCompatCheck = "1.6.0", n.getUserJoinedTeamsSupportedAndroidClientVersion = "2.0.1", n.locationAPIsRequiredVersion = "1.9.0", n.peoplePickerRequiredVersion = "2.0.0", n.captureImageMobileSupportVersion = "1.7.0", n.mediaAPISupportVersion = "1.8.0", n.getMediaCallbackSupportVersion = "2.0.0", n.scanBarCodeAPIMobileSupportVersion = "1.9.0", n.validOrigins = ["https://teams.microsoft.com", "https://teams.microsoft.us", "https://gov.teams.microsoft.us", "https://dod.teams.microsoft.us", "https://int.teams.microsoft.com", "https://teams.live.com", "https://devspaces.skype.com", "https://ssauth.skype.com", "https://local.teams.live.com", "https://local.teams.live.com:8080", "https://local.teams.office.com", "https://local.teams.office.com:8080", "https://msft.spoppe.com", "https://*.sharepoint.com", "https://*.sharepoint-df.com", "https://*.sharepointonline.com", "https://outlook.office.com", "https://outlook-sdf.office.com", "https://*.teams.microsoft.com", "https://www.office.com", "https://word.office.com", "https://excel.office.com", "https://powerpoint.office.com", "https://www.officeppe.com", "https://*.www.office.com"], n.validOriginRegExp = r.generateRegExpFromUrls(n.validOrigins), n.userOriginUrlValidationRegExp = /^https\:\/\//; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(22); function i(e) { for (var n = "^", t = e.split("."), r = 0; r < t.length; r++)n += (r > 0 ? "[.]" : "") + t[r].replace("*", "[^/^.]+"); return n += "$" } n.generateRegExpFromUrls = function (e) { for (var n = "", t = 0; t < e.length; t++)n += (0 === t ? "" : "|") + i(e[t]); return new RegExp(n) }, n.getGenericOnCompleteHandler = function (e) { return function (n, t) { if (!n) throw new Error(e || t) } }, n.compareSDKVersions = function (e, n) { if ("string" != typeof e || "string" != typeof n) return NaN; var t = e.split("."), r = n.split("."); function i(e) { return /^\d+$/.test(e) } if (!t.every(i) || !r.every(i)) return NaN; for (; t.length < r.length;)t.push("0"); for (; r.length < t.length;)r.push("0"); for (var o = 0; o < t.length; ++o)if (Number(t[o]) != Number(r[o])) return Number(t[o]) > Number(r[o]) ? 1 : -1; return 0 }, n.generateGUID = function () { return r.v4() }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = function () { function e() { } return e.initializeCalled = !1, e.initializeCompleted = !1, e.additionalValidOrigins = [], e.additionalValidOriginsRegexp = null, e.initializeCallbacks = [], e.isFramelessWindow = !1, e.printCapabilityEnabled = !1, e }(); n.GlobalVars = r; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }), function (e) { e.Inline = "inline", e.Desktop = "desktop", e.Web = "web"; }(n.FileOpenPreference || (n.FileOpenPreference = {})), function (e) { e[e.NOT_SUPPORTED_ON_PLATFORM = 100] = "NOT_SUPPORTED_ON_PLATFORM", e[e.INTERNAL_ERROR = 500] = "INTERNAL_ERROR", e[e.NOT_SUPPORTED_IN_CURRENT_CONTEXT = 501] = "NOT_SUPPORTED_IN_CURRENT_CONTEXT", e[e.PERMISSION_DENIED = 1e3] = "PERMISSION_DENIED", e[e.NETWORK_ERROR = 2e3] = "NETWORK_ERROR", e[e.NO_HW_SUPPORT = 3e3] = "NO_HW_SUPPORT", e[e.INVALID_ARGUMENTS = 4e3] = "INVALID_ARGUMENTS", e[e.UNAUTHORIZED_USER_OPERATION = 5e3] = "UNAUTHORIZED_USER_OPERATION", e[e.INSUFFICIENT_RESOURCES = 6e3] = "INSUFFICIENT_RESOURCES", e[e.THROTTLE = 7e3] = "THROTTLE", e[e.USER_ABORT = 8e3] = "USER_ABORT", e[e.OPERATION_TIMED_OUT = 8001] = "OPERATION_TIMED_OUT", e[e.OLD_PLATFORM = 9e3] = "OLD_PLATFORM", e[e.FILE_NOT_FOUND = 404] = "FILE_NOT_FOUND", e[e.SIZE_EXCEEDED = 1e4] = "SIZE_EXCEEDED"; }(n.ErrorCode || (n.ErrorCode = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(25); n.appInitialization = r.appInitialization; var i = t(11); n.authentication = i.authentication; var o = t(2); n.FrameContexts = o.FrameContexts, n.HostClientType = o.HostClientType, n.TaskModuleDimension = o.TaskModuleDimension, n.TeamType = o.TeamType, n.UserTeamRole = o.UserTeamRole, n.ChannelType = o.ChannelType; var a = t(7); n.ErrorCode = a.ErrorCode, n.FileOpenPreference = a.FileOpenPreference; var s = t(26); n.enablePrintCapability = s.enablePrintCapability, n.executeDeepLink = s.executeDeepLink, n.getContext = s.getContext, n.getMruTabInstances = s.getMruTabInstances, n.getTabInstances = s.getTabInstances, n.initialize = s.initialize, n.initializeWithFrameContext = s.initializeWithFrameContext, n.print = s.print, n.registerBackButtonHandler = s.registerBackButtonHandler, n.registerBeforeUnloadHandler = s.registerBeforeUnloadHandler, n.registerChangeSettingsHandler = s.registerChangeSettingsHandler, n.registerFullScreenHandler = s.registerFullScreenHandler, n.registerOnLoadHandler = s.registerOnLoadHandler, n.registerOnThemeChangeHandler = s.registerOnThemeChangeHandler, n.registerAppButtonClickHandler = s.registerAppButtonClickHandler, n.registerAppButtonHoverEnterHandler = s.registerAppButtonHoverEnterHandler, n.registerAppButtonHoverLeaveHandler = s.registerAppButtonHoverLeaveHandler, n.setFrameContext = s.setFrameContext, n.shareDeepLink = s.shareDeepLink; var l = t(27); n.returnFocus = l.returnFocus, n.navigateBack = l.navigateBack, n.navigateCrossDomain = l.navigateCrossDomain, n.navigateToTab = l.navigateToTab; var u = t(12); n.settings = u.settings; var d = t(28); n.tasks = d.tasks; var c = t(16); n.ChildAppWindow = c.ChildAppWindow, n.ParentAppWindow = c.ParentAppWindow; var f = t(17); n.media = f.media; var m = t(29); n.location = m.location; var g = t(30); n.meeting = g.meeting; var p = t(31); n.people = p.people; }, function (e, n) { var t = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto); if (t) { var r = new Uint8Array(16); e.exports = function () { return t(r), r }; } else { var i = new Array(16); e.exports = function () { for (var e, n = 0; n < 16; n++)0 == (3 & n) && (e = 4294967296 * Math.random()), i[n] = e >>> ((3 & n) << 3) & 255; return i }; } }, function (e, n) { for (var t = [], r = 0; r < 256; ++r)t[r] = (r + 256).toString(16).substr(1); e.exports = function (e, n) { var r = n || 0, i = t; return [i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]]].join("") }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(6), o = t(2), a = t(0), s = t(3); !function (e) { var n, t; function l() { d(); try { a.Communication.childWindow && a.Communication.childWindow.close(); } finally { a.Communication.childWindow = null, a.Communication.childOrigin = null; } } function u(e) { n = e, l(); var t = n.width || 600, r = n.height || 400; t = Math.min(t, a.Communication.currentWindow.outerWidth - 400), r = Math.min(r, a.Communication.currentWindow.outerHeight - 200); var i = document.createElement("a"); i.href = n.url; var o = void 0 !== a.Communication.currentWindow.screenLeft ? a.Communication.currentWindow.screenLeft : a.Communication.currentWindow.screenX, s = void 0 !== a.Communication.currentWindow.screenTop ? a.Communication.currentWindow.screenTop : a.Communication.currentWindow.screenY; o += a.Communication.currentWindow.outerWidth / 2 - t / 2, s += a.Communication.currentWindow.outerHeight / 2 - r / 2, a.Communication.childWindow = a.Communication.currentWindow.open(i.href, "_blank", "toolbar=no, location=yes, status=no, menubar=no, scrollbars=yes, top=" + s + ", left=" + o + ", width=" + t + ", height=" + r), a.Communication.childWindow ? c() : m("FailedToOpenWindow"); } function d() { t && (clearInterval(t), t = 0), s.removeHandler("initialize"), s.removeHandler("navigateCrossDomain"); } function c() { d(), t = a.Communication.currentWindow.setInterval(function () { if (!a.Communication.childWindow || a.Communication.childWindow.closed) m("CancelledByUser"); else { var e = a.Communication.childOrigin; try { a.Communication.childOrigin = "*", a.sendMessageEventToChild("ping"); } finally { a.Communication.childOrigin = e; } } }, 100), s.registerHandler("initialize", function () { return [o.FrameContexts.authentication, i.GlobalVars.hostClientType] }), s.registerHandler("navigateCrossDomain", function () { return !1 }); } function f(e) { try { n && n.successCallback && n.successCallback(e); } finally { n = null, l(); } } function m(e) { try { n && n.failureCallback && n.failureCallback(e); } finally { n = null, l(); } } function g(e, n, t) { if (e) { var r = document.createElement("a"); r.href = decodeURIComponent(e), r.host && r.host !== window.location.host && "outlook.office.com" === r.host && r.search.indexOf("client_type=Win32_Outlook") > -1 && (n && "result" === n && (t && (r.href = p(r.href, "result", t)), a.Communication.currentWindow.location.assign(p(r.href, "authSuccess", ""))), n && "reason" === n && (t && (r.href = p(r.href, "reason", t)), a.Communication.currentWindow.location.assign(p(r.href, "authFailure", "")))); } } function p(e, n, t) { var r = e.indexOf("#"), i = -1 === r ? "#" : e.substr(r); return i = i + "&" + n + ("" !== t ? "=" + t : ""), (e = -1 === r ? e : e.substr(0, r)) + i } e.initialize = function () { s.registerHandler("authentication.authenticate.success", f, !1), s.registerHandler("authentication.authenticate.failure", m, !1); }, e.registerAuthenticationHandlers = function (e) { n = e; }, e.authenticate = function (e) { var t = void 0 !== e ? e : n; if (r.ensureInitialized(o.FrameContexts.content, o.FrameContexts.sidePanel, o.FrameContexts.settings, o.FrameContexts.remove, o.FrameContexts.task, o.FrameContexts.stage, o.FrameContexts.meetingStage), i.GlobalVars.hostClientType === o.HostClientType.desktop || i.GlobalVars.hostClientType === o.HostClientType.android || i.GlobalVars.hostClientType === o.HostClientType.ios || i.GlobalVars.hostClientType === o.HostClientType.rigel) { var s = document.createElement("a"); s.href = t.url, a.sendMessageToParent("authentication.authenticate", [s.href, t.width, t.height], function (e, n) { e ? t.successCallback(n) : t.failureCallback(n); }); } else u(t); }, e.getAuthToken = function (e) { r.ensureInitialized(), a.sendMessageToParent("authentication.getAuthToken", [e.resources, e.claims, e.silent], function (n, t) { n ? e.successCallback(t) : e.failureCallback(t); }); }, e.getUser = function (e) { r.ensureInitialized(), a.sendMessageToParent("authentication.getUser", function (n, t) { n ? e.successCallback(t) : e.failureCallback(t); }); }, e.notifySuccess = function (e, n) { g(n, "result", e), r.ensureInitialized(o.FrameContexts.authentication), a.sendMessageToParent("authentication.authenticate.success", [e]), a.waitForMessageQueue(a.Communication.parentWindow, function () { return setTimeout(function () { return a.Communication.currentWindow.close() }, 200) }); }, e.notifyFailure = function (e, n) { g(n, "reason", e), r.ensureInitialized(o.FrameContexts.authentication), a.sendMessageToParent("authentication.authenticate.failure", [e]), a.waitForMessageQueue(a.Communication.parentWindow, function () { return setTimeout(function () { return a.Communication.currentWindow.close() }, 200) }); }; }(n.authentication || (n.authentication = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(2), o = t(5), a = t(0), s = t(3); !function (e) { var n, t; function l(e) { var t = new u(e); n ? n(t) : t.notifySuccess(); } e.initialize = function () { s.registerHandler("settings.save", l, !1), s.registerHandler("settings.remove", d, !1); }, e.setValidityState = function (e) { r.ensureInitialized(i.FrameContexts.settings, i.FrameContexts.remove), a.sendMessageToParent("settings.setValidityState", [e]); }, e.getSettings = function (e) { r.ensureInitialized(i.FrameContexts.content, i.FrameContexts.settings, i.FrameContexts.remove, i.FrameContexts.sidePanel), a.sendMessageToParent("settings.getSettings", e); }, e.setSettings = function (e, n) { r.ensureInitialized(i.FrameContexts.content, i.FrameContexts.settings, i.FrameContexts.sidePanel), a.sendMessageToParent("settings.setSettings", [e], n || o.getGenericOnCompleteHandler()); }, e.registerOnSaveHandler = function (e) { r.ensureInitialized(i.FrameContexts.settings), n = e, e && a.sendMessageToParent("registerHandler", ["save"]); }, e.registerOnRemoveHandler = function (e) { r.ensureInitialized(i.FrameContexts.remove, i.FrameContexts.settings), t = e, e && a.sendMessageToParent("registerHandler", ["remove"]); }; var u = function () { function e(e) { this.notified = !1, this.result = e || {}; } return e.prototype.notifySuccess = function () { this.ensureNotNotified(), a.sendMessageToParent("settings.save.success"), this.notified = !0; }, e.prototype.notifyFailure = function (e) { this.ensureNotNotified(), a.sendMessageToParent("settings.save.failure", [e]), this.notified = !0; }, e.prototype.ensureNotNotified = function () { if (this.notified) throw new Error("The SaveEvent may only notify success or failure once.") }, e }(); function d() { var e = new c; t ? t(e) : e.notifySuccess(); } var c = function () { function e() { this.notified = !1; } return e.prototype.notifySuccess = function () { this.ensureNotNotified(), a.sendMessageToParent("settings.remove.success"), this.notified = !0; }, e.prototype.notifyFailure = function (e) { this.ensureNotNotified(), a.sendMessageToParent("settings.remove.failure", [e]), this.notified = !0; }, e.prototype.ensureNotNotified = function () { if (this.notified) throw new Error("The removeEvent may only notify success or failure once.") }, e }(); }(n.settings || (n.settings = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(0), o = t(3); !function (e) { e.registerGetLogHandler = function (e) { r.ensureInitialized(), e ? o.registerHandler("log.request", function () { var n = e(); i.sendMessageToParent("log.receive", [n]); }) : o.removeHandler("log.request"); }; }(n.logs || (n.logs = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(2), o = t(5), a = t(0), s = t(15), l = t(3), u = t(6), d = t(7), c = t(4); n.initializePrivateApis = function () { s.menus.initialize(); }, n.getUserJoinedTeams = function (e, n) { if (r.ensureInitialized(), u.GlobalVars.hostClientType === i.HostClientType.android && !r.isAPISupportedByPlatform(c.getUserJoinedTeamsSupportedAndroidClientVersion)) { var t = { errorCode: d.ErrorCode.OLD_PLATFORM }; throw new Error(JSON.stringify(t)) } a.sendMessageToParent("getUserJoinedTeams", [n], e); }, n.enterFullscreen = function () { r.ensureInitialized(i.FrameContexts.content), a.sendMessageToParent("enterFullscreen", []); }, n.exitFullscreen = function () { r.ensureInitialized(i.FrameContexts.content), a.sendMessageToParent("exitFullscreen", []); }, n.openFilePreview = function (e) { r.ensureInitialized(i.FrameContexts.content); var n = [e.entityId, e.title, e.description, e.type, e.objectUrl, e.downloadUrl, e.webPreviewUrl, e.webEditUrl, e.baseUrl, e.editFile, e.subEntityId, e.viewerAction, e.fileOpenPreference]; a.sendMessageToParent("openFilePreview", n); }, n.showNotification = function (e) { r.ensureInitialized(i.FrameContexts.content); var n = [e.message, e.notificationType]; a.sendMessageToParent("showNotification", n); }, n.uploadCustomApp = function (e, n) { r.ensureInitialized(), a.sendMessageToParent("uploadCustomApp", [e], n || o.getGenericOnCompleteHandler()); }, n.sendCustomMessage = function (e, n, t) { r.ensureInitialized(), a.sendMessageToParent(e, n, t); }, n.sendCustomEvent = function (e, n) { if (r.ensureInitialized(), !a.Communication.childWindow) throw new Error("The child window has not yet been initialized or is not present"); a.sendMessageEventToChild(e, n); }, n.registerCustomHandler = function (e, n) { var t = this; r.ensureInitialized(), l.registerHandler(e, function () { for (var e = [], r = 0; r < arguments.length; r++)e[r] = arguments[r]; return n.apply(t, e) }); }, n.getChatMembers = function (e) { r.ensureInitialized(), a.sendMessageToParent("getChatMembers", e); }, n.getConfigSetting = function (e, n) { r.ensureInitialized(), a.sendMessageToParent("getConfigSetting", [n], e); }, n.registerUserSettingsChangeHandler = function (e, n) { r.ensureInitialized(), l.registerHandler("userSettingsChange", n, !0, [e]); }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(0), o = t(3); !function (e) { var n, t, a, s = function () { return function () { this.enabled = !0, this.selected = !1; } }(); function l(e) { a && a(e) || (r.ensureInitialized(), i.sendMessageToParent("viewConfigItemPress", [e])); } function u(e) { n && n(e) || (r.ensureInitialized(), i.sendMessageToParent("handleNavBarMenuItemPress", [e])); } function d(e) { t && t(e) || (r.ensureInitialized(), i.sendMessageToParent("handleActionMenuItemPress", [e])); } e.MenuItem = s, function (e) { e.dropDown = "dropDown", e.popOver = "popOver"; }(e.MenuListType || (e.MenuListType = {})), e.initialize = function () { o.registerHandler("navBarMenuItemPress", u, !1), o.registerHandler("actionMenuItemPress", d, !1), o.registerHandler("setModuleView", l, !1); }, e.setUpViews = function (e, n) { r.ensureInitialized(), a = n, i.sendMessageToParent("setUpViews", [e]); }, e.setNavBarMenu = function (e, t) { r.ensureInitialized(), n = t, i.sendMessageToParent("setNavBarMenu", [e]); }, e.showActionMenu = function (e, n) { r.ensureInitialized(), t = n, i.sendMessageToParent("showActionMenu", [e]); }; }(n.menus || (n.menus = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(2), o = t(5), a = t(0), s = t(3), l = function () { function e() { } return e.prototype.postMessage = function (e, n) { r.ensureInitialized(), a.sendMessageToParent("messageForChild", [e], n || o.getGenericOnCompleteHandler()); }, e.prototype.addEventListener = function (e, n) { "message" === e && s.registerHandler("messageForParent", n); }, e }(); n.ChildAppWindow = l; var u = function () { function e() { } return Object.defineProperty(e, "Instance", { get: function () { return this._instance || (this._instance = new this) }, enumerable: !0, configurable: !0 }), e.prototype.postMessage = function (e, n) { r.ensureInitialized(i.FrameContexts.task), a.sendMessageToParent("messageForParent", [e], n || o.getGenericOnCompleteHandler()); }, e.prototype.addEventListener = function (e, n) { "message" === e && s.registerHandler("messageForChild", n); }, e }(); n.ParentAppWindow = u; }, function (e, n, t) { var r = this && this.__extends || function () { var e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, n) { e.__proto__ = n; } || function (e, n) { for (var t in n) n.hasOwnProperty(t) && (e[t] = n[t]); }; return function (n, t) { function r() { this.constructor = n; } e(n, t), n.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r); } }(); Object.defineProperty(n, "__esModule", { value: !0 }); var i = t(6), o = t(7), a = t(1), s = t(2), l = t(5), u = t(18), d = t(0), c = t(3), f = t(4); !function (e) { !function (e) { e.Base64 = "base64", e.ID = "id"; }(e.FileFormat || (e.FileFormat = {})); var n = function () { return function () { } }(); e.File = n, e.captureImage = function (e) { if (!e) throw new Error("[captureImage] Callback cannot be null"); a.ensureInitialized(s.FrameContexts.content, s.FrameContexts.task), i.GlobalVars.isFramelessWindow ? a.isAPISupportedByPlatform(f.captureImageMobileSupportVersion) ? d.sendMessageToParent("captureImage", e) : e({ errorCode: o.ErrorCode.OLD_PLATFORM }, void 0) : e({ errorCode: o.ErrorCode.NOT_SUPPORTED_ON_PLATFORM }, void 0); }; var t = function (e) { function n(n) { void 0 === n && (n = null); var t = e.call(this) || this; return n && (t.content = n.content, t.format = n.format, t.mimeType = n.mimeType, t.name = n.name, t.preview = n.preview, t.size = n.size), t } return r(n, e), n.prototype.getMedia = function (e) { if (!e) throw new Error("[get Media] Callback cannot be null"); (a.ensureInitialized(s.FrameContexts.content, s.FrameContexts.task), a.isAPISupportedByPlatform(f.mediaAPISupportVersion)) ? u.validateGetMediaInputs(this.mimeType, this.format, this.content) ? a.isAPISupportedByPlatform(f.getMediaCallbackSupportVersion) ? this.getMediaViaCallback(e) : this.getMediaViaHandler(e) : e({ errorCode: o.ErrorCode.INVALID_ARGUMENTS }, null) : e({ errorCode: o.ErrorCode.OLD_PLATFORM }, null); }, n.prototype.getMediaViaCallback = function (e) { var n = { mediaMimeType: this.mimeType, assembleAttachment: [] }, t = [this.content]; d.sendMessageToParent("getMedia", t, function (t) { if (e) if (t && t.error) e(t.error, null); else if (t && t.mediaChunk) if (t.mediaChunk.chunkSequence <= 0) { var r = u.createFile(n.assembleAttachment, n.mediaMimeType); e(t.error, r); } else { var i = u.decodeAttachment(t.mediaChunk, n.mediaMimeType); n.assembleAttachment.push(i); } else e({ errorCode: o.ErrorCode.INTERNAL_ERROR, message: "data receieved is null" }, null); }); }, n.prototype.getMediaViaHandler = function (e) { var n = l.generateGUID(), t = { mediaMimeType: this.mimeType, assembleAttachment: [] }, r = [n, this.content]; this.content && e && d.sendMessageToParent("getMedia", r), c.registerHandler("getMedia" + n, function (r) { if (e) { var i = JSON.parse(r); if (i.error) e(i.error, null), c.removeHandler("getMedia" + n); else if (i.mediaChunk) if (i.mediaChunk.chunkSequence <= 0) { var a = u.createFile(t.assembleAttachment, t.mediaMimeType); e(i.error, a), c.removeHandler("getMedia" + n); } else { var s = u.decodeAttachment(i.mediaChunk, t.mediaMimeType); t.assembleAttachment.push(s); } else e({ errorCode: o.ErrorCode.INTERNAL_ERROR, message: "data receieved is null" }, null), c.removeHandler("getMedia" + n); } }); }, n }(n); e.Media = t, function (e) { e[e.Photo = 1] = "Photo", e[e.Document = 2] = "Document", e[e.Whiteboard = 3] = "Whiteboard", e[e.BusinessCard = 4] = "BusinessCard"; }(e.CameraStartMode || (e.CameraStartMode = {})), function (e) { e[e.Camera = 1] = "Camera", e[e.Gallery = 2] = "Gallery"; }(e.Source || (e.Source = {})), function (e) { e[e.Image = 1] = "Image", e[e.Audio = 4] = "Audio"; }(e.MediaType || (e.MediaType = {})), function (e) { e[e.ID = 1] = "ID", e[e.URL = 2] = "URL"; }(e.ImageUriType || (e.ImageUriType = {})), e.selectMedia = function (e, n) { if (!n) throw new Error("[select Media] Callback cannot be null"); if (a.ensureInitialized(s.FrameContexts.content, s.FrameContexts.task), a.isAPISupportedByPlatform(f.mediaAPISupportVersion)) if (u.validateSelectMediaInputs(e)) { var r = [e]; d.sendMessageToParent("selectMedia", r, function (e, r) { if (r) { for (var i = [], o = 0, a = r; o < a.length; o++) { var s = a[o]; i.push(new t(s)); } n(e, i); } else n(e, null); }); } else { var i = { errorCode: o.ErrorCode.INVALID_ARGUMENTS }; n(i, null); } else { var l = { errorCode: o.ErrorCode.OLD_PLATFORM }; n(l, null); } }, e.viewImages = function (e, n) { if (!n) throw new Error("[view images] Callback cannot be null"); if (a.ensureInitialized(s.FrameContexts.content, s.FrameContexts.task), a.isAPISupportedByPlatform(f.mediaAPISupportVersion)) if (u.validateViewImagesInput(e)) { var t = [e]; d.sendMessageToParent("viewImages", t, n); } else n({ errorCode: o.ErrorCode.INVALID_ARGUMENTS }); else n({ errorCode: o.ErrorCode.OLD_PLATFORM }); }, e.scanBarCode = function (e, n) { if (!e) throw new Error("[media.scanBarCode] Callback cannot be null"); a.ensureInitialized(s.FrameContexts.content, s.FrameContexts.task), i.GlobalVars.hostClientType !== s.HostClientType.desktop && i.GlobalVars.hostClientType !== s.HostClientType.web && i.GlobalVars.hostClientType !== s.HostClientType.rigel ? a.isAPISupportedByPlatform(f.scanBarCodeAPIMobileSupportVersion) ? u.validateScanBarCodeInput(n) ? d.sendMessageToParent("media.scanBarCode", [n], e) : e({ errorCode: o.ErrorCode.INVALID_ARGUMENTS }, null) : e({ errorCode: o.ErrorCode.OLD_PLATFORM }, null) : e({ errorCode: o.ErrorCode.NOT_SUPPORTED_ON_PLATFORM }, null); }; }(n.media || (n.media = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(17); n.createFile = function (e, n) { if (null == e || null == n || e.length <= 0) return null; var t, r = 1; return e.sort(function (e, n) { return e.sequence > n.sequence ? 1 : -1 }), e.forEach(function (e) { e.sequence == r && (t = t ? new Blob([t, e.file], { type: n }) : new Blob([e.file], { type: n }), r++); }), t }, n.decodeAttachment = function (e, n) { if (null == e || null == n) return null; for (var t = atob(e.chunk), r = new Array(t.length), i = 0; i < t.length; i++)r[i] = t.charCodeAt(i); var o = new Uint8Array(r), a = new Blob([o], { type: n }); return { sequence: e.chunkSequence, file: a } }, n.validateSelectMediaInputs = function (e) { return !(null == e || e.maxMediaCount > 10) }, n.validateGetMediaInputs = function (e, n, t) { return null != e && null != n && n == r.media.FileFormat.ID && null != t }, n.validateViewImagesInput = function (e) { return !(null == e || e.length <= 0 || e.length > 10) }, n.validateScanBarCodeInput = function (e) { return !e || !(null === e.timeOutIntervalInSec || e.timeOutIntervalInSec <= 0 || e.timeOutIntervalInSec > 60) }, n.validatePeoplePickerInput = function (e) { if (e) { if (e.title && "string" != typeof e.title) return !1; if (e.setSelected && "object" != typeof e.setSelected) return !1; if (e.openOrgWideSearchInChatOrChannel && "boolean" != typeof e.openOrgWideSearchInChatOrChannel) return !1; if (e.singleSelect && "boolean" != typeof e.singleSelect) return !1 } return !0 }; }, function (e, n, t) { function r(e) { for (var t in e) n.hasOwnProperty(t) || (n[t] = e[t]); } Object.defineProperty(n, "__esModule", { value: !0 }), r(t(20)), r(t(8)); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(21); n.bot = r.bot; var i = t(15); n.menus = i.menus; var o = t(13); n.logs = o.logs; var a = t(32); n.NotificationTypes = a.NotificationTypes, n.ViewerActionTypes = a.ViewerActionTypes, n.UserSettingTypes = a.UserSettingTypes; var s = t(14); n.enterFullscreen = s.enterFullscreen, n.exitFullscreen = s.exitFullscreen, n.getChatMembers = s.getChatMembers, n.getConfigSetting = s.getConfigSetting, n.getUserJoinedTeams = s.getUserJoinedTeams, n.openFilePreview = s.openFilePreview, n.sendCustomMessage = s.sendCustomMessage, n.showNotification = s.showNotification, n.sendCustomEvent = s.sendCustomEvent, n.registerCustomHandler = s.registerCustomHandler, n.uploadCustomApp = s.uploadCustomApp, n.registerUserSettingsChangeHandler = s.registerUserSettingsChangeHandler; var l = t(33); n.conversations = l.conversations; var u = t(34); n.meetingRoom = u.meetingRoom; var d = t(35); n.remoteCamera = d.remoteCamera; var c = t(36); n.files = c.files; var f = t(37); n.appEntity = f.appEntity; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(0), i = t(1); !function (e) { e.sendQuery = function (e, n, t) { i.ensureInitialized(), r.sendMessageToParent("bot.executeQuery", [e], function (e, r) { e ? n(r) : t(r); }); }, e.getSupportedCommands = function (e, n) { i.ensureInitialized(), r.sendMessageToParent("bot.getSupportedCommands", function (t, r) { t ? e(r) : n(r); }); }, e.authenticate = function (e, n, t) { i.ensureInitialized(), r.sendMessageToParent("bot.authenticate", [e], function (e, r) { e ? n(r) : t(r); }); }, function (e) { e.Results = "Results", e.Auth = "Auth"; }(e.ResponseType || (e.ResponseType = {})); }(n.bot || (n.bot = {})); }, function (e, n, t) { var r = t(23), i = t(24), o = i; o.v1 = r, o.v4 = i, e.exports = o; }, function (e, n, t) { var r, i, o = t(9), a = t(10), s = 0, l = 0; e.exports = function (e, n, t) { var u = n && t || 0, d = n || [], c = (e = e || {}).node || r, f = void 0 !== e.clockseq ? e.clockseq : i; if (null == c || null == f) { var m = o(); null == c && (c = r = [1 | m[0], m[1], m[2], m[3], m[4], m[5]]), null == f && (f = i = 16383 & (m[6] << 8 | m[7])); } var g = void 0 !== e.msecs ? e.msecs : (new Date).getTime(), p = void 0 !== e.nsecs ? e.nsecs : l + 1, C = g - s + (p - l) / 1e4; if (C < 0 && void 0 === e.clockseq && (f = f + 1 & 16383), (C < 0 || g > s) && void 0 === e.nsecs && (p = 0), p >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec"); s = g, l = p, i = f; var h = (1e4 * (268435455 & (g += 122192928e5)) + p) % 4294967296; d[u++] = h >>> 24 & 255, d[u++] = h >>> 16 & 255, d[u++] = h >>> 8 & 255, d[u++] = 255 & h; var v = g / 4294967296 * 1e4 & 268435455; d[u++] = v >>> 8 & 255, d[u++] = 255 & v, d[u++] = v >>> 24 & 15 | 16, d[u++] = v >>> 16 & 255, d[u++] = f >>> 8 | 128, d[u++] = 255 & f; for (var b = 0; b < 6; ++b)d[u + b] = c[b]; return n || a(d) }; }, function (e, n, t) { var r = t(9), i = t(10); e.exports = function (e, n, t) { var o = n && t || 0; "string" == typeof e && (n = "binary" === e ? new Array(16) : null, e = null); var a = (e = e || {}).random || (e.rng || r)(); if (a[6] = 15 & a[6] | 64, a[8] = 63 & a[8] | 128, n) for (var s = 0; s < 16; ++s)n[o + s] = a[s]; return n || i(a) }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(4), o = t(0); !function (e) { e.Messages = { AppLoaded: "appInitialization.appLoaded", Success: "appInitialization.success", Failure: "appInitialization.failure", ExpectedFailure: "appInitialization.expectedFailure" }, function (e) { e.AuthFailed = "AuthFailed", e.Timeout = "Timeout", e.Other = "Other"; }(e.FailedReason || (e.FailedReason = {})), function (e) { e.PermissionError = "PermissionError", e.NotFound = "NotFound", e.Throttling = "Throttling", e.Offline = "Offline", e.Other = "Other"; }(e.ExpectedFailureReason || (e.ExpectedFailureReason = {})), e.notifyAppLoaded = function () { r.ensureInitialized(), o.sendMessageToParent(e.Messages.AppLoaded, [i.version]); }, e.notifySuccess = function () { r.ensureInitialized(), o.sendMessageToParent(e.Messages.Success, [i.version]); }, e.notifyFailure = function (n) { r.ensureInitialized(), o.sendMessageToParent(e.Messages.Failure, [n.reason, n.message]); }, e.notifyExpectedFailure = function (n) { r.ensureInitialized(), o.sendMessageToParent(e.Messages.ExpectedFailure, [n.reason, n.message]); }; }(n.appInitialization || (n.appInitialization = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(6), o = t(4), a = t(12), s = t(5), l = t(13), u = t(2), d = t(0), c = t(11), f = t(14), m = t(3); function g(e, n) { i.GlobalVars.initializeCalled || (i.GlobalVars.initializeCalled = !0, m.initializeHandlers(), d.initializeCommunication(function (e, n, t) { void 0 === t && (t = o.defaultSDKVersionForCompatCheck), i.GlobalVars.frameContext = e, i.GlobalVars.hostClientType = n, i.GlobalVars.clientSupportedSDKVersion = t, i.GlobalVars.initializeCallbacks.forEach(function (e) { return e() }), i.GlobalVars.initializeCallbacks = [], i.GlobalVars.initializeCompleted = !0; }, n), c.authentication.initialize(), a.settings.initialize(), f.initializePrivateApis(), this._uninitialize = function () { i.GlobalVars.frameContext && (C(null), h(null), v(null), T(null), b(null), l.logs.registerGetLogHandler(null)), i.GlobalVars.frameContext === u.FrameContexts.settings && a.settings.registerOnSaveHandler(null), i.GlobalVars.frameContext === u.FrameContexts.remove && a.settings.registerOnRemoveHandler(null), i.GlobalVars.initializeCalled = !1, i.GlobalVars.initializeCompleted = !1, i.GlobalVars.initializeCallbacks = [], i.GlobalVars.additionalValidOrigins = [], i.GlobalVars.frameContext = null, i.GlobalVars.hostClientType = null, i.GlobalVars.isFramelessWindow = !1, d.uninitializeCommunication(); }), Array.isArray(n) && r.processAdditionalValidOrigins(n), e && (i.GlobalVars.initializeCompleted ? e() : i.GlobalVars.initializeCallbacks.push(e)); } function p() { window.print(); } function C(e) { r.ensureInitialized(), m.registerOnThemeChangeHandler(e); } function h(e) { r.ensureInitialized(), m.registerHandler("fullScreenChange", e); } function v(e) { r.ensureInitialized(), m.registerBackButtonHandler(e); } function b(e) { r.ensureInitialized(), m.registerOnLoadHandler(e); } function T(e) { r.ensureInitialized(), m.registerBeforeUnloadHandler(e); } function w(e) { r.ensureInitialized(u.FrameContexts.content), d.sendMessageToParent("setFrameContext", [e]); } n.initialize = g, n._initialize = function (e) { d.Communication.currentWindow = e; }, n._uninitialize = function () { }, n.enablePrintCapability = function () { i.GlobalVars.printCapabilityEnabled || (i.GlobalVars.printCapabilityEnabled = !0, r.ensureInitialized(), document.addEventListener("keydown", function (e) { (e.ctrlKey || e.metaKey) && 80 === e.keyCode && (p(), e.cancelBubble = !0, e.preventDefault(), e.stopImmediatePropagation()); })); }, n.print = p, n.getContext = function (e) { r.ensureInitialized(), d.sendMessageToParent("getContext", function (n) { n.frameContext || (n.frameContext = i.GlobalVars.frameContext), e(n); }); }, n.registerOnThemeChangeHandler = C, n.registerFullScreenHandler = h, n.registerAppButtonClickHandler = function (e) { r.ensureInitialized(u.FrameContexts.content), m.registerHandler("appButtonClick", e); }, n.registerAppButtonHoverEnterHandler = function (e) { r.ensureInitialized(u.FrameContexts.content), m.registerHandler("appButtonHoverEnter", e); }, n.registerAppButtonHoverLeaveHandler = function (e) { r.ensureInitialized(u.FrameContexts.content), m.registerHandler("appButtonHoverLeave", e); }, n.registerBackButtonHandler = v, n.registerOnLoadHandler = b, n.registerBeforeUnloadHandler = T, n.registerChangeSettingsHandler = function (e) { r.ensureInitialized(u.FrameContexts.content), m.registerHandler("changeSettings", e); }, n.getTabInstances = function (e, n) { r.ensureInitialized(), d.sendMessageToParent("getTabInstances", [n], e); }, n.getMruTabInstances = function (e, n) { r.ensureInitialized(), d.sendMessageToParent("getMruTabInstances", [n], e); }, n.shareDeepLink = function (e) { r.ensureInitialized(u.FrameContexts.content, u.FrameContexts.sidePanel, u.FrameContexts.meetingStage), d.sendMessageToParent("shareDeepLink", [e.subEntityId, e.subEntityLabel, e.subEntityWebUrl]); }, n.executeDeepLink = function (e, n) { r.ensureInitialized(u.FrameContexts.content, u.FrameContexts.sidePanel, u.FrameContexts.settings, u.FrameContexts.task, u.FrameContexts.stage, u.FrameContexts.meetingStage), d.sendMessageToParent("executeDeepLink", [e], n || s.getGenericOnCompleteHandler()); }, n.setFrameContext = w, n.initializeWithFrameContext = function (e, n, t) { g(n, t), w(e); }; }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(5), o = t(2), a = t(0); n.returnFocus = function (e) { r.ensureInitialized(o.FrameContexts.content), a.sendMessageToParent("returnFocus", [e]); }, n.navigateToTab = function (e, n) { r.ensureInitialized(), a.sendMessageToParent("navigateToTab", [e], n || i.getGenericOnCompleteHandler("Invalid internalTabInstanceId and/or channelId were/was provided")); }, n.navigateCrossDomain = function (e, n) { r.ensureInitialized(o.FrameContexts.content, o.FrameContexts.sidePanel, o.FrameContexts.settings, o.FrameContexts.remove, o.FrameContexts.task, o.FrameContexts.stage, o.FrameContexts.meetingStage), a.sendMessageToParent("navigateCrossDomain", [e], n || i.getGenericOnCompleteHandler("Cross-origin navigation is only supported for URLs matching the pattern registered in the manifest.")); }, n.navigateBack = function (e) { r.ensureInitialized(), a.sendMessageToParent("navigateBack", [], e || i.getGenericOnCompleteHandler("Back navigation is not supported in the current client or context.")); }; }, function (e, n, t) { var r = this && this.__rest || function (e, n) { var t = {}; for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && n.indexOf(r) < 0 && (t[r] = e[r]); if (null != e && "function" == typeof Object.getOwnPropertySymbols) { var i = 0; for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)n.indexOf(r[i]) < 0 && (t[r[i]] = e[r[i]]); } return t }; Object.defineProperty(n, "__esModule", { value: !0 }); var i = t(2), o = t(16), a = t(0), s = t(1); !function (e) { e.startTask = function (e, n) { return s.ensureInitialized(i.FrameContexts.content, i.FrameContexts.sidePanel, i.FrameContexts.meetingStage), a.sendMessageToParent("tasks.startTask", [e], n), new o.ChildAppWindow }, e.updateTask = function (e) { s.ensureInitialized(i.FrameContexts.content, i.FrameContexts.sidePanel, i.FrameContexts.task, i.FrameContexts.meetingStage), e.width, e.height; var n = r(e, ["width", "height"]); if (Object.keys(n).length) throw new Error("updateTask requires a taskInfo argument containing only width and height"); a.sendMessageToParent("tasks.updateTask", [e]); }, e.submitTask = function (e, n) { s.ensureInitialized(i.FrameContexts.content, i.FrameContexts.sidePanel, i.FrameContexts.task, i.FrameContexts.meetingStage), a.sendMessageToParent("tasks.completeTask", [e, Array.isArray(n) ? n : [n]]); }; }(n.tasks || (n.tasks = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(7), i = t(1), o = t(2), a = t(0), s = t(4); !function (e) { e.getLocation = function (e, n) { if (!n) throw new Error("[location.getLocation] Callback cannot be null"); i.ensureInitialized(o.FrameContexts.content, o.FrameContexts.task), i.isAPISupportedByPlatform(s.locationAPIsRequiredVersion) ? e ? a.sendMessageToParent("location.getLocation", [e], n) : n({ errorCode: r.ErrorCode.INVALID_ARGUMENTS }, void 0) : n({ errorCode: r.ErrorCode.OLD_PLATFORM }, void 0); }, e.showLocation = function (e, n) { if (!n) throw new Error("[location.showLocation] Callback cannot be null"); i.ensureInitialized(o.FrameContexts.content, o.FrameContexts.task), i.isAPISupportedByPlatform(s.locationAPIsRequiredVersion) ? e ? a.sendMessageToParent("location.showLocation", [e], n) : n({ errorCode: r.ErrorCode.INVALID_ARGUMENTS }, void 0) : n({ errorCode: r.ErrorCode.OLD_PLATFORM }, void 0); }; }(n.location || (n.location = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(0), i = t(3), o = t(1), a = t(2); !function (e) { !function (e) { e.Unknown = "Unknown", e.Adhoc = "Adhoc", e.Scheduled = "Scheduled", e.Recurring = "Recurring", e.Broadcast = "Broadcast", e.MeetNow = "MeetNow"; }(e.MeetingType || (e.MeetingType = {})), e.getIncomingClientAudioState = function (e) { if (!e) throw new Error("[get incoming client audio state] Callback cannot be null"); o.ensureInitialized(), r.sendMessageToParent("getIncomingClientAudioState", e); }, e.toggleIncomingClientAudio = function (e) { if (!e) throw new Error("[toggle incoming client audio] Callback cannot be null"); o.ensureInitialized(), r.sendMessageToParent("toggleIncomingClientAudio", e); }, e.getMeetingDetails = function (e) { if (!e) throw new Error("[get meeting details] Callback cannot be null"); o.ensureInitialized(), r.sendMessageToParent("meeting.getMeetingDetails", e); }, e.getAuthenticationTokenForAnonymousUser = function (e) { if (!e) throw new Error("[get Authentication Token For AnonymousUser] Callback cannot be null"); o.ensureInitialized(), r.sendMessageToParent("meeting.getAuthenticationTokenForAnonymousUser", e); }, e.getLiveStreamState = function (e) { if (!e) throw new Error("[get live stream state] Callback cannot be null"); o.ensureInitialized(a.FrameContexts.sidePanel), r.sendMessageToParent("meeting.getLiveStreamState", e); }, e.requestStartLiveStreaming = function (e, n, t) { if (!e) throw new Error("[request start live streaming] Callback cannot be null"); o.ensureInitialized(a.FrameContexts.sidePanel), r.sendMessageToParent("meeting.requestStartLiveStreaming", [n, t], e); }, e.requestStopLiveStreaming = function (e) { if (!e) throw new Error("[request stop live streaming] Callback cannot be null"); o.ensureInitialized(a.FrameContexts.sidePanel), r.sendMessageToParent("meeting.requestStopLiveStreaming", e); }, e.registerLiveStreamChangedHandler = function (e) { if (!e) throw new Error("[register live stream changed handler] Handler cannot be null"); o.ensureInitialized(a.FrameContexts.sidePanel), i.registerHandler("meeting.liveStreamChanged", e); }; }(n.meeting || (n.meeting = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(2), o = t(7), a = t(18), s = t(0), l = t(4); !function (e) { (n.people || (n.people = {})).selectPeople = function (e, n) { if (!e) throw new Error("[people picker] Callback cannot be null"); r.ensureInitialized(i.FrameContexts.content, i.FrameContexts.task, i.FrameContexts.settings), r.isAPISupportedByPlatform(l.peoplePickerRequiredVersion) ? a.validatePeoplePickerInput(n) ? s.sendMessageToParent("people.selectPeople", [n], e) : e({ errorCode: o.ErrorCode.INVALID_ARGUMENTS }, null) : e({ errorCode: o.ErrorCode.OLD_PLATFORM }, void 0); }; }(); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }), function (e) { e.fileDownloadStart = "fileDownloadStart", e.fileDownloadComplete = "fileDownloadComplete"; }(n.NotificationTypes || (n.NotificationTypes = {})), function (e) { e.view = "view", e.edit = "edit", e.editNew = "editNew"; }(n.ViewerActionTypes || (n.ViewerActionTypes = {})), function (e) { e.fileOpenPreference = "fileOpenPreference", e.theme = "theme"; }(n.UserSettingTypes || (n.UserSettingTypes = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(2), o = t(0), a = t(3); !function (e) { e.openConversation = function (e) { r.ensureInitialized(i.FrameContexts.content), o.sendMessageToParent("conversations.openConversation", [{ title: e.title, subEntityId: e.subEntityId, conversationId: e.conversationId, channelId: e.channelId, entityId: e.entityId }], function (e, n) { if (!e) throw new Error(n) }), e.onStartConversation && a.registerHandler("startConversation", function (n, t, r, i) { return e.onStartConversation({ subEntityId: n, conversationId: t, channelId: r, entityId: i }) }), e.onCloseConversation && a.registerHandler("closeConversation", function (n, t, r, i) { return e.onCloseConversation({ subEntityId: n, conversationId: t, channelId: r, entityId: i }) }); }, e.closeConversation = function () { r.ensureInitialized(i.FrameContexts.content), o.sendMessageToParent("conversations.closeConversation"), a.removeHandler("startConversation"), a.removeHandler("closeConversation"); }; }(n.conversations || (n.conversations = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(0), o = t(3); !function (e) { !function (e) { e.toggleMute = "toggleMute", e.toggleCamera = "toggleCamera", e.toggleCaptions = "toggleCaptions", e.volume = "volume", e.showVideoGallery = "showVideoGallery", e.showContent = "showContent", e.showVideoGalleryAndContent = "showVideoGalleryAndContent", e.showLargeGallery = "showLargeGallery", e.showTogether = "showTogether", e.leaveMeeting = "leaveMeeting"; }(e.Capability || (e.Capability = {})), e.getPairedMeetingRoomInfo = function (e) { r.ensureInitialized(), i.sendMessageToParent("meetingRoom.getPairedMeetingRoomInfo", e); }, e.sendCommandToPairedMeetingRoom = function (e, n) { if (!e || 0 == e.length) throw new Error("[meetingRoom.sendCommandToPairedMeetingRoom] Command name cannot be null or empty"); if (!n) throw new Error("[meetingRoom.sendCommandToPairedMeetingRoom] Callback cannot be null"); r.ensureInitialized(), i.sendMessageToParent("meetingRoom.sendCommandToPairedMeetingRoom", [e], n); }, e.registerMeetingRoomCapabilitiesUpdateHandler = function (e) { if (!e) throw new Error("[meetingRoom.registerMeetingRoomCapabilitiesUpdateHandler] Handler cannot be null"); r.ensureInitialized(), o.registerHandler("meetingRoom.meetingRoomCapabilitiesUpdate", function (n) { r.ensureInitialized(), e(n); }); }, e.registerMeetingRoomStatesUpdateHandler = function (e) { if (!e) throw new Error("[meetingRoom.registerMeetingRoomStatesUpdateHandler] Handler cannot be null"); r.ensureInitialized(), o.registerHandler("meetingRoom.meetingRoomStatesUpdate", function (n) { r.ensureInitialized(), e(n); }); }; }(n.meetingRoom || (n.meetingRoom = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(1), i = t(2), o = t(0), a = t(3); !function (e) { !function (e) { e.Reset = "Reset", e.ZoomIn = "ZoomIn", e.ZoomOut = "ZoomOut", e.PanLeft = "PanLeft", e.PanRight = "PanRight", e.TiltUp = "TiltUp", e.TiltDown = "TiltDown"; }(e.ControlCommand || (e.ControlCommand = {})), function (e) { e[e.CommandResetError = 0] = "CommandResetError", e[e.CommandZoomInError = 1] = "CommandZoomInError", e[e.CommandZoomOutError = 2] = "CommandZoomOutError", e[e.CommandPanLeftError = 3] = "CommandPanLeftError", e[e.CommandPanRightError = 4] = "CommandPanRightError", e[e.CommandTiltUpError = 5] = "CommandTiltUpError", e[e.CommandTiltDownError = 6] = "CommandTiltDownError", e[e.SendDataError = 7] = "SendDataError"; }(e.ErrorReason || (e.ErrorReason = {})), function (e) { e[e.None = 0] = "None", e[e.ControlDenied = 1] = "ControlDenied", e[e.ControlNoResponse = 2] = "ControlNoResponse", e[e.ControlBusy = 3] = "ControlBusy", e[e.AckTimeout = 4] = "AckTimeout", e[e.ControlTerminated = 5] = "ControlTerminated", e[e.ControllerTerminated = 6] = "ControllerTerminated", e[e.DataChannelError = 7] = "DataChannelError", e[e.ControllerCancelled = 8] = "ControllerCancelled", e[e.ControlDisabled = 9] = "ControlDisabled"; }(e.SessionTerminatedReason || (e.SessionTerminatedReason = {})), e.getCapableParticipants = function (e) { if (!e) throw new Error("[remoteCamera.getCapableParticipants] Callback cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), o.sendMessageToParent("remoteCamera.getCapableParticipants", e); }, e.requestControl = function (e, n) { if (!e) throw new Error("[remoteCamera.requestControl] Participant cannot be null"); if (!n) throw new Error("[remoteCamera.requestControl] Callback cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), o.sendMessageToParent("remoteCamera.requestControl", [e], n); }, e.sendControlCommand = function (e, n) { if (!e) throw new Error("[remoteCamera.sendControlCommand] ControlCommand cannot be null"); if (!n) throw new Error("[remoteCamera.sendControlCommand] Callback cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), o.sendMessageToParent("remoteCamera.sendControlCommand", [e], n); }, e.terminateSession = function (e) { if (!e) throw new Error("[remoteCamera.terminateSession] Callback cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), o.sendMessageToParent("remoteCamera.terminateSession", e); }, e.registerOnCapableParticipantsChangeHandler = function (e) { if (!e) throw new Error("[remoteCamera.registerOnCapableParticipantsChangeHandler] Handler cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), a.registerHandler("remoteCamera.capableParticipantsChange", e); }, e.registerOnErrorHandler = function (e) { if (!e) throw new Error("[remoteCamera.registerOnErrorHandler] Handler cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), a.registerHandler("remoteCamera.handlerError", e); }, e.registerOnDeviceStateChangeHandler = function (e) { if (!e) throw new Error("[remoteCamera.registerOnDeviceStateChangeHandler] Handler cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), a.registerHandler("remoteCamera.deviceStateChange", e); }, e.registerOnSessionStatusChangeHandler = function (e) { if (!e) throw new Error("[remoteCamera.registerOnSessionStatusChangeHandler] Handler cannot be null"); r.ensureInitialized(i.FrameContexts.sidePanel), a.registerHandler("remoteCamera.sessionStatusChange", e); }; }(n.remoteCamera || (n.remoteCamera = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(0), i = t(1), o = t(8); !function (e) { !function (e) { e.Dropbox = "DROPBOX", e.Box = "BOX", e.Sharefile = "SHAREFILE", e.GoogleDrive = "GOOGLEDRIVE", e.Egnyte = "EGNYTE"; }(e.CloudStorageProvider || (e.CloudStorageProvider = {})), function (e) { e[e.Sharepoint = 0] = "Sharepoint", e[e.WopiIntegration = 1] = "WopiIntegration", e[e.Google = 2] = "Google"; }(e.CloudStorageProviderType || (e.CloudStorageProviderType = {})), e.getCloudStorageFolders = function (e, n) { if (i.ensureInitialized(o.FrameContexts.content), !e || 0 == e.length) throw new Error("[files.getCloudStorageFolders] channelId name cannot be null or empty"); if (!n) throw new Error("[files.getCloudStorageFolders] Callback cannot be null"); r.sendMessageToParent("files.getCloudStorageFolders", [e], n); }, e.addCloudStorageFolder = function (e, n) { if (i.ensureInitialized(o.FrameContexts.content), !e || 0 == e.length) throw new Error("[files.addCloudStorageFolder] channelId name cannot be null or empty"); if (!n) throw new Error("[files.addCloudStorageFolder] Callback cannot be null"); r.sendMessageToParent("files.addCloudStorageFolder", [e], n); }, e.deleteCloudStorageFolder = function (e, n, t) { if (i.ensureInitialized(o.FrameContexts.content), !e) throw new Error("[files.deleteCloudStorageFolder] channelId name cannot be null or empty"); if (!n) throw new Error("[files.deleteCloudStorageFolder] folderToDelete cannot be null or empty"); if (!t) throw new Error("[files.deleteCloudStorageFolder] Callback cannot be null"); r.sendMessageToParent("files.deleteCloudStorageFolder", [e, n], t); }, e.getCloudStorageFolderContents = function (e, n, t) { if (i.ensureInitialized(o.FrameContexts.content), !e || !n) throw new Error("[files.getCloudStorageFolderContents] folder/providerCode name cannot be null or empty"); if (!t) throw new Error("[files.getCloudStorageFolderContents] Callback cannot be null"); if ("isSubdirectory" in e && !e.isSubdirectory) throw new Error("[files.getCloudStorageFolderContents] provided folder is not a subDirectory"); r.sendMessageToParent("files.getCloudStorageFolderContents", [e, n], t); }, e.openCloudStorageFile = function (e, n, t) { if (i.ensureInitialized(o.FrameContexts.content), !e || !n) throw new Error("[files.openCloudStorageFile] file/providerCode cannot be null or empty"); if (e.isSubdirectory) throw new Error("[files.openCloudStorageFile] provided file is a subDirectory"); r.sendMessageToParent("files.openCloudStorageFile", [e, n, t]); }; }(n.files || (n.files = {})); }, function (e, n, t) { Object.defineProperty(n, "__esModule", { value: !0 }); var r = t(0), i = t(1), o = t(8); !function (e) { (n.appEntity || (n.appEntity = {})).selectAppEntity = function (e, n, t) { if (i.ensureInitialized(o.FrameContexts.content), !e || 0 == e.length) throw new Error("[appEntity.selectAppEntity] threadId name cannot be null or empty"); if (!t) throw new Error("[appEntity.selectAppEntity] Callback cannot be null"); r.sendMessageToParent("appEntity.selectAppEntity", [e, n], t); }; }(); }]) });
    });

    var MicrosoftTeams_min$1 = /*@__PURE__*/unwrapExports(MicrosoftTeams_min);

    // Copyright (c) Microsoft Corporation.
    /**
     * A constant that indicates whether the environment is node.js or browser based.
     */
    var isNode = typeof process !== "undefined" &&
        !!process.version &&
        !!process.versions &&
        !!process.versions.node;

    // Copyright (c) Microsoft Corporation.
    function log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 0) {
            var firstArg = String(args[0]);
            if (firstArg.includes(":error")) {
                console.error.apply(console, __spread(args));
            }
            else if (firstArg.includes(":warning")) {
                console.warn.apply(console, __spread(args));
            }
            else if (firstArg.includes(":info")) {
                console.info.apply(console, __spread(args));
            }
            else if (firstArg.includes(":verbose")) {
                console.debug.apply(console, __spread(args));
            }
            else {
                console.debug.apply(console, __spread(args));
            }
        }
    }

    // Copyright (c) Microsoft Corporation.
    var debugEnvVariable = (typeof process !== "undefined" && process.env && process.env.DEBUG) || undefined;
    var enabledString;
    var enabledNamespaces = [];
    var skippedNamespaces = [];
    var debuggers = [];
    if (debugEnvVariable) {
        enable(debugEnvVariable);
    }
    var debugObj = Object.assign(function (namespace) {
        return createDebugger(namespace);
    }, {
        enable: enable,
        enabled: enabled,
        disable: disable,
        log: log
    });
    function enable(namespaces) {
        var e_1, _a, e_2, _b;
        enabledString = namespaces;
        enabledNamespaces = [];
        skippedNamespaces = [];
        var wildcard = /\*/g;
        var namespaceList = namespaces.split(",").map(function (ns) { return ns.trim().replace(wildcard, ".*?"); });
        try {
            for (var namespaceList_1 = __values(namespaceList), namespaceList_1_1 = namespaceList_1.next(); !namespaceList_1_1.done; namespaceList_1_1 = namespaceList_1.next()) {
                var ns = namespaceList_1_1.value;
                if (ns.startsWith("-")) {
                    skippedNamespaces.push(new RegExp("^" + ns.substr(1) + "$"));
                }
                else {
                    enabledNamespaces.push(new RegExp("^" + ns + "$"));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (namespaceList_1_1 && !namespaceList_1_1.done && (_a = namespaceList_1.return)) _a.call(namespaceList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var debuggers_1 = __values(debuggers), debuggers_1_1 = debuggers_1.next(); !debuggers_1_1.done; debuggers_1_1 = debuggers_1.next()) {
                var instance = debuggers_1_1.value;
                instance.enabled = enabled(instance.namespace);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (debuggers_1_1 && !debuggers_1_1.done && (_b = debuggers_1.return)) _b.call(debuggers_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function enabled(namespace) {
        var e_3, _a, e_4, _b;
        if (namespace.endsWith("*")) {
            return true;
        }
        try {
            for (var skippedNamespaces_1 = __values(skippedNamespaces), skippedNamespaces_1_1 = skippedNamespaces_1.next(); !skippedNamespaces_1_1.done; skippedNamespaces_1_1 = skippedNamespaces_1.next()) {
                var skipped = skippedNamespaces_1_1.value;
                if (skipped.test(namespace)) {
                    return false;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (skippedNamespaces_1_1 && !skippedNamespaces_1_1.done && (_a = skippedNamespaces_1.return)) _a.call(skippedNamespaces_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var enabledNamespaces_1 = __values(enabledNamespaces), enabledNamespaces_1_1 = enabledNamespaces_1.next(); !enabledNamespaces_1_1.done; enabledNamespaces_1_1 = enabledNamespaces_1.next()) {
                var enabledNamespace = enabledNamespaces_1_1.value;
                if (enabledNamespace.test(namespace)) {
                    return true;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (enabledNamespaces_1_1 && !enabledNamespaces_1_1.done && (_b = enabledNamespaces_1.return)) _b.call(enabledNamespaces_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    }
    function disable() {
        var result = enabledString || "";
        enable("");
        return result;
    }
    function createDebugger(namespace) {
        var newDebugger = Object.assign(debug, {
            enabled: enabled(namespace),
            destroy: destroy,
            log: debugObj.log,
            namespace: namespace,
            extend: extend$1
        });
        function debug() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!newDebugger.enabled) {
                return;
            }
            if (args.length > 0) {
                args[0] = namespace + " " + args[0];
            }
            newDebugger.log.apply(newDebugger, __spread(args));
        }
        debuggers.push(newDebugger);
        return newDebugger;
    }
    function destroy() {
        var index = debuggers.indexOf(this);
        if (index >= 0) {
            debuggers.splice(index, 1);
            return true;
        }
        return false;
    }
    function extend$1(namespace) {
        var newDebugger = createDebugger(this.namespace + ":" + namespace);
        newDebugger.log = this.log;
        return newDebugger;
    }

    // Copyright (c) Microsoft Corporation.
    var registeredLoggers = new Set();
    var logLevelFromEnv = (typeof process !== "undefined" && process.env && process.env.AZURE_LOG_LEVEL) || undefined;
    var azureLogLevel;
    /**
     * The AzureLogger provides a mechanism for overriding where logs are output to.
     * By default, logs are sent to stderr.
     * Override the `log` method to redirect logs to another location.
     */
    var AzureLogger = debugObj("azure");
    AzureLogger.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        debugObj.log.apply(debugObj, __spread(args));
    };
    var AZURE_LOG_LEVELS = ["verbose", "info", "warning", "error"];
    if (logLevelFromEnv) {
        // avoid calling setLogLevel because we don't want a mis-set environment variable to crash
        if (isAzureLogLevel(logLevelFromEnv)) {
            setLogLevel(logLevelFromEnv);
        }
        else {
            console.error("AZURE_LOG_LEVEL set to unknown log level '" + logLevelFromEnv + "'; logging is not enabled. Acceptable values: " + AZURE_LOG_LEVELS.join(", ") + ".");
        }
    }
    /**
     * Immediately enables logging at the specified log level.
     * @param level - The log level to enable for logging.
     * Options from most verbose to least verbose are:
     * - verbose
     * - info
     * - warning
     * - error
     */
    function setLogLevel(level) {
        var e_1, _a;
        if (level && !isAzureLogLevel(level)) {
            throw new Error("Unknown log level '" + level + "'. Acceptable values: " + AZURE_LOG_LEVELS.join(","));
        }
        azureLogLevel = level;
        var enabledNamespaces = [];
        try {
            for (var registeredLoggers_1 = __values(registeredLoggers), registeredLoggers_1_1 = registeredLoggers_1.next(); !registeredLoggers_1_1.done; registeredLoggers_1_1 = registeredLoggers_1.next()) {
                var logger = registeredLoggers_1_1.value;
                if (shouldEnable(logger)) {
                    enabledNamespaces.push(logger.namespace);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (registeredLoggers_1_1 && !registeredLoggers_1_1.done && (_a = registeredLoggers_1.return)) _a.call(registeredLoggers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        debugObj.enable(enabledNamespaces.join(","));
    }
    var levelMap = {
        verbose: 400,
        info: 300,
        warning: 200,
        error: 100
    };
    /**
     * Creates a logger for use by the Azure SDKs that inherits from `AzureLogger`.
     * @param namespace - The name of the SDK package.
     * @hidden
     */
    function createClientLogger(namespace) {
        var clientRootLogger = AzureLogger.extend(namespace);
        patchLogMethod(AzureLogger, clientRootLogger);
        return {
            error: createLogger(clientRootLogger, "error"),
            warning: createLogger(clientRootLogger, "warning"),
            info: createLogger(clientRootLogger, "info"),
            verbose: createLogger(clientRootLogger, "verbose")
        };
    }
    function patchLogMethod(parent, child) {
        child.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            parent.log.apply(parent, __spread(args));
        };
    }
    function createLogger(parent, level) {
        var logger = Object.assign(parent.extend(level), {
            level: level
        });
        patchLogMethod(parent, logger);
        if (shouldEnable(logger)) {
            var enabledNamespaces = debugObj.disable();
            debugObj.enable(enabledNamespaces + "," + logger.namespace);
        }
        registeredLoggers.add(logger);
        return logger;
    }
    function shouldEnable(logger) {
        if (azureLogLevel && levelMap[logger.level] <= levelMap[azureLogLevel]) {
            return true;
        }
        else {
            return false;
        }
    }
    function isAzureLogLevel(logLevel) {
        return AZURE_LOG_LEVELS.includes(logLevel);
    }

    // Copyright (c) Microsoft Corporation.
    // Licensed under the MIT license.
    /**
     * Available resource type.
     * @beta
     */
    exports.ResourceType = void 0;
    (function (ResourceType) {
        /**
         * SQL database.
         *
         */
        ResourceType[ResourceType["SQL"] = 0] = "SQL";
        /**
         * Rest API.
         *
         */
        ResourceType[ResourceType["API"] = 1] = "API";
    })(exports.ResourceType || (exports.ResourceType = {}));

    // Copyright (c) Microsoft Corporation.
    /**
     * Global configuration instance
     *
     */
    let config;
    /**
     * Initialize configuration from environment variables or configuration object and set the global instance
     *
     * @param {Configuration} configuration - Optional configuration that overrides the default configuration values. The override depth is 1.
     *
     * @throws {@link ErrorCode|InvalidParameter} when configuration is not passed in browser environment
     *
     * @beta
     */
    function loadConfiguration(configuration) {
        internalLogger.info("load configuration");
        // browser environment
        if (!isNode) {
            if (!configuration) {
                const errorMsg = "You are running the code in browser. Configuration must be passed in.";
                internalLogger.error(errorMsg);
                throw new ErrorWithCode(errorMsg, exports.ErrorCode.InvalidParameter);
            }
            config = configuration;
            return;
        }
        // node environment
        let newAuthentication;
        let newResources = [];
        const defaultResourceName = "default";
        if (configuration === null || configuration === void 0 ? void 0 : configuration.authentication) {
            newAuthentication = configuration.authentication;
        }
        else {
            newAuthentication = {
                authorityHost: process.env.M365_AUTHORITY_HOST,
                tenantId: process.env.M365_TENANT_ID,
                clientId: process.env.M365_CLIENT_ID,
                clientSecret: process.env.M365_CLIENT_SECRET,
                simpleAuthEndpoint: process.env.SIMPLE_AUTH_ENDPOINT,
                initiateLoginEndpoint: process.env.INITIATE_LOGIN_ENDPOINT,
                applicationIdUri: process.env.M365_APPLICATION_ID_URI,
            };
        }
        if (configuration === null || configuration === void 0 ? void 0 : configuration.resources) {
            newResources = configuration.resources;
        }
        else {
            newResources = [
                {
                    // SQL resource
                    type: exports.ResourceType.SQL,
                    name: defaultResourceName,
                    properties: {
                        sqlServerEndpoint: process.env.SQL_ENDPOINT,
                        sqlUsername: process.env.SQL_USER_NAME,
                        sqlPassword: process.env.SQL_PASSWORD,
                        sqlDatabaseName: process.env.SQL_DATABASE_NAME,
                        sqlIdentityId: process.env.IDENTITY_ID,
                    },
                },
                {
                    // API resource
                    type: exports.ResourceType.API,
                    name: defaultResourceName,
                    properties: {
                        endpoint: process.env.API_ENDPOINT,
                    },
                },
            ];
        }
        config = {
            authentication: newAuthentication,
            resources: newResources,
        };
    }
    /**
     * Get configuration for a specific resource.
     * @param {ResourceType} resourceType - The type of resource
     * @param {string} resourceName - The name of resource, default value is "default".
     *
     * @returns Resource configuration for target resource from global configuration instance.
     *
     * @throws {@link ErrorCode|InvalidConfiguration} when resource configuration with the specific type and name is not found
     *
     * @beta
     */
    function getResourceConfiguration(resourceType, resourceName = "default") {
        var _a;
        internalLogger.info(`Get resource configuration of ${exports.ResourceType[resourceType]} from ${resourceName}`);
        const result = (_a = config.resources) === null || _a === void 0 ? void 0 : _a.find((item) => item.type === resourceType && item.name === resourceName);
        if (result) {
            return result.properties;
        }
        const errorMsg = formatString(ErrorMessage.MissingResourceConfiguration, exports.ResourceType[resourceType], resourceName);
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(errorMsg, exports.ErrorCode.InvalidConfiguration);
    }
    /**
     * Get configuration for authentication.
     *
     * @returns Authentication configuration from global configuration instance, the value may be undefined if no authentication config exists in current environment.
     *
     * @throws {@link ErrorCode|InvalidConfiguration} when global configuration does not exist
     *
     * @beta
     */
    function getAuthenticationConfiguration() {
        internalLogger.info("Get authentication configuration");
        if (config) {
            return config.authentication;
        }
        const errorMsg = "Please call loadConfiguration() first before calling getAuthenticationConfiguration().";
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(formatString(ErrorMessage.ConfigurationNotExists, errorMsg), exports.ErrorCode.InvalidConfiguration);
    }

    var bind = function bind(fn, thisArg) {
        return function wrap() {
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; i++) {
                args[i] = arguments[i];
            }
            return fn.apply(thisArg, args);
        };
    };

    /*global toString:true*/

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
        return toString.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
        return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
        return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
            && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
        return toString.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
        return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
        var result;
        if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
            result = ArrayBuffer.isView(val);
        } else {
            result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
        }
        return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
        return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
        return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
        return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
        if (toString.call(val) !== '[object Object]') {
            return false;
        }

        var prototype = Object.getPrototypeOf(val);
        return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
        return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
        return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
        return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
        return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
        return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
        if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
            navigator.product === 'NativeScript' ||
            navigator.product === 'NS')) {
            return false;
        }
        return (
            typeof window !== 'undefined' &&
            typeof document !== 'undefined'
        );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') {
            return;
        }

        // Force an array if not already something iterable
        if (typeof obj !== 'object') {
            /*eslint no-param-reassign:0*/
            obj = [obj];
        }

        if (isArray(obj)) {
            // Iterate over array values
            for (var i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        } else {
            // Iterate over object keys
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    fn.call(null, obj[key], key, obj);
                }
            }
        }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
        var result = {};
        function assignValue(val, key) {
            if (isPlainObject(result[key]) && isPlainObject(val)) {
                result[key] = merge(result[key], val);
            } else if (isPlainObject(val)) {
                result[key] = merge({}, val);
            } else if (isArray(val)) {
                result[key] = val.slice();
            } else {
                result[key] = val;
            }
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
            forEach(arguments[i], assignValue);
        }
        return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
        forEach(b, function assignValue(val, key) {
            if (thisArg && typeof val === 'function') {
                a[key] = bind(val, thisArg);
            } else {
                a[key] = val;
            }
        });
        return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        return content;
    }

    var utils = {
        isArray: isArray,
        isArrayBuffer: isArrayBuffer,
        isBuffer: isBuffer,
        isFormData: isFormData,
        isArrayBufferView: isArrayBufferView,
        isString: isString,
        isNumber: isNumber,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isUndefined: isUndefined,
        isDate: isDate,
        isFile: isFile,
        isBlob: isBlob,
        isFunction: isFunction,
        isStream: isStream,
        isURLSearchParams: isURLSearchParams,
        isStandardBrowserEnv: isStandardBrowserEnv,
        forEach: forEach,
        merge: merge,
        extend: extend,
        trim: trim,
        stripBOM: stripBOM
    };

    function encode(val) {
        return encodeURIComponent(val).
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%20/g, '+').
            replace(/%5B/gi, '[').
            replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
        /*eslint no-param-reassign:0*/
        if (!params) {
            return url;
        }

        var serializedParams;
        if (paramsSerializer) {
            serializedParams = paramsSerializer(params);
        } else if (utils.isURLSearchParams(params)) {
            serializedParams = params.toString();
        } else {
            var parts = [];

            utils.forEach(params, function serialize(val, key) {
                if (val === null || typeof val === 'undefined') {
                    return;
                }

                if (utils.isArray(val)) {
                    key = key + '[]';
                } else {
                    val = [val];
                }

                utils.forEach(val, function parseValue(v) {
                    if (utils.isDate(v)) {
                        v = v.toISOString();
                    } else if (utils.isObject(v)) {
                        v = JSON.stringify(v);
                    }
                    parts.push(encode(key) + '=' + encode(v));
                });
            });

            serializedParams = parts.join('&');
        }

        if (serializedParams) {
            var hashmarkIndex = url.indexOf('#');
            if (hashmarkIndex !== -1) {
                url = url.slice(0, hashmarkIndex);
            }

            url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }

        return url;
    };

    function InterceptorManager() {
        this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
        this.handlers.push({
            fulfilled: fulfilled,
            rejected: rejected
        });
        return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) {
                fn(h);
            }
        });
    };

    var InterceptorManager_1 = InterceptorManager;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
        /*eslint no-param-reassign:0*/
        utils.forEach(fns, function transform(fn) {
            data = fn(data, headers);
        });

        return data;
    };

    var isCancel = function isCancel(value) {
        return !!(value && value.__CANCEL__);
    };

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
        utils.forEach(headers, function processHeader(value, name) {
            if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                headers[normalizedName] = value;
                delete headers[name];
            }
        });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
        error.config = config;
        if (code) {
            error.code = code;
        }

        error.request = request;
        error.response = response;
        error.isAxiosError = true;

        error.toJSON = function toJSON() {
            return {
                // Standard
                message: this.message,
                name: this.name,
                // Microsoft
                description: this.description,
                number: this.number,
                // Mozilla
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                // Axios
                config: this.config,
                code: this.code
            };
        };
        return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
        var error = new Error(message);
        return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
        var validateStatus = response.config.validateStatus;
        if (!response.status || !validateStatus || validateStatus(response.status)) {
            resolve(response);
        } else {
            reject(createError(
                'Request failed with status code ' + response.status,
                response.config,
                null,
                response.request,
                response
            ));
        }
    };

    var cookies = (
        utils.isStandardBrowserEnv() ?

            // Standard browser envs support document.cookie
            (function standardBrowserEnv() {
                return {
                    write: function write(name, value, expires, path, domain, secure) {
                        var cookie = [];
                        cookie.push(name + '=' + encodeURIComponent(value));

                        if (utils.isNumber(expires)) {
                            cookie.push('expires=' + new Date(expires).toGMTString());
                        }

                        if (utils.isString(path)) {
                            cookie.push('path=' + path);
                        }

                        if (utils.isString(domain)) {
                            cookie.push('domain=' + domain);
                        }

                        if (secure === true) {
                            cookie.push('secure');
                        }

                        document.cookie = cookie.join('; ');
                    },

                    read: function read(name) {
                        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
                        return (match ? decodeURIComponent(match[3]) : null);
                    },

                    remove: function remove(name) {
                        this.write(name, '', Date.now() - 86400000);
                    }
                };
            })() :

            // Non standard browser env (web workers, react-native) lack needed support.
            (function nonStandardBrowserEnv() {
                return {
                    write: function write() { },
                    read: function read() { return null; },
                    remove: function remove() { }
                };
            })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
        // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
        // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
        // by any combination of letters, digits, plus, period, or hyphen.
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
        return relativeURL
            ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
            : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
            return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
        'age', 'authorization', 'content-length', 'content-type', 'etag',
        'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
        'last-modified', 'location', 'max-forwards', 'proxy-authorization',
        'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
        var parsed = {};
        var key;
        var val;
        var i;

        if (!headers) { return parsed; }

        utils.forEach(headers.split('\n'), function parser(line) {
            i = line.indexOf(':');
            key = utils.trim(line.substr(0, i)).toLowerCase();
            val = utils.trim(line.substr(i + 1));

            if (key) {
                if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                    return;
                }
                if (key === 'set-cookie') {
                    parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
                } else {
                    parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
                }
            }
        });

        return parsed;
    };

    var isURLSameOrigin = (
        utils.isStandardBrowserEnv() ?

            // Standard browser envs have full support of the APIs needed to test
            // whether the request URL is of the same origin as current location.
            (function standardBrowserEnv() {
                var msie = /(msie|trident)/i.test(navigator.userAgent);
                var urlParsingNode = document.createElement('a');
                var originURL;

                /**
              * Parse a URL to discover it's components
              *
              * @param {String} url The URL to be parsed
              * @returns {Object}
              */
                function resolveURL(url) {
                    var href = url;

                    if (msie) {
                        // IE needs attribute set twice to normalize properties
                        urlParsingNode.setAttribute('href', href);
                        href = urlParsingNode.href;
                    }

                    urlParsingNode.setAttribute('href', href);

                    // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
                    return {
                        href: urlParsingNode.href,
                        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                        host: urlParsingNode.host,
                        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
                        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
                        hostname: urlParsingNode.hostname,
                        port: urlParsingNode.port,
                        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                            urlParsingNode.pathname :
                            '/' + urlParsingNode.pathname
                    };
                }

                originURL = resolveURL(window.location.href);

                /**
              * Determine if a URL shares the same origin as the current location
              *
              * @param {String} requestURL The URL to test
              * @returns {boolean} True if URL shares the same origin, otherwise false
              */
                return function isURLSameOrigin(requestURL) {
                    var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
                    return (parsed.protocol === originURL.protocol &&
                        parsed.host === originURL.host);
                };
            })() :

            // Non standard browser envs (web workers, react-native) lack needed support.
            (function nonStandardBrowserEnv() {
                return function isURLSameOrigin() {
                    return true;
                };
            })()
    );

    var xhr = function xhrAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
            var requestData = config.data;
            var requestHeaders = config.headers;

            if (utils.isFormData(requestData)) {
                delete requestHeaders['Content-Type']; // Let the browser set it
            }

            var request = new XMLHttpRequest();

            // HTTP basic authentication
            if (config.auth) {
                var username = config.auth.username || '';
                var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
                requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
            }

            var fullPath = buildFullPath(config.baseURL, config.url);
            request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

            // Set the request timeout in MS
            request.timeout = config.timeout;

            // Listen for ready state
            request.onreadystatechange = function handleLoad() {
                if (!request || request.readyState !== 4) {
                    return;
                }

                // The request errored out and we didn't get a response, this will be
                // handled by onerror instead
                // With one exception: request that using file: protocol, most browsers
                // will return status as 0 even though it's a successful request
                if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                    return;
                }

                // Prepare the response
                var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };

                settle(resolve, reject, response);

                // Clean up request
                request = null;
            };

            // Handle browser request cancellation (as opposed to a manual cancellation)
            request.onabort = function handleAbort() {
                if (!request) {
                    return;
                }

                reject(createError('Request aborted', config, 'ECONNABORTED', request));

                // Clean up request
                request = null;
            };

            // Handle low level network errors
            request.onerror = function handleError() {
                // Real errors are hidden from us by the browser
                // onerror should only fire if it's a network error
                reject(createError('Network Error', config, null, request));

                // Clean up request
                request = null;
            };

            // Handle timeout
            request.ontimeout = function handleTimeout() {
                var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
                if (config.timeoutErrorMessage) {
                    timeoutErrorMessage = config.timeoutErrorMessage;
                }
                reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
                    request));

                // Clean up request
                request = null;
            };

            // Add xsrf header
            // This is only done if running in a standard browser environment.
            // Specifically not if we're in a web worker, or react-native.
            if (utils.isStandardBrowserEnv()) {
                // Add xsrf header
                var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
                    cookies.read(config.xsrfCookieName) :
                    undefined;

                if (xsrfValue) {
                    requestHeaders[config.xsrfHeaderName] = xsrfValue;
                }
            }

            // Add headers to the request
            if ('setRequestHeader' in request) {
                utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                    if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                        // Remove Content-Type if data is undefined
                        delete requestHeaders[key];
                    } else {
                        // Otherwise add header to the request
                        request.setRequestHeader(key, val);
                    }
                });
            }

            // Add withCredentials to request if needed
            if (!utils.isUndefined(config.withCredentials)) {
                request.withCredentials = !!config.withCredentials;
            }

            // Add responseType to request if needed
            if (config.responseType) {
                try {
                    request.responseType = config.responseType;
                } catch (e) {
                    // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
                    // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
                    if (config.responseType !== 'json') {
                        throw e;
                    }
                }
            }

            // Handle progress if needed
            if (typeof config.onDownloadProgress === 'function') {
                request.addEventListener('progress', config.onDownloadProgress);
            }

            // Not all browsers support upload events
            if (typeof config.onUploadProgress === 'function' && request.upload) {
                request.upload.addEventListener('progress', config.onUploadProgress);
            }

            if (config.cancelToken) {
                // Handle cancellation
                config.cancelToken.promise.then(function onCanceled(cancel) {
                    if (!request) {
                        return;
                    }

                    request.abort();
                    reject(cancel);
                    // Clean up request
                    request = null;
                });
            }

            if (!requestData) {
                requestData = null;
            }

            // Send the request
            request.send(requestData);
        });
    };

    var DEFAULT_CONTENT_TYPE = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
        if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
            headers['Content-Type'] = value;
        }
    }

    function getDefaultAdapter() {
        var adapter;
        if (typeof XMLHttpRequest !== 'undefined') {
            // For browsers use XHR adapter
            adapter = xhr;
        } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
            // For node use HTTP adapter
            adapter = xhr;
        }
        return adapter;
    }

    var defaults = {
        adapter: getDefaultAdapter(),

        transformRequest: [function transformRequest(data, headers) {
            normalizeHeaderName(headers, 'Accept');
            normalizeHeaderName(headers, 'Content-Type');
            if (utils.isFormData(data) ||
                utils.isArrayBuffer(data) ||
                utils.isBuffer(data) ||
                utils.isStream(data) ||
                utils.isFile(data) ||
                utils.isBlob(data)
            ) {
                return data;
            }
            if (utils.isArrayBufferView(data)) {
                return data.buffer;
            }
            if (utils.isURLSearchParams(data)) {
                setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
                return data.toString();
            }
            if (utils.isObject(data)) {
                setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
                return JSON.stringify(data);
            }
            return data;
        }],

        transformResponse: [function transformResponse(data) {
            /*eslint no-param-reassign:0*/
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) { /* Ignore */ }
            }
            return data;
        }],

        /**
         * A timeout in milliseconds to abort a request. If set to 0 (default) a
         * timeout is not created.
         */
        timeout: 0,

        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',

        maxContentLength: -1,
        maxBodyLength: -1,

        validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
        }
    };

    defaults.headers = {
        common: {
            'Accept': 'application/json, text/plain, */*'
        }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
        defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
        defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
            config.cancelToken.throwIfRequested();
        }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
        throwIfCancellationRequested(config);

        // Ensure headers exist
        config.headers = config.headers || {};

        // Transform request data
        config.data = transformData(
            config.data,
            config.headers,
            config.transformRequest
        );

        // Flatten headers
        config.headers = utils.merge(
            config.headers.common || {},
            config.headers[config.method] || {},
            config.headers
        );

        utils.forEach(
            ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
            function cleanHeaderConfig(method) {
                delete config.headers[method];
            }
        );

        var adapter = config.adapter || defaults_1.adapter;

        return adapter(config).then(function onAdapterResolution(response) {
            throwIfCancellationRequested(config);

            // Transform response data
            response.data = transformData(
                response.data,
                response.headers,
                config.transformResponse
            );

            return response;
        }, function onAdapterRejection(reason) {
            if (!isCancel(reason)) {
                throwIfCancellationRequested(config);

                // Transform response data
                if (reason && reason.response) {
                    reason.response.data = transformData(
                        reason.response.data,
                        reason.response.headers,
                        config.transformResponse
                    );
                }
            }

            return Promise.reject(reason);
        });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
        // eslint-disable-next-line no-param-reassign
        config2 = config2 || {};
        var config = {};

        var valueFromConfig2Keys = ['url', 'method', 'data'];
        var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
        var defaultToConfig2Keys = [
            'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
            'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
            'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
            'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
            'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
        ];
        var directMergeKeys = ['validateStatus'];

        function getMergedValue(target, source) {
            if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
                return utils.merge(target, source);
            } else if (utils.isPlainObject(source)) {
                return utils.merge({}, source);
            } else if (utils.isArray(source)) {
                return source.slice();
            }
            return source;
        }

        function mergeDeepProperties(prop) {
            if (!utils.isUndefined(config2[prop])) {
                config[prop] = getMergedValue(config1[prop], config2[prop]);
            } else if (!utils.isUndefined(config1[prop])) {
                config[prop] = getMergedValue(undefined, config1[prop]);
            }
        }

        utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
            if (!utils.isUndefined(config2[prop])) {
                config[prop] = getMergedValue(undefined, config2[prop]);
            }
        });

        utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

        utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
            if (!utils.isUndefined(config2[prop])) {
                config[prop] = getMergedValue(undefined, config2[prop]);
            } else if (!utils.isUndefined(config1[prop])) {
                config[prop] = getMergedValue(undefined, config1[prop]);
            }
        });

        utils.forEach(directMergeKeys, function merge(prop) {
            if (prop in config2) {
                config[prop] = getMergedValue(config1[prop], config2[prop]);
            } else if (prop in config1) {
                config[prop] = getMergedValue(undefined, config1[prop]);
            }
        });

        var axiosKeys = valueFromConfig2Keys
            .concat(mergeDeepPropertiesKeys)
            .concat(defaultToConfig2Keys)
            .concat(directMergeKeys);

        var otherKeys = Object
            .keys(config1)
            .concat(Object.keys(config2))
            .filter(function filterAxiosKeys(key) {
                return axiosKeys.indexOf(key) === -1;
            });

        utils.forEach(otherKeys, mergeDeepProperties);

        return config;
    };

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
            request: new InterceptorManager_1(),
            response: new InterceptorManager_1()
        };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof config === 'string') {
            config = arguments[1] || {};
            config.url = arguments[0];
        } else {
            config = config || {};
        }

        config = mergeConfig(this.defaults, config);

        // Set config.method
        if (config.method) {
            config.method = config.method.toLowerCase();
        } else if (this.defaults.method) {
            config.method = this.defaults.method.toLowerCase();
        } else {
            config.method = 'get';
        }

        // Hook up interceptors middleware
        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve(config);

        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
        config = mergeConfig(this.defaults, config);
        return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
        /*eslint func-names:0*/
        Axios.prototype[method] = function (url, config) {
            return this.request(mergeConfig(config || {}, {
                method: method,
                url: url,
                data: (config || {}).data
            }));
        };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
        /*eslint func-names:0*/
        Axios.prototype[method] = function (url, data, config) {
            return this.request(mergeConfig(config || {}, {
                method: method,
                url: url,
                data: data
            }));
        };
    });

    var Axios_1 = Axios;

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
        this.message = message;
    }

    Cancel.prototype.toString = function toString() {
        return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
        if (typeof executor !== 'function') {
            throw new TypeError('executor must be a function.');
        }

        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });

        var token = this;
        executor(function cancel(message) {
            if (token.reason) {
                // Cancellation has already been requested
                return;
            }

            token.reason = new Cancel_1(message);
            resolvePromise(token.reason);
        });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token: token,
            cancel: cancel
        };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
        return function wrap(arr) {
            return callback.apply(null, arr);
        };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
        return (typeof payload === 'object') && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
        var context = new Axios_1(defaultConfig);
        var instance = bind(Axios_1.prototype.request, context);

        // Copy axios.prototype to instance
        utils.extend(instance, Axios_1.prototype, context);

        // Copy context to instance
        utils.extend(instance, context);

        return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Factory for creating new instances
    axios$1.create = function create(instanceConfig) {
        return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios$1.Cancel = Cancel_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;

    // Expose all/spread
    axios$1.all = function all(promises) {
        return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default = axios$1;
    axios_1.default = _default;

    var axios = axios_1;

    // Copyright (c) Microsoft Corporation.
    // Licensed under the MIT license.
    /**
     * @internal
     */
    var GrantType;
    (function (GrantType) {
        GrantType["authCode"] = "authorization_code";
        GrantType["ssoToken"] = "sso_token";
    })(GrantType || (GrantType = {}));

    // Copyright (c) Microsoft Corporation.
    const accessTokenCacheKeyPrefix = "accessToken";
    const separator = "-";
    const tokenRefreshTimeSpanInMillisecond = 5 * 60 * 1000;
    const initializeTeamsSdkTimeoutInMillisecond = 5000;
    const loginPageWidth = 600;
    const loginPageHeight = 535;
    const maxRetryCount = 3;
    const retryTimeSpanInMillisecond = 3000;
    /**
     * Represent Teams current user's identity, and it is used within Teams tab application.
     *
     * @remarks
     * Can only be used within Teams.
     *
     * @beta
     */
    class TeamsUserCredential {
        /**
         * Constructor of TeamsUserCredential.
         * Developer need to call loadConfiguration(config) before using this class.
         *
         * @example
         * ```typescript
         * const config = {
         *  authentication: {
         *    runtimeConnectorEndpoint: "https://xxx.xxx.com",
         *    initiateLoginEndpoint: "https://localhost:3000/auth-start.html",
         *    clientId: "xxx"
         *   }
         * }
           loadConfiguration(config); // No default config from environment variables, developers must provide the config object.
           const credential = new TeamsUserCredential(["https://graph.microsoft.com/User.Read"]);
         * ```
         *
         * @throws {@link ErrorCode|InvalidConfiguration} when client id, initiate login endpoint or simple auth endpoint is not found in config.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
         *
         * @beta
         */
        constructor() {
            internalLogger.info("Create teams user credential");
            this.config = this.loadAndValidateConfig();
            this.ssoToken = null;
        }
        /**
         * Popup login page to get user's access token with specific scopes.
         *
         * @remarks
         * Only works in Teams client APP. User will be redirected to the authorization page to login and consent.
         *
         * @example
         * ```typescript
         * await credential.login(["https://graph.microsoft.com/User.Read"]); // single scope using string array
         * await credential.login("https://graph.microsoft.com/User.Read"); // single scopes using string
         * await credential.login(["https://graph.microsoft.com/User.Read", "Calendars.Read"]); // multiple scopes using string array
         * await credential.login("https://graph.microsoft.com/User.Read Calendars.Read"); // multiple scopes using string
         * ```
         * @param scopes - The list of scopes for which the token will have access, before that, we will request user to consent.
         *
         * @throws {@link ErrorCode|InternalError} when failed to login with unknown error.
         * @throws {@link ErrorCode|ServiceError} when simple auth server failed to exchange access token.
         * @throws {@link ErrorCode|ConsentFailed} when user canceled or failed to consent.
         * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
         *
         * @beta
         */
        login(scopes) {
            return __awaiter$1(this, void 0, void 0, function* () {
                validateScopesType(scopes);
                const scopesStr = typeof scopes === "string" ? scopes : scopes.join(" ");
                internalLogger.info(`Popup login page to get user's access token with scopes: ${scopesStr}`);
                return new Promise((resolve, reject) => {
                    MicrosoftTeams_min$1.initialize(() => {
                        MicrosoftTeams_min$1.authentication.authenticate({
                            url: `${this.config.initiateLoginEndpoint}?clientId=${this.config.clientId}&scope=${encodeURI(scopesStr)}`,
                            width: loginPageWidth,
                            height: loginPageHeight,
                            successCallback: (result) => __awaiter$1(this, void 0, void 0, function* () {
                                if (!result) {
                                    const errorMsg = "Get empty authentication result from Teams";
                                    internalLogger.error(errorMsg);
                                    reject(new ErrorWithCode(errorMsg, exports.ErrorCode.InternalError));
                                    return;
                                }
                                const authCodeResult = JSON.parse(result);
                                try {
                                    yield this.exchangeAccessTokenFromSimpleAuthServer(scopesStr, authCodeResult);
                                    resolve();
                                }
                                catch (err) {
                                    reject(this.generateAuthServerError(err));
                                }
                            }),
                            failureCallback: (reason) => {
                                const errorMsg = `Consent failed for the scope ${scopesStr} with error: ${reason}`;
                                internalLogger.error(errorMsg);
                                reject(new ErrorWithCode(errorMsg, exports.ErrorCode.ConsentFailed));
                            },
                        });
                    });
                });
            });
        }
        /**
         * Get access token from credential.
         *
         * @example
         * ```typescript
         * await credential.getToken([]) // Get SSO token using empty string array
         * await credential.getToken("") // Get SSO token using empty string
         * await credential.getToken([".default"]) // Get Graph access token with default scope using string array
         * await credential.getToken(".default") // Get Graph access token with default scope using string
         * await credential.getToken(["User.Read"]) // Get Graph access token for single scope using string array
         * await credential.getToken("User.Read") // Get Graph access token for single scope using string
         * await credential.getToken(["User.Read", "Application.Read.All"]) // Get Graph access token for multiple scopes using string array
         * await credential.getToken("User.Read Application.Read.All") // Get Graph access token for multiple scopes using space-separated string
         * await credential.getToken("https://graph.microsoft.com/User.Read") // Get Graph access token with full resource URI
         * await credential.getToken(["https://outlook.office.com/Mail.Read"]) // Get Outlook access token
         * ```
         *
         * @param {string | string[]} scopes - The list of scopes for which the token will have access.
         * @param {GetTokenOptions} options - The options used to configure any requests this TokenCredential implementation might make.
         *
         * @throws {@link ErrorCode|InternalError} when failed to get access token with unknown error.
         * @throws {@link ErrorCode|UiRequiredError} when need user consent to get access token.
         * @throws {@link ErrorCode|ServiceError} when failed to get access token from simple auth server.
         * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
         *
         * @returns User access token of defined scopes.
         * If scopes is empty string or array, it returns SSO token.
         * If scopes is non-empty, it returns access token for target scope.
         * Throw error if get access token failed.
         *
         * @beta
         */
        getToken(scopes, options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                validateScopesType(scopes);
                const ssoToken = yield this.getSSOToken();
                const scopeStr = typeof scopes === "string" ? scopes : scopes.join(" ");
                if (scopeStr === "") {
                    internalLogger.info("Get SSO token");
                    return ssoToken;
                }
                else {
                    internalLogger.info("Get access token with scopes: " + scopeStr);
                    const cachedKey = yield this.getAccessTokenCacheKey(scopeStr);
                    const cachedToken = this.getTokenCache(cachedKey);
                    if (cachedToken) {
                        if (!this.isAccessTokenNearExpired(cachedToken)) {
                            internalLogger.verbose("Get access token from cache");
                            return cachedToken;
                        }
                        else {
                            internalLogger.verbose("Cached access token is expired");
                        }
                    }
                    else {
                        internalLogger.verbose("No cached access token");
                    }
                    const accessToken = yield this.getAndCacheAccessTokenFromSimpleAuthServer(scopeStr);
                    return accessToken;
                }
            });
        }
        /**
         * Get basic user info from SSO token
         *
         * @example
         * ```typescript
         * const currentUser = await credential.getUserInfo();
         * ```
         *
         * @throws {@link ErrorCode|InternalError} when SSO token from Teams client is not valid.
         * @throws {@link ErrorCode|InvalidParameter} when SSO token from Teams client is empty.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
         *
         * @returns Basic user info with user displayName, objectId and preferredUserName.
         *
         * @beta
         */
        getUserInfo() {
            return __awaiter$1(this, void 0, void 0, function* () {
                internalLogger.info("Get basic user info from SSO token");
                const ssoToken = yield this.getSSOToken();
                return getUserInfoFromSsoToken(ssoToken.token);
            });
        }
        exchangeAccessTokenFromSimpleAuthServer(scopesStr, authCodeResult) {
            var _a, _b;
            return __awaiter$1(this, void 0, void 0, function* () {
                const axiosInstance = yield this.getAxiosInstance();
                let retryCount = 0;
                while (true) {
                    try {
                        const response = yield axiosInstance.post("/auth/token", {
                            scope: scopesStr,
                            code: authCodeResult.code,
                            code_verifier: authCodeResult.codeVerifier,
                            redirect_uri: authCodeResult.redirectUri,
                            grant_type: GrantType.authCode,
                        });
                        const tokenResult = response.data;
                        const key = yield this.getAccessTokenCacheKey(scopesStr);
                        this.setTokenCache(key, {
                            token: tokenResult.access_token,
                            expiresOnTimestamp: tokenResult.expires_on,
                        });
                        return;
                    }
                    catch (err) {
                        if (((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.type) && err.response.data.type === "AadUiRequiredException") {
                            internalLogger.warn("Exchange access token failed, retry...");
                            if (retryCount < maxRetryCount) {
                                yield this.sleep(retryTimeSpanInMillisecond);
                                retryCount++;
                                continue;
                            }
                        }
                        throw err;
                    }
                }
            });
        }
        /**
         * Get access token cache from authentication server
         * @returns Access token
         */
        getAndCacheAccessTokenFromSimpleAuthServer(scopesStr) {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    internalLogger.verbose("Get access token from authentication server with scopes: " + scopesStr);
                    const axiosInstance = yield this.getAxiosInstance();
                    const response = yield axiosInstance.post("/auth/token", {
                        scope: scopesStr,
                        grant_type: GrantType.ssoToken,
                    });
                    const accessTokenResult = response.data;
                    const accessToken = {
                        token: accessTokenResult.access_token,
                        expiresOnTimestamp: accessTokenResult.expires_on,
                    };
                    const cacheKey = yield this.getAccessTokenCacheKey(scopesStr);
                    this.setTokenCache(cacheKey, accessToken);
                    return accessToken;
                }
                catch (err) {
                    throw this.generateAuthServerError(err);
                }
            });
        }
        /**
         * Get SSO token using teams SDK
         * It will try to get SSO token from memory first, if SSO token doesn't exist or about to expired, then it will using teams SDK to get SSO token
         * @returns SSO token
         */
        getSSOToken() {
            return new Promise((resolve, reject) => {
                if (this.ssoToken) {
                    if (this.ssoToken.expiresOnTimestamp - Date.now() > tokenRefreshTimeSpanInMillisecond) {
                        internalLogger.verbose("Get SSO token from memory cache");
                        resolve(this.ssoToken);
                        return;
                    }
                }
                let initialized = false;
                MicrosoftTeams_min$1.initialize(() => {
                    initialized = true;
                    MicrosoftTeams_min$1.authentication.getAuthToken({
                        successCallback: (token) => {
                            if (!token) {
                                const errorMsg = "Get empty SSO token from Teams";
                                internalLogger.error(errorMsg);
                                reject(new ErrorWithCode(errorMsg, exports.ErrorCode.InternalError));
                                return;
                            }
                            const tokenObject = parseJwt(token);
                            if (tokenObject.ver !== "1.0" && tokenObject.ver !== "2.0") {
                                const errorMsg = "SSO token is not valid with an unknown version: " + tokenObject.ver;
                                internalLogger.error(errorMsg);
                                reject(new ErrorWithCode(errorMsg, exports.ErrorCode.InternalError));
                                return;
                            }
                            const ssoToken = {
                                token,
                                expiresOnTimestamp: tokenObject.exp * 1000,
                            };
                            this.ssoToken = ssoToken;
                            resolve(ssoToken);
                        },
                        failureCallback: (errMessage) => {
                            const errorMsg = "Get SSO token failed with error: " + errMessage;
                            internalLogger.error(errorMsg);
                            reject(new ErrorWithCode(errorMsg, exports.ErrorCode.InternalError));
                        },
                        resources: [],
                    });
                });
                // If the code not running in Teams, the initialize callback function would never trigger
                setTimeout(() => {
                    if (!initialized) {
                        const errorMsg = "Initialize teams sdk timeout, maybe the code is not running inside Teams";
                        internalLogger.error(errorMsg);
                        reject(new ErrorWithCode(errorMsg, exports.ErrorCode.InternalError));
                    }
                }, initializeTeamsSdkTimeoutInMillisecond);
            });
        }
        /**
         * Load and validate authentication configuration
         * @returns Authentication configuration
         */
        loadAndValidateConfig() {
            internalLogger.verbose("Validate authentication configuration");
            const config = getAuthenticationConfiguration();
            if (!config) {
                internalLogger.error(ErrorMessage.AuthenticationConfigurationNotExists);
                throw new ErrorWithCode(ErrorMessage.AuthenticationConfigurationNotExists, exports.ErrorCode.InvalidConfiguration);
            }
            if (config.initiateLoginEndpoint && config.simpleAuthEndpoint && config.clientId) {
                return config;
            }
            const missingValues = [];
            if (!config.initiateLoginEndpoint) {
                missingValues.push("initiateLoginEndpoint");
            }
            if (!config.simpleAuthEndpoint) {
                missingValues.push("simpleAuthEndpoint");
            }
            if (!config.clientId) {
                missingValues.push("clientId");
            }
            const errorMsg = formatString(ErrorMessage.InvalidConfiguration, missingValues.join(", "), "undefined");
            internalLogger.error(errorMsg);
            throw new ErrorWithCode(errorMsg, exports.ErrorCode.InvalidConfiguration);
        }
        /**
         * Get axios instance with sso token bearer header
         * @returns AxiosInstance
         */
        getAxiosInstance() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const ssoToken = yield this.getSSOToken();
                const axiosInstance = axios.create({
                    baseURL: this.config.simpleAuthEndpoint,
                });
                axiosInstance.interceptors.request.use((config) => {
                    config.headers.Authorization = "Bearer " + ssoToken.token;
                    return config;
                });
                return axiosInstance;
            });
        }
        /**
         * Set access token to cache
         * @param key
         * @param token
         */
        setTokenCache(key, token) {
            Cache.set(key, JSON.stringify(token));
        }
        /**
         * Get access token from cache.
         * If there is no cache or cannot be parsed, then it will return null
         * @param key
         * @returns Access token or null
         */
        getTokenCache(key) {
            const value = Cache.get(key);
            if (value === null) {
                return null;
            }
            const accessToken = this.validateAndParseJson(value);
            return accessToken;
        }
        /**
         * Parses passed value as JSON access token, if value is not a valid json string JSON.parse() will throw an error.
         * @param jsonValue
         */
        validateAndParseJson(jsonValue) {
            try {
                const parsedJson = JSON.parse(jsonValue);
                /**
                 * There are edge cases in which JSON.parse will successfully parse a non-valid JSON object
                 * (e.g. JSON.parse will parse an escaped string into an unescaped string), so adding a type check
                 * of the parsed value is necessary in order to be certain that the string represents a valid JSON object.
                 *
                 */
                return parsedJson && typeof parsedJson === "object" ? parsedJson : null;
            }
            catch (error) {
                return null;
            }
        }
        /**
         * Generate cache key
         * @param scopesStr
         * @returns Access token cache key, a key example: accessToken-userId-clientId-tenantId-scopes
         */
        getAccessTokenCacheKey(scopesStr) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const ssoToken = yield this.getSSOToken();
                const ssoTokenObj = parseJwt(ssoToken.token);
                const clientId = this.config.clientId;
                const userObjectId = ssoTokenObj.oid;
                const tenantId = ssoTokenObj.tid;
                const key = [accessTokenCacheKeyPrefix, userObjectId, clientId, tenantId, scopesStr]
                    .join(separator)
                    .replace(/" "/g, "_");
                return key;
            });
        }
        /**
         * Check whether the token is about to expire (within 5 minutes)
         * @returns Boolean value indicate whether the token is about to expire
         */
        isAccessTokenNearExpired(token) {
            const expireDate = new Date(token.expiresOnTimestamp);
            if (expireDate.getTime() - Date.now() > tokenRefreshTimeSpanInMillisecond) {
                return false;
            }
            return true;
        }
        generateAuthServerError(err) {
            var _a, _b;
            let errorMessage = err.message;
            if ((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.type) {
                errorMessage = err.response.data.detail;
                if (err.response.data.type === "AadUiRequiredException") {
                    const fullErrorMsg = "Failed to get access token from authentication server, please login first: " +
                        errorMessage;
                    internalLogger.warn(fullErrorMsg);
                    return new ErrorWithCode(fullErrorMsg, exports.ErrorCode.UiRequiredError);
                }
                else {
                    const fullErrorMsg = "Failed to get access token from authentication server: " + errorMessage;
                    internalLogger.error(fullErrorMsg);
                    return new ErrorWithCode(fullErrorMsg, exports.ErrorCode.ServiceError);
                }
            }
            const fullErrorMsg = "Failed to get access token with error: " + errorMessage;
            return new ErrorWithCode(fullErrorMsg, exports.ErrorCode.InternalError);
        }
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
    }

    // Copyright (c) Microsoft Corporation.
    const defaultScope = "https://graph.microsoft.com/.default";
    /**
     * Microsoft Graph auth provider for Teams Framework
     *
     * @beta
     */
    class MsGraphAuthProvider {
        /**
         * Constructor of MsGraphAuthProvider.
         *
         * @param {TokenCredential} credential - Credential used to invoke Microsoft Graph APIs.
         * @param {string | string[]} scopes - The list of scopes for which the token will have access.
         *
         * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
         *
         * @returns An instance of MsGraphAuthProvider.
         *
         * @beta
         */
        constructor(credential, scopes) {
            this.credential = credential;
            let scopesStr = defaultScope;
            if (scopes) {
                validateScopesType(scopes);
                scopesStr = typeof scopes === "string" ? scopes : scopes.join(" ");
                if (scopesStr === "") {
                    scopesStr = defaultScope;
                }
            }
            internalLogger.info(`Create Microsoft Graph Authentication Provider with scopes: '${scopesStr}'`);
            this.scopes = scopesStr;
        }
        /**
         * Get access token for Microsoft Graph API requests.
         *
         * @throws {@link ErrorCode|InternalError} when get access token failed due to empty token or unknown other problems.
         * @throws {@link ErrorCode|TokenExpiredError} when SSO token has already expired.
         * @throws {@link ErrorCode|UiRequiredError} when need user consent to get access token.
         * @throws {@link ErrorCode|ServiceError} when failed to get access token from simple auth or AAD server.
         * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
         *
         * @returns Access token from the credential.
         *
         */
        getAccessToken() {
            return __awaiter$1(this, void 0, void 0, function* () {
                internalLogger.info(`Get Graph Access token with scopes: '${this.scopes}'`);
                const accessToken = yield this.credential.getToken(this.scopes);
                return new Promise((resolve, reject) => {
                    if (accessToken) {
                        resolve(accessToken.token);
                    }
                    else {
                        const errorMsg = "Graph access token is undefined or empty";
                        internalLogger.error(errorMsg);
                        reject(new ErrorWithCode(errorMsg, exports.ErrorCode.InternalError));
                    }
                });
            });
        }
    }

    // Copyright (c) Microsoft Corporation.
    /**
     * Creates a new prompt that leverage Teams Single Sign On (SSO) support for bot to automatically sign in user and
     * help receive oauth token, asks the user to consent if needed.
     *
     * @remarks
     * The prompt will attempt to retrieve the users current token of the desired scopes and store it in
     * the token store.
     *
     * User will be automatically signed in leveraging Teams support of Bot Single Sign On(SSO):
     * https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/auth-aad-sso-bots
     *
     * @example
     * When used with your bots `DialogSet` you can simply add a new instance of the prompt as a named
     * dialog using `DialogSet.add()`. You can then start the prompt from a waterfall step using either
     * `DialogContext.beginDialog()` or `DialogContext.prompt()`. The user will be prompted to sign in as
     * needed and their access token will be passed as an argument to the callers next waterfall step:
     *
     * ```JavaScript
     * const { ConversationState, MemoryStorage } = require('botbuilder');
     * const { DialogSet, WaterfallDialog } = require('botbuilder-dialogs');
     * const { TeamsBotSsoPrompt } = require('@microsoft/teamsfx');
     *
     * const convoState = new ConversationState(new MemoryStorage());
     * const dialogState = convoState.createProperty('dialogState');
     * const dialogs = new DialogSet(dialogState);
     *
     * loadConfiguration();
     * dialogs.add(new TeamsBotSsoPrompt('TeamsBotSsoPrompt', {
     *    scopes: ["User.Read"],
     * }));
     *
     * dialogs.add(new WaterfallDialog('taskNeedingLogin', [
     *      async (step) => {
     *          return await step.beginDialog('TeamsBotSsoPrompt');
     *      },
     *      async (step) => {
     *          const token = step.result;
     *          if (token) {
     *
     *              // ... continue with task needing access token ...
     *
     *          } else {
     *              await step.context.sendActivity(`Sorry... We couldn't log you in. Try again later.`);
     *              return await step.endDialog();
     *          }
     *      }
     * ]));
     * ```
     *
     * @beta
     */
    class TeamsBotSsoPrompt {
        /**
         * Constructor of TeamsBotSsoPrompt.
         *
         * @param dialogId Unique ID of the dialog within its parent `DialogSet` or `ComponentDialog`.
         * @param settings Settings used to configure the prompt.
         *
         * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is browser.
         *
         * @beta
         */
        constructor(dialogId, settings) {
            this.settings = settings;
            throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "TeamsBotSsoPrompt"), exports.ErrorCode.RuntimeNotSupported);
        }
        /**
         * Called when a prompt dialog is pushed onto the dialog stack and is being activated.
         * @remarks
         * If the task is successful, the result indicates whether the prompt is still
         * active after the turn has been processed by the prompt.
         *
         * @param dc The DialogContext for the current turn of the conversation.
         *
         * @throws {@link ErrorCode|InvalidParameter} when timeout property in teams bot sso prompt settings is not number or is not positive.
         * @throws {@link ErrorCode|ChannelNotSupported} when bot channel is not MS Teams.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is browser.
         *
         * @returns A `Promise` representing the asynchronous operation.
         *
         * @beta
         */
        beginDialog(dc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "TeamsBotSsoPrompt"), exports.ErrorCode.RuntimeNotSupported);
            });
        }
        /**
         * Called when a prompt dialog is the active dialog and the user replied with a new activity.
         *
         * @remarks
         * If the task is successful, the result indicates whether the dialog is still
         * active after the turn has been processed by the dialog.
         * The prompt generally continues to receive the user's replies until it accepts the
         * user's reply as valid input for the prompt.
         *
         * @param dc The DialogContext for the current turn of the conversation.
         *
         * @returns A `Promise` representing the asynchronous operation.
         *
         * @throws {@link ErrorCode|ChannelNotSupported} when bot channel is not MS Teams.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is browser.
         *
         * @beta
         */
        continueDialog(dc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                throw new ErrorWithCode(formatString(ErrorMessage.BrowserRuntimeNotSupported, "TeamsBotSsoPrompt"), exports.ErrorCode.RuntimeNotSupported);
            });
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @enum
     * Enum for RequestMethods
     * @property {string} GET - The get request type
     * @property {string} PATCH - The patch request type
     * @property {string} POST - The post request type
     * @property {string} PUT - The put request type
     * @property {string} DELETE - The delete request type
     */
    var RequestMethod;
    (function (RequestMethod) {
        RequestMethod["GET"] = "GET";
        RequestMethod["PATCH"] = "PATCH";
        RequestMethod["POST"] = "POST";
        RequestMethod["PUT"] = "PUT";
        RequestMethod["DELETE"] = "DELETE";
    })(RequestMethod || (RequestMethod = {}));

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * Class representing MiddlewareControl
     */
    class MiddlewareControl {
        /**
         * @public
         * @constructor
         * Creates an instance of MiddlewareControl
         * @param {MiddlewareOptions[]} [middlewareOptions = []] - The array of middlewareOptions
         * @returns The instance of MiddlewareControl
         */
        constructor(middlewareOptions = []) {
            // tslint:disable-next-line:ban-types
            this.middlewareOptions = new Map();
            for (const option of middlewareOptions) {
                const fn = option.constructor;
                this.middlewareOptions.set(fn, option);
            }
        }
        /**
         * @public
         * To get the middleware option using the class of the option
         * @param {Function} fn - The class of the strongly typed option class
         * @returns The middleware option
         * @example
         * // if you wanted to return the middleware option associated with this class (MiddlewareControl)
         * // call this function like this:
         * getMiddlewareOptions(MiddlewareControl)
         */
        // tslint:disable-next-line:ban-types
        getMiddlewareOptions(fn) {
            return this.middlewareOptions.get(fn);
        }
        /**
         * @public
         * To set the middleware options using the class of the option
         * @param {Function} fn - The class of the strongly typed option class
         * @param {MiddlewareOptions} option - The strongly typed middleware option
         * @returns nothing
         */
        // tslint:disable-next-line:ban-types
        setMiddlewareOptions(fn, option) {
            this.middlewareOptions.set(fn, option);
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @constant
     * To generate the UUID
     * @returns The UUID string
     */
    const generateUUID = () => {
        let uuid = "";
        for (let j = 0; j < 32; j++) {
            if (j === 8 || j === 12 || j === 16 || j === 20) {
                uuid += "-";
            }
            uuid += Math.floor(Math.random() * 16).toString(16);
        }
        return uuid;
    };
    /**
     * @constant
     * To get the request header from the request
     * @param {RequestInfo} request - The request object or the url string
     * @param {FetchOptions|undefined} options - The request options object
     * @param {string} key - The header key string
     * @returns A header value for the given key from the request
     */
    const getRequestHeader = (request, options, key) => {
        let value = null;
        if (typeof Request !== "undefined" && request instanceof Request) {
            value = request.headers.get(key);
        }
        else if (typeof options !== "undefined" && options.headers !== undefined) {
            if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                value = options.headers.get(key);
            }
            else if (options.headers instanceof Array) {
                const headers = options.headers;
                for (let i = 0, l = headers.length; i < l; i++) {
                    if (headers[i][0] === key) {
                        value = headers[i][1];
                        break;
                    }
                }
            }
            else if (options.headers[key] !== undefined) {
                value = options.headers[key];
            }
        }
        return value;
    };
    /**
     * @constant
     * To set the header value to the given request
     * @param {RequestInfo} request - The request object or the url string
     * @param {FetchOptions|undefined} options - The request options object
     * @param {string} key - The header key string
     * @param {string } value - The header value string
     * @returns Nothing
     */
    const setRequestHeader = (request, options, key, value) => {
        if (typeof Request !== "undefined" && request instanceof Request) {
            request.headers.set(key, value);
        }
        else if (typeof options !== "undefined") {
            if (options.headers === undefined) {
                options.headers = new Headers({
                    [key]: value,
                });
            }
            else {
                if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                    options.headers.set(key, value);
                }
                else if (options.headers instanceof Array) {
                    let i = 0;
                    const l = options.headers.length;
                    for (; i < l; i++) {
                        const header = options.headers[i];
                        if (header[0] === key) {
                            header[1] = value;
                            break;
                        }
                    }
                    if (i === l) {
                        options.headers.push([key, value]);
                    }
                }
                else {
                    Object.assign(options.headers, { [key]: value });
                }
            }
        }
    };
    /**
     * @constant
     * To append the header value to the given request
     * @param {RequestInfo} request - The request object or the url string
     * @param {FetchOptions|undefined} options - The request options object
     * @param {string} key - The header key string
     * @param {string } value - The header value string
     * @returns Nothing
     */
    const appendRequestHeader = (request, options, key, value) => {
        if (typeof Request !== "undefined" && request instanceof Request) {
            request.headers.append(key, value);
        }
        else if (typeof options !== "undefined") {
            if (options.headers === undefined) {
                options.headers = new Headers({
                    [key]: value,
                });
            }
            else {
                if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                    options.headers.append(key, value);
                }
                else if (options.headers instanceof Array) {
                    options.headers.push([key, value]);
                }
                else if (options.headers === undefined) {
                    options.headers = { [key]: value };
                }
                else if (options.headers[key] === undefined) {
                    options.headers[key] = value;
                }
                else {
                    options.headers[key] += `, ${value}`;
                }
            }
        }
    };
    /**
     * @constant
     * To clone the request with the new url
     * @param {string} url - The new url string
     * @param {Request} request - The request object
     * @returns A promise that resolves to request object
     */
    const cloneRequestWithNewUrl = (newUrl, request) => __awaiter(undefined, void 0, void 0, function* () {
        const body = request.headers.get("Content-Type") ? yield request.blob() : yield Promise.resolve(undefined);
        const { method, headers, referrer, referrerPolicy, mode, credentials, cache, redirect, integrity, keepalive, signal } = request;
        return new Request(newUrl, { method, headers, body, referrer, referrerPolicy, mode, credentials, cache, redirect, integrity, keepalive, signal });
    });

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * @implements MiddlewareOptions
     * Class representing AuthenticationHandlerOptions
     */
    class AuthenticationHandlerOptions {
        /**
         * @public
         * @constructor
         * To create an instance of AuthenticationHandlerOptions
         * @param {AuthenticationProvider} [authenticationProvider] - The authentication provider instance
         * @param {AuthenticationProviderOptions} [authenticationProviderOptions] - The authentication provider options instance
         * @returns An instance of AuthenticationHandlerOptions
         */
        constructor(authenticationProvider, authenticationProviderOptions) {
            this.authenticationProvider = authenticationProvider;
            this.authenticationProviderOptions = authenticationProviderOptions;
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @enum
     * @property {number} NONE - The hexadecimal flag value for nothing enabled
     * @property {number} REDIRECT_HANDLER_ENABLED - The hexadecimal flag value for redirect handler enabled
     * @property {number} RETRY_HANDLER_ENABLED - The hexadecimal flag value for retry handler enabled
     * @property {number} AUTHENTICATION_HANDLER_ENABLED - The hexadecimal flag value for the authentication handler enabled
     */
    var FeatureUsageFlag;
    (function (FeatureUsageFlag) {
        FeatureUsageFlag[FeatureUsageFlag["NONE"] = 0] = "NONE";
        FeatureUsageFlag[FeatureUsageFlag["REDIRECT_HANDLER_ENABLED"] = 1] = "REDIRECT_HANDLER_ENABLED";
        FeatureUsageFlag[FeatureUsageFlag["RETRY_HANDLER_ENABLED"] = 2] = "RETRY_HANDLER_ENABLED";
        FeatureUsageFlag[FeatureUsageFlag["AUTHENTICATION_HANDLER_ENABLED"] = 4] = "AUTHENTICATION_HANDLER_ENABLED";
    })(FeatureUsageFlag || (FeatureUsageFlag = {}));
    /**
     * @class
     * @implements MiddlewareOptions
     * Class for TelemetryHandlerOptions
     */
    class TelemetryHandlerOptions {
        constructor() {
            /**
             * @private
             * A member to hold the OR of feature usage flags
             */
            this.featureUsage = FeatureUsageFlag.NONE;
        }
        /**
         * @public
         * @static
         * To update the feature usage in the context object
         * @param {Context} context - The request context object containing middleware options
         * @param {FeatureUsageFlag} flag - The flag value
         * @returns nothing
         */
        static updateFeatureUsageFlag(context, flag) {
            let options;
            if (context.middlewareControl instanceof MiddlewareControl) {
                options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions);
            }
            else {
                context.middlewareControl = new MiddlewareControl();
            }
            if (typeof options === "undefined") {
                options = new TelemetryHandlerOptions();
                context.middlewareControl.setMiddlewareOptions(TelemetryHandlerOptions, options);
            }
            options.setFeatureUsage(flag);
        }
        /**
         * @private
         * To set the feature usage flag
         * @param {FeatureUsageFlag} flag - The flag value
         * @returns nothing
         */
        setFeatureUsage(flag) {
            /* tslint:disable: no-bitwise */
            this.featureUsage = this.featureUsage | flag;
            /* tslint:enable: no-bitwise */
        }
        /**
         * @public
         * To get the feature usage
         * @returns A feature usage flag as hexadecimal string
         */
        getFeatureUsage() {
            return this.featureUsage.toString(16);
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * @implements Middleware
     * Class representing AuthenticationHandler
     */
    class AuthenticationHandler {
        /**
         * @public
         * @constructor
         * Creates an instance of AuthenticationHandler
         * @param {AuthenticationProvider} authenticationProvider - The authentication provider for the authentication handler
         */
        constructor(authenticationProvider) {
            this.authenticationProvider = authenticationProvider;
        }
        /**
         * @public
         * @async
         * To execute the current middleware
         * @param {Context} context - The context object of the request
         * @returns A Promise that resolves to nothing
         */
        execute(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let options;
                    if (context.middlewareControl instanceof MiddlewareControl) {
                        options = context.middlewareControl.getMiddlewareOptions(AuthenticationHandlerOptions);
                    }
                    let authenticationProvider;
                    let authenticationProviderOptions;
                    if (typeof options !== "undefined") {
                        authenticationProvider = options.authenticationProvider;
                        authenticationProviderOptions = options.authenticationProviderOptions;
                    }
                    if (typeof authenticationProvider === "undefined") {
                        authenticationProvider = this.authenticationProvider;
                    }
                    const token = yield authenticationProvider.getAccessToken(authenticationProviderOptions);
                    const bearerKey = `Bearer ${token}`;
                    appendRequestHeader(context.request, context.options, AuthenticationHandler.AUTHORIZATION_HEADER, bearerKey);
                    TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
                    return yield this.nextMiddleware.execute(context);
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * To set the next middleware in the chain
         * @param {Middleware} next - The middleware instance
         * @returns Nothing
         */
        setNext(next) {
            this.nextMiddleware = next;
        }
    }
    /**
     * @private
     * A member representing the authorization header name
     */
    AuthenticationHandler.AUTHORIZATION_HEADER = "Authorization";

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * @implements Middleware
     * Class for HTTPMessageHandler
     */
    class HTTPMessageHandler {
        /**
         * @public
         * @async
         * To execute the current middleware
         * @param {Context} context - The request context object
         * @returns A promise that resolves to nothing
         */
        execute(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    context.response = yield fetch(context.request, context.options);
                    return;
                }
                catch (error) {
                    throw error;
                }
            });
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * @implements MiddlewareOptions
     * Class for RetryHandlerOptions
     */
    class RetryHandlerOptions {
        /**
         * @public
         * @constructor
         * To create an instance of RetryHandlerOptions
         * @param {number} [delay = RetryHandlerOptions.DEFAULT_DELAY] - The delay value in seconds
         * @param {number} [maxRetries = RetryHandlerOptions.DEFAULT_MAX_RETRIES] - The maxRetries value
         * @param {ShouldRetry} [shouldRetry = RetryHandlerOptions.DEFAULT_SHOULD_RETRY] - The shouldRetry callback function
         * @returns An instance of RetryHandlerOptions
         */
        constructor(delay = RetryHandlerOptions.DEFAULT_DELAY, maxRetries = RetryHandlerOptions.DEFAULT_MAX_RETRIES, shouldRetry = RetryHandlerOptions.DEFAULT_SHOULD_RETRY) {
            if (delay > RetryHandlerOptions.MAX_DELAY && maxRetries > RetryHandlerOptions.MAX_MAX_RETRIES) {
                const error = new Error(`Delay and MaxRetries should not be more than ${RetryHandlerOptions.MAX_DELAY} and ${RetryHandlerOptions.MAX_MAX_RETRIES}`);
                error.name = "MaxLimitExceeded";
                throw error;
            }
            else if (delay > RetryHandlerOptions.MAX_DELAY) {
                const error = new Error(`Delay should not be more than ${RetryHandlerOptions.MAX_DELAY}`);
                error.name = "MaxLimitExceeded";
                throw error;
            }
            else if (maxRetries > RetryHandlerOptions.MAX_MAX_RETRIES) {
                const error = new Error(`MaxRetries should not be more than ${RetryHandlerOptions.MAX_MAX_RETRIES}`);
                error.name = "MaxLimitExceeded";
                throw error;
            }
            else if (delay < 0 && maxRetries < 0) {
                const error = new Error(`Delay and MaxRetries should not be negative`);
                error.name = "MinExpectationNotMet";
                throw error;
            }
            else if (delay < 0) {
                const error = new Error(`Delay should not be negative`);
                error.name = "MinExpectationNotMet";
                throw error;
            }
            else if (maxRetries < 0) {
                const error = new Error(`MaxRetries should not be negative`);
                error.name = "MinExpectationNotMet";
                throw error;
            }
            this.delay = Math.min(delay, RetryHandlerOptions.MAX_DELAY);
            this.maxRetries = Math.min(maxRetries, RetryHandlerOptions.MAX_MAX_RETRIES);
            this.shouldRetry = shouldRetry;
        }
        /**
         * @public
         * To get the maximum delay
         * @returns A maximum delay
         */
        getMaxDelay() {
            return RetryHandlerOptions.MAX_DELAY;
        }
    }
    /**
     * @private
     * @static
     * A member holding default delay value in seconds
     */
    RetryHandlerOptions.DEFAULT_DELAY = 3;
    /**
     * @private
     * @static
     * A member holding default maxRetries value
     */
    RetryHandlerOptions.DEFAULT_MAX_RETRIES = 3;
    /**
     * @private
     * @static
     * A member holding maximum delay value in seconds
     */
    RetryHandlerOptions.MAX_DELAY = 180;
    /**
     * @private
     * @static
     * A member holding maximum maxRetries value
     */
    RetryHandlerOptions.MAX_MAX_RETRIES = 10;
    /**
     * @private
     * A member holding default shouldRetry callback
     */
    RetryHandlerOptions.DEFAULT_SHOULD_RETRY = () => true;

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * @implements Middleware
     * Class for RetryHandler
     */
    class RetryHandler {
        /**
         * @public
         * @constructor
         * To create an instance of RetryHandler
         * @param {RetryHandlerOptions} [options = new RetryHandlerOptions()] - The retry handler options value
         * @returns An instance of RetryHandler
         */
        constructor(options = new RetryHandlerOptions()) {
            this.options = options;
        }
        /**
         *
         * @private
         * To check whether the response has the retry status code
         * @param {Response} response - The response object
         * @returns Whether the response has retry status code or not
         */
        isRetry(response) {
            return RetryHandler.RETRY_STATUS_CODES.indexOf(response.status) !== -1;
        }
        /**
         * @private
         * To check whether the payload is buffered or not
         * @param {RequestInfo} request - The url string or the request object value
         * @param {FetchOptions} options - The options of a request
         * @returns Whether the payload is buffered or not
         */
        isBuffered(request, options) {
            const method = typeof request === "string" ? options.method : request.method;
            const isPutPatchOrPost = method === RequestMethod.PUT || method === RequestMethod.PATCH || method === RequestMethod.POST;
            if (isPutPatchOrPost) {
                const isStream = getRequestHeader(request, options, "Content-Type") === "application/octet-stream";
                if (isStream) {
                    return false;
                }
            }
            return true;
        }
        /**
         * @private
         * To get the delay for a retry
         * @param {Response} response - The response object
         * @param {number} retryAttempts - The current attempt count
         * @param {number} delay - The delay value in seconds
         * @returns A delay for a retry
         */
        getDelay(response, retryAttempts, delay) {
            const getRandomness = () => Number(Math.random().toFixed(3));
            const retryAfter = response.headers !== undefined ? response.headers.get(RetryHandler.RETRY_AFTER_HEADER) : null;
            let newDelay;
            if (retryAfter !== null) {
                // tslint:disable: prefer-conditional-expression
                if (Number.isNaN(Number(retryAfter))) {
                    newDelay = Math.round((new Date(retryAfter).getTime() - Date.now()) / 1000);
                }
                else {
                    newDelay = Number(retryAfter);
                }
                // tslint:enable: prefer-conditional-expression
            }
            else {
                // Adding randomness to avoid retrying at a same
                newDelay = retryAttempts >= 2 ? this.getExponentialBackOffTime(retryAttempts) + delay + getRandomness() : delay + getRandomness();
            }
            return Math.min(newDelay, this.options.getMaxDelay() + getRandomness());
        }
        /**
         * @private
         * To get an exponential back off value
         * @param {number} attempts - The current attempt count
         * @returns An exponential back off value
         */
        getExponentialBackOffTime(attempts) {
            return Math.round((1 / 2) * (Math.pow(2, attempts) - 1));
        }
        /**
         * @private
         * @async
         * To add delay for the execution
         * @param {number} delaySeconds - The delay value in seconds
         * @returns Nothing
         */
        sleep(delaySeconds) {
            return __awaiter(this, void 0, void 0, function* () {
                const delayMilliseconds = delaySeconds * 1000;
                return new Promise((resolve) => setTimeout(resolve, delayMilliseconds));
            });
        }
        getOptions(context) {
            let options;
            if (context.middlewareControl instanceof MiddlewareControl) {
                options = context.middlewareControl.getMiddlewareOptions(this.options.constructor);
            }
            if (typeof options === "undefined") {
                options = Object.assign(new RetryHandlerOptions(), this.options);
            }
            return options;
        }
        /**
         * @private
         * @async
         * To execute the middleware with retries
         * @param {Context} context - The context object
         * @param {number} retryAttempts - The current attempt count
         * @param {RetryHandlerOptions} options - The retry middleware options instance
         * @returns A Promise that resolves to nothing
         */
        executeWithRetry(context, retryAttempts, options) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.nextMiddleware.execute(context);
                    if (retryAttempts < options.maxRetries && this.isRetry(context.response) && this.isBuffered(context.request, context.options) && options.shouldRetry(options.delay, retryAttempts, context.request, context.options, context.response)) {
                        ++retryAttempts;
                        setRequestHeader(context.request, context.options, RetryHandler.RETRY_ATTEMPT_HEADER, retryAttempts.toString());
                        const delay = this.getDelay(context.response, retryAttempts, options.delay);
                        yield this.sleep(delay);
                        return yield this.executeWithRetry(context, retryAttempts, options);
                    }
                    else {
                        return;
                    }
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * To execute the current middleware
         * @param {Context} context - The context object of the request
         * @returns A Promise that resolves to nothing
         */
        execute(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const retryAttempts = 0;
                    const options = this.getOptions(context);
                    TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.RETRY_HANDLER_ENABLED);
                    return yield this.executeWithRetry(context, retryAttempts, options);
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * To set the next middleware in the chain
         * @param {Middleware} next - The middleware instance
         * @returns Nothing
         */
        setNext(next) {
            this.nextMiddleware = next;
        }
    }
    /**
     * @private
     * @static
     * A list of status codes that needs to be retried
     */
    RetryHandler.RETRY_STATUS_CODES = [
        429,
        503,
        504,
    ];
    /**
     * @private
     * @static
     * A member holding the name of retry attempt header
     */
    RetryHandler.RETRY_ATTEMPT_HEADER = "Retry-Attempt";
    /**
     * @private
     * @static
     * A member holding the name of retry after header
     */
    RetryHandler.RETRY_AFTER_HEADER = "Retry-After";

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * @implements MiddlewareOptions
     * A class representing RedirectHandlerOptions
     */
    class RedirectHandlerOptions {
        /**
         * @public
         * @constructor
         * To create an instance of RedirectHandlerOptions
         * @param {number} [maxRedirects = RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS] - The max redirects value
         * @param {ShouldRedirect} [shouldRedirect = RedirectHandlerOptions.DEFAULT_SHOULD_RETRY] - The should redirect callback
         * @returns An instance of RedirectHandlerOptions
         */
        constructor(maxRedirects = RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS, shouldRedirect = RedirectHandlerOptions.DEFAULT_SHOULD_RETRY) {
            if (maxRedirects > RedirectHandlerOptions.MAX_MAX_REDIRECTS) {
                const error = new Error(`MaxRedirects should not be more than ${RedirectHandlerOptions.MAX_MAX_REDIRECTS}`);
                error.name = "MaxLimitExceeded";
                throw error;
            }
            if (maxRedirects < 0) {
                const error = new Error(`MaxRedirects should not be negative`);
                error.name = "MinExpectationNotMet";
                throw error;
            }
            this.maxRedirects = maxRedirects;
            this.shouldRedirect = shouldRedirect;
        }
    }
    /**
     * @private
     * @static
     * A member holding default max redirects value
     */
    RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS = 5;
    /**
     * @private
     * @static
     * A member holding maximum max redirects value
     */
    RedirectHandlerOptions.MAX_MAX_REDIRECTS = 20;
    /**
     * @private
     * A member holding default shouldRedirect callback
     */
    RedirectHandlerOptions.DEFAULT_SHOULD_RETRY = () => true;

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * Class
     * @implements Middleware
     * Class representing RedirectHandler
     */
    class RedirectHandler {
        /**
         * @public
         * @constructor
         * To create an instance of RedirectHandler
         * @param {RedirectHandlerOptions} [options = new RedirectHandlerOptions()] - The redirect handler options instance
         * @returns An instance of RedirectHandler
         */
        constructor(options = new RedirectHandlerOptions()) {
            this.options = options;
        }
        /**
         * @private
         * To check whether the response has the redirect status code or not
         * @param {Response} response - The response object
         * @returns A boolean representing whether the response contains the redirect status code or not
         */
        isRedirect(response) {
            return RedirectHandler.REDIRECT_STATUS_CODES.indexOf(response.status) !== -1;
        }
        /**
         * @private
         * To check whether the response has location header or not
         * @param {Response} response - The response object
         * @returns A boolean representing the whether the response has location header or not
         */
        hasLocationHeader(response) {
            return response.headers.has(RedirectHandler.LOCATION_HEADER);
        }
        /**
         * @private
         * To get the redirect url from location header in response object
         * @param {Response} response - The response object
         * @returns A redirect url from location header
         */
        getLocationHeader(response) {
            return response.headers.get(RedirectHandler.LOCATION_HEADER);
        }
        /**
         * @private
         * To check whether the given url is a relative url or not
         * @param {string} url - The url string value
         * @returns A boolean representing whether the given url is a relative url or not
         */
        isRelativeURL(url) {
            return url.indexOf("://") === -1;
        }
        /**
         * @private
         * To check whether the authorization header in the request should be dropped for consequent redirected requests
         * @param {string} requestUrl - The request url value
         * @param {string} redirectUrl - The redirect url value
         * @returns A boolean representing whether the authorization header in the request should be dropped for consequent redirected requests
         */
        shouldDropAuthorizationHeader(requestUrl, redirectUrl) {
            const schemeHostRegex = /^[A-Za-z].+?:\/\/.+?(?=\/|$)/;
            const requestMatches = schemeHostRegex.exec(requestUrl);
            let requestAuthority;
            let redirectAuthority;
            if (requestMatches !== null) {
                requestAuthority = requestMatches[0];
            }
            const redirectMatches = schemeHostRegex.exec(redirectUrl);
            if (redirectMatches !== null) {
                redirectAuthority = redirectMatches[0];
            }
            return typeof requestAuthority !== "undefined" && typeof redirectAuthority !== "undefined" && requestAuthority !== redirectAuthority;
        }
        /**
         * @private
         * @async
         * To update a request url with the redirect url
         * @param {string} redirectUrl - The redirect url value
         * @param {Context} context - The context object value
         * @returns Nothing
         */
        updateRequestUrl(redirectUrl, context) {
            return __awaiter(this, void 0, void 0, function* () {
                context.request = typeof context.request === "string" ? redirectUrl : yield cloneRequestWithNewUrl(redirectUrl, context.request);
            });
        }
        /**
         * @private
         * To get the options for execution of the middleware
         * @param {Context} context - The context object
         * @returns A options for middleware execution
         */
        getOptions(context) {
            let options;
            if (context.middlewareControl instanceof MiddlewareControl) {
                options = context.middlewareControl.getMiddlewareOptions(RedirectHandlerOptions);
            }
            if (typeof options === "undefined") {
                options = Object.assign(new RedirectHandlerOptions(), this.options);
            }
            return options;
        }
        /**
         * @private
         * @async
         * To execute the next middleware and to handle in case of redirect response returned by the server
         * @param {Context} context - The context object
         * @param {number} redirectCount - The redirect count value
         * @param {RedirectHandlerOptions} options - The redirect handler options instance
         * @returns A promise that resolves to nothing
         */
        executeWithRedirect(context, redirectCount, options) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.nextMiddleware.execute(context);
                    const response = context.response;
                    if (redirectCount < options.maxRedirects && this.isRedirect(response) && this.hasLocationHeader(response) && options.shouldRedirect(response)) {
                        ++redirectCount;
                        if (response.status === RedirectHandler.STATUS_CODE_SEE_OTHER) {
                            context.options.method = RequestMethod.GET;
                            delete context.options.body;
                        }
                        else {
                            const redirectUrl = this.getLocationHeader(response);
                            if (!this.isRelativeURL(redirectUrl) && this.shouldDropAuthorizationHeader(response.url, redirectUrl)) {
                                delete context.options.headers[RedirectHandler.AUTHORIZATION_HEADER];
                            }
                            yield this.updateRequestUrl(redirectUrl, context);
                        }
                        yield this.executeWithRedirect(context, redirectCount, options);
                    }
                    else {
                        return;
                    }
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * To execute the current middleware
         * @param {Context} context - The context object of the request
         * @returns A Promise that resolves to nothing
         */
        execute(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const redirectCount = 0;
                    const options = this.getOptions(context);
                    context.options.redirect = RedirectHandler.MANUAL_REDIRECT;
                    TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.REDIRECT_HANDLER_ENABLED);
                    return yield this.executeWithRedirect(context, redirectCount, options);
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * To set the next middleware in the chain
         * @param {Middleware} next - The middleware instance
         * @returns Nothing
         */
        setNext(next) {
            this.nextMiddleware = next;
        }
    }
    /**
     * @private
     * @static
     * A member holding the array of redirect status codes
     */
    RedirectHandler.REDIRECT_STATUS_CODES = [
        301,
        302,
        303,
        307,
        308,
    ];
    /**
     * @private
     * @static
     * A member holding SeeOther status code
     */
    RedirectHandler.STATUS_CODE_SEE_OTHER = 303;
    /**
     * @private
     * @static
     * A member holding the name of the location header
     */
    RedirectHandler.LOCATION_HEADER = "Location";
    /**
     * @private
     * @static
     * A member representing the authorization header name
     */
    RedirectHandler.AUTHORIZATION_HEADER = "Authorization";
    /**
     * @private
     * @static
     * A member holding the manual redirect value
     */
    RedirectHandler.MANUAL_REDIRECT = "manual";

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @module Constants
     */
    /**
     * @constant
     * A Default API endpoint version for a request
     */
    const GRAPH_API_VERSION = "v1.0";
    /**
     * @constant
     * A Default base url for a request
     */
    const GRAPH_BASE_URL = "https://graph.microsoft.com/";
    /**
     * To hold list of the service root endpoints for Microsoft Graph and Graph Explorer for each national cloud.
     * Set(iterable:Object) is not supported in Internet Explorer. The consumer is recommended to use a suitable polyfill.
     */
    const GRAPH_URLS = new Set(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn"]);

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * To hold list of OData query params
     */
    const oDataQueryNames = ["$select", "$expand", "$orderby", "$filter", "$top", "$skip", "$skipToken", "$count"];
    /**
     * To construct the URL by appending the segments with "/"
     * @param {string[]} urlSegments - The array of strings
     * @returns The constructed URL string
     */
    const urlJoin = (urlSegments) => {
        const removePostSlash = (s) => s.replace(/\/+$/, "");
        const removePreSlash = (s) => s.replace(/^\/+/, "");
        const joiner = (pre, cur) => [removePostSlash(pre), removePreSlash(cur)].join("/");
        const parts = Array.prototype.slice.call(urlSegments);
        return parts.reduce(joiner);
    };
    /**
     * Serializes the content
     * @param {any} content - The content value that needs to be serialized
     * @returns The serialized content
     *
     * Note:
     * This conversion is required due to the following reasons:
     * Body parameter of Request method of isomorphic-fetch only accepts Blob, ArrayBuffer, FormData, TypedArrays string.
     * Node.js platform does not support Blob, FormData. Javascript File object inherits from Blob so it is also not supported in node. Therefore content of type Blob, File, FormData will only come from browsers.
     * Parallel to ArrayBuffer in javascript, node provides Buffer interface. Node's Buffer is able to send the arbitrary binary data to the server successfully for both Browser and Node platform. Whereas sending binary data via ArrayBuffer or TypedArrays was only possible using Browser. To support both Node and Browser, `serializeContent` converts TypedArrays or ArrayBuffer to `Node Buffer`.
     * If the data received is in JSON format, `serializeContent` converts the JSON to string.
     */
    const serializeContent = (content) => {
        const className = content && content.constructor && content.constructor.name;
        if (className === "Buffer" || className === "Blob" || className === "File" || className === "FormData" || typeof content === "string") {
            return content;
        }
        if (className === "ArrayBuffer") {
            content = Buffer.from(content);
        }
        else if (className === "Int8Array" || className === "Int16Array" || className === "Int32Array" || className === "Uint8Array" || className === "Uint16Array" || className === "Uint32Array" || className === "Uint8ClampedArray" || className === "Float32Array" || className === "Float64Array" || className === "DataView") {
            content = Buffer.from(content.buffer);
        }
        else {
            try {
                content = JSON.stringify(content);
            }
            catch (error) {
                throw new Error("Unable to stringify the content");
            }
        }
        return content;
    };
    /**
     * Checks if the url is one of the service root endpoints for Microsoft Graph and Graph Explorer.
     * @param {string} url - The url to be verified
     * @returns {boolean} - Returns true if the url is a Graph URL
     */
    const isGraphURL = (url) => {
        // Valid Graph URL pattern - https://graph.microsoft.com/{version}/{resource}?{query-parameters}
        // Valid Graph URL example - https://graph.microsoft.com/v1.0/
        url = url.toLowerCase();
        if (url.indexOf("https://") !== -1) {
            url = url.replace("https://", "");
            // Find where the host ends
            const startofPortNoPos = url.indexOf(":");
            const endOfHostStrPos = url.indexOf("/");
            let hostName = "";
            if (endOfHostStrPos !== -1) {
                if (startofPortNoPos !== -1 && startofPortNoPos < endOfHostStrPos) {
                    hostName = url.substring(0, startofPortNoPos);
                    return GRAPH_URLS.has(hostName);
                }
                // Parse out the host
                hostName = url.substring(0, endOfHostStrPos);
                return GRAPH_URLS.has(hostName);
            }
        }
        return false;
    };

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    // THIS FILE IS AUTO GENERATED
    // ANY CHANGES WILL BE LOST DURING BUILD
    /**
     * @module Version
     */
    const PACKAGE_VERSION = "2.2.1";

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * @implements Middleware
     * Class for TelemetryHandler
     */
    class TelemetryHandler {
        /**
         * @public
         * @async
         * To execute the current middleware
         * @param {Context} context - The context object of the request
         * @returns A Promise that resolves to nothing
         */
        execute(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const url = typeof context.request === "string" ? context.request : context.request.url;
                    if (isGraphURL(url)) {
                        // Add telemetry only if the request url is a Graph URL.
                        // Errors are reported as in issue #265 if headers are present when redirecting to a non Graph URL
                        let clientRequestId = getRequestHeader(context.request, context.options, TelemetryHandler.CLIENT_REQUEST_ID_HEADER);
                        if (!clientRequestId) {
                            clientRequestId = generateUUID();
                            setRequestHeader(context.request, context.options, TelemetryHandler.CLIENT_REQUEST_ID_HEADER, clientRequestId);
                        }
                        let sdkVersionValue = `${TelemetryHandler.PRODUCT_NAME}/${PACKAGE_VERSION}`;
                        let options;
                        if (context.middlewareControl instanceof MiddlewareControl) {
                            options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions);
                        }
                        if (options) {
                            const featureUsage = options.getFeatureUsage();
                            sdkVersionValue += ` (${TelemetryHandler.FEATURE_USAGE_STRING}=${featureUsage})`;
                        }
                        appendRequestHeader(context.request, context.options, TelemetryHandler.SDK_VERSION_HEADER, sdkVersionValue);
                    }
                    else {
                        // Remove telemetry headers if present during redirection.
                        delete context.options.headers[TelemetryHandler.CLIENT_REQUEST_ID_HEADER];
                        delete context.options.headers[TelemetryHandler.SDK_VERSION_HEADER];
                    }
                    return yield this.nextMiddleware.execute(context);
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * To set the next middleware in the chain
         * @param {Middleware} next - The middleware instance
         * @returns Nothing
         */
        setNext(next) {
            this.nextMiddleware = next;
        }
    }
    /**
     * @private
     * @static
     * A member holding the name of the client request id header
     */
    TelemetryHandler.CLIENT_REQUEST_ID_HEADER = "client-request-id";
    /**
     * @private
     * @static
     * A member holding the name of the sdk version header
     */
    TelemetryHandler.SDK_VERSION_HEADER = "SdkVersion";
    /**
     * @private
     * @static
     * A member holding the language prefix for the sdk version header value
     */
    TelemetryHandler.PRODUCT_NAME = "graph-js";
    /**
     * @private
     * @static
     * A member holding the key for the feature usage metrics
     */
    TelemetryHandler.FEATURE_USAGE_STRING = "featureUsage";

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @module ChaosStrategy
     */
    /**
     * Strategy used for Testing Handler
     * @enum
     */
    var ChaosStrategy;
    (function (ChaosStrategy) {
        ChaosStrategy[ChaosStrategy["MANUAL"] = 0] = "MANUAL";
        ChaosStrategy[ChaosStrategy["RANDOM"] = 1] = "RANDOM";
    })(ChaosStrategy || (ChaosStrategy = {}));

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * Class representing CustomAuthenticationProvider
     * @extends AuthenticationProvider
     */
    class CustomAuthenticationProvider {
        /**
         * @public
         * @constructor
         * Creates an instance of CustomAuthenticationProvider
         * @param {AuthProviderCallback} provider - An authProvider function
         * @returns An instance of CustomAuthenticationProvider
         */
        constructor(provider) {
            this.provider = provider;
        }
        /**
         * @public
         * @async
         * To get the access token
         * @returns The promise that resolves to an access token
         */
        getAccessToken() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    this.provider((error, accessToken) => {
                        if (accessToken) {
                            resolve(accessToken);
                        }
                        else {
                            reject(error);
                        }
                    });
                });
            });
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @module GraphError
     */
    /**
     * @class
     * Class for GraphError
     * @NOTE: This is NOT what is returned from the Graph
     * GraphError is created from parsing JSON errors returned from the graph
     * Some fields are renamed ie, "request-id" => requestId so you can use dot notation
     */
    class GraphError extends Error {
        /**
         * @public
         * @constructor
         * Creates an instance of GraphError
         * @param {number} [statusCode = -1] - The status code of the error
         * @returns An instance of GraphError
         */
        constructor(statusCode = -1, message, baseError) {
            super(message || (baseError && baseError.message));
            // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
            Object.setPrototypeOf(this, GraphError.prototype);
            this.statusCode = statusCode;
            this.code = null;
            this.requestId = null;
            this.date = new Date();
            this.body = null;
            this.stack = baseError ? baseError.stack : this.stack;
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * Class for GraphErrorHandler
     */
    class GraphErrorHandler {
        /**
         * @private
         * @static
         * Populates the GraphError instance with Error instance values
         * @param {Error} error - The error returned by graph service or some native error
         * @param {number} [statusCode] - The status code of the response
         * @returns The GraphError instance
         */
        static constructError(error, statusCode) {
            const gError = new GraphError(statusCode, "", error);
            if (error.name !== undefined) {
                gError.code = error.name;
            }
            gError.body = error.toString();
            gError.date = new Date();
            return gError;
        }
        /**
         * @private
         * @static
         * @async
         * Populates the GraphError instance from the Error returned by graph service
         * @param {any} error - The error returned by graph service or some native error
         * @param {number} statusCode - The status code of the response
         * @returns A promise that resolves to GraphError instance
         *
         * Example error for https://graph.microsoft.com/v1.0/me/events?$top=3&$search=foo
         * {
         *      "error": {
         *          "code": "SearchEvents",
         *          "message": "The parameter $search is not currently supported on the Events resource.",
         *          "innerError": {
         *              "request-id": "b31c83fd-944c-4663-aa50-5d9ceb367e19",
         *              "date": "2016-11-17T18:37:45"
         *          }
         *      }
         *  }
         */
        static constructErrorFromResponse(error, statusCode) {
            error = error.error;
            const gError = new GraphError(statusCode, error.message);
            gError.code = error.code;
            if (error.innerError !== undefined) {
                gError.requestId = error.innerError["request-id"];
                gError.date = new Date(error.innerError.date);
            }
            try {
                gError.body = JSON.stringify(error);
            }
            catch (error) {
                // tslint:disable-line: no-empty
            }
            return gError;
        }
        /**
         * @public
         * @static
         * @async
         * To get the GraphError object
         * @param {any} [error = null] - The error returned by graph service or some native error
         * @param {number} [statusCode = -1] - The status code of the response
         * @param {GraphRequestCallback} [callback] - The graph request callback function
         * @returns A promise that resolves to GraphError instance
         */
        static getError(error = null, statusCode = -1, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                let gError;
                if (error && error.error) {
                    gError = GraphErrorHandler.constructErrorFromResponse(error, statusCode);
                }
                else if (typeof Error !== "undefined" && error instanceof Error) {
                    gError = GraphErrorHandler.constructError(error, statusCode);
                }
                else {
                    gError = new GraphError(statusCode);
                }
                if (typeof callback === "function") {
                    callback(gError, null);
                }
                else {
                    return gError;
                }
            });
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @enum
     * Enum for ResponseType values
     * @property {string} ARRAYBUFFER - To download response content as an [ArrayBuffer]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}
     * @property {string} BLOB - To download content as a [binary/blob] {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob}
     * @property {string} DOCUMENT - This downloads content as a document or stream
     * @property {string} JSON - To download response content as a json
     * @property {string} STREAM - To download response as a [stream]{@link https://nodejs.org/api/stream.html}
     * @property {string} TEXT - For downloading response as a text
     */
    var ResponseType;
    (function (ResponseType) {
        ResponseType["ARRAYBUFFER"] = "arraybuffer";
        ResponseType["BLOB"] = "blob";
        ResponseType["DOCUMENT"] = "document";
        ResponseType["JSON"] = "json";
        ResponseType["RAW"] = "raw";
        ResponseType["STREAM"] = "stream";
        ResponseType["TEXT"] = "text";
    })(ResponseType || (ResponseType = {}));

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @enum
     * Enum for document types
     * @property {string} TEXT_HTML - The text/html content type
     * @property {string} TEXT_XML - The text/xml content type
     * @property {string} APPLICATION_XML - The application/xml content type
     * @property {string} APPLICATION_XHTML - The application/xhml+xml content type
     */
    var DocumentType;
    (function (DocumentType) {
        DocumentType["TEXT_HTML"] = "text/html";
        DocumentType["TEXT_XML"] = "text/xml";
        DocumentType["APPLICATION_XML"] = "application/xml";
        DocumentType["APPLICATION_XHTML"] = "application/xhtml+xml";
    })(DocumentType || (DocumentType = {}));
    /**
     * @enum
     * Enum for Content types
     * @property {string} TEXT_PLAIN - The text/plain content type
     * @property {string} APPLICATION_JSON - The application/json content type
     */
    var ContentType;
    (function (ContentType) {
        ContentType["TEXT_PLAIN"] = "text/plain";
        ContentType["APPLICATION_JSON"] = "application/json";
    })(ContentType || (ContentType = {}));
    /**
     * @enum
     * Enum for Content type regex
     * @property {string} DOCUMENT - The regex to match document content types
     * @property {string} IMAGE - The regex to match image content types
     */
    var ContentTypeRegexStr;
    (function (ContentTypeRegexStr) {
        ContentTypeRegexStr["DOCUMENT"] = "^(text\\/(html|xml))|(application\\/(xml|xhtml\\+xml))$";
        ContentTypeRegexStr["IMAGE"] = "^image\\/.+";
    })(ContentTypeRegexStr || (ContentTypeRegexStr = {}));
    /**
     * @class
     * Class for GraphResponseHandler
     */
    class GraphResponseHandler {
        /**
         * @private
         * @static
         * To parse Document response
         * @param {Response} rawResponse - The response object
         * @param {DocumentType} type - The type to which the document needs to be parsed
         * @returns A promise that resolves to a document content
         */
        static parseDocumentResponse(rawResponse, type) {
            try {
                if (typeof DOMParser !== "undefined") {
                    return new Promise((resolve, reject) => {
                        rawResponse.text().then((xmlString) => {
                            try {
                                const parser = new DOMParser();
                                const xmlDoc = parser.parseFromString(xmlString, type);
                                resolve(xmlDoc);
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                    });
                }
                else {
                    return Promise.resolve(rawResponse.body);
                }
            }
            catch (error) {
                throw error;
            }
        }
        /**
         * @private
         * @static
         * @async
         * To convert the native Response to response content
         * @param {Response} rawResponse - The response object
         * @param {ResponseType} [responseType] - The response type value
         * @returns A promise that resolves to the converted response content
         */
        static convertResponse(rawResponse, responseType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (rawResponse.status === 204) {
                    // NO CONTENT
                    return Promise.resolve();
                }
                let responseValue;
                try {
                    switch (responseType) {
                        case ResponseType.ARRAYBUFFER:
                            responseValue = yield rawResponse.arrayBuffer();
                            break;
                        case ResponseType.BLOB:
                            responseValue = yield rawResponse.blob();
                            break;
                        case ResponseType.DOCUMENT:
                            responseValue = yield GraphResponseHandler.parseDocumentResponse(rawResponse, DocumentType.TEXT_XML);
                            break;
                        case ResponseType.JSON:
                            responseValue = yield rawResponse.json();
                            break;
                        case ResponseType.STREAM:
                            responseValue = yield Promise.resolve(rawResponse.body);
                            break;
                        case ResponseType.TEXT:
                            responseValue = yield rawResponse.text();
                            break;
                        default:
                            const contentType = rawResponse.headers.get("Content-type");
                            if (contentType !== null) {
                                const mimeType = contentType.split(";")[0];
                                if (new RegExp(ContentTypeRegexStr.DOCUMENT).test(mimeType)) {
                                    responseValue = yield GraphResponseHandler.parseDocumentResponse(rawResponse, mimeType);
                                }
                                else if (new RegExp(ContentTypeRegexStr.IMAGE).test(mimeType)) {
                                    responseValue = rawResponse.blob();
                                }
                                else if (mimeType === ContentType.TEXT_PLAIN) {
                                    responseValue = yield rawResponse.text();
                                }
                                else if (mimeType === ContentType.APPLICATION_JSON) {
                                    responseValue = yield rawResponse.json();
                                }
                                else {
                                    responseValue = Promise.resolve(rawResponse.body);
                                }
                            }
                            else {
                                /**
                                 * RFC specification {@link https://tools.ietf.org/html/rfc7231#section-3.1.1.5} says:
                                 *  A sender that generates a message containing a payload body SHOULD
                                 *  generate a Content-Type header field in that message unless the
                                 *  intended media type of the enclosed representation is unknown to the
                                 *  sender.  If a Content-Type header field is not present, the recipient
                                 *  MAY either assume a media type of "application/octet-stream"
                                 *  ([RFC2046], Section 4.5.1) or examine the data to determine its type.
                                 *
                                 *  So assuming it as a stream type so returning the body.
                                 */
                                responseValue = Promise.resolve(rawResponse.body);
                            }
                            break;
                    }
                }
                catch (error) {
                    throw error;
                }
                return responseValue;
            });
        }
        /**
         * @public
         * @static
         * @async
         * To get the parsed response
         * @param {Response} rawResponse - The response object
         * @param {ResponseType} [responseType] - The response type value
         * @param {GraphRequestCallback} [callback] - The graph request callback function
         * @returns The parsed response
         */
        static getResponse(rawResponse, responseType, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (responseType === ResponseType.RAW) {
                        return Promise.resolve(rawResponse);
                    }
                    else {
                        const response = yield GraphResponseHandler.convertResponse(rawResponse, responseType);
                        if (rawResponse.ok) {
                            // Status Code 2XX
                            if (typeof callback === "function") {
                                callback(null, response);
                            }
                            else {
                                return response;
                            }
                        }
                        else {
                            // NOT OK Response
                            throw response;
                        }
                    }
                }
                catch (error) {
                    throw error;
                }
            });
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * A Class representing GraphRequest
     */
    class GraphRequest {
        /* tslint:enable: variable-name */
        /**
         * @public
         * @constructor
         * Creates an instance of GraphRequest
         * @param {HTTPClient} httpClient - The HTTPClient instance
         * @param {ClientOptions} config - The options for making request
         * @param {string} path - A path string
         */
        constructor(httpClient, config, path) {
            /**
             * @private
             * Parses the path string and creates URLComponents out of it
             * @param {string} path - The request path string
             * @returns Nothing
             */
            this.parsePath = (path) => {
                // Strips out the base of the url if they passed in
                if (path.indexOf("https://") !== -1) {
                    path = path.replace("https://", "");
                    // Find where the host ends
                    const endOfHostStrPos = path.indexOf("/");
                    if (endOfHostStrPos !== -1) {
                        // Parse out the host
                        this.urlComponents.host = "https://" + path.substring(0, endOfHostStrPos);
                        // Strip the host from path
                        path = path.substring(endOfHostStrPos + 1, path.length);
                    }
                    // Remove the following version
                    const endOfVersionStrPos = path.indexOf("/");
                    if (endOfVersionStrPos !== -1) {
                        // Parse out the version
                        this.urlComponents.version = path.substring(0, endOfVersionStrPos);
                        // Strip version from path
                        path = path.substring(endOfVersionStrPos + 1, path.length);
                    }
                }
                // Strip out any leading "/"
                if (path.charAt(0) === "/") {
                    path = path.substr(1);
                }
                const queryStrPos = path.indexOf("?");
                if (queryStrPos === -1) {
                    // No query string
                    this.urlComponents.path = path;
                }
                else {
                    this.urlComponents.path = path.substr(0, queryStrPos);
                    // Capture query string into oDataQueryParams and otherURLQueryParams
                    const queryParams = path.substring(queryStrPos + 1, path.length).split("&");
                    for (const queryParam of queryParams) {
                        this.parseQueryParameter(queryParam);
                    }
                }
            };
            this.httpClient = httpClient;
            this.config = config;
            this.urlComponents = {
                host: this.config.baseUrl,
                version: this.config.defaultVersion,
                oDataQueryParams: {},
                otherURLQueryParams: {},
                otherURLQueryOptions: [],
            };
            this._headers = {};
            this._options = {};
            this._middlewareOptions = [];
            this.parsePath(path);
        }
        /**
         * @private
         * Adds the query parameter as comma separated values
         * @param {string} propertyName - The name of a property
         * @param {string|string[]} propertyValue - The vale of a property
         * @param {IArguments} additionalProperties - The additional properties
         * @returns Nothing
         */
        addCsvQueryParameter(propertyName, propertyValue, additionalProperties) {
            // If there are already $propertyName value there, append a ","
            this.urlComponents.oDataQueryParams[propertyName] = this.urlComponents.oDataQueryParams[propertyName] ? this.urlComponents.oDataQueryParams[propertyName] + "," : "";
            let allValues = [];
            if (additionalProperties.length > 1 && typeof propertyValue === "string") {
                allValues = Array.prototype.slice.call(additionalProperties);
            }
            else if (typeof propertyValue === "string") {
                allValues.push(propertyValue);
            }
            else {
                allValues = allValues.concat(propertyValue);
            }
            this.urlComponents.oDataQueryParams[propertyName] += allValues.join(",");
        }
        /**
         * @private
         * Builds the full url from the URLComponents to make a request
         * @returns The URL string that is qualified to make a request to graph endpoint
         */
        buildFullUrl() {
            const url = urlJoin([this.urlComponents.host, this.urlComponents.version, this.urlComponents.path]) + this.createQueryString();
            if (this.config.debugLogging) {
                console.log(url); // tslint:disable-line: no-console
            }
            return url;
        }
        /**
         * @private
         * Builds the query string from the URLComponents
         * @returns The Constructed query string
         */
        createQueryString() {
            // Combining query params from oDataQueryParams and otherURLQueryParams
            const urlComponents = this.urlComponents;
            const query = [];
            if (Object.keys(urlComponents.oDataQueryParams).length !== 0) {
                for (const property in urlComponents.oDataQueryParams) {
                    if (urlComponents.oDataQueryParams.hasOwnProperty(property)) {
                        query.push(property + "=" + urlComponents.oDataQueryParams[property]);
                    }
                }
            }
            if (Object.keys(urlComponents.otherURLQueryParams).length !== 0) {
                for (const property in urlComponents.otherURLQueryParams) {
                    if (urlComponents.otherURLQueryParams.hasOwnProperty(property)) {
                        query.push(property + "=" + urlComponents.otherURLQueryParams[property]);
                    }
                }
            }
            if (urlComponents.otherURLQueryOptions.length !== 0) {
                for (const str of urlComponents.otherURLQueryOptions) {
                    query.push(str);
                }
            }
            return query.length > 0 ? "?" + query.join("&") : "";
        }
        /**
         * @private
         * Parses the query parameters to set the urlComponents property of the GraphRequest object
         * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query parameter
         * @returns The same GraphRequest instance that is being called with
         */
        parseQueryParameter(queryDictionaryOrString) {
            if (typeof queryDictionaryOrString === "string") {
                if (queryDictionaryOrString.charAt(0) === "?") {
                    queryDictionaryOrString = queryDictionaryOrString.substring(1);
                }
                if (queryDictionaryOrString.indexOf("&") !== -1) {
                    const queryParams = queryDictionaryOrString.split("&");
                    for (const str of queryParams) {
                        this.parseQueryParamenterString(str);
                    }
                }
                else {
                    this.parseQueryParamenterString(queryDictionaryOrString);
                }
            }
            else if (queryDictionaryOrString.constructor === Object) {
                for (const key in queryDictionaryOrString) {
                    if (queryDictionaryOrString.hasOwnProperty(key)) {
                        this.setURLComponentsQueryParamater(key, queryDictionaryOrString[key]);
                    }
                }
            }
            return this;
        }
        /**
         * @private
         * Parses the query parameter of string type to set the urlComponents property of the GraphRequest object
         * @param {string} queryParameter - the query parameters
         * returns nothing
         */
        parseQueryParamenterString(queryParameter) {
            /* The query key-value pair must be split on the first equals sign to avoid errors in parsing nested query parameters.
                     Example-> "/me?$expand=home($select=city)" */
            if (this.isValidQueryKeyValuePair(queryParameter)) {
                const indexOfFirstEquals = queryParameter.indexOf("=");
                const paramKey = queryParameter.substring(0, indexOfFirstEquals);
                const paramValue = queryParameter.substring(indexOfFirstEquals + 1);
                this.setURLComponentsQueryParamater(paramKey, paramValue);
            }
            else {
                /* Push values which are not of key-value structure.
                Example-> Handle an invalid input->.query(test), .query($select($select=name)) and let the Graph API respond with the error in the URL*/
                this.urlComponents.otherURLQueryOptions.push(queryParameter);
            }
        }
        /**
         * @private
         * Sets values into the urlComponents property of GraphRequest object.
         * @param {string} paramKey - the query parameter key
         * @param {string} paramValue - the query paramter value
         * @returns nothing
         */
        setURLComponentsQueryParamater(paramKey, paramValue) {
            if (oDataQueryNames.indexOf(paramKey) !== -1) {
                const currentValue = this.urlComponents.oDataQueryParams[paramKey];
                const isValueAppendable = currentValue && (paramKey === "$expand" || paramKey === "$select" || paramKey === "$orderby");
                this.urlComponents.oDataQueryParams[paramKey] = isValueAppendable ? currentValue + "," + paramValue : paramValue;
            }
            else {
                this.urlComponents.otherURLQueryParams[paramKey] = paramValue;
            }
        }
        /**
         * @private
         * Check if the query parameter string has a valid key-value structure
         * @param {string} queryString - the query parameter string. Example -> "name=value"
         * #returns true if the query string has a valid key-value structure else false
         */
        isValidQueryKeyValuePair(queryString) {
            const indexofFirstEquals = queryString.indexOf("=");
            if (indexofFirstEquals === -1) {
                return false;
            }
            const indexofOpeningParanthesis = queryString.indexOf("(");
            if (indexofOpeningParanthesis !== -1 && queryString.indexOf("(") < indexofFirstEquals) {
                // Example -> .query($select($expand=true));
                return false;
            }
            return true;
        }
        /**
         * @private
         * Updates the custom headers and options for a request
         * @param {FetchOptions} options - The request options object
         * @returns Nothing
         */
        updateRequestOptions(options) {
            const optionsHeaders = Object.assign({}, options.headers);
            if (this.config.fetchOptions !== undefined) {
                const fetchOptions = Object.assign({}, this.config.fetchOptions);
                Object.assign(options, fetchOptions);
                if (typeof this.config.fetchOptions.headers !== undefined) {
                    options.headers = Object.assign({}, this.config.fetchOptions.headers);
                }
            }
            Object.assign(options, this._options);
            if (options.headers !== undefined) {
                Object.assign(optionsHeaders, options.headers);
            }
            Object.assign(optionsHeaders, this._headers);
            options.headers = optionsHeaders;
        }
        /**
         * @private
         * @async
         * Adds the custom headers and options to the request and makes the HTTPClient send request call
         * @param {RequestInfo} request - The request url string or the Request object value
         * @param {FetchOptions} options - The options to make a request
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the response content
         */
        send(request, options, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                let rawResponse;
                const middlewareControl = new MiddlewareControl(this._middlewareOptions);
                this.updateRequestOptions(options);
                try {
                    const context = yield this.httpClient.sendRequest({
                        request,
                        options,
                        middlewareControl,
                    });
                    rawResponse = context.response;
                    const response = yield GraphResponseHandler.getResponse(rawResponse, this._responseType, callback);
                    return response;
                }
                catch (error) {
                    let statusCode;
                    if (typeof rawResponse !== "undefined") {
                        statusCode = rawResponse.status;
                    }
                    const gError = yield GraphErrorHandler.getError(error, statusCode, callback);
                    throw gError;
                }
            });
        }
        /**
         * @private
         * Checks if the content-type is present in the _headers property. If not present, defaults the content-type to application/json
         * @param none
         * @returns nothing
         */
        setHeaderContentType() {
            if (!this._headers) {
                this.header("Content-Type", "application/json");
                return;
            }
            const headerKeys = Object.keys(this._headers);
            for (const headerKey of headerKeys) {
                if (headerKey.toLowerCase() === "content-type") {
                    return;
                }
            }
            // Default the content-type to application/json in case the content-type is not present in the header
            this.header("Content-Type", "application/json");
        }
        /**
         * @public
         * Sets the custom header for a request
         * @param {string} headerKey - A header key
         * @param {string} headerValue - A header value
         * @returns The same GraphRequest instance that is being called with
         */
        header(headerKey, headerValue) {
            this._headers[headerKey] = headerValue;
            return this;
        }
        /**
         * @public
         * Sets the custom headers for a request
         * @param {KeyValuePairObjectStringNumber | HeadersInit} headers - The request headers
         * @returns The same GraphRequest instance that is being called with
         */
        headers(headers) {
            for (const key in headers) {
                if (headers.hasOwnProperty(key)) {
                    this._headers[key] = headers[key];
                }
            }
            return this;
        }
        /**
         * @public
         * Sets the option for making a request
         * @param {string} key - The key value
         * @param {any} value - The value
         * @returns The same GraphRequest instance that is being called with
         */
        option(key, value) {
            this._options[key] = value;
            return this;
        }
        /**
         * @public
         * Sets the options for making a request
         * @param {{ [key: string]: any }} options - The options key value pair
         * @returns The same GraphRequest instance that is being called with
         */
        options(options) {
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    this._options[key] = options[key];
                }
            }
            return this;
        }
        /**
         * @public
         * Sets the middleware options for a request
         * @param {MiddlewareOptions[]} options - The array of middleware options
         * @returns The same GraphRequest instance that is being called with
         */
        middlewareOptions(options) {
            this._middlewareOptions = options;
            return this;
        }
        /**
         * @public
         * Sets the api endpoint version for a request
         * @param {string} version - The version value
         * @returns The same GraphRequest instance that is being called with
         */
        version(version) {
            this.urlComponents.version = version;
            return this;
        }
        /**
         * @public
         * Sets the api endpoint version for a request
         * @param {ResponseType} responseType - The response type value
         * @returns The same GraphRequest instance that is being called with
         */
        responseType(responseType) {
            this._responseType = responseType;
            return this;
        }
        /**
         * @public
         * To add properties for select OData Query param
         * @param {string|string[]} properties - The Properties value
         * @returns The same GraphRequest instance that is being called with, after adding the properties for $select query
         */
        /*
         * Accepts .select("displayName,birthday")
         *     and .select(["displayName", "birthday"])
         *     and .select("displayName", "birthday")
         *
         */
        select(properties) {
            this.addCsvQueryParameter("$select", properties, arguments);
            return this;
        }
        /**
         * @public
         * To add properties for expand OData Query param
         * @param {string|string[]} properties - The Properties value
         * @returns The same GraphRequest instance that is being called with, after adding the properties for $expand query
         */
        expand(properties) {
            this.addCsvQueryParameter("$expand", properties, arguments);
            return this;
        }
        /**
         * @public
         * To add properties for orderby OData Query param
         * @param {string|string[]} properties - The Properties value
         * @returns The same GraphRequest instance that is being called with, after adding the properties for $orderby query
         */
        orderby(properties) {
            this.addCsvQueryParameter("$orderby", properties, arguments);
            return this;
        }
        /**
         * @public
         * To add query string for filter OData Query param. The request URL accepts only one $filter Odata Query option and its value is set to the most recently passed filter query string.
         * @param {string} filterStr - The filter query string
         * @returns The same GraphRequest instance that is being called with, after adding the $filter query
         */
        filter(filterStr) {
            this.urlComponents.oDataQueryParams.$filter = filterStr;
            return this;
        }
        /**
         * @public
         * To add criterion for search OData Query param. The request URL accepts only one $search Odata Query option and its value is set to the most recently passed search criterion string.
         * @param {string} searchStr - The search criterion string
         * @returns The same GraphRequest instance that is being called with, after adding the $search query criteria
         */
        search(searchStr) {
            this.urlComponents.oDataQueryParams.$search = searchStr;
            return this;
        }
        /**
         * @public
         * To add number for top OData Query param. The request URL accepts only one $top Odata Query option and its value is set to the most recently passed number value.
         * @param {number} n - The number value
         * @returns The same GraphRequest instance that is being called with, after adding the number for $top query
         */
        top(n) {
            this.urlComponents.oDataQueryParams.$top = n;
            return this;
        }
        /**
         * @public
         * To add number for skip OData Query param. The request URL accepts only one $skip Odata Query option and its value is set to the most recently passed number value.
         * @param {number} n - The number value
         * @returns The same GraphRequest instance that is being called with, after adding the number for the $skip query
         */
        skip(n) {
            this.urlComponents.oDataQueryParams.$skip = n;
            return this;
        }
        /**
         * @public
         * To add token string for skipToken OData Query param. The request URL accepts only one $skipToken Odata Query option and its value is set to the most recently passed token value.
         * @param {string} token - The token value
         * @returns The same GraphRequest instance that is being called with, after adding the token string for $skipToken query option
         */
        skipToken(token) {
            this.urlComponents.oDataQueryParams.$skipToken = token;
            return this;
        }
        /**
         * @public
         * To add boolean for count OData Query param. The URL accepts only one $count Odata Query option and its value is set to the most recently passed boolean value.
         * @param {boolean} isCount - The count boolean
         * @returns The same GraphRequest instance that is being called with, after adding the boolean value for the $count query option
         */
        count(isCount = false) {
            this.urlComponents.oDataQueryParams.$count = isCount.toString();
            return this;
        }
        /**
         * @public
         * Appends query string to the urlComponent
         * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query value
         * @returns The same GraphRequest instance that is being called with, after appending the query string to the url component
         */
        /*
         * Accepts .query("displayName=xyz")
         *     and .select({ name: "value" })
         */
        query(queryDictionaryOrString) {
            return this.parseQueryParameter(queryDictionaryOrString);
        }
        /**
         * @public
         * @async
         * Makes a http request with GET method
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the get response
         */
        get(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.buildFullUrl();
                const options = {
                    method: RequestMethod.GET,
                };
                try {
                    const response = yield this.send(url, options, callback);
                    return response;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Makes a http request with POST method
         * @param {any} content - The content that needs to be sent with the request
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the post response
         */
        post(content, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.buildFullUrl();
                const options = {
                    method: RequestMethod.POST,
                    body: serializeContent(content),
                };
                const className = content && content.constructor && content.constructor.name;
                if (className === "FormData") {
                    // Content-Type headers should not be specified in case the of FormData type content
                    options.headers = {};
                }
                else {
                    this.setHeaderContentType();
                    options.headers = this._headers;
                }
                try {
                    const response = yield this.send(url, options, callback);
                    return response;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Alias for Post request call
         * @param {any} content - The content that needs to be sent with the request
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the post response
         */
        create(content, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield this.post(content, callback);
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Makes http request with PUT method
         * @param {any} content - The content that needs to be sent with the request
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the put response
         */
        put(content, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.buildFullUrl();
                this.setHeaderContentType();
                const options = {
                    method: RequestMethod.PUT,
                    body: serializeContent(content),
                };
                try {
                    const response = yield this.send(url, options, callback);
                    return response;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Makes http request with PATCH method
         * @param {any} content - The content that needs to be sent with the request
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the patch response
         */
        patch(content, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.buildFullUrl();
                this.setHeaderContentType();
                const options = {
                    method: RequestMethod.PATCH,
                    body: serializeContent(content),
                };
                try {
                    const response = yield this.send(url, options, callback);
                    return response;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Alias for PATCH request
         * @param {any} content - The content that needs to be sent with the request
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the patch response
         */
        update(content, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield this.patch(content, callback);
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Makes http request with DELETE method
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the delete response
         */
        delete(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.buildFullUrl();
                const options = {
                    method: RequestMethod.DELETE,
                };
                try {
                    const response = yield this.send(url, options, callback);
                    return response;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Alias for delete request call
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the delete response
         */
        del(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield this.delete(callback);
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Makes a http request with GET method to read response as a stream.
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the getStream response
         */
        getStream(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.buildFullUrl();
                const options = {
                    method: RequestMethod.GET,
                };
                this.responseType(ResponseType.STREAM);
                try {
                    const stream = yield this.send(url, options, callback);
                    return stream;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * @public
         * @async
         * Makes a http request with GET method to read response as a stream.
         * @param {any} stream - The stream instance
         * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
         * @returns A promise that resolves to the putStream response
         */
        putStream(stream, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const url = this.buildFullUrl();
                const options = {
                    method: RequestMethod.PUT,
                    headers: {
                        "Content-Type": "application/octet-stream",
                    },
                    body: stream,
                };
                try {
                    const response = yield this.send(url, options, callback);
                    return response;
                }
                catch (error) {
                    throw error;
                }
            });
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @class
     * Class representing HTTPClient
     */
    class HTTPClient {
        /**
         * @public
         * @constructor
         * Creates an instance of a HTTPClient
         * @param {...Middleware} middleware - The first middleware of the middleware chain or a sequence of all the Middleware handlers
         */
        constructor(...middleware) {
            if (!middleware || !middleware.length) {
                const error = new Error();
                error.name = "InvalidMiddlewareChain";
                error.message = "Please provide a default middleware chain or custom middleware chain";
                throw error;
            }
            this.setMiddleware(...middleware);
        }
        /**
         * @private
         * Processes the middleware parameter passed to set this.middleware property
         * The calling function should validate if middleware is not undefined or not empty.
         * @param {...Middleware} middleware - The middleware passed
         * @returns Nothing
         */
        setMiddleware(...middleware) {
            if (middleware.length > 1) {
                this.parseMiddleWareArray(middleware);
            }
            else {
                this.middleware = middleware[0];
            }
        }
        /**
         * @private
         * Processes the middleware array to construct the chain
         * and sets this.middleware property to the first middlware handler of the array
         * The calling function should validate if middleware is not undefined or not empty
         * @param {Middleware[]} middlewareArray - The array of middleware handlers
         * @returns Nothing
         */
        parseMiddleWareArray(middlewareArray) {
            middlewareArray.forEach((element, index) => {
                if (index < middlewareArray.length - 1) {
                    element.setNext(middlewareArray[index + 1]);
                }
            });
            this.middleware = middlewareArray[0];
        }
        /**
         * @public
         * @async
         * To send the request through the middleware chain
         * @param {Context} context - The context of a request
         * @returns A promise that resolves to the Context
         */
        sendRequest(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (typeof context.request === "string" && context.options === undefined) {
                        const error = new Error();
                        error.name = "InvalidRequestOptions";
                        error.message = "Unable to execute the middleware, Please provide valid options for a request";
                        throw error;
                    }
                    yield this.middleware.execute(context);
                    return context;
                }
                catch (error) {
                    throw error;
                }
            });
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @private
     * To check whether the environment is node or not
     * @returns A boolean representing the environment is node or not
     */
    const isNodeEnvironment = () => {
        return typeof process === "object" && typeof require === "function";
    };
    /**
     * @class
     * Class representing HTTPClientFactory
     */
    class HTTPClientFactory {
        /**
         * @public
         * @static
         * Creates HTTPClient with default middleware chain
         * @param {AuthenticationProvider} authProvider - The authentication provider instance
         * @returns A HTTPClient instance
         *
         * NOTE: These are the things that we need to remember while doing modifications in the below default pipeline.
         * 		* HTTPMessageHander should be the last one in the middleware pipeline, because this makes the actual network call of the request
         * 		* TelemetryHandler should be the one prior to the last middleware in the chain, because this is the one which actually collects and appends the usage flag and placing this handler 	*		  before making the actual network call ensures that the usage of all features are recorded in the flag.
         * 		* The best place for AuthenticationHandler is in the starting of the pipeline, because every other handler might have to work for multiple times for a request but the auth token for
         * 		  them will remain same. For example, Retry and Redirect handlers might be working multiple times for a request based on the response but their auth token would remain same.
         */
        static createWithAuthenticationProvider(authProvider) {
            const authenticationHandler = new AuthenticationHandler(authProvider);
            const retryHandler = new RetryHandler(new RetryHandlerOptions());
            const telemetryHandler = new TelemetryHandler();
            const httpMessageHandler = new HTTPMessageHandler();
            authenticationHandler.setNext(retryHandler);
            if (isNodeEnvironment()) {
                const redirectHandler = new RedirectHandler(new RedirectHandlerOptions());
                retryHandler.setNext(redirectHandler);
                redirectHandler.setNext(telemetryHandler);
            }
            else {
                retryHandler.setNext(telemetryHandler);
            }
            telemetryHandler.setNext(httpMessageHandler);
            return HTTPClientFactory.createWithMiddleware(authenticationHandler);
        }
        /**
         * @public
         * @static
         * Creates a middleware chain with the given one
         * @property {...Middleware} middleware - The first middleware of the middleware chain or a sequence of all the Middleware handlers
         * @returns A HTTPClient instance
         */
        static createWithMiddleware(...middleware) {
            // Middleware should not empty or undefined. This is check is present in the HTTPClient constructor.
            return new HTTPClient(...middleware);
        }
    }

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    /**
     * @constant
     * @function
     * Validates availability of Promise and fetch in global context
     * @returns The true in case the Promise and fetch available, otherwise throws error
     */
    const validatePolyFilling = () => {
        if (typeof Promise === "undefined" && typeof fetch === "undefined") {
            const error = new Error("Library cannot function without Promise and fetch. So, please provide polyfill for them.");
            error.name = "PolyFillNotAvailable";
            throw error;
        }
        else if (typeof Promise === "undefined") {
            const error = new Error("Library cannot function without Promise. So, please provide polyfill for it.");
            error.name = "PolyFillNotAvailable";
            throw error;
        }
        else if (typeof fetch === "undefined") {
            const error = new Error("Library cannot function without fetch. So, please provide polyfill for it.");
            error.name = "PolyFillNotAvailable";
            throw error;
        }
        return true;
    };

    /**
     * -------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
     * See License in the project root for license information.
     * -------------------------------------------------------------------------------------------
     */
    class Client {
        /**
         * @private
         * @constructor
         * Creates an instance of Client
         * @param {ClientOptions} clientOptions - The options to instantiate the client object
         */
        constructor(clientOptions) {
            /**
             * @private
             * A member which stores the Client instance options
             */
            this.config = {
                baseUrl: GRAPH_BASE_URL,
                debugLogging: false,
                defaultVersion: GRAPH_API_VERSION,
            };
            try {
                validatePolyFilling();
            }
            catch (error) {
                throw error;
            }
            for (const key in clientOptions) {
                if (clientOptions.hasOwnProperty(key)) {
                    this.config[key] = clientOptions[key];
                }
            }
            let httpClient;
            if (clientOptions.authProvider !== undefined && clientOptions.middleware !== undefined) {
                const error = new Error();
                error.name = "AmbiguityInInitialization";
                error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain not both";
                throw error;
            }
            else if (clientOptions.authProvider !== undefined) {
                httpClient = HTTPClientFactory.createWithAuthenticationProvider(clientOptions.authProvider);
            }
            else if (clientOptions.middleware !== undefined) {
                httpClient = new HTTPClient(...[].concat(clientOptions.middleware));
            }
            else {
                const error = new Error();
                error.name = "InvalidMiddlewareChain";
                error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain";
                throw error;
            }
            this.httpClient = httpClient;
        }
        /**
         * @public
         * @static
         * To create a client instance with options and initializes the default middleware chain
         * @param {Options} options - The options for client instance
         * @returns The Client instance
         */
        static init(options) {
            const clientOptions = {};
            for (const i in options) {
                if (options.hasOwnProperty(i)) {
                    clientOptions[i] = i === "authProvider" ? new CustomAuthenticationProvider(options[i]) : options[i];
                }
            }
            return Client.initWithMiddleware(clientOptions);
        }
        /**
         * @public
         * @static
         * To create a client instance with the Client Options
         * @param {ClientOptions} clientOptions - The options object for initializing the client
         * @returns The Client instance
         */
        static initWithMiddleware(clientOptions) {
            try {
                return new Client(clientOptions);
            }
            catch (error) {
                throw error;
            }
        }
        /**
         * @public
         * Entry point to make requests
         * @param {string} path - The path string value
         * @returns The graph request instance
         */
        api(path) {
            return new GraphRequest(this.httpClient, this.config, path);
        }
    }

    // Copyright (c) Microsoft Corporation.
    /**
     * Get Microsoft graph client.
     *
     * @example
     * Get Microsoft graph client by TokenCredential
     * ```typescript
     * // Sso token example (Azure Function)
     * const ssoToken = "YOUR_TOKEN_STRING";
     * const options = {"AAD_APP_ID", "AAD_APP_SECRET"};
     * const credential = new OnBehalfOfAADUserCredential(ssoToken, options);
     * const graphClient = await createMicrosoftGraphClient(credential);
     * const profile = await graphClient.api("/me").get();
     *
     * // TeamsBotSsoPrompt example (Bot Application)
     * const requiredScopes = ["User.Read"];
     * const config: Configuration = {
     *    loginUrl: loginUrl,
     *    clientId: clientId,
     *    clientSecret: clientSecret,
     *    tenantId: tenantId
     * };
     * const prompt = new TeamsBotSsoPrompt(dialogId, {
     *    config: config
     *    scopes: '["User.Read"],
     * });
     * this.addDialog(prompt);
     *
     * const oboCredential = new OnBehalfOfAADUserCredential(
     *  getUserId(dialogContext),
     *  {
     *    clientId: "AAD_APP_ID",
     *    clientSecret: "AAD_APP_SECRET"
     *  });
     * try {
     *    const graphClient = await createMicrosoftGraphClient(credential);
     *    const profile = await graphClient.api("/me").get();
     * } catch (e) {
     *    dialogContext.beginDialog(dialogId);
     *    return Dialog.endOfTurn();
     * }
     * ```
     *
     * @param {TokenCredential} credential - token credential instance.
     * @param scopes - The array of Microsoft Token scope of access. Default value is `[.default]`.
     *
     * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
     *
     * @returns Graph client with specified scopes.
     *
     * @beta
     */
    function createMicrosoftGraphClient(credential, scopes) {
        internalLogger.info("Create Microsoft Graph Client");
        const authProvider = new MsGraphAuthProvider(credential, scopes);
        const graphClient = Client.initWithMiddleware({
            authProvider,
        });
        return graphClient;
    }

    // Copyright (c) Microsoft Corporation.
    /**
     * The AzureLogger used for all clients within the identity package
     */
    const logger$1 = createClientLogger("identity");
    /**
     * Formatting the success event on the credentials
     */
    function formatError(scope, error) {
        let message = "ERROR.";
        if (scope === null || scope === void 0 ? void 0 : scope.length) {
            message += ` Scopes: ${Array.isArray(scope) ? scope.join(", ") : scope}.`;
        }
        return `${message} Error message: ${typeof error === "string" ? error : error.message}.`;
    }
    /**
     * Generates a CredentialLoggerInstance.
     *
     * It logs with the format:
     *
     *   `[title] => [message]`
     *
     */
    function credentialLoggerInstance(title, parent, log = logger$1) {
        const fullTitle = parent ? `${parent.fullTitle} ${title}` : title;
        function info(message) {
            log.info(`${fullTitle} =>`, message);
        }
        return {
            title,
            fullTitle,
            info
        };
    }
    /**
     * Generates a CredentialLogger, which is a logger declared at the credential's constructor, and used at any point in the credential.
     * It has all the properties of a CredentialLoggerInstance, plus other logger instances, one per method.
     *
     * It logs with the format:
     *
     *   `[title] => [message]`
     *   `[title] => getToken() => [message]`
     *
     */
    function credentialLogger(title, log = logger$1) {
        const credLogger = credentialLoggerInstance(title, undefined, log);
        return Object.assign(Object.assign({}, credLogger), { getToken: credentialLoggerInstance("=> getToken()", credLogger, log) });
    }

    // Copyright (c) Microsoft Corporation.
    const BrowserNotSupportedError = new Error("ManagedIdentityCredential is not supported in the browser.");
    const logger = credentialLogger("ManagedIdentityCredential");
    class ManagedIdentityCredential {
        constructor() {
            logger.info(formatError("", BrowserNotSupportedError));
            throw BrowserNotSupportedError;
        }
        getToken() {
            return __awaiter$1(this, void 0, void 0, function* () {
                logger.getToken.info(formatError("", BrowserNotSupportedError));
                throw BrowserNotSupportedError;
            });
        }
    }

    // Copyright (c) Microsoft Corporation.
    /**
     * SQL connection configuration instance.
     * @remarks
     * Only works in in server side.
     *
     * @beta
     *
     */
    class DefaultTediousConnectionConfiguration {
        constructor() {
            /**
             * MSSQL default scope
             * https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-connect-msi
             */
            this.defaultSQLScope = "https://database.windows.net/";
        }
        /**
         * Generate connection configuration consumed by tedious.
         *
         * @returns Connection configuration of tedious for the SQL.
         *
         * @throws {@link ErrorCode|InvalidConfiguration} when SQL config resource configuration is invalid.
         * @throws {@link ErrorCode|InternalError} when get user MSI token failed or MSI token is invalid.
         * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is browser.
         *
         * @beta
         */
        getConfig() {
            return __awaiter$1(this, void 0, void 0, function* () {
                internalLogger.info("Get SQL configuration");
                const configuration = getResourceConfiguration(exports.ResourceType.SQL);
                if (!configuration) {
                    const errMsg = "SQL resource configuration not exist";
                    internalLogger.error(errMsg);
                    throw new ErrorWithCode(errMsg, exports.ErrorCode.InvalidConfiguration);
                }
                try {
                    this.isSQLConfigurationValid(configuration);
                }
                catch (err) {
                    throw err;
                }
                if (!this.isMsiAuthentication()) {
                    const configWithUPS = this.generateDefaultConfig(configuration);
                    internalLogger.verbose("SQL configuration with username and password generated");
                    return configWithUPS;
                }
                try {
                    const configWithToken = yield this.generateTokenConfig(configuration);
                    internalLogger.verbose("SQL configuration with MSI token generated");
                    return configWithToken;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * Check SQL use MSI identity or username and password.
         *
         * @returns false - login with SQL MSI identity, true - login with username and password.
         * @internal
         */
        isMsiAuthentication() {
            internalLogger.verbose("Check connection config using MSI access token or username and password");
            const configuration = getResourceConfiguration(exports.ResourceType.SQL);
            if ((configuration === null || configuration === void 0 ? void 0 : configuration.sqlUsername) != null && (configuration === null || configuration === void 0 ? void 0 : configuration.sqlPassword) != null) {
                internalLogger.verbose("Login with username and password");
                return false;
            }
            internalLogger.verbose("Login with MSI identity");
            return true;
        }
        /**
         * check configuration is an available configurations.
         * @param { SqlConfiguration } sqlConfig
         *
         * @returns true - SQL configuration has a valid SQL endpoints, SQL username with password or identity ID.
         *          false - configuration is not valid.
         * @internal
         */
        isSQLConfigurationValid(sqlConfig) {
            internalLogger.verbose("Check SQL configuration if valid");
            if (!sqlConfig.sqlServerEndpoint) {
                internalLogger.error("SQL configuration is not valid without SQL server endpoint exist");
                throw new ErrorWithCode("SQL configuration error without SQL server endpoint exist", exports.ErrorCode.InvalidConfiguration);
            }
            if (!(sqlConfig.sqlUsername && sqlConfig.sqlPassword) && !sqlConfig.sqlIdentityId) {
                const errMsg = `SQL configuration is not valid without ${sqlConfig.sqlIdentityId ? "" : "identity id "} ${sqlConfig.sqlUsername ? "" : "SQL username "} ${sqlConfig.sqlPassword ? "" : "SQL password"} exist`;
                internalLogger.error(errMsg);
                throw new ErrorWithCode(errMsg, exports.ErrorCode.InvalidConfiguration);
            }
            internalLogger.verbose("SQL configuration is valid");
        }
        /**
         * Generate tedious connection configuration with default authentication type.
         *
         * @param { SqlConfiguration } SQL configuration with username and password.
         *
         * @returns Tedious connection configuration with username and password.
         * @internal
         */
        generateDefaultConfig(sqlConfig) {
            internalLogger.verbose(`SQL server ${sqlConfig.sqlServerEndpoint}, user name ${sqlConfig.sqlUsername}, database name ${sqlConfig.sqlDatabaseName}`);
            const config = {
                server: sqlConfig.sqlServerEndpoint,
                authentication: {
                    type: TediousAuthenticationType.default,
                    options: {
                        userName: sqlConfig.sqlUsername,
                        password: sqlConfig.sqlPassword,
                    },
                },
                options: {
                    database: sqlConfig.sqlDatabaseName,
                    encrypt: true,
                },
            };
            return config;
        }
        /**
         * Generate tedious connection configuration with azure-active-directory-access-token authentication type.
         *
         * @param { SqlConfiguration } SQL configuration with AAD access token.
         *
         * @returns Tedious connection configuration with access token.
         * @internal
         */
        generateTokenConfig(sqlConfig) {
            return __awaiter$1(this, void 0, void 0, function* () {
                internalLogger.verbose("Generate tedious config with MSI token");
                let token;
                try {
                    const credential = new ManagedIdentityCredential(sqlConfig.sqlIdentityId);
                    token = yield credential.getToken(this.defaultSQLScope);
                }
                catch (error) {
                    const errMsg = "Get user MSI token failed";
                    internalLogger.error(errMsg);
                    throw new ErrorWithCode(errMsg, exports.ErrorCode.InternalError);
                }
                if (token) {
                    const config = {
                        server: sqlConfig.sqlServerEndpoint,
                        authentication: {
                            type: TediousAuthenticationType.MSI,
                            options: {
                                token: token.token,
                            },
                        },
                        options: {
                            database: sqlConfig.sqlDatabaseName,
                            encrypt: true,
                        },
                    };
                    internalLogger.verbose(`Generate token configuration success, server endpoint is ${sqlConfig.sqlServerEndpoint}, database name is ${sqlConfig.sqlDatabaseName}`);
                    return config;
                }
                internalLogger.error(`Generate token configuration, server endpoint is ${sqlConfig.sqlServerEndpoint}, MSI token is not valid`);
                throw new ErrorWithCode("MSI token is not valid", exports.ErrorCode.InternalError);
            });
        }
    }
    /**
     * tedious connection config authentication type.
     * https://tediousjs.github.io/tedious/api-connection.html
     * @internal
     */
    var TediousAuthenticationType;
    (function (TediousAuthenticationType) {
        TediousAuthenticationType["default"] = "default";
        TediousAuthenticationType["MSI"] = "azure-active-directory-access-token";
    })(TediousAuthenticationType || (TediousAuthenticationType = {}));

    exports.DefaultTediousConnectionConfiguration = DefaultTediousConnectionConfiguration;
    exports.ErrorWithCode = ErrorWithCode;
    exports.M365TenantCredential = M365TenantCredential;
    exports.MsGraphAuthProvider = MsGraphAuthProvider;
    exports.OnBehalfOfUserCredential = OnBehalfOfUserCredential;
    exports.TeamsBotSsoPrompt = TeamsBotSsoPrompt;
    exports.TeamsUserCredential = TeamsUserCredential;
    exports.createMicrosoftGraphClient = createMicrosoftGraphClient;
    exports.getAuthenticationConfiguration = getAuthenticationConfiguration;
    exports.getLogLevel = getLogLevel;
    exports.getResourceConfiguration = getResourceConfiguration;
    exports.loadConfiguration = loadConfiguration;
    exports.setLogFunction = setLogFunction;
    exports.setLogLevel = setLogLevel$1;
    exports.setLogger = setLogger;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=teamsfx.js.map
