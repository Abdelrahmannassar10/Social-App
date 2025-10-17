"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const console_1 = require("console");
const app_controller_1 = require("./app.controller");
const dotenv_1 = require("dotenv");
const socket_io_1 = require("./socket-io");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = 3000;
(0, app_controller_1.bootstrap)(app, express_1.default);
const server = app.listen(PORT, () => {
    (0, console_1.log)(`Server is running on http://localhost:${PORT}`);
});
(0, socket_io_1.initSocket)(server);
