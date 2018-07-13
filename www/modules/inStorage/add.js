var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "react", "app", "service", "dilu", "utilty"], function (require, exports, React, app_1, service_1, dilu_1, utilty_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let now = new Date(Date.now());
    let today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    class InStorageAddPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = {
                storages: [], froms: [], details: [],
                entity: this.defaultEntity(),
            };
            this.service = this.createService(service_1.Service);
            this.service.storageList().then(storages => {
                let { entity } = this.state;
                if (storages.length > 0) {
                    entity.StorageNum = storages[0].SnNum;
                }
                this.setState({ storages, entity });
            });
            // this.service.fromList().then(froms => {
            //     this.setState({ froms });
            // })
        }
        defaultEntity() {
            let entity = {
                InType: 2,
                CreateUserName: service_1.storage.user.UserName,
                OrderTime: today,
                CreateUser: service_1.storage.user.UserNum,
                EstimateTime: today,
                ReceiveTime: today,
                FromSource: '',
                Remark: 'maishu-test',
            };
            return entity;
        }
        showSuppliers() {
            let data = {
                selectSupplier: (supplier) => {
                    console.assert(supplier != null);
                    let { entity } = this.state;
                    entity.SupNum = supplier.SupNum;
                    entity.SupName = supplier.SupName;
                    entity.SupSnNum = supplier.SnNum;
                    entity.ContactName = supplier.ContactName;
                    entity.Phone = supplier.Phone;
                    entity.Address = supplier.Address;
                    this.setState({ entity });
                }
            };
            app_1.app.redirect('supplier_list', data);
        }
        addProduct() {
            if (!this.validator.checkElement('StorageNum')) {
                return;
            }
            let entity = this.state.entity;
            let data = {
                StorageNum: entity.StorageNum,
                onConfirm: (detail) => {
                    let { details } = this.state;
                    details.unshift(detail);
                    this.setState({ details });
                }
            };
            app_1.app.redirect('inStorage_addProduct', data);
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.validator.check()) {
                    return Promise.reject('validate fail');
                }
                let { entity, details } = this.state;
                if (details == null || details.length == 0) {
                    ui.alert({ title: '错误', message: '请添加要入库的物资' });
                    return;
                }
                let service = this.createService(service_1.Service);
                yield service.inStorageCreate(entity, details);
                entity = this.defaultEntity();
                this.setState({ entity, details: [] });
            });
        }
        removeDetail(detail) {
            let { details } = this.state;
            details = details.filter(o => o != detail);
            this.setState({ details });
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.element, { name: 'StorageNum', rules: [dilu_1.rules.required('请选择仓库')] }, { name: 'SupName', rules: [dilu_1.rules.required('请选择供应商')] });
        }
        render() {
            let { storages, froms, entity, details } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, "\u65B0\u589E\u5165\u5E93\u5355")),
                React.createElement("section", { className: "container" },
                    React.createElement("form", { className: "master" },
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u5165\u5E93\u5355\u7F16\u53F7"),
                            React.createElement("input", { name: "OrderNum", className: "form-control", value: entity.OrderNum || '', readOnly: true, placeholder: "\u53EF\u4E0D\u586B,\u81EA\u52A8\u751F\u6210" })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u5165\u5E93\u5355\u7C7B\u578B"),
                            React.createElement("select", { name: "InType", className: "form-control", value: entity.InType != null ? entity.InType : '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    let value = e.target.value;
                                    if (value)
                                        entity.InType = Number.parseInt(value);
                                    else
                                        entity.InType = null;
                                    this.setState({ entity });
                                } },
                                React.createElement("option", null, "\u8BF7\u9009\u62E9\u5165\u5E93\u5355\u7C7B\u578B"),
                                React.createElement("option", { value: 2 }, "\u7269\u8D44\u5165\u5E93"),
                                React.createElement("option", { value: 7 }, "\u62A5\u635F\u5165\u5E93"),
                                React.createElement("option", { value: 8 }, "\u8FD4\u4FEE\u5165\u5E93"))),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u4ED3\u5E93"),
                            React.createElement("select", { name: "StorageNum", className: "form-control", value: entity.StorageNum || '', onChange: (e) => {
                                    entity.StorageNum = e.target.value;
                                    this.setState({ entity });
                                } },
                                React.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9\u4ED3\u5E93"),
                                storages.map(o => React.createElement("option", { key: o.StorageNum, value: o.SnNum }, o.StorageName)))),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u5236\u5355\u4EBA"),
                            React.createElement("input", { className: "form-control", value: entity.CreateUserName, onChange: e => {
                                    entity.CreateUserName = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("hr", null),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u4F9B\u5E94\u5546\u7F16\u53F7"),
                            React.createElement("input", { name: "SupNum", className: "form-control", placeholder: "\u70B9\u51FB\u9009\u62E9\u4F9B\u5E94\u5546", readOnly: true, value: entity.SupNum || '', onClick: () => this.showSuppliers() })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u4F9B\u5E94\u5546\u540D\u79F0"),
                            React.createElement("input", { name: "SupName", className: "form-control", value: entity.SupName || '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.SupName = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u8054\u7CFB\u4EBA"),
                            React.createElement("input", { className: "form-control", value: entity.ContactName || '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.ContactName = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u8054\u7CFB\u65B9\u5F0F"),
                            React.createElement("input", { className: "form-control", value: entity.Phone || '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.Phone = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u5730\u5740"),
                            React.createElement("input", { className: "form-control", value: entity.Address || '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.Address = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("hr", null),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u5236\u5355\u65F6\u95F4"),
                            React.createElement("input", { className: "form-control", value: entity.OrderTime || '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.OrderTime = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u9884\u5230\u65F6\u95F4"),
                            React.createElement("input", { className: "form-control", value: entity.EstimateTime || '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.OrderTime = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u6536\u8D27\u65F6\u95F4"),
                            React.createElement("input", { className: "form-control", value: entity.OrderTime || '', onChange: (e) => {
                                    if (!e)
                                        return;
                                    entity.OrderTime = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("hr", null),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u9879\u76EE\u540D\u79F0"),
                            React.createElement("input", { className: "form-control", value: entity.ProjectName, onChange: (e) => {
                                    entity.ProjectName = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u7269\u8D44\u6765\u6E90"),
                            React.createElement("input", { name: "FromSource", className: "form-control", value: entity.FromSource || '', onChange: e => {
                                    entity.FromSource = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("div", { className: "form-group clearfix" },
                            React.createElement("label", null, "\u5907\u6CE8"),
                            React.createElement("textarea", { name: "Remark", className: "form-control", style: { height: 60 }, value: entity.Remark, onChange: (e) => {
                                    entity.Remark = e.target.value;
                                    this.setState({ entity });
                                } })),
                        React.createElement("hr", null),
                        React.createElement("h4", null, "\u7269\u8D44\u660E\u7EC6"),
                        details.length == 0 ?
                            React.createElement("div", { className: "empty" }, "\u6682\u65E0\u7269\u8D44\u660E\u7EC6\uFF0C\u70B9\u51FB\u201C\u65B0\u589E\u7269\u8D44\u201D\u6309\u94AE\u6DFB\u52A0") :
                            React.createElement("ul", { className: "list-group" }, details.map(o => React.createElement("li", { key: o.ID, className: "list-group-item" },
                                React.createElement("div", { className: "pull-right", onClick: utilty_1.Utility.elementOnClick(() => this.removeDetail(o), {
                                        confirm: () => `确定删除'${o.ProductName}'吗`
                                    }) },
                                    React.createElement("i", { className: "icon-remove" })),
                                React.createElement("div", null,
                                    React.createElement("b", null, o.ProductName),
                                    " ",
                                    o.Num,
                                    " * ",
                                    o.InPrice,
                                    " = ",
                                    o.Amount),
                                React.createElement("div", null,
                                    o.StorageName,
                                    " ",
                                    o.LocalName)))))),
                React.createElement("footer", null,
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-xs-6", style: { padding: 0 } },
                            React.createElement("button", { type: "button", className: "btn btn-primary btn-block", onClick: () => this.addProduct() },
                                React.createElement("i", { className: "icon-plus" }),
                                React.createElement("span", null, "\u65B0\u589E\u7269\u8D44"))),
                        React.createElement("div", { className: "col-xs-6", style: { padding: 0 } },
                            React.createElement("button", { type: "button", className: "btn btn-primary btn-block", onClick: utilty_1.Utility.elementOnClick(() => this.save(), { toast: '保存成功' }) },
                                React.createElement("i", { className: "icon-save" }),
                                React.createElement("span", null, "\u4FDD\u5B58"))))));
        }
    }
    exports.default = InStorageAddPage;
});
