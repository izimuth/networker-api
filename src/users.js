"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.authMiddleware = exports.getUserJson = exports.getUserById = exports.createAuthToken = exports.createUser = void 0;
var bcrypt_1 = require("bcrypt");
var uuid_1 = require("uuid");
var sql_1 = require("./db/sql");
function createUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user.password = bcrypt_1["default"].hashSync(user.password, 10);
                    return [4 /*yield*/, (0, sql_1["default"])(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\t\tINSERT INTO users (email, password, display_name) VALUES (", ", ", ", ", ")\n\t"], ["\n\t\tINSERT INTO users (email, password, display_name) VALUES (", ", ", ", ", ")\n\t"])), user.email, user.password, user.display_name)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.createUser = createUser;
function createAuthToken(user) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenValue, expires;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenValue = (0, uuid_1.v4)();
                    expires = Date.now() + (86400 * 7 * 1000);
                    return [4 /*yield*/, (0, sql_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["INSERT INTO user_auth_tokens (user_id, token_value, expires_after) VALUES (", ", ", ", ", ")"], ["INSERT INTO user_auth_tokens (user_id, token_value, expires_after) VALUES (", ", ", ", ", ")"])), user.id, tokenValue, expires)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, tokenValue];
            }
        });
    });
}
exports.createAuthToken = createAuthToken;
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sql_1["default"])(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT * FROM users WHERE id = ", ""], ["SELECT * FROM users WHERE id = ", ""])), id)];
                case 1:
                    user = (_a.sent())[0];
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.getUserById = getUserById;
function getUserJson(user) {
    return {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
        is_visible: user.is_visible,
        is_active: user.is_active,
        shareable_code: user.shareable_code,
        avatar_file: user.avatar_file
    };
}
exports.getUserJson = getUserJson;
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var now, _a, type, token, authToken, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    now = Date.now();
                    // look for authorization header
                    if (!req.headers.authorization) {
                        res.status(403);
                        res.send({ error: 'No authorization header' });
                        return [2 /*return*/];
                    }
                    _a = req.headers.authorization.trim().split(/\s+/), type = _a[0], token = _a[1];
                    // type must be bearer
                    if (type.toLowerCase() != 'bearer') {
                        res.status(400);
                        res.send({ error: "Invalid authorization type: ".concat(type) });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, sql_1["default"])(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT * FROM user_auth_tokens WHERE token_value = ", ""], ["SELECT * FROM user_auth_tokens WHERE token_value = ", ""])), token)];
                case 1:
                    authToken = (_b.sent())[0];
                    if (!(authToken && now < authToken.expires_after)) return [3 /*break*/, 3];
                    return [4 /*yield*/, getUserById(authToken.user_id)];
                case 2:
                    user = _b.sent();
                    // make sure user record exists and is set to active
                    if (!user || !user.is_active) {
                        res.status(400);
                        res.send({ error: 'Invalid user' });
                        return [2 /*return*/];
                    }
                    // add user and token to request
                    req.user = user;
                    req.authToken = authToken;
                    // continue with request
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    res.status(403);
                    res.send({ error: 'Auth token expired or invalid' });
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.authMiddleware = authMiddleware;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
