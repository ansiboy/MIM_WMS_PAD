var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "pages", "service", "utilty", "react", "dilu", "modules/outStorage/addDetail"], function (require, exports, pages_1, service_1, utilty_1, React, dilu_1, addDetail_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EOutType;
    (function (EOutType) {
        /** 零件出库 */
        EOutType[EOutType["Sell"] = 2] = "Sell";
    })(EOutType || (EOutType = {}));
    class OutStorageAddPage extends pages_1.MasterDetailPage {
        constructor(props) {
            super(props);
            this.title = '备件领用';
            let service = this.createService(service_1.Service);
            service.storageList().then(storages => {
                let { master } = this.state;
                if (storages != null && storages.length > 0) {
                    master.StorageNum = storages[0].SnNum;
                }
                this.setState({ storages, master });
            });
            service.locationZhanChang().then(locatios => {
                this.setState({ locatios });
            });
        }
        defaultMaster() {
            return {
                OutType: EOutType.Sell,
                CreateTime: utilty_1.Utility.today(),
                CreateUser: service_1.storage.user.UserNum,
                CreateUserName: service_1.storage.user.UserName,
                SendDate: utilty_1.Utility.today(),
            };
        }
        componentDidMount() {
            let sendDateElement = this.element.querySelector('[name="SendDate"]');
            console.assert(sendDateElement != null);
            utilty_1.Utility.date(sendDateElement);
            this.validator = new dilu_1.FormValidator(this.element, { name: 'OutType', rules: [dilu_1.rules.required('请选择出库单类型')] }, { name: 'StorageNum', rules: [dilu_1.rules.required('请选择仓库')] }, { name: 'SendDate', rules: [dilu_1.rules.required('请输入领用日期')] }, { name: 'LocalNum', rules: [dilu_1.rules.required('请选择站场')] });
        }
        renderMaster(master) {
            let { storages, locatios } = this.state;
            storages = storages || [];
            locatios = locatios || [];
            return React.createElement("form", { className: "master" },
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u51FA\u5E93\u5355\u7F16\u53F7"),
                    React.createElement("input", { name: "OrderNum", className: "form-control", readOnly: true })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u51FA\u5E93\u5355\u7C7B\u578B"),
                    React.createElement("select", { name: "OutType", className: "form-control", value: master.OutType || '', onChange: (e) => {
                            master.OutType = e.target.value ? Number.parseInt(e.target.value) : null;
                            this.setState({ master });
                        } },
                        React.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9"),
                        React.createElement("option", { value: "2" }, "\u96F6\u4EF6\u51FA\u5E93"))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u4ED3\u5E93"),
                    React.createElement("select", { name: "StorageNum", className: "form-control", value: master.StorageNum || '', onChange: (e) => {
                            master.StorageNum = e.target.value;
                            this.setState({ master });
                        } },
                        React.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9"),
                        storages.map(o => React.createElement("option", { key: o.ID, value: o.SnNum }, o.StorageName)))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5236\u5355\u4EBA"),
                    React.createElement("input", { name: "CreateUserName", className: "form-control", value: master.CreateUserName || '', onChange: e => {
                            master.CreateUserName = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u8054\u7CFB\u4EBA"),
                    React.createElement("input", { name: "CusName", className: "form-control", value: master.CusName || '', onChange: e => {
                            master.CusName = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u8054\u7CFB\u65B9\u5F0F"),
                    React.createElement("input", { name: "Phone", className: "form-control", value: master.Phone || '', onChange: e => {
                            master.Phone = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u90AE\u7BB1"),
                    React.createElement("input", { name: "Email", className: "form-control", value: master.Email || '', onChange: e => {
                            master.Email = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u81EA\u5B9A\u4E49\u5355\u53F7"),
                    React.createElement("input", { name: "CusOrderNum", className: "form-control", value: master.CusOrderNum || '', onChange: e => {
                            master.CusOrderNum = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u9886\u7528\u65E5\u671F"),
                    React.createElement("input", { name: "SendDate", className: "form-control", value: master.SendDate || '', onChange: e => {
                            master.SendDate = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u7AD9\u573A"),
                    React.createElement("select", { name: "LocalNum", className: "form-control", value: master.LocalNum || '', onChange: e => {
                            master.LocalNum = e.target.value;
                            this.setState({ master });
                        } },
                        React.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9"),
                        locatios.map(o => React.createElement("option", { key: o.ID, value: o.LocalNum }, o.LocalName)))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5907\u6CE8"),
                    React.createElement("textarea", { name: "Remark", className: "form-control", value: master.Remark, onChange: (e) => {
                            master.Remark = e.target.value;
                            this.setState({ master });
                        } })));
        }
        renderDetail(detail) {
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "pull-right" }, detail.LocalName),
                React.createElement("div", null,
                    detail.ProductName,
                    " X ",
                    detail.Num));
        }
        save(master, details) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.validator.check())
                    return Promise.reject('validate fail');
                if (details == null || details.length == 0) {
                    let message = '请添加要出库的物资';
                    ui.alert({ title: '错误', message });
                    return Promise.reject(message);
                }
                let service = this.createService(service_1.Service);
                yield service.outStorageCreate(master, details);
                master = this.defaultMaster();
                details = [];
                this.setState({ master, details });
            });
        }
        createDetail() {
            return new Promise((resolve, reject) => {
                let name = 'StorageNum';
                if (!this.validator.checkElement(name)) {
                    return reject('validate fail.');
                }
                let data = {
                    loadProductMethod: 'localProductList',
                    storageNum: this.state.master.StorageNum,
                    confirm: (item) => {
                        console.assert(item != null);
                        resolve(item);
                    }
                };
                // app.redirect('outStorage_addDetail', data);
                addDetail_1.default.show(data);
                // let data: ProductInputData = {
                //     method: 'localProductList',
                //     storageNum: this.state.master.StorageNum,
                //     confirm: (product, local, num) => {
                //     }
                // }
                // ProductInputPage.show(data);
            });
        }
    }
    exports.default = OutStorageAddPage;
});
