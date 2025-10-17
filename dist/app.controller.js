"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const module_1 = require("./module");
const DB_1 = require("./DB/");
const utils_1 = require("./utils");
function bootstrap(app, express) {
    (0, DB_1.connectDB)();
    app.use(express.json());
    app.use("/auth", module_1.authRouter);
    app.use("/user", module_1.userRouter);
    app.use("/post", module_1.postRouter);
    app.use("/comment", module_1.commentRouter);
    app.use("/{*dummy}", (req, res) => {
        res.status(404).json({ message: "Route Not Found", success: false });
    });
    app.use(utils_1.globalErrorHandler);
}
