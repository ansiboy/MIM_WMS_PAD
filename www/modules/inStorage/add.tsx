import * as React from 'react';
import { app, Page } from 'app';
import { Service, storage } from 'service';
import { FormValidator, rules as r } from 'dilu';
import { SupplierListPageData } from 'modules/supplier/list';
import { InStorageAddProductData } from './addProduct';
import { Utility } from 'utilty';
type AddPageState = {
    storages: StorageEntity[]
    froms: BaseDicEntity[],
    entity: InStorageEntity,
    details: InStorDetailEntity[],
}

let now = new Date(Date.now());
let today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

export default class InStorageAddPage extends Page<AddPageState>{
    service: Service;
    validator: FormValidator;

    constructor(props) {
        super(props);
        this.state = {
            storages: [], froms: [], details: [],
            entity: this.defaultEntity(),
        };
        this.service = this.createService(Service);
        this.service.storageList().then(storages => {
            let { entity } = this.state;
            if (storages.length > 0) {
                entity.StorageNum = storages[0].SnNum;
            }
            this.setState({ storages, entity });
        })
    }
    defaultEntity() {
        let entity = {
            InType: 2,
            CreateUserName: storage.user.UserName,
            OrderTime: today,
            CreateUser: storage.user.UserNum,
            EstimateTime: today,
            ReceiveTime: today,
            FromSource: '',
            Remark: 'maishu-test',
        } as InStorageEntity
        return entity;
    }
    showSuppliers() {
        let data: SupplierListPageData = {
            selectSupplier: (supplier: SupplierEntity) => {
                console.assert(supplier != null);
                let { entity } = this.state;
                entity.SupNum = supplier.SupNum;
                entity.SupName = supplier.SupName;
                entity.SupSnNum = supplier.SnNum;
                entity.ContactName = supplier.ContactName;
                entity.Phone = supplier.Phone;
                entity.Address = supplier.Address;
                this.setState({ entity });
            }
        }
        app.redirect('supplier_list', data);
    }
    addProduct() {
        if (!this.validator.checkElement('StorageNum')) {
            return;
        }
        let entity = this.state.entity;
        let data: InStorageAddProductData = {
            StorageNum: entity.StorageNum,
            onConfirm: (detail) => {
                let { details } = this.state;
                details.unshift(detail);
                this.setState({ details });
            }
        }
        app.redirect('inStorage_addProduct', data);
    }
    async save() {
        if (!this.validator.check()) {
            return Promise.reject('validate fail');
        }
        let { entity, details } = this.state;
        if (details == null || details.length == 0) {
            ui.alert({ title: '错误', message: '请添加要入库的物资' })
            return;
        }
        let service = this.createService(Service);
        await service.inStorageCreate(entity, details);
        entity = this.defaultEntity();
        this.setState({ entity, details: [] });
    }
    removeDetail(detail: InStorDetailEntity) {
        let { details } = this.state;
        details = details.filter(o => o != detail);
        this.setState({ details });
    }
    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'StorageNum', rules: [r.required('请选择仓库')] },
            { name: 'SupName', rules: [r.required('请选择供应商')] },
            // { name: 'FromSource', rules: [r.required('请选择物资来源')] }
        )
    }
    render() {
        let { storages, froms, entity, details } = this.state;
        return <React.Fragment>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">新增入库单</div>
            </header>
            <section className="container">
                <form className="master">
                    <div className="form-group clearfix">
                        <label>入库单编号</label>
                        <input name="OrderNum" className="form-control" value={entity.OrderNum || ''} readOnly={true}
                            placeholder="可不填,自动生成" />
                    </div>
                    <div className="form-group clearfix">
                        <label>入库单类型</label>
                        <select name="InType" className="form-control" value={entity.InType != null ? entity.InType : ''}
                            onChange={(e) => {
                                if (!e) return;
                                let value = (e.target as HTMLSelectElement).value;
                                if (value)
                                    entity.InType = Number.parseInt(value);
                                else
                                    entity.InType = null;

                                this.setState({ entity });
                            }}>
                            <option>请选择入库单类型</option>
                            <option value={2}>物资入库</option>
                            <option value={7}>报损入库</option>
                            <option value={8}>返修入库</option>
                        </select>
                    </div>
                    <div className="form-group clearfix" >
                        <label>仓库</label>
                        <select name="StorageNum" className="form-control" value={entity.StorageNum || ''}
                            onChange={(e) => {
                                entity.StorageNum = e.target.value;
                                this.setState({ entity });
                            }} >
                            <option value="">请选择仓库</option>
                            {storages.map(o =>
                                <option key={o.StorageNum} value={o.SnNum}>{o.StorageName}</option>
                            )}
                        </select>
                    </div>
                    <div className="form-group clearfix" >
                        <label>制单人</label>
                        <input className="form-control" value={entity.CreateUserName}
                            onChange={e => {
                                entity.CreateUserName = e.target.value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <hr />
                    <div className="form-group clearfix" >
                        <label>供应商编号</label>
                        <input name="SupNum" className="form-control" placeholder="点击选择供应商" readOnly={true}
                            value={entity.SupNum || ''}
                            onClick={() => this.showSuppliers()} />
                    </div>
                    <div className="form-group clearfix" >
                        <label>供应商名称</label>
                        <input name="SupName" className="form-control"
                            value={entity.SupName || ''}
                            onChange={(e) => {
                                if (!e) return;
                                entity.SupName = (e.target as HTMLInputElement).value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix" >
                        <label>联系人</label>
                        <input className="form-control" value={entity.ContactName || ''}
                            onChange={(e) => {
                                if (!e) return;
                                entity.ContactName = (e.target as HTMLInputElement).value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix" >
                        <label>联系方式</label>
                        <input className="form-control" value={entity.Phone || ''}
                            onChange={(e) => {
                                if (!e) return;
                                entity.Phone = (e.target as HTMLInputElement).value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix" >
                        <label>地址</label>
                        <input className="form-control" value={entity.Address || ''}
                            onChange={(e) => {
                                if (!e) return;
                                entity.Address = (e.target as HTMLInputElement).value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <hr />
                    <div className="form-group clearfix" >
                        <label>制单时间</label>
                        <input className="form-control" value={entity.OrderTime || ''}
                            onChange={(e) => {
                                if (!e) return;
                                entity.OrderTime = (e.target as HTMLInputElement).value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix" >
                        <label>预到时间</label>
                        <input className="form-control" value={entity.EstimateTime || ''}
                            onChange={(e) => {
                                if (!e) return;
                                entity.OrderTime = (e.target as HTMLInputElement).value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix" >
                        <label>收货时间</label>
                        <input className="form-control" value={entity.OrderTime || ''}
                            onChange={(e) => {
                                if (!e) return;
                                entity.OrderTime = (e.target as HTMLInputElement).value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <hr />
                    <div className="form-group clearfix" >
                        <label>项目名称</label>
                        <input className="form-control" value={entity.ProjectName}
                            onChange={(e) => {
                                entity.ProjectName = e.target.value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix" >
                        <label>物资来源</label>
                        {/* <select name="FromSource" className="form-control" value={entity.FromSource || ''}
                            onChange={e => {
                                entity.FromSource = e.target.value;
                                this.setState({ entity });
                            }} >
                            <option>请选择物资来源</option>
                            {froms.map(o =>
                                <option key={o.DicValue} value={o.DicValue}>{o.DicValue}</option>
                            )}
                        </select> */}
                        <input name="FromSource" className="form-control" value={entity.FromSource || ''}
                            onChange={e => {
                                entity.FromSource = e.target.value;
                                this.setState({ entity });
                            }}
                        />
                    </div>
                    <div className="form-group clearfix" >
                        <label>备注</label>
                        <textarea name="Remark" className="form-control" style={{ height: 60 }}
                            value={entity.Remark}
                            onChange={(e) => {
                                entity.Remark = e.target.value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <hr />
                    <h4>物资明细</h4>
                    {details.length == 0 ?
                        <div className="empty">
                            暂无物资明细，点击“新增物资”按钮添加
                        </div> :
                        <ul className="list-group">
                            {details.map(o =>
                                <li key={o.ID} className="list-group-item">
                                    <div className="pull-right"
                                        onClick={
                                            Utility.elementOnClick(
                                                () => this.removeDetail(o),
                                                {
                                                    confirm: () => `确定删除'${o.ProductName}'吗`
                                                }
                                            )
                                        }>
                                        <i className="icon-remove" />
                                    </div>
                                    <div>
                                        <b>{o.ProductName}</b> {o.Num} * {o.InPrice} = {o.Amount}
                                    </div>
                                    <div>
                                        {o.StorageName} {o.LocalName}
                                    </div>
                                </li>
                            )}
                        </ul>
                    }
                </form>
            </section>
            <footer>
                <div className="form-group">
                    <div className="col-xs-6" style={{ padding: 0 }}>
                        <button type="button" className="btn btn-primary btn-block"
                            onClick={() => this.addProduct()}>
                            <i className="icon-plus" />
                            <span>新增物资</span>
                        </button>
                    </div>
                    <div className="col-xs-6" style={{ padding: 0 }}>
                        <button type="button" className="btn btn-primary btn-block"
                            onClick={Utility.elementOnClick(() => this.save(), { toast: '保存成功' })}>
                            <i className="icon-save" />
                            <span>保存</span>
                        </button>
                    </div>
                </div>
            </footer>
        </React.Fragment >
    }
}

