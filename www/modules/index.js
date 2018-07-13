define(["require", "exports", "app", "react", "service"], function (require, exports, app_1, React, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    app_1.app.loadPageLess('index');
    class StartPage extends app_1.Page {
        logout() {
            let service = this.createService(service_1.Service);
            service.logout();
            app_1.app.redirect('user_login');
        }
        render() {
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-right" },
                        React.createElement("button", { className: "btn-link", onClick: () => this.logout() }, "\u9000\u51FA")),
                    React.createElement("div", { className: "title" }, "\u7269\u8D44\u4FE1\u606F\u5316\u7BA1\u7406\u7CFB\u7EDF")),
                React.createElement("section", null,
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-xs-4 text-center", onClick: () => {
                                app_1.app.redirect('inStorage_add');
                            } },
                            React.createElement("div", null,
                                React.createElement("i", { className: "icon-double-angle-right" })),
                            React.createElement("div", { className: "name" }, "\u5165\u5E93\u7BA1\u7406")),
                        React.createElement("div", { className: "col-xs-4 text-center", onClick: () => app_1.app.redirect('move_add') },
                            React.createElement("div", null,
                                React.createElement("i", { className: "icon-cloud-upload" })),
                            React.createElement("div", { className: "name" }, "\u9A8C\u6536\u4E0A\u67B6")),
                        React.createElement("div", { className: "col-xs-4 text-center" },
                            React.createElement("div", null,
                                React.createElement("i", { className: "icon-refresh" })),
                            React.createElement("div", { className: "name" }, "\u7269\u8D44\u7533\u9886"))),
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-xs-4 text-center" },
                            React.createElement("div", { onClick: () => app_1.app.redirect('outStorage_add') },
                                React.createElement("i", { className: "icon-random" })),
                            React.createElement("div", { className: "name" }, "\u5907\u4EF6\u9886\u7528 ")),
                        React.createElement("div", { className: "col-xs-4 text-center" },
                            React.createElement("div", { onClick: () => app_1.app.redirect('repair_add') },
                                React.createElement("i", { className: "icon-wrench" })),
                            React.createElement("div", { className: "name" }, "\u7269\u8D44\u8FD4\u4FEE")),
                        React.createElement("div", { className: "col-xs-4 text-center" },
                            React.createElement("div", { onClick: () => app_1.app.redirect('bad_add') },
                                React.createElement("i", { className: "icon-trash" })),
                            React.createElement("div", { className: "name" }, "\u7269\u8D44\u62A5\u5E9F")))));
        }
    }
    exports.default = StartPage;
});
