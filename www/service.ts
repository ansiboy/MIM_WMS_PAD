import { errors } from "dilu";

type AjaxResult<T> = {
    Code: number,
    Message: string,
    SubCode: number,
    SubMessage: string,
    Result: T
}
export let ajaxCodes = {
    Success: 1,
    NoPermission: 2,
    Exception: 3,
    NotLogin: 4,
}
let InStorageEntity = {
    All: 0,
    WaitingForAudit: 1,
    AuditPass: 2,
    AuditFail: 3
}
// export let ELocalType = {
//     1: '正式库区',
//     2: '待入库区',
//     3: '待修库区',
//     4: '待出库区',
//     5: '报损库区',
//     6: '站场区',
// }
export enum ELocalType {
    /** 正式库区 */
    Normal = 1,
    /** 待入库区 */
    WaitIn = 2,
    /** 待修库区 */
    WaitCheck = 3,
    /** 待出库区 */
    WaitOut = 4,
    /** 报损库区 */
    Bad = 5,
    /** 站场区 */
    Work = 6,
}
export let ELocalTypeText: { [key: number]: string } = {}
ELocalTypeText[ELocalType.Normal] = '正式库区'
ELocalTypeText[ELocalType.WaitIn] = '待入库区'
ELocalTypeText[ELocalType.WaitCheck] = '待修库区'
ELocalTypeText[ELocalType.WaitOut] = '待出库区'
ELocalTypeText[ELocalType.Bad] = '报损库区'
ELocalTypeText[ELocalType.Work] = '站场区'

export type LoadProductArguments = {
    PageIndex: number,
    StorageNumber: string,
    BarCode?: string,
    ListLocal?: number[],
}
const PAGE_SIZE = 20;
export class Service extends chitu.Service {
    url(path: string) {
        return `http://mimapi.gitwms.com/${path}`; //`http://localhost:8095/${path}`;//
    }
    async ajax<T>(path: string, data?: any) {
        let company = await this._ajax<any>('Api/Sys/Company/GetSingle', { CompanyNum: 'C00001' });
        data = data || {}
        data.CompanyID = company.CompanyID;
        return this._ajax<T>(path, data);
    }
    private async _ajax<T>(path: string, data?: any) {
        let url = this.url(path);
        let options: chitu.AjaxOptions = {
            data,
            method: 'post'
        }
        let text = await super.ajax<string | object>(url, options);
        let result: AjaxResult<T>;
        if (typeof text == 'object') {
            result = text as any;
        }
        else {
            if (!text.startsWith('{') || !text.endsWith('}')) {
                return Promise.reject(text);
            }
            result = JSON.parse(text);
        }

        if (result.Code != ajaxCodes.Success) {
            let err = new Error(result.Message);
            err.name = `${result.Code}`;
            this.error.fire(this, err)
            return Promise.reject(result.Message);
        }
        return Promise.resolve(result.Result)
    }
    async login(username: string, password: string) {
        let result = await this.ajax<AdminEntity>('Api/Sys/User/Login', { UserName: username, PassWord: password });
        storage.user = result;
        return result;
    }
    logout() {
        storage.user = null;
    }
    inStorageList(status?: number): Promise<InStorageEntity[]> {
        status = status == null ? 0 : status;
        let data = { status };
        return this.ajax<InStorageEntity[]>('Api/Order/InStorage/GetDetailList', data);
    }
    company(companyNum: string) {
        return this.ajax('Api/Sys/Company/GetSingle', { CompanyNum: companyNum });
    }
    /** 仓库列表 */
    storageList() {
        return this.ajax<StorageEntity[]>('Api/Sys/Storage/GetList');
    }
    /** 选择物资来源 */
    fromList() {
        return this.ajax<BaseDicEntity[]>('Api/Sys/From/GetList');
    }
    /** 供应商列表 */
    supplierList() {
        return this.ajax<SupplierEntity[]>('Api/Sys/Supplier/GetList');
    }
    /** 分页获取商品 */
    productPage(pageIndex: number) {
        let args = {
            PageIndex: pageIndex + 1,
            PageSize: PAGE_SIZE
        }
        return this.ajax<ProductEntity[]>('Api/Sys/Product/GetPage', args);
    }
    productScan(barCode: string): Promise<ProductEntity> {
        let args = { BarCode: barCode };
        return this.ajax<ProductEntity>('Api/Sys/Product/Scan', args);
    }
    localProductList(args: LoadProductArguments) {
        let data = JSON.parse(JSON.stringify(args));
        if (args.ListLocal != null) {
            data.ListLocal = JSON.stringify(args.ListLocal)
        }
        let api = 'Api/Storage/LocalProduct/GetList';
        return this.ajax<LocalProductEntity[]>(api, data);
    }
    localProductOutAbleList(args: LoadProductArguments) {
        let data = JSON.parse(JSON.stringify(args));
        if (args.ListLocal != null) {
            data.ListLocal = JSON.stringify(args.ListLocal)
        }

        let api = 'Api/Storage/LocalProduct/GetOutAbleList';
        return this.ajax<LocalProductEntity[]>(api, data);
    }
    async localProductBadAbleList(args: LoadProductArguments) {
        let data = JSON.parse(JSON.stringify(args));
        if (args.ListLocal != null) {
            data.ListLocal = JSON.stringify(args.ListLocal)
        }
        let api = 'Api/Storage/LocalProduct/GetBadAbleList'
        let items = await this.ajax<LocalProductEntity[]>(api, data)
        return items
    }
    localProductBadAbleItem(storageNum: string, barCode: string) {
        let data: any = {
            StorageNum: storageNum,
            BarCode: barCode,
        }
        let api = 'Api/Storage/LocalProduct/GetBadAbleList';
        return this.ajax<LocalProductEntity[]>(api, data);
    }
    GetBadAbleList
    /** 分页获取库位 */
    locationPage(storageNum: string, listLocalType: number[], pageIndex?: number) {
        if (!storageNum) throw errors.argumentNull('storageNum');

        pageIndex = pageIndex == null ? 0 : pageIndex;
        let args = {
            PageIndex: pageIndex + 1,
            PageSize: PAGE_SIZE,
            IsForbid: -1,
            IsDefault: -1,
            StorageNum: storageNum,
            StorageType: 0,
            ListLocalType: JSON.stringify(listLocalType)
        }
        return this.ajax<LocationEntity[]>('Api/Sys/Location/GetPage', args);
    }
    locationZhanChang() {
        let api = 'Api/Sys/Location/GetZhanChang';
        return this.ajax<LocationEntity[]>(api);
    }
    inStorageCreate(entity: InStorageEntity, details: InStorDetailEntity[]) {
        if (entity == null) throw errors.argumentNull('entity');
        if (details == null || details.length == 0) throw errors.argumentNull('details');

        details.forEach(o => {
            o.RealNum = o.Num;
        })
        let api = 'Api/Order/InStorage/Create';
        let data = {
            Entity: JSON.stringify(entity),
            List: JSON.stringify(details),
        }
        return this.ajax<null>(api, data)
    }
    outStorageCreate(entity: OutStorageEntity, details: OutStoDetailEntity[]) {
        let api = 'Api/Order/OutStorage/Create';
        let data = {
            Entity: JSON.stringify(entity),
            List: JSON.stringify(details),
        }
        return this.ajax<null>(api, data);
    }
    //========================================================
    // 移库操作
    moveCreate(master: MoveOrderEntity, details: MoveOrderDetailEntity[]) {
        let api = 'Api/Order/Move/Create';
        let data = {
            Entity: JSON.stringify(master),
            List: JSON.stringify(details),
        }
        return this.ajax<null>(api, data);
    }
    //========================================================
    badCreate(master: BadReportEntity, details: BadReportDetailEntity[]) {
        let api = 'Api/Order/Bad/Create'
        let data = {
            Entity: JSON.stringify(master),
            List: JSON.stringify(details),
        }
        return this.ajax<null>(api, data)
    }
}

export let storage = {
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
    get user(): AdminEntity {
        let userText = localStorage.getItem('user');
        if (userText == null)
            return null;

        return JSON.parse(userText);
    },
    set user(value: AdminEntity) {
        let userText = JSON.stringify(value);
        localStorage.setItem('user', userText);
    }
}