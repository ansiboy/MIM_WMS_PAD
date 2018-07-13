import { Page, app } from "app";
import React = require("react");

export default class ProductAddPage extends Page<any> {
    render() {
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
                <div className="form-group clearfix">
                    <label>物资条码</label>
                    <input className="form-control" />
                </div>
                <div className="form-group clearfix">
                    <label>物资名称</label>
                    <input className="form-control" />
                </div>
                <div className="form-group clearfix">
                    <label>规格 / 检定期</label>
                    <input className="form-control" />
                </div>
                <div className="form-group clearfix">
                    <label>价格</label>
                    <input className="form-control" />
                </div>
                <div className="form-group clearfix">
                    <label>物资批次</label>
                    <input className="form-control" />
                </div>
                <div className="form-group clearfix">
                    <label>入库单位</label>
                    <input className="form-control" />
                </div>
            </section>
            <footer>
                <div className="form-group clearfix">
                    <button className="btn btn-block btn-primary">
                        <i className="icon-ok" />
                        <span>确定</span>
                    </button>
                </div>
            </footer>
        </React.Fragment>
    }
}