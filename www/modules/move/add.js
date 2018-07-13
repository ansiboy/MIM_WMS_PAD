var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "react", "utilty", "service", "pages", "./addDetail", "dilu"], function (require, exports, React, utilty_1, service_1, pages_1, addDetail_1, dilu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EMoveType;
    (function (EMoveType) {
        /** 移库上架 */
        EMoveType[EMoveType["ToRack"] = 1] = "ToRack";
        /** 站场调拨 */
        EMoveType[EMoveType["RackToRack"] = 2] = "RackToRack";
        /** 报修移库 */
        EMoveType[EMoveType["MoveToBad"] = 3] = "MoveToBad";
    })(EMoveType = exports.EMoveType || (exports.EMoveType = {}));
    class MoveAddPage extends pages_1.MasterDetailPage {
        constructor(props) {
            super(props);
            this.title = '验收上架';
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
                MoveType: EMoveType.ToRack,
                CreateTime: utilty_1.Utility.today(),
                CreateUserName: service_1.storage.user.UserName,
                CreateUser: service_1.storage.user.UserNum,
            };
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.element, { name: 'StorageNum', rules: [dilu_1.rules.required('请选择仓库')] });
            utilty_1.Utility.date(this.createTimeElement);
        }
        renderMaster(master) {
            let storages = this.state.storages || [];
            return React.createElement("form", { className: "master" },
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u79FB\u5E93\u5355\u53F7"),
                    React.createElement("input", { className: "form-control", readOnly: true })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u79FB\u5E93\u7C7B\u578B"),
                    React.createElement("select", { className: "form-control", value: master.MoveType, disabled: true },
                        React.createElement("option", { value: 1 }, "\u79FB\u5E93\u4E0A\u67B6"),
                        React.createElement("option", { value: 2 }, "\u7AD9\u573A\u8C03\u62E8"),
                        React.createElement("option", { value: 3 }, "\u62A5\u4FEE\u79FB\u5E93"))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5173\u8054\u8BA2\u5355\u53F7"),
                    React.createElement("input", { name: "ContractOrder", className: "form-control", value: master.ContractOrder || '', onChange: (e) => {
                            master.ContractOrder = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5236\u5355\u65E5\u671F"),
                    React.createElement("input", { className: "form-control", value: master.CreateTime, ref: (e) => this.createTimeElement = e || this.createTimeElement, onChange: e => {
                            master.CreateTime = e.target.value;
                            this.setState({ master });
                        } })),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u4ED3\u5E93"),
                    React.createElement("select", { name: "StorageNum", className: "form-control", value: master.StorageNum || '', onChange: (e) => {
                            master.StorageNum = e.target.value;
                            this.setState({ master });
                        } },
                        React.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9\u4ED3\u5E93"),
                        storages.map(o => React.createElement("option", { key: o.StorageNum, value: o.SnNum }, o.StorageName)))),
                React.createElement("div", { className: "form-group clearfix" },
                    React.createElement("label", null, "\u5907\u6CE8"),
                    React.createElement("input", { className: "form-control", value: master.Reamrk || '', onChange: (e) => {
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
                let data = {
                    storageNum: this.state.master.StorageNum,
                    listLocal: `1`,
                    confirm: (item) => {
                        console.assert(item != null);
                        resolve(item);
                    }
                };
                addDetail_1.default.show(data);
            });
        }
    }
    exports.default = MoveAddPage;
});
