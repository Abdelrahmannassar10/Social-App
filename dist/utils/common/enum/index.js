"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_AGENT = exports.Gender = exports.SYS_ROLE = void 0;
var SYS_ROLE;
(function (SYS_ROLE) {
    SYS_ROLE["ADMIN"] = "admin";
    SYS_ROLE["USER"] = "user";
    SYS_ROLE["SUPER_ADMIN"] = "super-admin";
})(SYS_ROLE || (exports.SYS_ROLE = SYS_ROLE = {}));
;
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (exports.Gender = Gender = {}));
;
var USER_AGENT;
(function (USER_AGENT) {
    USER_AGENT["local"] = "local";
    USER_AGENT["google"] = "google";
})(USER_AGENT || (exports.USER_AGENT = USER_AGENT = {}));
