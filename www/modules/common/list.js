define(["require", "exports", "react", "pages", "service"], function (require, exports, React, pages_1, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class StockListPage extends pages_1.ListSelectorPage {
        constructor(props) {
            super(props);
            this.title = '选择移库物资';
        }
        renderItem(item) {
            return React.createElement("div", { onClick: () => {
                    let data = this.data;
                    if (data.selectItem) {
                        data.selectItem(item);
                    }
                } },
                React.createElement("div", { className: "pull-right" },
                    React.createElement("span", { style: { color: 'gray' } },
                        item.StorageName,
                        " ",
                        item.LocalName)),
                React.createElement("div", null,
                    React.createElement("b", null, item.ProductName),
                    " X  ",
                    item.Num,
                    " ",
                    item.UnitName));
        }
        loadItems(pageIndex) {
            let service = this.createService(service_1.Service);
            let { storageNum } = this.data;
            return service.localProductList(pageIndex, storageNum);
        }
    }
    exports.default = StockListPage;
});
