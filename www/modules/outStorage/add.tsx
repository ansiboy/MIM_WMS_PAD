import { MasterDetailPage, MasterDetailState } from "pages";
import { storage, Service } from "service";
import { Utility } from "utilty";
import React = require("react");
import { FormValidator, rules as r } from "dilu";
import { resolve } from "path";
import { app } from "app";
import OutStorageAddDetailPage, { OutStorageAddDetailData } from "modules/outStorage/addDetail";
import ProductInputPage, { ProductInputData } from "../common/productInput";

enum EOutType {
    /** 零件出库 */
    Sell = 2
}

interface OutStorageAddState extends MasterDetailState<OutStorageEntity, OutStoDetailEntity> {
    storages?: StorageEntity[],
    locatios?: LocationEntity[],
}

export default class OutStorageAddPage extends MasterDetailPage<OutStorageAddState, OutStorageEntity, OutStoDetailEntity> {
    private validator: FormValidator;
    constructor(props) {
        super(props)
        this.title = '备件领用';
        let service = this.createService(Service);
        service.storageList().then(storages => {
            let { master } = this.state;
            if (storages != null && storages.length > 0) {
                master.StorageNum = storages[0].SnNum;
            }
            this.setState({ storages, master });
        })
        service.locationZhanChang().then(locatios => {
            this.setState({ locatios });
        })
    }
    defaultMaster(): OutStorageEntity {
        return {
            OutType: EOutType.Sell,
            CreateTime: Utility.today(),
            CreateUser: storage.user.UserNum,
            CreateUserName: storage.user.UserName,
            SendDate: Utility.today(),
        } as OutStorageEntity
    }
    componentDidMount() {
        let sendDateElement = this.element.querySelector('[name="SendDate"]') as HTMLElement;
        console.assert(sendDateElement != null);
        Utility.date(sendDateElement);

        this.validator = new FormValidator(this.element,
            { name: 'OutType', rules: [r.required('请选择出库单类型')] },
            { name: 'StorageNum', rules: [r.required('请选择仓库')] },
            { name: 'SendDate', rules: [r.required('请输入领用日期')] },
            { name: 'LocalNum', rules: [r.required('请选择站场')] }
        )
    }
    renderMaster(master: OutStorageEntity): JSX.Element {
        let { storages, locatios } = this.state;
        storages = storages || [];
        locatios = locatios || [];
        return <form className="master">
            <div className="form-group clearfix">
                <label>出库单编号</label>
                <input name="OrderNum" className="form-control" readOnly={true} />
            </div>
            <div className="form-group clearfix">
                <label>出库单类型</label>
                <select name="OutType" className="form-control" value={master.OutType || ''}
                    onChange={(e) => {
                        master.OutType = e.target.value ? Number.parseInt(e.target.value) : null;
                        this.setState({ master });
                    }}>
                    <option value="">请选择</option>
                    <option value="2">零件出库</option>
                </select>
            </div>
            <div className="form-group clearfix">
                <label>仓库</label>
                <select name="StorageNum" className="form-control" value={master.StorageNum || ''}
                    onChange={(e) => {
                        master.StorageNum = e.target.value;
                        this.setState({ master });
                    }}>
                    <option value="">请选择</option>
                    {storages.map(o =>
                        <option key={o.ID} value={o.SnNum}>{o.StorageName}</option>
                    )}
                </select>
            </div>
            <div className="form-group clearfix">
                <label>制单人</label>
                <input name="CreateUserName" className="form-control" value={master.CreateUserName || ''}
                    onChange={e => {
                        master.CreateUserName = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>联系人</label>
                <input name="CusName" className="form-control" value={master.CusName || ''}
                    onChange={e => {
                        master.CusName = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>联系方式</label>
                <input name="Phone" className="form-control" value={master.Phone || ''}
                    onChange={e => {
                        master.Phone = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>邮箱</label>
                <input name="Email" className="form-control" value={master.Email || ''}
                    onChange={e => {
                        master.Email = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>自定义单号</label>
                <input name="CusOrderNum" className="form-control" value={master.CusOrderNum || ''}
                    onChange={e => {
                        master.CusOrderNum = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>领用日期</label>
                <input name="SendDate" className="form-control" value={master.SendDate || ''}
                    onChange={e => {
                        master.SendDate = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>站场</label>
                <select name="LocalNum" className="form-control" value={master.LocalNum || ''}
                    onChange={e => {
                        master.LocalNum = e.target.value;
                        this.setState({ master });
                    }} >
                    <option value="">请选择</option>
                    {locatios.map(o =>
                        <option key={o.ID} value={o.LocalNum}>{o.LocalName}</option>
                    )}
                </select>
            </div>
            <div className="form-group clearfix">
                <label>备注</label>
                <textarea name="Remark" className="form-control" value={master.Remark}
                    onChange={(e) => {
                        master.Remark = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
        </form>
    }
    renderDetail(detail: OutStoDetailEntity): JSX.Element {
        return <>
            <div className="pull-right">{detail.LocalName}</div>
            <div>{detail.ProductName} X {detail.Num}</div>
        </>
    }
    async save(master: OutStorageEntity, details: OutStoDetailEntity[]): Promise<any> {
        if (!this.validator.check())
            return Promise.reject('validate fail');

        if (details == null || details.length == 0) {
            let message = '请添加要出库的物资';
            ui.alert({ title: '错误', message })
            return Promise.reject(message);
        }

        let service = this.createService(Service);
        await service.outStorageCreate(master, details);
        master = this.defaultMaster();
        details = [];
        this.setState({ master, details });
    }
    createDetail(): Promise<OutStoDetailEntity> {
        return new Promise<OutStoDetailEntity>((resolve, reject) => {
            let name: keyof OutStorageEntity = 'StorageNum';
            if (!this.validator.checkElement(name)) {
                return reject('validate fail.');
            }
            let data: OutStorageAddDetailData = {
                loadProductMethod: 'localProductList',
                storageNum: this.state.master.StorageNum,
                confirm: (item) => {
                    console.assert(item != null);
                    resolve(item);
                }
            }
            // app.redirect('outStorage_addDetail', data);
            OutStorageAddDetailPage.show(data);

            // let data: ProductInputData = {
            //     method: 'localProductList',
            //     storageNum: this.state.master.StorageNum,
            //     confirm: (product, local, num) => {

            //     }

            // }
            // ProductInputPage.show(data);
        })
    }


}