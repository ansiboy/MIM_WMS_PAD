import { Page, app } from "app";
import React = require("react");
import { Service } from "service";

interface ProductListPageState {
    products?: ProductEntity[]
}

export interface ProductListPageData {
    selecteProduct(product: ProductEntity)
}

export default class ProductListPage extends Page<ProductListPageState>{
    constructor(props) {
        super(props);

        this.state = {};

        let service = this.createService(Service);
        service.productPage(0).then(items => {
            let products = this.state.products;
            if (products == null)
                products = [];

            products.push(...items);
            this.setState({ products })
        })
    }
    selectProduct(product: ProductEntity) {
        let data = this.props.source.data as ProductListPageData;
        if (data != null && data.selecteProduct != null) {
            data.selecteProduct(product);
        }
        app.back();
    }
    render() {
        let { products } = this.state;
        return <>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">
                    选择物资
                </div>
            </header>
            <section>
                {products == null ?
                    <div className="loading">
                        <i className="icon-spinner icon-spin" />
                        <span>数据正在加载中...</span>
                    </div> :
                    <ul className="list-group">
                        {products.map(o =>
                            <li key={o.ID} className="list-group-item"
                                onClick={() => this.selectProduct(o)}>
                                <div className="clearfix">
                                    <div className="pull-right">{o.StorageName} {o.LocalName}</div>
                                    <div><b>{o.ProductName}</b> X {o.UnitName}</div>
                                </div>
                                <div className="clearfix">
                                    <div className="pull-right">{o.Size}</div>
                                    <div>{o.BarCode}</div>
                                </div>
                            </li>
                        )}
                    </ul>
                }
            </section>
        </>
    }
}