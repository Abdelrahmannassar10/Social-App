"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const token_model_1 = require("./token.model");
class TokenRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(token_model_1.Token);
    }
}
exports.TokenRepository = TokenRepository;
