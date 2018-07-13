define(["require", "exports", "app", "service", "react"], function (require, exports, app_1, service_1, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SupplierListPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = { suppliers: [] };
            let service = this.createService(service_1.Service);
            service.supplierList().then(suppliers => {
                this.setState({ suppliers });
            });
        }
        selectSupplier(supplier) {
            let data = this.props.source.data;
            console.assert(data.selectSupplier != null);
            data.selectSupplier(supplier);
            app_1.app.back();
        }
        componentDidMount() {
            // this.props.source.data
        }
        render() {
            let { suppliers } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, "\u8BF7\u9009\u62E9\u4F9B\u5E94\u5546")),
                React.createElement("section", null,
                    React.createElement("ul", { className: "list-group" }, suppliers.map(o => React.createElement("li", { key: o.ID, className: "list-group-item", onClick: () => this.selectSupplier(o) },
                        React.createElement("div", null,
                            React.createElement("b", null, o.SupName),
                            " "),
                        React.createElement("div", null,
                            o.ContactName || '',
                            " ",
                            o.Phone || '')))),
                    React.createElement("hr", null)));
        }
    }
    exports.default = SupplierListPage;
});
