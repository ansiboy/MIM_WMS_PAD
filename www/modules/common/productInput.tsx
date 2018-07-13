import { Page, app } from "app"
import React = require('react')
import LocalProductSelectorPage, { LocalProductSelectorData, LoadProductMethod } from "modules/common/localProductSelector";
import { LocalSelectorData } from "modules/common/localSelector";
import { FormValidator, rules as r } from "dilu";
import { Service, LoadProductArguments } from "service";
import { Utility } from "utilty";

export interface ProductInputState {
    barCode?: string,
    localProduct?: LocalProductEntity,
    local?: LocationEntity,
    num?: number
}

export interface ProductInputData {
    method: LoadProductMethod
    storageNum: string
    productLocal?: string
    listLocal?: string
    /** 控制是否显示库位 */
    localLabel?: string
    /** 控制是否显示数量 */
    numberLabel?: string
    confirm?: (localProduct: LocalProductEntity, local: LocationEntity, num: number) => void
}

export default class ProductInputPage extends Page<ProductInputState>{
    title: any
    validator: FormValidator
    constructor(props) {
        super(props)
        this.title = '添加物资'
        this.state = {}
    }
    get data() {
        return super.data as ProductInputData;
    }
    static show(data: ProductInputData) {
        app.redirect('common_productInput', data)
    }
    confirm() {
        if (!this.validator.check())
            return;

        let { local, localProduct, num } = this.state
        console.assert(this.data)
        if (this.data.confirm) {
            this.data.confirm(localProduct, local, num)
        }
        app.back();
    }
    async loadProduct(barCode) {
        let service = this.createService(Service)
        let args: LoadProductArguments = {
            PageIndex: 0, StorageNumber: this.data.storageNum,
            BarCode: barCode
        }
        let items = await service[this.data.method](args)
        this.setState({ localProduct: items[0] })
    }
    showLocalSelector(): any {
        let data: LocalSelectorData = {
            StoreNum: this.data.storageNum,
            ListLocal: this.data.listLocal,
            selectItem: (item) => {
                this.setState({ local: item })
            }
        };
        app.redirect('common_localSelector', data);
    }
    showProductSelecter() {
        let data: LocalProductSelectorData = {
            method: (this.data as ProductInputData).method,
            storageNum: (this.data as ProductInputData).storageNum,
            listProduct: (this.data as ProductInputData).productLocal,
            confirm: (item) => {
                this.setState({ localProduct: item, barCode: item.BarCode });
            },
        };
        LocalProductSelectorPage.show(data);
    }
    componentDidMount() {
        let { numberLabel, localLabel } = this.data
        this.validator = new FormValidator(this.element,
            {
                name: 'Num', rules: [
                    r.required(() => `请输入${numberLabel}`),
                    r.lessThan(() => this.state.localProduct.Num + 1, () => `${numberLabel}小于或等于${this.state.localProduct.Num}`),
                    r.greaterThan(() => 0, `${numberLabel}必须大于 0`)
                ],
                condition: () => numberLabel != null
            },
            {
                name: 'LocalName', rules: [r.required(() => `请输入${localLabel}`)],
                condition: () => this.data.localLabel != null
            }
        )
    }
    render() {
        let { barCode, localProduct, local, num } = this.state
        let { localLabel, numberLabel } = this.data
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
                <div className="master">
                    <div className="form-group clearfix">
                        <label>物资条码</label>
                        <div className="input-group">
                            <input name="BarCode" className="form-control" placeholder="点击右侧按钮选择物资"
                                value={barCode || ''}
                                onChange={(e) => {
                                    barCode = e.target.value
                                    this.setState({ barCode })
                                }}
                                onKeyDown={(e) => {
                                    const KEYCODE_ENTER = 13;
                                    if (e.keyCode == KEYCODE_ENTER) {
                                        this.loadProduct((e.target as HTMLInputElement).value);
                                        Utility.hideKeyboard()
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
                            请扫描或输入条码 </div> :
                        <>
                            <div className="form-group clearfix">
                                <label>物资名称</label>
                                <div>{localProduct.ProductName}</div>
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
                            {localLabel ?
                                <div className="form-group clearfix">
                                    <label>{localLabel}</label>
                                    <input name="LocalName" className="form-control"
                                        value={local ? local.LocalName : ''}
                                        placeholder={'点击选择库位'} onClick={() => this.showLocalSelector()}
                                        onChange={(e) => { }} />
                                </div> : null}
                            {numberLabel ?
                                <div className="form-group clearfix">
                                    <label>{numberLabel}</label>
                                    <input name="Num" className="form-control"
                                        value={num != null ? num : ''}
                                        placeholder={''}
                                        onChange={(e) => {
                                            num = e.target.value ? Number.parseInt(e.target.value) : null
                                            this.setState({ num })
                                        }} />
                                </div> : null}
                        </>
                    }
                </div>
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