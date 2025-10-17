"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
const token_schema_1 = require("./token.schema");
exports.Token = (0, mongoose_1.model)("Token", token_schema_1.tokenSchema);
