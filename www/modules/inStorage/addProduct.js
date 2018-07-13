var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "app", "react", "dilu", "service", "utilty"], function (require, exports, app_1, React, dilu_1, service_1, utilty_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let now = new Date(Date.now());
    const INPUT_DEFAULT_WIDTH = '(100% - 90px)';
    class InStorageAddProductPage extends app_1.InputPage {
        constructor(props) {
            super(props);
            this.state = { entity: this.defaultEntity() };
        }
        get data() {
            return super.data;
        }
        defaultEntity() {
            return {
                Num: 1, InPrice: 0,
                BatchNum: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
            };
        }
        confirm() {
            this.validator.clearErrors();
            if (!this.validator.check())
                return;
            let data = this.data;
            console.assert(data != null && data.onConfirm != null);
            data.onConfirm(this.state.entity);
            debugger;
            app_1.app.back();
        }
        showProductList() {
            let data = {
                selecteProduct: (product) => {
                    console.assert(product != null);
                    this.setProduct(product);
                }
            };
            app_1.app.redirect('product_list', data);
        }
        showLocationList() {
            let data = {
                StorageNum: this.data.StorageNum,
                ListLocalType: '2,3,5',
                selectLocation: (o) => {
                    let { entity } = this.state;
                    entity.LocalName = o.LocalName;
                    entity.StorageName = o.StorageName;
                    entity.LocalNum = o.LocalNum;
                    this.setState({ entity });
                }
            };
            app_1.app.redirect('location_list', data);
        }
        loadProduct(barCode) {
            return __awaiter(this, void 0, void 0, function* () {
                let service = this.createService(service_1.Service);
                let product = yield service.productScan(barCode); // || DEFAULT_PRODUCT
                this.setProduct(product);
            });
        }
        setProduct(product) {
            product.Num = 1;
            product.Qty = 1;
            let inPrice = product.InPrice.toString();
            let { entity } = this.state;
            Object.assign(entity, product);
            entity.ProductNum = product.SnNum;
            entity.Amount = entity.Num * entity.InPrice;
            this.setState({ entity, inPrice });
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.element, { name: 'LocalName', rules: [dilu_1.rules.required('请选择库位')] }, { name: 'BarCode', rules: [dilu_1.rules.required('请输入条码')], errorElement: this.barCodeError }, { name: 'BatchNum', rules: [dilu_1.rules.required('请输入批次')] }, {
                name: 'ProductName', rules: [dilu_1.rules.required('商品部存在')],
                depends: [() => this.validator.checkElement('BarCode')]
            });
            utilty_1.Utility.date(this.batchNumElement);
        }
        render() {
            let { entity, inPrice } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, "\u65B0\u589E\u7269\u8D44")),
                React.createElement("section", { className: "container" },
                    React.createElement("div", { className: "master" },
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u7269\u8D44\u6761\u7801"),
                            React.createElement("div", { className: "input-group" },
                                React.createElement("input", { name: "BarCode", className: "form-control", placeholder: "\u70B9\u51FB\u53F3\u4FA7\u6309\u94AE\u9009\u62E9\u7269\u8D44", value: entity.BarCode || '', onChange: (e) => {
                                        entity.BarCode = e.target.value;
                                        Object.assign(entity, {
                                            ProductName: '', Size: '', Expiry: null,
                                            InPrice: null, Qty: null
                                        });
                                        this.setState({ entity, inPrice: '' });
                                    }, onKeyDown: (e) => {
                                        const KEYCODE_ENTER = 13;
                                        if (e.keyCode == KEYCODE_ENTER) {
                                            this.loadProduct(e.target.value);
                                            utilty_1.Utility.hideKeyboard();
                                        }
                                    } }),
                                React.createElement("div", { className: "input-group-addon", onClick: () => this.showProductList() },
                                    React.createElement("i", { className: "icon-chevron-right" }))),
                            React.createElement("span", { className: "validationMessage", ref: (e) => this.barCodeError = e || this.barCodeError })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u7269\u8D44\u540D\u79F0"),
                            React.createElement("input", { name: "ProductName", className: "form-control", value: entity.ProductName || '', readOnly: true })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u89C4\u683C / \u68C0\u5B9A\u671F"),
                            React.createElement("input", { name: "Size", className: "form-control", placeholder: "\u89C4\u683C", style: { width: `calc(${INPUT_DEFAULT_WIDTH} / 2 - 10px)` }, value: entity.Size || '', readOnly: true }),
                            React.createElement("input", { name: "Expiry", className: "form-control pull-right", placeholder: "\u68C0\u5B9A\u671F", style: { width: `calc(${INPUT_DEFAULT_WIDTH} / 2 - 10px)` }, value: entity.Expiry || '', readOnly: true })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u6570\u91CF"),
                            React.createElement("input", { name: "Num", className: "form-control", value: entity.Num, onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.Num = Number.parseInt(e.target.value);
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u4EF7\u683C"),
                            React.createElement("input", { name: "Qty", className: "form-control", value: entity.Num || '', style: { width: 26, padding: 0, textAlign: 'center' }, onChange: (e) => {
                                    //check value
                                    entity.Num = Number.parseInt(e.target.value);
                                    entity.Amount = entity.Num * entity.InPrice;
                                    this.setState({ entity });
                                } }),
                            React.createElement("div", { className: "pull-left", style: { width: 15, textAlign: 'center', paddingTop: 6 } }, "*"),
                            React.createElement("input", { name: "InPrice", className: "form-control", value: inPrice || '', style: { width: `calc((${INPUT_DEFAULT_WIDTH} - 50px) / 2 - 16px)`, padding: 0, textAlign: 'right' }, onChange: (e) => {
                                    inPrice = e.target.value;
                                    entity.InPrice = Number.parseFloat(inPrice);
                                    this.setState({ inPrice, entity });
                                } }),
                            React.createElement("div", { className: "pull-left", style: { width: 15, textAlign: 'center', paddingTop: 6 } }, "="),
                            React.createElement("input", { className: "form-control pull-right", style: { width: `calc((${INPUT_DEFAULT_WIDTH} - 30px) / 2 - 10px)`, padding: 0, textAlign: 'right' }, value: entity.Num * entity.InPrice || '', readOnly: true })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u7269\u8D44\u6279\u6B21"),
                            React.createElement("input", { name: "BatchNum", className: "form-control", value: entity.BatchNum, ref: (e) => this.batchNumElement = e || this.batchNumElement, onChange: (e) => {
                                    entity.BatchNum = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u5165\u5E93\u5E93\u4F4D"),
                            React.createElement("input", { name: "LocalName", className: "form-control", readOnly: true, placeholder: "\u70B9\u51FB\u9009\u62E9\u5E93\u4F4D", value: entity.LocalName || '', onClick: () => this.showLocationList() })))),
                React.createElement("footer", null,
                    React.createElement("div", { className: "form-group clearfix" },
                        React.createElement("button", { className: "btn btn-block btn-primary", onClick: () => this.confirm() },
                            React.createElement("i", { className: "icon-ok" }),
                            React.createElement("span", null, "\u786E\u5B9A")))));
        }
    }
    exports.default = InStorageAddProductPage;
});
