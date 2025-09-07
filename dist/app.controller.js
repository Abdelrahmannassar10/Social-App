"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const connection_1 = __importDefault(require("./DB/connection"));
function bootstrap(app, express) {
    (0, connection_1.default)();
    app.use(express.json());
    app.use("/auth", auth_controller_1.default);
    app.use("/{*dummy}", (req, res) => {
        res.status(404).json({ message: "Route Not Found", success: false });
    });
}
