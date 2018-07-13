import { Page, app } from "app";
import { Service } from "service";
import React = require("react");

export type SupplierListPageData = {
    selectSupplier(supplier: SupplierEntity);
}
interface SupplierListPageState {
    suppliers: SupplierEntity[]
}
export default class SupplierListPage extends Page<SupplierListPageState>{
    constructor(props) {
        super(props);
        this.state = { suppliers: [] };
        let service = this.createService(Service);
        service.supplierList().then(suppliers => {
            this.setState({ suppliers });
        })
    }
    selectSupplier(supplier: SupplierEntity) {
        let data = this.props.source.data as SupplierListPageData;
        console.assert(data.selectSupplier != null);
        data.selectSupplier(supplier);
        app.back();
    }
    componentDidMount() {
        // this.props.source.data
    }
    render() {
        let { suppliers } = this.state;
        return <React.Fragment>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">请选择供应商</div>
            </header>
            <section>
                <ul className="list-group">
                    {suppliers.map(o =>
                        <li key={o.ID} className="list-group-item"
                            onClick={() => this.selectSupplier(o)}>
                            <div><b>{o.SupName}</b> </div>
                            <div>{o.ContactName || ''} {o.Phone || ''}</div>
                        </li>
                    )}
                </ul>
                <hr />

            </section>
        </React.Fragment>
    }
}