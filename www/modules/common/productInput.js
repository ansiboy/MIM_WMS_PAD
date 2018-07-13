var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "app", "react", "modules/common/localProductSelector", "dilu", "service", "utilty"], function (require, exports, app_1, React, localProductSelector_1, dilu_1, service_1, utilty_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProductInputPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.title = '添加物资';
            this.state = {};
        }
        get data() {
            return super.data;
        }
        static show(data) {
            app_1.app.redirect('common_productInput', data);
        }
        confirm() {
            if (!this.validator.check())
                return;
            let { local, localProduct, num } = this.state;
            console.assert(this.data);
            if (this.data.confirm) {
                this.data.confirm(localProduct, local, num);
            }
            app_1.app.back();
        }
        loadProduct(barCode) {
            return __awaiter(this, void 0, void 0, function* () {
                let service = this.createService(service_1.Service);
                let args = {
                    PageIndex: 0, StorageNumber: this.data.storageNum,
                    BarCode: barCode
                };
                let items = yield service[this.data.method](args);
                this.setState({ localProduct: items[0] });
            });
        }
        showLocalSelector() {
            let data = {
                StoreNum: this.data.storageNum,
                ListLocal: this.data.listLocal,
                selectItem: (item) => {
                    this.setState({ local: item });
                }
            };
            app_1.app.redirect('common_localSelector', data);
        }
        showProductSelecter() {
            let data = {
                method: this.data.method,
                storageNum: this.data.storageNum,
                listProduct: this.data.productLocal,
                confirm: (item) => {
                    this.setState({ localProduct: item, barCode: item.BarCode });
                },
            };
            localProductSelector_1.default.show(data);
        }
        componentDidMount() {
            let { numberLabel, localLabel } = this.data;
            this.validator = new dilu_1.FormValidator(this.element, {
                name: 'Num', rules: [
                    dilu_1.rules.required(() => `请输入${numberLabel}`),
                    dilu_1.rules.lessThan(() => this.state.localProduct.Num + 1, () => `${numberLabel}小于或等于${this.state.localProduct.Num}`),
                    dilu_1.rules.greaterThan(() => 0, `${numberLabel}必须大于 0`)
                ],
                condition: () => numberLabel != null
            }, {
                name: 'LocalName', rules: [dilu_1.rules.required(() => `请输入${localLabel}`)],
                condition: () => this.data.localLabel != null
            });
        }
        render() {
            let { barCode, localProduct, local, num } = this.state;
            let { localLabel, numberLabel } = this.data;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, this.title)),
                React.createElement("section", { className: "container" },
                    React.createElement("div", { className: "master" },
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u7269\u8D44\u6761\u7801"),
                            React.createElement("div", { className: "input-group" },
                                React.createElement("input", { name: "BarCode", className: "form-control", placeholder: "\u70B9\u51FB\u53F3\u4FA7\u6309\u94AE\u9009\u62E9\u7269\u8D44", value: barCode || '', onChange: (e) => {
                                        barCode = e.target.value;
                                        this.setState({ barCode });
                                    }, onKeyDown: (e) => {
                                        const KEYCODE_ENTER = 13;
                                        if (e.keyCode == KEYCODE_ENTER) {
                                            this.loadProduct(e.target.value);
                                            utilty_1.Utility.hideKeyboard();
                                        }
                                    } }),
                                React.createElement("div", { className: "input-group-addon", onClick: () => this.showProductSelecter() },
                                    React.createElement("i", { className: "icon-chevron-right" })))),
                        React.createElement("hr", null),
                        localProduct == null ?
                            React.createElement("div", { className: "empty" }, "\u8BF7\u626B\u63CF\u6216\u8F93\u5165\u6761\u7801 ") :
                            React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "form-group clearfix" },
                                    React.createElement("label", null, "\u7269\u8D44\u540D\u79F0"),
                                    React.createElement("div", null, localProduct.ProductName)),
                                React.createElement("div", { className: "form-group clearfix" },
                                    React.createElement("label", null, "\u539F\u5E93\u4F4D"),
                                    React.createElement("div", null, `${localProduct.StorageName || ''} ${localProduct.LocalName || ''}`)),
                                React.createElement("div", { className: "form-group clearfix" },
                                    React.createElement("label", null, "\u53EF\u79FB\u6570\u91CF"),
                                    React.createElement("div", null, localProduct.Num)),
                                localLabel ?
                                    React.createElement("div", { className: "form-group clearfix" },
                                        React.createElement("label", null, localLabel),
                                        React.createElement("input", { name: "LocalName", className: "form-control", value: local ? local.LocalName : '', placeholder: '点击选择库位', onClick: () => this.showLocalSelector(), onChange: (e) => { } })) : null,
                                numberLabel ?
                                    React.createElement("div", { className: "form-group clearfix" },
                                        React.createElement("label", null, numberLabel),
                                        React.createElement("input", { name: "Num", className: "form-control", value: num != null ? num : '', placeholder: '', onChange: (e) => {
                                                num = e.target.value ? Number.parseInt(e.target.value) : null;
                                                this.setState({ num });
                                            } })) : null))),
                localProduct ?
                    React.createElement("footer", null,
                        React.createElement("div", { className: "form-group" },
                            React.createElement("button", { className: "btn btn-primary btn-block", onClick: () => this.confirm() }, "\u786E\u5B9A"))) : null);
        }
    }
    exports.default = ProductInputPage;
});
