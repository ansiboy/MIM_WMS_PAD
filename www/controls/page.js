define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Header extends React.Component {
        render() {
            return React.createElement("header", null,
                React.createElement("div", { className: "pull-left" },
                    React.createElement("button", { type: "button", className: "btn-link" },
                        React.createElement("i", { className: "icon-chevron-left" }))),
                React.createElement("div", { className: "pull-right" },
                    React.createElement("button", { type: "button", className: "btn-link" },
                        React.createElement("i", { className: "icon-plus" }))),
                React.createElement("div", { className: "title" }, "\u5165\u5E93\u7BA1\u7406"));
        }
    }
    exports.Header = Header;
    class PageView extends React.Component {
        render() {
            let props = { className: 'page' };
            let children = this.props.children || new Array();
            if (children.length != null && children.length > 0) {
                var hasHeader = children.filter(o => o.type == 'header').length > 0;
                props.className = hasHeader ? props.className + ' showHeader' : props.className;
            }
            return React.createElement("div", Object.assign({}, props), this.props.children);
        }
    }
    exports.PageView = PageView;
});
