import { MasterDetailPage, MasterDetailState } from "pages";
import { Utility } from "utilty";
import { storage, Service } from "service";
import React = require('react')
import { FormValidator, rules as r } from "dilu";
import MoveAddDetailPage, { MoveAddDetailData } from "modules/move/addDetail";
import OutStorageAddDetailPage, { OutStorageAddDetailData } from "modules/outStorage/addDetail";
import ProductInputPage, { ProductInputData } from "../common/productInput";

interface BadAddState extends MasterDetailState<BadReportEntity, BadReportDetailEntity> {
    storages?: StorageEntity[]
}

enum EBadType {
    Bad = 1,
    Loss = 2
}
let EBadTypeText: { [key: number]: string } = {}
EBadTypeText[EBadType.Bad] = '损坏报损'
EBadTypeText[EBadType.Loss] = '丢失报损'

export default class BadAddPage extends MasterDetailPage<BadAddState, BadReportEntity, BadReportDetailEntity> {
    validator: FormValidator;
    constructor(props) {
        super(props)
        this.title = '物资报废'
        let service = this.createService(Service)
        service.storageList().then(storages => {
            let { master } = this.state
            if (storages != null && storages.length > 0) {
                master.StorageNum = storages[0].SnNum
                master.StorageName = storages[0].StorageName
            }
            this.setState({ storages, master })
        })
    }
    defaultMaster(): BadReportEntity {
        return {
            CreateTime: Utility.today(),
            CreateUserName: storage.user.UserName,
            CreateUser: storage.user.UserNum,
        } as BadReportEntity
    }
    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'StorageNum', rules: [r.required('请选择仓库')] }
        )
    }
    renderMaster(master: BadReportEntity): JSX.Element {
        let { storages } = this.state
        storages = storages || []

        return <div className="master">
            <div className="form-group clearfix">
                <label>报损单号</label>
                <input name="OrderNum" className="form-control" value={master.OrderNum || ''} readOnly />
            </div>
            <div className="form-group clearfix">
                <label>报损类型</label>
                <select name="BadType" className="form-control" value={master.BadType || ''}
                    onChange={e => {
                        master.BadType = e.target.value
                        this.setState({ master })
                    }}>
                    <option value="">请选择</option>
                    <option value={EBadType.Bad}>{EBadTypeText[EBadType.Bad]}</option>
                    <option value={EBadType.Loss}>{EBadTypeText[EBadType.Loss]}</option>
                </select>
            </div>
            <div className="form-group clearfix">
                <label>制单日期</label>
                <input name="CreateTime" className="form-control" value={master.CreateTime || ''}
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
                        let storage = storages.filter(o => o.SnNum == e.target.value)[0]
                        master.StorageNum = storage ? storage.SnNum : ''
                        master.StorageName = storage ? storage.StorageName : ''
                        this.setState({ master })
                    }} >
                    <option value=''>请选择</option>
                    {storages.map(o =>
                        <option key={o.ID} value={o.SnNum}>{o.StorageName}</option>
                    )}
                </select>
            </div>
        </div>
    }
    renderDetail(detail: BadReportDetailEntity): JSX.Element {
        return <>
            <div className="pull-right">{detail.ToLocalName}</div>
            <div>{detail.ProductName} X {detail.Num}</div>
        </>
    }
    async save(master: BadReportEntity, details: BadReportDetailEntity[]): Promise<any> {
        if (!this.validator.check())
            return Promise.reject('validate fail')

        let service = this.createService(Service)
        await service.badCreate(master, details)
        let { StorageNum, StorageName } = master
        master = this.defaultMaster()
        master.StorageNum = StorageNum
        master.StorageName = StorageName
        details = []
        this.setState({ master, details })
    }
    createDetail(): Promise<BadReportDetailEntity> {
        return new Promise<BadReportDetailEntity>((resolve, reject) => {
            if (!this.validator.checkElement('StorageNum')) {
                return reject('validate fail.');
            }
            let data: ProductInputData = {
                method: 'localProductBadAbleList',
                storageNum: this.state.master.StorageNum,
                numberLabel: '出库数量',
                confirm: (product, local, num) => {
                    console.assert(product != null)
                    console.assert(num != null)
                    let detail = {
                        BarCode: product.BarCode,
                        BatchNum: product.BatchNum,
                        Num: num,
                        RealNum: num,
                        ProductName: product.ProductName,
                        ProductNum: product.ProductNum,
                        SnNum: Utility.newGuid(),
                        ToLocalName: product.LocalName,
                        Size: product.Size,
                    } as BadReportDetailEntity
                    resolve(detail)
                }
            }
            ProductInputPage.show(data)
        })
    }


}