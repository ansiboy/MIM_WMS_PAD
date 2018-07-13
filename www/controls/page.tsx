import React = require("react");

export class Header extends React.Component<{}, {}> {
    render() {
        return <header>
            <div className="pull-left">
                <button type="button" className="btn-link">
                    <i className="icon-chevron-left"></i>
                </button>
            </div>
            <div className="pull-right">
                <button type="button" className="btn-link">
                    <i className="icon-plus"></i>
                </button>
            </div>
            <div className="title">入库管理</div>

        </header>
    }
}

export class PageView extends React.Component<{}, {}>{
    render() {
        let props = { className: 'page' }
        let children = this.props.children as Array<React.ReactElement<any>> || new Array<React.ReactElement<any>>();
        if (children.length != null && children.length > 0) {
            var hasHeader = children.filter(o => o.type == 'header').length > 0;
            props.className = hasHeader ? props.className + ' showHeader' : props.className;
        }
        return <div {...props}>
            {this.props.children}
        </div>
    }
}