"use strict";
exports.__esModule = true;
require("dotenv/config");
var express_1 = require("express");
var express_fileupload_1 = require("express-fileupload");
require("./types");
var auth_1 = require("./api/auth");
var profile_1 = require("./api/profile");
var qrcode_1 = require("./api/qrcode");
var connections_1 = require("./api/connections");
var delete_1 = require("./api/delete");
var profile_2 = require("./web/profile");
var users_1 = require("./users");
var app = (0, express_1["default"])();
app.use('/static', express_1["default"].static('static'));
app.use(express_1["default"].urlencoded());
app.use(express_1["default"].json());
app.use((0, express_fileupload_1["default"])({
// useTempFiles: true,
// tempFileDir: '/tmp/'
}));
app.use('/auth', auth_1["default"]);
app.use('/getqrcode', qrcode_1["default"]);
app.use('/profile', users_1.authMiddleware, profile_1["default"]);
app.use('/connections', users_1.authMiddleware, connections_1["default"]);
app.use('/delete', users_1.authMiddleware, delete_1["default"]);
app.use('/qrcode', profile_2["default"]);
app.listen(3001);
