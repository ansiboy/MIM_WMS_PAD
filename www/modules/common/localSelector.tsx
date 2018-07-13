import { ListSelectorPage, ListSelectorData } from "pages";
import React = require("react");
import { Service, ELocalType, ELocalTypeText } from "service";

export interface LocalSelectorData extends ListSelectorData<LocationEntity> {
    StoreNum: string,
    ListLocal: string,
}
export default class LocalSelectorPage extends ListSelectorPage<any, LocationEntity>{
    constructor(props) {
        super(props);
        this.title = '请选择库位';
    }
    renderItem(item: LocationEntity): JSX.Element {
        return <>
            <div className="pull-right">{ELocalTypeText[item.LocalType]} {item.StorageName}</div>
            <div>{item.LocalName}</div>
        </>
    }
    loadItems(pageIndex: number): Promise<LocationEntity[]> {
        let service = this.createService(Service);
        let data = this.data as LocalSelectorData;
        let listLocalType = data.ListLocal == null ? null : data.ListLocal.split(',').map(o => Number.parseInt(o));
        console.assert(data.StoreNum != null);
        return service.locationPage(data.StoreNum, listLocalType, pageIndex);//[2, 3, 5]
    }


}
