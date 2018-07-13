define(["require", "exports", "app", "react", "service"], function (require, exports, app_1, React, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProductListPage extends app_1.Page {
        constructor(props) {
            super(props);
            this.state = {};
            let service = this.createService(service_1.Service);
            service.productPage(0).then(items => {
                let products = this.state.products;
                if (products == null)
                    products = [];
                products.push(...items);
                this.setState({ products });
            });
        }
        selectProduct(product) {
            let data = this.props.source.data;
            if (data != null && data.selecteProduct != null) {
                data.selecteProduct(product);
            }
            app_1.app.back();
        }
        render() {
            let { products } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, "\u9009\u62E9\u7269\u8D44")),
                React.createElement("section", null, products == null ?
                    React.createElement("div", { className: "loading" },
                        React.createElement("i", { className: "icon-spinner icon-spin" }),
                        React.createElement("span", null, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D...")) :
                    React.createElement("ul", { className: "list-group" }, products.map(o => React.createElement("li", { key: o.ID, className: "list-group-item", onClick: () => this.selectProduct(o) },
                        React.createElement("div", { className: "clearfix" },
                            React.createElement("div", { className: "pull-right" },
                                o.StorageName,
                                " ",
                                o.LocalName),
                            React.createElement("div", null,
                                React.createElement("b", null, o.ProductName),
                                " X ",
                                o.UnitName)),
                        React.createElement("div", { className: "clearfix" },
                            React.createElement("div", { className: "pull-right" }, o.Size),
                            React.createElement("div", null, o.BarCode)))))));
        }
    }
    exports.default = ProductListPage;
});
