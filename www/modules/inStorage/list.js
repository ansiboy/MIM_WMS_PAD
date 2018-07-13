var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "service", "react", "app"], function (require, exports, service_1, React, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ListPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = { tabIndex: 0 };
            this.service = this.createService(service_1.Service);
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield this.service.inStorageList();
                this.setState({ items: result });
            });
        }
        activeTab(tabIndex) {
            let currentTabIndex = this.state.tabIndex;
            if (currentTabIndex == tabIndex)
                return;
            this.setState({ tabIndex, items: null });
            this.service.inStorageList(tabIndex).then(items => {
                this.setState({ items });
            });
        }
        render() {
            let { items, tabIndex } = this.state;
            const labelClassName = "col-xs-4";
            const valueClassName = "col-xs-8";
            let tabs = ['全部', '待审核', '审核通过', '审核失败'];
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "pull-right" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.redirect('inStorage_add') },
                            React.createElement("i", { className: "icon-plus" }))),
                    React.createElement("div", { className: "title" }, "\u5165\u5E93\u7BA1\u7406")),
                React.createElement("section", null,
                    React.createElement("ul", { className: "nav nav-tabs row" }, tabs.map((o, i) => React.createElement("li", { key: i, className: i == tabIndex ? 'active' : '', onClick: () => this.activeTab(i) },
                        React.createElement("a", { href: "javascrpt:" }, o)))),
                    items == null ? React.createElement("div", { className: "loading" },
                        React.createElement("i", { className: "icon-spinner icon-spin" }),
                        "\u6B63\u5728\u52A0\u8F7D\u4E2D...") :
                        items.length == 0 ? React.createElement("div", { className: "empty" }, "\u6682\u65E0\u8BB0\u5F55") :
                            items.map(o => React.createElement("ul", { key: o.OrderNum, style: { marginTop: 10 } },
                                React.createElement("li", null,
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u8BA2\u5355\u53F7"),
                                        React.createElement("div", { className: valueClassName }, o.OrderNum)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u7269\u8D44\u540D\u79F0"),
                                        React.createElement("div", { className: valueClassName }, o.ProductName)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u7269\u8D44\u7F16\u53F7"),
                                        React.createElement("div", { className: valueClassName }, o.BarCode)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u6279\u6B21"),
                                        React.createElement("div", { className: valueClassName }, o.BatchNum)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u89C4\u683C"),
                                        React.createElement("div", { className: valueClassName }, o.Size)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u6570\u91CF"),
                                        React.createElement("div", { className: valueClassName }, o.RealNum)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u4ED3\u5E93"),
                                        React.createElement("div", { className: valueClassName }, o.StorageName)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u5E93\u4F4D"),
                                        React.createElement("div", { className: valueClassName }, o.LocalName)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u9879\u76EE\u540D\u79F0"),
                                        React.createElement("div", { className: valueClassName }, o.ProjectName)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u7269\u8D44\u6765\u6E90"),
                                        React.createElement("div", { className: valueClassName }, o.FromSource)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u4F9B\u5E94\u5546"),
                                        React.createElement("div", { className: valueClassName }, o.SupName)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u5236\u5355\u4EBA"),
                                        React.createElement("div", { className: valueClassName }, o.CreateUserName)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u5236\u5355\u65F6\u95F4"),
                                        React.createElement("div", { className: valueClassName }, o.CreateTime)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u72B6\u6001"),
                                        React.createElement("div", { className: valueClassName }, o.Status)),
                                    React.createElement("div", { className: "row" },
                                        React.createElement("label", { className: labelClassName }, "\u5BA1\u6838\u4EBA"),
                                        React.createElement("div", { className: valueClassName }, o.AuditeUserName)),
                                    React.createElement("div", null,
                                        React.createElement("div", { className: "pull-right" }, "\u7F16\u8F91"))),
                                React.createElement("li", null,
                                    React.createElement("hr", null))))));
        }
    }
    exports.default = ListPage;
});
// ReactDOM.render(<ListPage />, page.element);
// }
