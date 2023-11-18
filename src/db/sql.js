"use strict";
exports.__esModule = true;
var postgres_1 = require("postgres");
exports["default"] = (0, postgres_1["default"])({
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    pass: process.env.DBPASS
});
