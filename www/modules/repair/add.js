var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "pages", "react", "modules/move/add", "utilty", "service", "dilu", "../common/productInput"], function (require, exports, pages_1, React, add_1, utilty_1, service_1, dilu_1, productInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RepairAddPage extends pages_1.MasterDetailPage {
        constructor(props) {
            super(props);
            this.title = '物资返修';
            let service = this.createService(service_1.Service);
            service.storageList().then(storages => {
                let { master } = this.state;
                if (storages != null && storages.length > 0) {
                    master.StorageNum = storages[0].SnNum;
                }
                this.setState({ storages, master });
            });
        }
        defaultMaster() {
            return {
                MoveType: add_1.EMoveType.RackToRack,
                CreateUserName: service_1.storage.user.UserName,
                CreateUser: service_1.storage.user.UserNum,
                CreateTime: utilty_1.Utility.today(),
            };
        }
        componentDidMount() {
            utilty_1.Utility.date(this.createTimeElement);
            this.validator = new dilu_1.FormValidator(this.element, { name: 'OutType', rules: [dilu_1.rules.required('请选择出库单类型')] }, { name: 'StorageNum', rules: [dilu_1.rules.required('请选择仓库')] }, { name: 'CreateTime', rules: [dilu_1.rules.required('制单日期')] }, { name: 'StorageNum', rules: [dilu_1.rules.required('请选择仓库')] });
        }
        renderMaster(master) {
            let { storages } = this.state;
            storages = storages || [];
            return React.createElement("div", { className: "master" },
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u8FD4\u4FEE\u5355\u53F7"),
                    React.createElement("input", { name: "OrderNum", className: "form-control", readOnly: true })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u8FD4\u4FEE\u7C7B\u578B"),
                    React.createElement("select", { name: "MoveType", className: "form-control", value: master.MoveType || '', disabled: true },
                        React.createElement("option", { value: add_1.EMoveType.RackToRack }, "\u7AD9\u573A\u8C03\u62E8"))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5173\u8054\u5355\u53F7"),
                    React.createElement("input", { name: "ContractOrder", className: "form-control", value: master.ContractOrder, onChange: e => {
                            master.ContractOrder = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5236\u5355\u65E5\u671F"),
                    React.createElement("input", { name: "CreateTime", className: "form-control", value: master.CreateTime || '', ref: e => this.createTimeElement = e || this.createTimeElement, onChange: e => {
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
                            master.StorageNum = e.target.value;
                            this.setState({ master });
                        } },
                        React.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9"),
                        storages.map(o => React.createElement("option", { key: o.ID, value: o.SnNum }, o.StorageName)))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5907\u6CE8"),
                    React.createElement("textarea", { name: "Remark", className: "form-control", value: master.Reamrk || '', onChange: e => {
                            master.Reamrk = e.target.value;
                            this.setState({ master });
                        } })));
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
                let service = this.createService(service_1.Service);
                yield service.moveCreate(master, details);
                master = this.defaultMaster();
                master.StorageNum = this.state.master.StorageNum;
                this.setState({ master, details: [] });
            });
        }
        createDetail() {
            return new Promise((resolve, reject) => {
                if (!this.validator.checkElement('StorageNum')) {
                    return reject('validate fail.');
                }
                // let data: MoveAddDetailData = {
                //     storageNum: this.state.master.StorageNum,
                //     listLocal: `2`,
                //     productLocal: `6`,
                //     confirm: (item) => {
                //         console.assert(item != null);
                //         resolve(item);
                //     }
                // }
                let data = {
                    method: 'localProductList',
                    storageNum: this.state.master.StorageNum,
                    listLocal: `2`,
                    productLocal: `${service_1.ELocalType.Work}`,
                    localLabel: '移入库位',
                    numberLabel: '移入数量',
                    confirm: (item, local, num) => {
                        let detail = {
                            ProductName: item.ProductName,
                            ProductNum: item.ProductNum,
                            BarCode: item.BarCode,
                            ToLocalName: local.LocalName,
                            ToLocalNum: local.LocalNum,
                            StorageName: item.StorageName,
                            StorageNum: item.StorageNum,
                            BatchNum: item.BatchNum,
                            Size: item.Size,
                            Num: num,
                            RealNum: num,
                            SnNum: utilty_1.Utility.newGuid(),
                        };
                        let { details } = this.state;
                        details.unshift(detail);
                        this.setState({ details });
                    }
                };
                // app.redirect('move_addDetail', data);
                //MoveAddDetailPage.show(data);
                productInput_1.default.show(data);
            });
        }
    }
    exports.default = RepairAddPage;
});
