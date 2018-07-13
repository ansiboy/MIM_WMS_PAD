define(["require", "exports", "react", "pages", "service", "app"], function (require, exports, React, pages_1, service_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocalProductSelectorPage extends pages_1.ListSelectorPage {
        constructor(props) {
            super(props);
            this.title = '选择移库物资';
        }
        renderItem(item) {
            return React.createElement("div", { onClick: () => {
                    let data = this.data;
                    if (data.confirm) {
                        data.confirm(item);
                    }
                } },
                React.createElement("div", { className: "clearfix" },
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
                        item.UnitName)),
                React.createElement("div", { className: "clearfix" },
                    React.createElement("div", { className: "pull-left" }, item.BarCode),
                    React.createElement("div", { style: { marginLeft: 80, textAlign: 'right' } }, item.Size)));
        }
        loadItems(pageIndex) {
            let data = this.data;
            let service = this.createService(service_1.Service);
            let args = {
                PageIndex: pageIndex, StorageNumber: data.storageNum
            };
            if (data.listProduct != null)
                args.ListLocal = data.listProduct.split(',').map(o => Number.parseInt(o));
            return service[data.method](args);
        }
        static show(data) {
            app_1.app.redirect('common_localProductSelector', data);
        }
    }
    exports.default = LocalProductSelectorPage;
});
