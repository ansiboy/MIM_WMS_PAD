var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "pages", "utilty", "service", "react", "dilu", "../common/productInput"], function (require, exports, pages_1, utilty_1, service_1, React, dilu_1, productInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EBadType;
    (function (EBadType) {
        EBadType[EBadType["Bad"] = 1] = "Bad";
        EBadType[EBadType["Loss"] = 2] = "Loss";
    })(EBadType || (EBadType = {}));
    let EBadTypeText = {};
    EBadTypeText[EBadType.Bad] = '损坏报损';
    EBadTypeText[EBadType.Loss] = '丢失报损';
    class BadAddPage extends pages_1.MasterDetailPage {
        constructor(props) {
            super(props);
            this.title = '物资报废';
            let service = this.createService(service_1.Service);
            service.storageList().then(storages => {
                let { master } = this.state;
                if (storages != null && storages.length > 0) {
                    master.StorageNum = storages[0].SnNum;
                    master.StorageName = storages[0].StorageName;
                }
                this.setState({ storages, master });
            });
        }
        defaultMaster() {
            return {
                CreateTime: utilty_1.Utility.today(),
                CreateUserName: service_1.storage.user.UserName,
                CreateUser: service_1.storage.user.UserNum,
            };
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.element, { name: 'StorageNum', rules: [dilu_1.rules.required('请选择仓库')] });
        }
        renderMaster(master) {
            let { storages } = this.state;
            storages = storages || [];
            return React.createElement("div", { className: "master" },
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u62A5\u635F\u5355\u53F7"),
                    React.createElement("input", { name: "OrderNum", className: "form-control", value: master.OrderNum || '', readOnly: true })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u62A5\u635F\u7C7B\u578B"),
                    React.createElement("select", { name: "BadType", className: "form-control", value: master.BadType || '', onChange: e => {
                            master.BadType = e.target.value;
                            this.setState({ master });
                        } },
                        React.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9"),
                        React.createElement("option", { value: EBadType.Bad }, EBadTypeText[EBadType.Bad]),
                        React.createElement("option", { value: EBadType.Loss }, EBadTypeText[EBadType.Loss]))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5236\u5355\u65E5\u671F"),
                    React.createElement("input", { name: "CreateTime", className: "form-control", value: master.CreateTime || '', onChange: e => {
                            master.CreateTime = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5236\u5355\u4EBA"),
                    React.createElement("input", { name: "CreateUserName", className: "form-control", value: master.CreateUserName || '', onChange: e => {
                            master.CreateUserName = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u4ED3\u5E93"),
                    React.createElement("select", { name: "StorageNum", className: "form-control", value: master.StorageNum || '', onChange: e => {
                            let storage = storages.filter(o => o.SnNum == e.target.value)[0];
                            master.StorageNum = storage ? storage.SnNum : '';
                            master.StorageName = storage ? storage.StorageName : '';
                            this.setState({ master });
                        } },
                        React.createElement("option", { value: '' }, "\u8BF7\u9009\u62E9"),
                        storages.map(o => React.createElement("option", { key: o.ID, value: o.SnNum }, o.StorageName)))));
        }
        renderDetail(detail) {
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "pull-right" }, detail.ToLocalName),
                React.createElement("div", null,
                    detail.ProductName,
                    " X ",
                    detail.Num));
        }
        save(master, details) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.validator.check())
                    return Promise.reject('validate fail');
                let service = this.createService(service_1.Service);
                yield service.badCreate(master, details);
                let { StorageNum, StorageName } = master;
                master = this.defaultMaster();
                master.StorageNum = StorageNum;
                master.StorageName = StorageName;
                details = [];
                this.setState({ master, details });
            });
        }
        createDetail() {
            return new Promise((resolve, reject) => {
                if (!this.validator.checkElement('StorageNum')) {
                    return reject('validate fail.');
                }
                let data = {
                    method: 'localProductBadAbleList',
                    storageNum: this.state.master.StorageNum,
                    numberLabel: '出库数量',
                    confirm: (product, local, num) => {
                        console.assert(product != null);
                        console.assert(num != null);
                        let detail = {
                            BarCode: product.BarCode,
                            BatchNum: product.BatchNum,
                            Num: num,
                            RealNum: num,
                            ProductName: product.ProductName,
                            ProductNum: product.ProductNum,
                            SnNum: utilty_1.Utility.newGuid(),
                            ToLocalName: product.LocalName,
                            Size: product.Size,
                        };
                        resolve(detail);
                    }
                };
                productInput_1.default.show(data);
            });
        }
    }
    exports.default = BadAddPage;
});
