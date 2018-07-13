define(["require", "exports", "app", "react"], function (require, exports, app_1, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProductAddPage extends app_1.Page {
        render() {
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, "\u65B0\u589E\u7269\u8D44")),
                React.createElement("section", { className: "container" },
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("label", null, "\u7269\u8D44\u6761\u7801"),
                        React.createElement("input", { className: "form-control" })),
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("label", null, "\u7269\u8D44\u540D\u79F0"),
                        React.createElement("input", { className: "form-control" })),
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("label", null, "\u89C4\u683C / \u68C0\u5B9A\u671F"),
                        React.createElement("input", { className: "form-control" })),
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("label", null, "\u4EF7\u683C"),
                        React.createElement("input", { className: "form-control" })),
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("label", null, "\u7269\u8D44\u6279\u6B21"),
                        React.createElement("input", { className: "form-control" })),
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("label", null, "\u5165\u5E93\u5355\u4F4D"),
                        React.createElement("input", { className: "form-control" }))),
                React.createElement("footer", null,
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("button", { className: "btn btn-block btn-primary" },
                            React.createElement("i", { className: "icon-ok" }),
                            React.createElement("span", null, "\u786E\u5B9A")))));
        }
    }
    exports.default = ProductAddPage;
});
