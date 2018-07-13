import { Page, app } from "app";
import React = require("react");
import { Service } from "service";

type LocationListPageState = {
    items?: LocationEntity[]
}

export type LocationListPageData = {
    StorageNum: string,
    ListLocalType: string,
    selectLocation(location: LocationEntity),
}

export default class LocationListPage extends Page<LocationListPageState>{
    constructor(props) {
        super(props);
        this.state = {};
        let service = this.createService(Service);
        let data = this.data as LocationListPageData;
        console.assert(typeof data.ListLocalType == 'string');
        let listLocalType = data.ListLocalType.split(',').map(o => Number.parseInt(o));
        service.locationPage(data.StorageNum, listLocalType).then(items => {
            this.setState({ items });
        })
    }
    selectLocation(location: LocationEntity) {
        let data = this.data as LocationListPageData;
        if (data != null && data.selectLocation != null) {
            data.selectLocation(location);
        }
        app.back();
    }
    render() {
        let { items } = this.state;
        return <>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">选择库位</div>
            </header>
            <section>
                {items == null ?
                    <div className="loading">
                        <i className="icon-spinner icon-spin" />
                        <span>数据正在加载中...</span>
                    </div> :
                    items.length == 0 ?
                        <div className="empty">
                            <span>暂无库位数据</span>
                        </div> :
                        <ul className="list-group">
                            {items.map(o =>
                                <li key={o.ID} className="list-group-item"
                                    onClick={() => this.selectLocation(o)}>
                                    {o.LocalName}
                                </li>
                            )}
                        </ul>

                }
            </section>
        </>
    }
}