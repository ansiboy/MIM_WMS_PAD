define(["require", "exports", "app", "react", "service"], function (require, exports, app_1, React, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocationListPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = {};
            let service = this.createService(service_1.Service);
            let data = this.data;
            console.assert(typeof data.ListLocalType == 'string');
            let listLocalType = data.ListLocalType.split(',').map(o => Number.parseInt(o));
            service.locationPage(data.StorageNum, listLocalType).then(items => {
                this.setState({ items });
            });
        }
        selectLocation(location) {
            let data = this.data;
            if (data != null && data.selectLocation != null) {
                data.selectLocation(location);
            }
            app_1.app.back();
        }
        render() {
            let { items } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, "\u9009\u62E9\u5E93\u4F4D")),
                React.createElement("section", null, items == null ?
                    React.createElement("div", { className: "loading" },
                        React.createElement("i", { className: "icon-spinner icon-spin" }),
                        React.createElement("span", null, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D...")) :
                    items.length == 0 ?
                        React.createElement("div", { className: "empty" },
                            React.createElement("span", null, "\u6682\u65E0\u5E93\u4F4D\u6570\u636E")) :
                        React.createElement("ul", { className: "list-group" }, items.map(o => React.createElement("li", { key: o.ID, className: "list-group-item", onClick: () => this.selectLocation(o) }, o.LocalName)))));
        }
    }
    exports.default = LocationListPage;
});
