import { Page, app } from "app";
import React = require("react");
import { ListSelectorData } from "pages";
import { LocalSelectorData } from "modules/common/localSelector";
import { FormValidator, rules as r } from "dilu";
import { StockListData } from "../stock/list";
import { Utility } from "utilty";
import LocalProductSelectorPage, { LocalProductSelectorData } from "modules/common/localProductSelector";

export interface MoveAddDetailState {
    entity: MoveOrderDetailEntity,
    localProduct?: LocalProductEntity
}

export interface MoveAddDetailData {
    storageNum: string,
    listLocal?: string,
    productLocal?: string,
    confirm(item: MoveOrderDetailEntity);
}

export default class MoveAddDetailPage extends Page<MoveAddDetailState> {
    title: string;
    validator: FormValidator;
    constructor(props) {
        super(props);

        this.state = { entity: this.defaultMaster() }
        this.title = '添加物资';
    }
    confirm() {
        if (!this.validator.check())
            return;

        let data = this.data as MoveAddDetailData;
        console.assert(data);
        if (data.confirm) {
            data.confirm(this.state.entity);
        }
        app.back();
    }
    showProductSelecter() {
        let data: LocalProductSelectorData = {
            method: 'localProductList',
            storageNum: (this.data as MoveAddDetailData).storageNum,
            listProduct: (this.data as MoveAddDetailData).productLocal,
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
        // app.redirect('stock_list', data);
        LocalProductSelectorPage.show(data);
    }
    showLocalSelector() {//'1'
        let data: LocalSelectorData = {
            StoreNum: this.state.entity.StorageNum,
            ListLocal: (this.data as MoveAddDetailData).listLocal,
            selectItem: (item) => {
                let { entity } = this.state;
                entity.ToLocalName = item.LocalName;
                entity.ToLocalNum = item.LocalNum;
            }
        };
        app.redirect('common_localSelector', data);
    }
    static show(data: MoveAddDetailData) {
        app.redirect('move_addDetail', data);
    }
    defaultMaster(): MoveOrderDetailEntity {
        return {
            SnNum: Utility.newGuid()
        } as MoveOrderDetailEntity;
    }
    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'ToLocalName', rules: [r.required('请选择库位')] },
            {
                name: 'Num', rules: [
                    r.required('请输入移入数量'),
                    r.lessThan(() => this.state.localProduct.Num + 1,
                        () => `数量不能大于${this.state.localProduct.Num}`),
                    r.greaterThan(() => 0, '')
                ]
            }
        );

    }
    renderMaster(master: MoveOrderDetailEntity): JSX.Element {
        let { localProduct } = this.state;
        return <>
            <div className="form-group clearfix">
                <label>物资条码</label>
                <div className="input-group">
                    <input name="BarCode" className="form-control" placeholder="点击右侧按钮选择物资"
                        value={master.BarCode || ''}
                        onChange={(e) => {
                            master.BarCode = (e.target as HTMLInputElement).value;
                            Object.assign(master, {
                                ProductName: '', Size: '', Expiry: null,
                                InPrice: null, Qty: null
                            } as ProductEntity)

                            this.setState({ entity: master });
                        }}
                        onKeyDown={(e) => {
                            const KEYCODE_ENTER = 13;
                            if (e.keyCode == KEYCODE_ENTER) {
                                // this.loadProduct((e.target as HTMLInputElement).value);
                            }
                        }} />
                    <div className="input-group-addon"
                        onClick={() => this.showProductSelecter()}>
                        <i className="icon-chevron-right" />
                    </div>
                </div>
            </div>
            <hr />
            {localProduct == null ?
                <div className="empty">
                    请扫描或输入条码
                </div> :
                <>
                    <div className="form-group clearfix">
                        <label>物资名称</label>
                        <div>{master.ProductName}</div>
                    </div>
                    <div className="form-group clearfix">
                        <label>原库位</label>
                        <div>
                            {`${localProduct.StorageName || ''} ${localProduct.LocalName || ''}`}
                        </div>
                    </div>
                    <div className="form-group clearfix">
                        <label>可移数量</label>
                        <div>{localProduct.Num}</div>
                    </div>
                    <div className="form-group clearfix">
                        <label>移入库位</label>
                        <input name="ToLocalName" className="form-control" value={master.ToLocalName || ''}
                            placeholder={'点击选择库位'} onClick={() => this.showLocalSelector()}
                            onChange={(e) => { }} />
                    </div>
                    <div className="form-group clearfix">
                        <label>移入数量</label>
                        <input name="Num" className="form-control" type="number"
                            value={master.Num || ''}
                            onChange={(e) => {
                                master.RealNum = master.Num = Number.parseInt(e.target.value);
                                this.setState({ entity: master });
                            }} />
                    </div>
                </>
            }
        </>
    }
    render() {
        let { entity, localProduct } = this.state;
        return <>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">
                    {this.title}
                </div>
            </header>
            <section className="container">
                <form className="master">
                    {this.renderMaster(entity)}
                </form>
            </section>
            {localProduct ?
                <footer>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block"
                            onClick={() => this.confirm()}>
                            确定
                        </button>
                    </div>
                </footer> : null
            }
        </>
    }

}