var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "dilu"], function (require, exports, dilu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ajaxCodes = {
        Success: 1,
        NoPermission: 2,
        Exception: 3,
        NotLogin: 4,
    };
    let InStorageEntity = {
        All: 0,
        WaitingForAudit: 1,
        AuditPass: 2,
        AuditFail: 3
    };
    // export let ELocalType = {
    //     1: '正式库区',
    //     2: '待入库区',
    //     3: '待修库区',
    //     4: '待出库区',
    //     5: '报损库区',
    //     6: '站场区',
    // }
    var ELocalType;
    (function (ELocalType) {
        /** 正式库区 */
        ELocalType[ELocalType["Normal"] = 1] = "Normal";
        /** 待入库区 */
        ELocalType[ELocalType["WaitIn"] = 2] = "WaitIn";
        /** 待修库区 */
        ELocalType[ELocalType["WaitCheck"] = 3] = "WaitCheck";
        /** 待出库区 */
        ELocalType[ELocalType["WaitOut"] = 4] = "WaitOut";
        /** 报损库区 */
        ELocalType[ELocalType["Bad"] = 5] = "Bad";
        /** 站场区 */
        ELocalType[ELocalType["Work"] = 6] = "Work";
    })(ELocalType = exports.ELocalType || (exports.ELocalType = {}));
    exports.ELocalTypeText = {};
    exports.ELocalTypeText[ELocalType.Normal] = '正式库区';
    exports.ELocalTypeText[ELocalType.WaitIn] = '待入库区';
    exports.ELocalTypeText[ELocalType.WaitCheck] = '待修库区';
    exports.ELocalTypeText[ELocalType.WaitOut] = '待出库区';
    exports.ELocalTypeText[ELocalType.Bad] = '报损库区';
    exports.ELocalTypeText[ELocalType.Work] = '站场区';
    const PAGE_SIZE = 20;
    class Service extends chitu.Service {
        url(path) {
            return `http://mimapi.gitwms.com/${path}`; //`http://localhost:8095/${path}`;//
        }
        ajax(path, data) {
            return __awaiter(this, void 0, void 0, function* () {
                let company = yield this._ajax('Api/Sys/Company/GetSingle', { CompanyNum: 'C00001' });
                data = data || {};
                data.CompanyID = company.CompanyID;
                return this._ajax(path, data);
            });
        }
        _ajax(path, data) {
            const _super = name => super[name];
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url(path);
                let options = {
                    data,
                    method: 'post'
                };
                let text = yield _super("ajax").call(this, url, options);
                let result;
                if (typeof text == 'object') {
                    result = text;
                }
                else {
                    if (!text.startsWith('{') || !text.endsWith('}')) {
                        return Promise.reject(text);
                    }
                    result = JSON.parse(text);
                }
                if (result.Code != exports.ajaxCodes.Success) {
                    let err = new Error(result.Message);
                    err.name = `${result.Code}`;
                    this.error.fire(this, err);
                    return Promise.reject(result.Message);
                }
                return Promise.resolve(result.Result);
            });
        }
        login(username, password) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield this.ajax('Api/Sys/User/Login', { UserName: username, PassWord: password });
                exports.storage.user = result;
                return result;
            });
        }
        logout() {
            exports.storage.user = null;
        }
        inStorageList(status) {
            status = status == null ? 0 : status;
            let data = { status };
            return this.ajax('Api/Order/InStorage/GetDetailList', data);
        }
        company(companyNum) {
            return this.ajax('Api/Sys/Company/GetSingle', { CompanyNum: companyNum });
        }
        /** 仓库列表 */
        storageList() {
            return this.ajax('Api/Sys/Storage/GetList');
        }
        /** 选择物资来源 */
        fromList() {
            return this.ajax('Api/Sys/From/GetList');
        }
        /** 供应商列表 */
        supplierList() {
            return this.ajax('Api/Sys/Supplier/GetList');
        }
        /** 分页获取商品 */
        productPage(pageIndex) {
            let args = {
                PageIndex: pageIndex + 1,
                PageSize: PAGE_SIZE
            };
            return this.ajax('Api/Sys/Product/GetPage', args);
        }
        productScan(barCode) {
            let args = { BarCode: barCode };
            return this.ajax('Api/Sys/Product/Scan', args);
        }
        localProductList(args) {
            let data = JSON.parse(JSON.stringify(args));
            if (args.ListLocal != null) {
                data.ListLocal = JSON.stringify(args.ListLocal);
            }
            let api = 'Api/Storage/LocalProduct/GetList';
            return this.ajax(api, data);
        }
        localProductOutAbleList(args) {
            let data = JSON.parse(JSON.stringify(args));
            if (args.ListLocal != null) {
                data.ListLocal = JSON.stringify(args.ListLocal);
            }
            let api = 'Api/Storage/LocalProduct/GetOutAbleList';
            return this.ajax(api, data);
        }
        localProductBadAbleList(args) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = JSON.parse(JSON.stringify(args));
                if (args.ListLocal != null) {
                    data.ListLocal = JSON.stringify(args.ListLocal);
                }
                let api = 'Api/Storage/LocalProduct/GetBadAbleList';
                let items = yield this.ajax(api, data);
                return items;
            });
        }
        localProductBadAbleItem(storageNum, barCode) {
            let data = {
                StorageNum: storageNum,
                BarCode: barCode,
            };
            let api = 'Api/Storage/LocalProduct/GetBadAbleList';
            return this.ajax(api, data);
        }
        /** 分页获取库位 */
        locationPage(storageNum, listLocalType, pageIndex) {
            if (!storageNum)
                throw dilu_1.errors.argumentNull('storageNum');
            pageIndex = pageIndex == null ? 0 : pageIndex;
            let args = {
                PageIndex: pageIndex + 1,
                PageSize: PAGE_SIZE,
                IsForbid: -1,
                IsDefault: -1,
                StorageNum: storageNum,
                StorageType: 0,
                ListLocalType: JSON.stringify(listLocalType)
            };
            return this.ajax('Api/Sys/Location/GetPage', args);
        }
        locationZhanChang() {
            let api = 'Api/Sys/Location/GetZhanChang';
            return this.ajax(api);
        }
        inStorageCreate(entity, details) {
            if (entity == null)
                throw dilu_1.errors.argumentNull('entity');
            if (details == null || details.length == 0)
                throw dilu_1.errors.argumentNull('details');
            details.forEach(o => {
                o.RealNum = o.Num;
            });
            let api = 'Api/Order/InStorage/Create';
            let data = {
                Entity: JSON.stringify(entity),
                List: JSON.stringify(details),
            };
            return this.ajax(api, data);
        }
        outStorageCreate(entity, details) {
            let api = 'Api/Order/OutStorage/Create';
            let data = {
                Entity: JSON.stringify(entity),
                List: JSON.stringify(details),
            };
            return this.ajax(api, data);
        }
        //========================================================
        // 移库操作
        moveCreate(master, details) {
            let api = 'Api/Order/Move/Create';
            let data = {
                Entity: JSON.stringify(master),
                List: JSON.stringify(details),
            };
            return this.ajax(api, data);
        }
        //========================================================
        badCreate(master, details) {
            let api = 'Api/Order/Bad/Create';
            let data = {
                Entity: JSON.stringify(master),
                List: JSON.stringify(details),
            };
            return this.ajax(api, data);
        }
    }
    exports.Service = Service;
    exports.storage = {
        // get username(): string {
        //     return localStorage.getItem('username');
        // },
        // set username(value: string) {
        //     if (value == null) {
        //         localStorage.removeItem('username');
        //         return;
        //     }
        //     localStorage.setItem('username', value);
        // },
        get user() {
            let userText = localStorage.getItem('user');
            if (userText == null)
                return null;
            return JSON.parse(userText);
        },
        set user(value) {
            let userText = JSON.stringify(value);
            localStorage.setItem('user', userText);
        }
    };
});
