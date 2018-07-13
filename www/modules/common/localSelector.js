define(["require", "exports", "pages", "react", "service"], function (require, exports, pages_1, React, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocalSelectorPage extends pages_1.ListSelectorPage {
        constructor(props) {
            super(props);
            this.title = '请选择库位';
        }
        renderItem(item) {
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "pull-right" },
                    service_1.ELocalTypeText[item.LocalType],
                    " ",
                    item.StorageName),
                React.createElement("div", null, item.LocalName));
        }
        loadItems(pageIndex) {
            let service = this.createService(service_1.Service);
            let data = this.data;
            let listLocalType = data.ListLocal == null ? null : data.ListLocal.split(',').map(o => Number.parseInt(o));
            console.assert(data.StoreNum != null);
            return service.locationPage(data.StoreNum, listLocalType, pageIndex); //[2, 3, 5]
        }
    }
    exports.default = LocalSelectorPage;
});
