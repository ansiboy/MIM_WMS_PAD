import { Page, app, InputPage } from "app";
import React = require("react");
import ProductListPage, { ProductListPageData } from "modules/product/list";
import { LocationListPageData } from "../location/list";
import { FormValidator, rules as r } from "dilu";
import { Service } from "service";
import { Utility } from "utilty";
import LocalProductSelectorPage, { LocalProductSelectorData } from "../common/localProductSelector";

type AddProductPageState = {
    entity: InStorDetailEntity,
    inPrice?: string,
    // qty: number,
}
export type InStorageAddProductData = {
    StorageNum: string,
    onConfirm: (entity: InStorDetailEntity) => void,
}

let now = new Date(Date.now());
const INPUT_DEFAULT_WIDTH = '(100% - 90px)';
export default class InStorageAddProductPage extends InputPage<AddProductPageState> {
    private validator: FormValidator;
    private barCodeError: HTMLElement;
    private batchNumElement: HTMLInputElement;
    constructor(props) {
        super(props);
        this.state = { entity: this.defaultEntity() };
    }
    get data(): InStorageAddProductData {
        return super.data as InStorageAddProductData;
    }
    defaultEntity() {
        return {
            Num: 1, InPrice: 0,
            BatchNum: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
        } as InStorDetailEntity;
    }
    confirm() {
        this.validator.clearErrors();
        if (!this.validator.check())
            return;

        let data = this.data;
        console.assert(data != null && data.onConfirm != null);
        data.onConfirm(this.state.entity);
        debugger;
        app.back();
    }
    showProductList() {
        let data: ProductListPageData = {
            selecteProduct: (product) => {
                console.assert(product != null);
                this.setProduct(product);
            }
        }
        app.redirect('product_list', data);
    }
    showLocationList() {
        let data: LocationListPageData = {
            StorageNum: (this.data as InStorageAddProductData).StorageNum,
            ListLocalType: '2,3,5',
            selectLocation: (o) => {
                let { entity } = this.state;
                entity.LocalName = o.LocalName;
                entity.StorageName = o.StorageName;
                entity.LocalNum = o.LocalNum;
                this.setState({ entity });
            }
        }
        app.redirect('location_list', data);
    }
    async loadProduct(barCode: string) {
        let service = this.createService(Service);
        let product = await service.productScan(barCode);// || DEFAULT_PRODUCT
        this.setProduct(product);
    }
    setProduct(product: ProductEntity) {
        product.Num = 1;
        product.Qty = 1;

        let inPrice = product.InPrice.toString();
        let { entity } = this.state;
        Object.assign(entity, product);
        entity.ProductNum = product.SnNum;
        entity.Amount = entity.Num * entity.InPrice;
        this.setState({ entity, inPrice });
    }
    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'LocalName', rules: [r.required('请选择库位')] },
            { name: 'BarCode', rules: [r.required('请输入条码')], errorElement: this.barCodeError },
            { name: 'BatchNum', rules: [r.required('请输入批次')] },
            {
                name: 'ProductName', rules: [r.required('商品部存在')],
                depends: [() => this.validator.checkElement('BarCode')]
            },
        )
        Utility.date(this.batchNumElement);
    }
    render() {
        let { entity, inPrice } = this.state;
        return <React.Fragment>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">新增物资</div>
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
                                    Object.assign(entity, {
                                        ProductName: '', Size: '', Expiry: null,
                                        InPrice: null, Qty: null
                                    } as ProductEntity)
                                    this.setState({ entity, inPrice: '' });
                                }}
                                onKeyDown={(e) => {
                                    const KEYCODE_ENTER = 13;
                                    if (e.keyCode == KEYCODE_ENTER) {
                                        this.loadProduct((e.target as HTMLInputElement).value)
                                        Utility.hideKeyboard()
                                    }
                                }} />
                            <div className="input-group-addon" onClick={() => this.showProductList()}>
                                <i className="icon-chevron-right" />
                            </div>
                        </div>
                        <span className="validationMessage" ref={(e) => this.barCodeError = e || this.barCodeError}></span>
                    </div>
                    <div className="form-group clearfix">
                        <label>物资名称</label>
                        <input name="ProductName" className="form-control" value={entity.ProductName || ''} readOnly />
                    </div>
                    <div className="form-group clearfix">
                        <label>规格 / 检定期</label>
                        <input name="Size" className="form-control" placeholder="规格"
                            style={{ width: `calc(${INPUT_DEFAULT_WIDTH} / 2 - 10px)` }}
                            value={entity.Size || ''} readOnly />
                        <input name="Expiry" className="form-control pull-right" placeholder="检定期"
                            style={{ width: `calc(${INPUT_DEFAULT_WIDTH} / 2 - 10px)` }}
                            value={entity.Expiry || ''} readOnly />
                    </div>
                    <div className="form-group clearfix">
                        <label>数量</label>
                        <input name="Num" className="form-control" value={entity.Num}
                            onChange={(e) => {
                                if (!e) return;
                                entity.Num = Number.parseInt((e.target as HTMLInputElement).value);
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix">
                        <label>价格</label>
                        <input name="Qty" className="form-control" value={entity.Num || ''}
                            style={{ width: 26, padding: 0, textAlign: 'center' }}
                            onChange={(e) => {
                                //check value
                                entity.Num = Number.parseInt(e.target.value);
                                entity.Amount = entity.Num * entity.InPrice;
                                this.setState({ entity });
                            }} />
                        <div className="pull-left" style={{ width: 15, textAlign: 'center', paddingTop: 6 }}>*</div>
                        <input name="InPrice" className="form-control" value={inPrice || ''}
                            style={{ width: `calc((${INPUT_DEFAULT_WIDTH} - 50px) / 2 - 16px)`, padding: 0, textAlign: 'right' }}
                            onChange={(e) => {
                                inPrice = e.target.value;
                                entity.InPrice = Number.parseFloat(inPrice);
                                this.setState({ inPrice, entity });
                            }} />
                        <div className="pull-left" style={{ width: 15, textAlign: 'center', paddingTop: 6 }} >=</div>
                        <input className="form-control pull-right"
                            style={{ width: `calc((${INPUT_DEFAULT_WIDTH} - 30px) / 2 - 10px)`, padding: 0, textAlign: 'right' }}
                            value={entity.Num * entity.InPrice || ''} readOnly />
                    </div>
                    <div className="form-group clearfix">
                        <label>物资批次</label>
                        <input name="BatchNum" className="form-control" value={entity.BatchNum}
                            ref={(e) => this.batchNumElement = e || this.batchNumElement}
                            onChange={(e) => {
                                entity.BatchNum = e.target.value;
                                this.setState({ entity });
                            }} />
                    </div>
                    <div className="form-group clearfix">
                        <label>入库库位</label>
                        <input name="LocalName" className="form-control" readOnly
                            placeholder="点击选择库位" value={entity.LocalName || ''}
                            onClick={() => this.showLocationList()} />
                    </div>
                </div>
            </section>
            <footer>
                <div className="form-group clearfix">
                    <button className="btn btn-block btn-primary"
                        onClick={() => this.confirm()}>
                        <i className="icon-ok" />
                        <span>确定</span>
                    </button>
                </div>
            </footer>
        </React.Fragment>
    }
}