import { Service } from "service";
import * as React from 'react';
import { Page, app } from "app";

interface ListPageState {
    items?: InStorageEntity[],
    tabIndex: number,
}
export default class ListPage extends Page<ListPageState>{
    private service: Service;
    constructor(props) {
        super(props);
        this.state = { tabIndex: 0 };
        this.service = this.createService(Service);
    }
    async componentDidMount() {
        let result = await this.service.inStorageList();
        this.setState({ items: result });
    }
    activeTab(tabIndex: number) {
        let currentTabIndex = this.state.tabIndex;
        if (currentTabIndex == tabIndex)
            return;

        this.setState({ tabIndex, items: null });
        this.service.inStorageList(tabIndex).then(items => {
            this.setState({ items });
        });
    }
    render() {
        let { items, tabIndex } = this.state;
        const labelClassName = "col-xs-4";
        const valueClassName = "col-xs-8";
        let tabs = ['全部', '待审核', '审核通过', '审核失败']
        return <React.Fragment>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="pull-right">
                    <button type="button" className="btn-link"
                        onClick={() => app.redirect('inStorage_add')}>
                        <i className="icon-plus"></i>
                    </button>
                </div>
                <div className="title">入库管理</div>
            </header>
            <section>
                <ul className="nav nav-tabs row">
                    {tabs.map((o, i) =>
                        <li key={i} className={i == tabIndex ? 'active' : ''}
                            onClick={() => this.activeTab(i)}>
                            <a href="javascrpt:">{o}</a>
                        </li>
                    )}
                </ul>
                {items == null ? <div className="loading"><i className="icon-spinner icon-spin" />正在加载中...</div> :
                    items.length == 0 ? <div className="empty">暂无记录</div> :
                        items.map(o =>
                            <ul key={o.OrderNum} style={{ marginTop: 10 }}>
                                <li>
                                    <div className="row">
                                        <label className={labelClassName}>订单号</label>
                                        <div className={valueClassName}>{o.OrderNum}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>物资名称</label>
                                        <div className={valueClassName}>{o.ProductName}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>物资编号</label>
                                        <div className={valueClassName}>{o.BarCode}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>批次</label>
                                        <div className={valueClassName}>{o.BatchNum}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>规格</label>
                                        <div className={valueClassName}>{o.Size}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>数量</label>
                                        <div className={valueClassName}>{o.RealNum}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>仓库</label>
                                        <div className={valueClassName}>{o.StorageName}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>库位</label>
                                        <div className={valueClassName}>{o.LocalName}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>项目名称</label>
                                        <div className={valueClassName}>{o.ProjectName}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>物资来源</label>
                                        <div className={valueClassName}>{o.FromSource}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>供应商</label>
                                        <div className={valueClassName}>{o.SupName}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>制单人</label>
                                        <div className={valueClassName}>{o.CreateUserName}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>制单时间</label>
                                        <div className={valueClassName}>{o.CreateTime}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>状态</label>
                                        <div className={valueClassName}>{o.Status}</div>
                                    </div>
                                    <div className="row">
                                        <label className={labelClassName}>审核人</label>
                                        <div className={valueClassName}>{o.AuditeUserName}</div>
                                    </div>
                                    <div>
                                        <div className="pull-right">
                                            编辑
                                    </div>
                                    </div>
                                </li>
                                <li>
                                    <hr />
                                </li>
                            </ul>
                        )
                }
            </section>
        </React.Fragment>
    }
}

    // ReactDOM.render(<ListPage />, page.element);
// }