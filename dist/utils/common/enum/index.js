"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REACTION = exports.USER_AGENT = exports.Gender = exports.SYS_ROLE = void 0;
var SYS_ROLE;
(function (SYS_ROLE) {
    SYS_ROLE[SYS_ROLE["ADMIN"] = 0] = "ADMIN";
    SYS_ROLE[SYS_ROLE["USER"] = 1] = "USER";
    SYS_ROLE[SYS_ROLE["SUPER_ADMIN"] = 2] = "SUPER_ADMIN";
})(SYS_ROLE || (exports.SYS_ROLE = SYS_ROLE = {}));
;
var Gender;
(function (Gender) {
    Gender[Gender["MALE"] = 0] = "MALE";
    Gender[Gender["FEMALE"] = 1] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
;
var USER_AGENT;
(function (USER_AGENT) {
    USER_AGENT[USER_AGENT["local"] = 0] = "local";
    USER_AGENT[USER_AGENT["google"] = 1] = "google";
})(USER_AGENT || (exports.USER_AGENT = USER_AGENT = {}));
var REACTION;
(function (REACTION) {
    REACTION[REACTION["like"] = 0] = "like";
    REACTION[REACTION["care"] = 1] = "care";
    REACTION[REACTION["angry"] = 2] = "angry";
    REACTION[REACTION["love"] = 3] = "love";
})(REACTION || (exports.REACTION = REACTION = {}));
