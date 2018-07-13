import { Page } from "app";
import React = require('react');
import { ListSelectorPage, ListSelectorState } from "pages";
import { Service } from "service";

export interface StockListPageState extends ListSelectorState<LocalProductEntity> {
}
export interface StockListData {
    storageNum: string,
    selectItem(item: LocalProductEntity);
}
export default class StockListPage extends ListSelectorPage<StockListPageState, LocalProductEntity> {
    constructor(props) {
        super(props);
        this.title = '选择移库物资';
    }
    renderItem(item: LocalProductEntity): JSX.Element {
        return <div onClick={() => {
            let data = this.data as StockListData;
            if (data.selectItem) {
                data.selectItem(item);
            }
        }}>
            <div className="pull-right">
                <span style={{ color: 'gray' }}>{item.StorageName} {item.LocalName}</span>
            </div>
            <div><b>{item.ProductName}</b> X  {item.Num} {item.UnitName}</div>
        </div>
    }
    loadItems(pageIndex: number): Promise<LocalProductEntity[]> {
        let service = this.createService(Service);
        let { storageNum } = this.data as StockListData;
        return service.localProductList({
            PageIndex: pageIndex, StorageNumber: storageNum
        });
    }
}