var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Services extends chitu.Service {
        url(path) {
            return `http://localhost:61803/${path}`;
        }
        ajax(url, options) {
            const _super = name => super[name];
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield _super("ajax").call(this, url, options);
                return result;
            });
        }
        login(username, password) {
            let url = this.url('UserAjax/Login');
            return this.ajax(url, { data: { UserName: username, PassWord: password } });
        }
    }
    exports.Services = Services;
});
