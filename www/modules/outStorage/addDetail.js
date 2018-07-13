var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "app", "react", "modules/common/localProductSelector", "service", "dilu", "utilty"], function (require, exports, app_1, React, localProductSelector_1, service_1, dilu_1, utilty_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OutStorageAddDetailPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = { entity: this.defaultEntity() };
        }
        confirm() {
            if (this.validator.check() == false)
                return;
            let data = this.data;
            if (data.confirm)
                data.confirm(this.state.entity);
            app_1.app.back();
        }
        defaultEntity() {
            return {};
        }
        static show(data) {
            app_1.app.redirect('outStorage_addDetail', data);
        }
        showProductSelecter() {
            let data = {
                method: this.data.loadProductMethod,
                storageNum: this.data.storageNum,
                confirm: (item) => {
                    console.assert(item != null);
                    let { entity } = this.state;
                    let { ProductName, ProductNum, BarCode, LocalName, LocalNum, StorageName, StorageNum, BatchNum, Size, } = item;
                    Object.assign(entity, {
                        ProductName, ProductNum, BarCode,
                        LocalName, LocalNum, StorageName, StorageNum,
                        BatchNum, Size,
                    });
                    this.setState({ entity, localProduct: item });
                },
            };
            localProductSelector_1.default.show(data);
        }
        loadProduct(barCode) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = this.data;
                let service = this.createService(service_1.Service);
                let items = yield service.localProductOutAbleList({
                    PageIndex: 0, StorageNumber: data.storageNum, BarCode: barCode
                }); // .localProductOutAbleItem(data.storageNum, barCode);
                let localProduct = items[0];
                this.setState({ localProduct });
            });
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.element, { name: 'BarCode', rules: [dilu_1.rules.required('请输入条码')], errorElement: this.barCodeError }, { name: 'Num', rules: [dilu_1.rules.required('请输入出库数量')] });
        }
        render() {
            let { localProduct, entity } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, "\u9009\u62E9\u5E93\u5B58\u7269\u8D44")),
                React.createElement("section", { className: "container" },
                    React.createElement("div", { className: "master" },
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u7269\u8D44\u6761\u7801"),
                            React.createElement("div", { className: "input-group" },
                                React.createElement("input", { name: "BarCode", className: "form-control", placeholder: "\u70B9\u51FB\u53F3\u4FA7\u6309\u94AE\u9009\u62E9\u7269\u8D44", value: entity.BarCode || '', onChange: (e) => {
                                        entity.BarCode = e.target.value;
                                        this.setState({ entity: entity });
                                    }, onKeyDown: (e) => {
                                        const KEYCODE_ENTER = 13;
                                        if (e.keyCode == KEYCODE_ENTER) {
                                            if (this.validator.check() == false)
                                                return;
                                            this.loadProduct(e.target.value);
                                            utilty_1.Utility.hideKeyboard();
                                        }
                                        else {
                                            this.setState({ localProduct: null });
                                        }
                                    } }),
                                React.createElement("div", { className: "input-group-addon", onClick: () => this.showProductSelecter() },
                                    React.createElement("i", { className: "icon-chevron-right" }))),
                            React.createElement("span", { ref: (e) => this.barCodeError = e || this.barCodeError, className: "validationMessage" })),
                        React.createElement("hr", null),
                        localProduct == null ?
                            React.createElement("div", { className: "empty" }, "\u8BF7\u626B\u63CF\u6216\u8F93\u5165\u6761\u7801") :
                            React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "form-group clearfix" },
                                    React.createElement("label", null, "\u7269\u8D44"),
                                    React.createElement("div", null,
                                        localProduct.ProductName,
                                        " X ",
                                        localProduct.Num,
                                        localProduct.UnitName)),
                                React.createElement("div", { className: "form-group clearfix" },
                                    React.createElement("label", null, "\u7269\u8D44\u6279\u6B21"),
                                    React.createElement("div", null, localProduct.BatchNum)),
                                React.createElement("div", { className: "form-group clearfix" },
                                    React.createElement("label", null, "\u4ED3\u5E93\u5E93\u4F4D"),
                                    React.createElement("div", null,
                                        localProduct.StorageName,
                                        " ",
                                        localProduct.LocalName)),
                                React.createElement("div", { className: "form-group clearfix" },
                                    React.createElement("label", null, "\u51FA\u5E93\u6570\u91CF"),
                                    React.createElement("input", { name: "Num", className: "form-control", value: entity.Num || '', onChange: e => {
                                            entity.Num = e.target.value ? Number.parseInt(e.target.value) : null;
                                            entity.RealNum = entity.Num;
                                            this.setState({ entity });
                                        } }))))),
                localProduct ? React.createElement("footer", null,
                    React.createElement("div", { className: "form-group" },
                        React.createElement("button", { type: "button", className: "btn btn-primary btn-block", onClick: () => this.confirm() }, "\u786E\u5B9A"))) : null);
        }
    }
    exports.default = OutStorageAddDetailPage;
});
