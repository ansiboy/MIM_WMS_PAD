var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "dilu", "service", "app", "react", "utilty"], function (require, exports, dilu_1, service_1, app_1, React, utilty_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoginPage extends app_1.Page {
        login() {
            return __awaiter(this, void 0, void 0, function* () {
                this.validator.clearErrors();
                let isValid = this.validator.check();
                if (!isValid)
                    return;
                let service = this.createService(service_1.Service);
                let username = this.formElement["username"].value;
                let password = this.formElement["password"].value;
                yield service.login(username, password);
                app_1.app.redirect('index');
            });
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.element, { name: 'username', rules: [dilu_1.rules.required('请输入用户名')] }, { name: 'password', rules: [dilu_1.rules.required('请输入密码')] });
            this.formElement["username"].value = 'administrator';
        }
        render() {
            return React.createElement("section", { className: "container" },
                React.createElement("form", { ref: (e) => this.formElement = e || this.formElement },
                    React.createElement("h3", { className: "text-center" }, "\u7269\u8D44\u4FE1\u606F\u5316\u7BA1\u7406\u7CFB\u7EDF"),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("input", { name: "username", className: "form-control", placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D" })),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("input", { name: "password", type: "password", className: "form-control", placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801" })),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("button", { type: "button", className: "btn btn-primary btn-block", onClick: utilty_1.Utility.elementOnClick(() => this.login()) }, "\u767B\u5F55"))));
        }
    }
    exports.default = LoginPage;
});
