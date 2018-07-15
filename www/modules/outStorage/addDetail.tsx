import { Page, app } from "app";
import React = require('react');
import LocalProductSelectorPage, { LocalProductSelectorData, LoadProductMethod } from "modules/common/localProductSelector";
import { Service } from "service";
import { FormValidator, rules as r } from "dilu";
import { Utility } from "utilty";

interface OutStorageAddDetailState {
    entity: OutStoDetailEntity,
    localProduct?: LocalProductEntity,
}
export type OutStorageAddDetailData = {
    storageNum: string,
    loadProductMethod: LoadProductMethod,
    confirm(item: OutStoDetailEntity)
}
export default class OutStorageAddDetailPage extends Page<OutStorageAddDetailState>{
    validator: FormValidator;
    barCodeError: HTMLElement;
    constructor(props) {
        super(props)
        this.state = { entity: this.defaultEntity() }
    }
    confirm() {
        if (this.validator.check() == false)
            return;

        let data = this.data as OutStorageAddDetailData;
        if (data.confirm)
            data.confirm(this.state.entity);

        app.back();
    }
    defaultEntity() {
        return {

        } as OutStoDetailEntity
    }
    static show(data: OutStorageAddDetailData) {
        app.redirect('outStorage_addDetail', data)
    }
    showProductSelecter() {
        let data: LocalProductSelectorData = {
            method: (this.data as OutStorageAddDetailData).loadProductMethod,//'localProductOutAbleList',
            storageNum: (this.data as OutStorageAddDetailData).storageNum,
            confirm: (item) => {
                console.assert(item != null);
                let { entity } = this.state;
                let { ProductName, ProductNum, BarCode,
                    LocalName, LocalNum, StorageName, StorageNum,
                    BatchNum, Size,
                } = item;
                Object.assign(entity, {
                    ProductName, ProductNum, BarCode,
                    LocalName, LocalNum, StorageName, StorageNum,
                    BatchNum, Size,
                })
                this.setState({ entity, localProduct: item });
            },
        };
        LocalProductSelectorPage.show(data);
    }
    async loadProduct(barCode: string) {
        let data = this.data as OutStorageAddDetailData;
        let service = this.createService(Service);
        let items = await service.localProductOutAbleList({
            PageIndex: 0, StorageNumber: data.storageNum, BarCode: barCode
        });// .localProductOutAbleItem(data.storageNum, barCode);
        let localProduct = items[0];
        this.setState({ localProduct })
    }
    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'BarCode', rules: [r.required('请输入条码')], errorElement: this.barCodeError },
            { name: 'Num', rules: [r.required('请输入出库数量')] }
        )
    }
    render() {
        let { localProduct, entity } = this.state;
        return <>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">
                    选择库存物资
                </div>
            </header>
            <section className="container">
                <div className="master">
                    <div className="form-group clearfix">
                        <label>物资条码</label>
                        <div className="input-group">
                            <input name="BarCode" className="form-control" placeholder="点击右侧按钮选择物资"
                                value={entity.BarCode || ''}
                                onChange={(e) => {
                                    entity.BarCode = (e.target as HTMLInputElement).value;
                                    this.setState({ entity: entity });
                                }}
                                onKeyDown={(e) => {
                                    const KEYCODE_ENTER = 13;
                                    if (e.keyCode == KEYCODE_ENTER) {
                                        if (this.validator.checkElement('BarCode') == false)
                                            return;

                                        this.loadProduct((e.target as HTMLInputElement).value);
                                        Utility.hideKeyboard()
                                    }
                                    else {
                                        this.setState({ localProduct: null })
                                    }
                                }} />
                            <div className="input-group-addon"
                                onClick={() => this.showProductSelecter()}>
                                <i className="icon-chevron-right" />
                            </div>
                        </div>
                        <span ref={(e) => this.barCodeError = e || this.barCodeError} className="validationMessage"></span>
                    </div>
                    <hr />
                    {localProduct == null ?
                        <div className="empty">
                            请扫描或输入条码
                    </div> :
                        <>
                            <div className="form-group clearfix">
                                <label>物资</label>
                                <div>{localProduct.ProductName} X {localProduct.Num}{localProduct.UnitName}</div>
                            </div>
                            <div className="form-group clearfix">
                                <label>物资批次</label>
                                <div>{localProduct.BatchNum}</div>
                            </div>
                            <div className="form-group clearfix">
                                <label>仓库库位</label>
                                <div>{localProduct.StorageName} {localProduct.LocalName}</div>
                            </div>
                            <div className="form-group clearfix">
                                <label>出库数量</label>
                                <input name="Num" className="form-control" value={entity.Num || ''}
                                    onChange={e => {
                                        entity.Num = e.target.value ? Number.parseInt(e.target.value) : null
                                        entity.RealNum = entity.Num;
                                        this.setState({ entity })
                                    }} />
                            </div>
                        </>
                    }
                </div>
            </section>
            {localProduct ? <footer>
                <div className="form-group">
                    <button type="button" className="btn btn-primary btn-block"
                        onClick={() => this.confirm()}>
                        确定
                        </button>
                </div>
            </footer> : null}
        </>
    }
}