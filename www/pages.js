define(["require", "exports", "react", "app", "utilty"], function (require, exports, React, app_1, utilty_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Page extends React.Component {
        // active = chitu.Callbacks<this, any>();
        constructor(props) {
            super(props);
            this._componentDidMount = this.componentDidMount;
            this.componentDidMount = () => {
                if (this._componentDidMount) {
                    this._componentDidMount();
                }
                var firstInputElement = this.element.querySelector('input');
                if (firstInputElement) {
                    firstInputElement.focus();
                }
                console.assert(this.props.source.data != null);
                this.setState(Object.assign({}, this.props.source.data));
                this.props.source.showing.add((sender, args) => {
                    this.setState(Object.assign({}, args));
                });
            };
        }
        componentDidUpdate() {
            let header = this.element.querySelector('header');
            let footer = this.element.querySelector('footer');
            let className = this.element.className;
            if (header != null && className.indexOf('showHeader') < 0) {
                this.element.className = `${this.element.className} showHeader`;
            }
            if (footer != null && className.indexOf('showFooter') < 0) {
                this.element.className = `${this.element.className} showFooter`;
            }
        }
        createService(type) {
            console.assert(this.props.source != null);
            return this.props.source.createService(type);
        }
        get element() {
            return this.props.source.element;
        }
        get data() {
            return this.props.source.data;
        }
    }
    exports.Page = Page;
    class InputPage extends Page {
        // private _componentDidMount: () => void;
        constructor(props) {
            super(props);
            //     this._componentDidMount = this.componentDidMount;
            //     this.componentDidMount = () => {
            //         if (this._componentDidMount) {
            //             this._componentDidMount();
            //         }
            //         var firstInputElement = this.element.querySelector('input');
            //         if (firstInputElement) {
            //             firstInputElement.focus();
            //         }
            //     }
        }
    }
    exports.InputPage = InputPage;
    class ListSelectorPage extends Page {
        constructor(props) {
            super(props);
            this.title = '';
            this.state = {};
            this.loadItems(0).then(items => {
                items = items || [];
                this.setState({ items });
            });
        }
        selecteItem(item) {
            let data = this.data;
            console.assert(data != null);
            if (data.selectItem) {
                data.selectItem(item);
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
                    React.createElement("div", { className: "title" }, this.title)),
                React.createElement("section", null, items == null ?
                    React.createElement("div", { className: "loading" }, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D...") :
                    items.length == 0 ?
                        React.createElement("div", { className: "emtpy" }) :
                        React.createElement("ul", { className: "list-group" }, items.map(o => React.createElement("li", { key: o.ID, className: "list-group-item", onClick: () => this.selecteItem(o) }, this.renderItem(o))))));
        }
    }
    exports.ListSelectorPage = ListSelectorPage;
    class MasterPage extends Page {
        constructor(props) {
            super(props);
            // private _componentDidMount: () => void;
            this.title = '';
            this.state = { master: this.defaultMaster() };
        }
        render() {
            let { master } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, this.title)),
                React.createElement("section", { className: "container" },
                    React.createElement("form", { className: "master" }, this.renderMaster(master))));
        }
    }
    exports.MasterPage = MasterPage;
    class MasterDetailPage extends Page {
        constructor(props) {
            super(props);
            this.title = '';
            this.state = { master: this.defaultMaster(), details: [] };
        }
        render() {
            let { master, details } = this.state;
            return React.createElement(React.Fragment, null,
                React.createElement("header", null,
                    React.createElement("div", { className: "pull-left" },
                        React.createElement("button", { type: "button", className: "btn-link", onClick: () => app_1.app.back() },
                            React.createElement("i", { className: "icon-chevron-left" }))),
                    React.createElement("div", { className: "title" }, this.title)),
                React.createElement("section", { className: "container" },
                    this.renderMaster(master),
                    React.createElement("hr", null),
                    React.createElement("h4", null, "\u7269\u8D44\u660E\u7EC6"),
                    details.length == 0 ?
                        React.createElement("div", { className: "empty" }, "\u6682\u65E0\u7269\u8D44\u660E\u7EC6\uFF0C\u70B9\u51FB\u201C\u65B0\u589E\u7269\u8D44\u201D\u6309\u94AE\u6DFB\u52A0") :
                        React.createElement("ul", { className: "list-group" }, details.map((o, i) => React.createElement("li", { key: i }, this.renderDetail(o))))),
                React.createElement("footer", null,
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "col-xs-6", style: { padding: 0 } },
                            React.createElement("button", { type: "button", className: "btn btn-primary btn-block", onClick: () => {
                                    this.createDetail().then(detail => {
                                        console.assert(detail != null);
                                        details.push(detail);
                                        this.setState({ details });
                                    });
                                } },
                                React.createElement("i", { className: "icon-plus" }),
                                React.createElement("span", null, "\u65B0\u589E\u7269\u8D44"))),
                        React.createElement("div", { className: "col-xs-6", style: { padding: 0 } },
                            React.createElement("button", { type: "button", className: "btn btn-primary btn-block", onClick: utilty_1.Utility.elementOnClick(() => this.save(master, details), { toast: '保存成功' }) },
                                React.createElement("i", { className: "icon-save" }),
                                React.createElement("span", null, "\u4FDD\u5B58"))))));
        }
    }
    exports.MasterDetailPage = MasterDetailPage;
});
