import { Page, app } from "app";
import React = require("react");
import { Utility } from "utilty";
import { storage, Service } from "service";
import { MasterDetailPage, MasterPage, MasterDetailState } from "pages";
import { resolve } from "path";
import { MoveAddProductState } from "modules/move/addProduct";
import MoveAddDetailPage, { MoveAddDetailData } from "./addDetail";
import { FormValidator, rules as r } from "dilu";


interface State extends MasterDetailState<MoveOrderEntity, MoveOrderDetailEntity> {
    // entity: MoveOrderEntity,
    // details: MoveOrderDetailEntity[],
    storages: StorageEntity[],
}
export enum EMoveType {
    /** 移库上架 */
    ToRack = 1,
    /** 站场调拨 */
    RackToRack = 2,
    /** 报修移库 */
    MoveToBad = 3
}

export default class MoveAddPage extends MasterDetailPage<State, MoveOrderEntity, MoveOrderDetailEntity>{
    private validator: FormValidator;
    private createTimeElement: HTMLElement;
    constructor(props) {
        super(props)
        this.title = '验收上架';
        let service = this.createService(Service);
        service.storageList().then(storages => {
            let { master } = this.state;
            if (storages != null && storages.length > 0) {
                master.StorageNum = storages[0].SnNum;
            }
            this.setState({ storages, master });
        })
    }
    defaultMaster(): MoveOrderEntity {
        return {
            MoveType: EMoveType.ToRack,
            CreateTime: Utility.today(),
            CreateUserName: storage.user.UserName,
            CreateUser: storage.user.UserNum,
        } as MoveOrderEntity;
    }
    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'StorageNum', rules: [r.required('请选择仓库')] }
        )
        Utility.date(this.createTimeElement);
    }
    renderMaster(master: MoveOrderEntity): JSX.Element {
        let storages: StorageEntity[] = (this.state as any).storages || []
        return <form className="master">
            <div className="form-group clearfix">
                <label>移库单号</label>
                <input className="form-control" readOnly />
            </div>
            <div className="form-group clearfix">
                <label>移库类型</label>
                <select className="form-control" value={master.MoveType} disabled >
                    <option value={1}>移库上架</option>
                    <option value={2}>站场调拨</option>
                    <option value={3}>报修移库</option>
                </select>
            </div>
            <div className="form-group clearfix">
                <label>关联订单号</label>
                <input name="ContractOrder" className="form-control" value={master.ContractOrder || ''}
                    onChange={(e) => {
                        master.ContractOrder = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>制单日期</label>
                <input className="form-control" value={master.CreateTime}
                    ref={(e) => this.createTimeElement = e || this.createTimeElement}
                    onChange={e => {
                        master.CreateTime = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
            <div className="form-group clearfix" >
                <label>仓库</label>
                <select name="StorageNum" className="form-control" value={master.StorageNum || ''}
                    onChange={(e) => {
                        master.StorageNum = e.target.value;
                        this.setState({ master });
                    }} >
                    <option value="">请选择仓库</option>
                    {storages.map(o =>
                        <option key={o.StorageNum} value={o.SnNum}>{o.StorageName}</option>
                    )}
                </select>
            </div>
            <div className="form-group clearfix">
                <label>备注</label>
                <input className="form-control" value={master.Reamrk || ''}
                    onChange={(e) => {
                        master.Reamrk = e.target.value;
                        this.setState({ master });
                    }} />
            </div>
        </form>
    }
    renderDetail(detail: MoveOrderDetailEntity): JSX.Element {
        return <>
            <div className="pull-right">{detail.ToLocalName}</div>
            <div>{detail.ProductName} X {detail.Num}</div>
        </>
    }
    async save(master: MoveOrderEntity, details: MoveOrderDetailEntity[]): Promise<any> {
        let service = this.createService(Service);
        await service.moveCreate(master, details);

        master = this.defaultMaster();
        master.StorageNum = this.state.master.StorageNum;
        this.setState({ master, details: [] })
    }
    createDetail(): Promise<MoveOrderDetailEntity> {
        return new Promise<MoveOrderDetailEntity>((resolve, reject) => {
            if (!this.validator.checkElement('StorageNum')) {
                return reject('validate fail.');
            }
            let data: MoveAddDetailData = {
                storageNum: this.state.master.StorageNum,
                listLocal: `1`,
                confirm: (item) => {
                    console.assert(item != null);
                    resolve(item);
                }
            }
            MoveAddDetailPage.show(data);
        })
    }
}