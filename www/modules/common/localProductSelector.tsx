import React = require('react');
import { ListSelectorPage, ListSelectorState } from "pages";
import { Service, LoadProductArguments } from "service";
import { app } from 'app';

export interface LocalProductSelectorDataState extends ListSelectorState<LocalProductEntity> {
}
export type LoadProductMethod = 'localProductList' | 'localProductOutAbleList' | 'localProductBadAbleList'
export interface LocalProductSelectorData {
    method: LoadProductMethod,
    storageNum: string,
    listProduct?: string,
    confirm(item: LocalProductEntity);
}
export default class LocalProductSelectorPage extends ListSelectorPage<LocalProductSelectorDataState, LocalProductEntity> {
    constructor(props) {
        super(props);
        this.title = '选择移库物资';
    }
    renderItem(item: LocalProductEntity): JSX.Element {
        return <div onClick={() => {
            let data = this.data as LocalProductSelectorData;
            if (data.confirm) {
                data.confirm(item);
            }
        }}>
            <div className="clearfix">
                <div className="pull-right">
                    <span style={{ color: 'gray' }}>{item.StorageName} {item.LocalName}</span>
                </div>
                <div><b>{item.ProductName}</b> X  {item.Num} {item.UnitName}</div>
            </div>
            <div className="clearfix">
                <div className="pull-left">{item.BarCode}</div>
                <div style={{ marginLeft: 80, textAlign: 'right' }}>{item.Size}</div>
            </div>
        </div>
    }
    loadItems(pageIndex: number): Promise<LocalProductEntity[]> {
        let data = this.data as LocalProductSelectorData;
        let service = this.createService(Service);
        let args: LoadProductArguments = {
            PageIndex: pageIndex, StorageNumber: data.storageNum
        }

        if (data.listProduct != null)
            args.ListLocal = data.listProduct.split(',').map(o => Number.parseInt(o))

        return service[data.method](args);
    }
    static show(data: LocalProductSelectorData) {
        app.redirect('common_localProductSelector', data);
    }
}