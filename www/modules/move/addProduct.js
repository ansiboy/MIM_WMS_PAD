define(["require", "exports", "app", "react"], function (require, exports, app_1, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MoveAddProductPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = { master: this.defaultMaster() };
            this.title = '添加物资';
        }
        showSelecter() {
            let data = {
                selectItem: (item) => {
                    console.assert(item != null);
                    let { master } = this.state;
                    let { ProductName, ProductNum, Num, LocalName, LocalNum, StorageName, StorageNum, } = item;
                    Object.assign(master, {
                        ProductName, ProductNum, MaxNum: Num,
                        LocalName, LocalNum, StorageName, StorageNum,
                    });
                    this.setState({ master, localProduct: item });
                }
            };
            app_1.app.redirect('stock_list', data);
        }
        defaultMaster() {
            return {};
        }
        renderMaster(master) {
            let { localProduct } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u7269\u8D44\u6761\u7801"),
                    React.createElement("div", { className: "input-group" },
                        React.createElement("input", { name: "BarCode", className: "form-control", placeholder: "\u70B9\u51FB\u53F3\u4FA7\u6309\u94AE\u9009\u62E9\u7269\u8D44", value: master.BarCode || '', onChange: (e) => {
                                master.BarCode = e.target.value;
                                Object.assign(master, {
                                    ProductName: '', Size: '', Expiry: null,
                                    InPrice: null, Qty: null
                                });
                                this.setState({ master });
                            }, onKeyDown: (e) => {
                                const KEYCODE_ENTER = 13;
                                if (e.keyCode == KEYCODE_ENTER) {
                                    // this.loadProduct((e.target as HTMLInputElement).value);
                                }
                            } }),
                        React.createElement("div", { className: "input-group-addon", onClick: () => this.showSelecter() },
                            React.createElement("i", { className: "icon-chevron-right" })))),
                React.createElement("hr", null),
                localProduct == null ?
                    React.createElement("div", { className: "empty" }, "\u8BF7\u626B\u63CF\u6216\u8F93\u5165\u6761\u7801") :
                    React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u7269\u8D44\u540D\u79F0"),
                            React.createElement("div", null, master.ProductName)),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u539F\u5E93\u4F4D"),
                            React.createElement("div", null, `${localProduct.StorageName || ''} ${localProduct.LocalName || ''}`)),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u53EF\u79FB\u6570\u91CF"),
                            React.createElement("div", null, localProduct.Num)),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u79FB\u5165\u5E93\u4F4D"),
                            React.createElement("div", { className: "form-control" }, master.ToLocalName || '点击选择库位')),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u79FB\u5165\u6570\u91CF"),
                            React.createElement("input", { className: "form-control" }))));
        }
        render() {
            let { master, localProduct } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, this.title)),
                React.createElement("section", { className: "container" },
                    React.createElement("form", { className: "master" }, this.renderMaster(master))),
                localProduct ?
                    React.createElement("footer", null,
                        React.createElement("div", { className: "form-group" },
                            React.createElement("button", { className: "btn btn-primary btn-block" }, "\u786E\u5B9A"))) : null);
        }
    }
    exports.default = MoveAddProductPage;
});
