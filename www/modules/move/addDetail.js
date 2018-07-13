define(["require", "exports", "app", "react", "dilu", "utilty", "modules/common/localProductSelector"], function (require, exports, app_1, React, dilu_1, utilty_1, localProductSelector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MoveAddDetailPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = { entity: this.defaultMaster() };
            this.title = '添加物资';
        }
        confirm() {
            if (!this.validator.check())
                return;
            let data = this.data;
            console.assert(data);
            if (data.confirm) {
                data.confirm(this.state.entity);
            }
            app_1.app.back();
        }
        showProductSelecter() {
            let data = {
                method: 'localProductList',
                storageNum: this.data.storageNum,
                listProduct: this.data.productLocal,
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
            // app.redirect('stock_list', data);
            localProductSelector_1.default.show(data);
        }
        showLocalSelector() {
            let data = {
                StoreNum: this.state.entity.StorageNum,
                ListLocal: this.data.listLocal,
                selectItem: (item) => {
                    let { entity } = this.state;
                    entity.ToLocalName = item.LocalName;
                    entity.ToLocalNum = item.LocalNum;
                }
            };
            app_1.app.redirect('common_localSelector', data);
        }
        static show(data) {
            app_1.app.redirect('move_addDetail', data);
        }
        defaultMaster() {
            return {
                SnNum: utilty_1.Utility.newGuid()
            };
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.element, { name: 'ToLocalName', rules: [dilu_1.rules.required('请选择库位')] }, {
                name: 'Num', rules: [
                    dilu_1.rules.required('请输入移入数量'),
                    dilu_1.rules.lessThan(() => this.state.localProduct.Num + 1, () => `数量不能大于${this.state.localProduct.Num}`),
                    dilu_1.rules.greaterThan(() => 0, '')
                ]
            });
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
                                this.setState({ entity: master });
                            }, onKeyDown: (e) => {
                                const KEYCODE_ENTER = 13;
                                if (e.keyCode == KEYCODE_ENTER) {
                                    // this.loadProduct((e.target as HTMLInputElement).value);
                                }
                            } }),
                        React.createElement("div", { className: "input-group-addon", onClick: () => this.showProductSelecter() },
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
                            React.createElement("input", { name: "ToLocalName", className: "form-control", value: master.ToLocalName || '', placeholder: '点击选择库位', onClick: () => this.showLocalSelector(), onChange: (e) => { } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u79FB\u5165\u6570\u91CF"),
                            React.createElement("input", { name: "Num", className: "form-control", type: "number", value: master.Num || '', onChange: (e) => {
                                    master.RealNum = master.Num = Number.parseInt(e.target.value);
                                    this.setState({ entity: master });
                                } }))));
        }
        render() {
            let { entity, localProduct } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, this.title)),
                React.createElement("section", { className: "container" },
                    React.createElement("form", { className: "master" }, this.renderMaster(entity))),
                localProduct ?
                    React.createElement("footer", null,
                        React.createElement("div", { className: "form-group" },
                            React.createElement("button", { className: "btn btn-primary btn-block", onClick: () => this.confirm() }, "\u786E\u5B9A"))) : null);
        }
    }
    exports.default = MoveAddDetailPage;
});
