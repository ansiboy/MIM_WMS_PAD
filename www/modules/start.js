define(["require", "exports", "app", "react"], function (require, exports, app_1, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class StartPage extends React.Component {
        render() {
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-xs-4 text-center", onClick: () => {
                            app_1.app.goto('inStorage_list');
                        } },
                        React.createElement("div", null,
                            React.createElement("i", { className: "icon-double-angle-right" })),
                        React.createElement("div", { className: "name" }, "\u5165\u5E93\u7BA1\u7406")),
                    React.createElement("div", { className: "col-xs-4 text-center" },
                        React.createElement("div", null,
                            React.createElement("i", { className: "icon-cloud-upload" })),
                        React.createElement("div", { className: "name" }, "\u9A8C\u6536\u4E0A\u67B6")),
                    React.createElement("div", { className: "col-xs-4 text-center" },
                        React.createElement("div", null,
                            React.createElement("i", { className: "icon-refresh" })),
                        React.createElement("div", { className: "name" }, "\u7269\u8D44\u7533\u9886"))),
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-xs-4 text-center" },
                        React.createElement("div", null,
                            React.createElement("i", { className: "icon-random" })),
                        React.createElement("div", { className: "name" }, "\u5907\u4EF6\u9886\u7528")),
                    React.createElement("div", { className: "col-xs-4 text-center" },
                        React.createElement("div", null,
                            React.createElement("i", { className: "icon-wrench" })),
                        React.createElement("div", { className: "name" }, "\u7269\u8D44\u9000\u4FEE")),
                    React.createElement("div", { className: "col-xs-4 text-center" },
                        React.createElement("div", null,
                            React.createElement("i", { className: "icon-trash" })),
                        React.createElement("div", { className: "name" }, "\u7269\u8D44\u62A5\u5E9F"))));
        }
    }
    exports.default = StartPage;
});
