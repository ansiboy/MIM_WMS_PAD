import { MasterDetailPage, MasterDetailState } from "pages";
import React = require('react')
import { EMoveType } from "modules/move/add";
import { Utility } from "utilty";
import { storage, Service, ELocalType } from "service";
import { FormValidator, rules as r } from "dilu";
import MoveAddDetailPage, { MoveAddDetailData } from "modules/move/addDetail";
import ProductInputPage, { ProductInputData } from "../common/productInput";

interface RepairAddState extends MasterDetailState<MoveOrderEntity, MoveOrderDetailEntity> {
    storages?: StorageEntity[]
}
export default class RepairAddPage extends MasterDetailPage<RepairAddState, MoveOrderEntity, MoveOrderDetailEntity>{
    createTimeElement: HTMLElement;
    validator: FormValidator;
    constructor(props) {
        super(props)
        this.title = '物资返修'
        let service = this.createService(Service)
        service.storageList().then(storages => {
            let { master } = this.state
            if (storages != null && storages.length > 0) {
                master.StorageNum = storages[0].SnNum
            }
            this.setState({ storages, master })
        })
    }
    defaultMaster(): MoveOrderEntity {
        return {
            MoveType: EMoveType.RackToRack,
            CreateUserName: storage.user.UserName,
            CreateUser: storage.user.UserNum,
            CreateTime: Utility.today(),
        } as MoveOrderEntity;
    }
    componentDidMount() {
        Utility.date(this.createTimeElement)
        this.validator = new FormValidator(this.element,
            { name: 'OutType', rules: [r.required('请选择出库单类型')] },
            { name: 'StorageNum', rules: [r.required('请选择仓库')] },
            { name: 'CreateTime', rules: [r.required('制单日期')] },
            { name: 'StorageNum', rules: [r.required('请选择仓库')] }
        )
    }
    renderMaster(master: MoveOrderEntity): JSX.Element {
        let { storages } = this.state;
        storages = storages || [];
        return <div className="master">
            <div className="form-group clearfix">
                <label>返修单号</label>
                <input name="OrderNum" className="form-control" readOnly />
            </div>
            <div className="form-group clearfix">
                <label>返修类型</label>
                <select name="MoveType" className="form-control" value={master.MoveType || ''} disabled >
                    <option value={EMoveType.RackToRack}>站场调拨</option>
                </select>
            </div>
            <div className="form-group clearfix">
                <label>关联单号</label>
                <input name="ContractOrder" className="form-control" value={master.ContractOrder}
                    onChange={e => {
                        master.ContractOrder = e.target.value
                        this.setState({ master })
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>制单日期</label>
                <input name="CreateTime" className="form-control" value={master.CreateTime || ''}
                    ref={e => this.createTimeElement = e || this.createTimeElement}
                    onChange={e => {
                        master.CreateTime = e.target.value
                        this.setState({ master })
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>制单人</label>
                <input name="CreateUserName" className="form-control" value={master.CreateUserName || ''}
                    onChange={e => {
                        master.CreateUserName = e.target.value
                        this.setState({ master })
                    }} />
            </div>
            <div className="form-group clearfix">
                <label>仓库</label>
                <select name="StorageNum" className="form-control" value={master.StorageNum || ''}
                    onChange={e => {
                        master.StorageNum = e.target.value
                        this.setState({ master })
                    }} >
                    <option value="">请选择</option>
                    {storages.map(o =>
                        <option key={o.ID} value={o.SnNum}>{o.StorageName}</option>
                    )}
                </select>
            </div>
            <div className="form-group clearfix">
                <label>备注</label>
                <textarea name="Remark" className="form-control" value={master.Reamrk || ''}
                    onChange={e => {
                        master.Reamrk = e.target.value
                        this.setState({ master })
                    }} />
            </div>
        </div>
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
            // let data: MoveAddDetailData = {
            //     storageNum: this.state.master.StorageNum,
            //     listLocal: `2`,
            //     productLocal: `6`,
            //     confirm: (item) => {
            //         console.assert(item != null);
            //         resolve(item);
            //     }
            // }

            let data: ProductInputData = {
                method: 'localProductList',
                storageNum: this.state.master.StorageNum,
                listLocal: `2`,
                productLocal: `${ELocalType.Work}`,
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
                        SnNum: Utility.newGuid(),
                    } as MoveOrderDetailEntity
                    let { details } = this.state
                    details.unshift(detail)
                    this.setState({ details })
                }
            }
            // app.redirect('move_addDetail', data);
            //MoveAddDetailPage.show(data);
            ProductInputPage.show(data)
        })
    }


}