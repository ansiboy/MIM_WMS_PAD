import React = require("react");
import ReactDOM = require("react-dom");
import { app } from "app";
import { Utility } from "utilty";


export interface PageProps {
    source: chitu.Page
}

export class Page<S> extends React.Component<PageProps, S>{
    private _componentDidMount: () => void;
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
            this.setState({ ...this.props.source.data as any });
            this.props.source.showing.add((sender, args) => {
                this.setState({ ...args as any });
            })
        }
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
    createService<T extends chitu.Service>(type?: chitu.ServiceConstructor<T>): T {
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

export class InputPage<S> extends Page<S>{
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

export interface ListSelectorState<T> {
    items?: T[]
}
export interface ListSelectorData<T> {
    selectItem(item: T)
}
export abstract class ListSelectorPage<S extends ListSelectorState<T>, T extends BaseEntity> extends Page<S>{
    protected title: string = '';
    constructor(props) {
        super(props);
        this.state = {} as S;
        this.loadItems(0).then(items => {
            items = items || [];
            this.setState({ items });
        })
    }
    abstract renderItem(item: T): JSX.Element;
    abstract loadItems(pageIndex: number): Promise<T[]>;
    selecteItem(item: T) {
        let data = this.data as ListSelectorData<T>;
        console.assert(data != null);
        if (data.selectItem) {
            data.selectItem(item);
        }
        app.back();
    }
    render() {
        let { items } = this.state;
        return <>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">
                    {this.title}
                </div>
            </header>
            <section>
                {items == null ?
                    <div className="loading">数据正在加载中...</div> :
                    items.length == 0 ?
                        <div className="emtpy"></div> :
                        <ul className="list-group">
                            {items.map(o =>
                                <li key={o.ID} className="list-group-item" onClick={() => this.selecteItem(o)}>
                                    {this.renderItem(o)}
                                </li>
                            )}
                        </ul>
                }
            </section>
        </>
    }
}

export type MasterState<M> = {
    master?: M
}
export abstract class MasterPage<S extends MasterState<M>, M> extends Page<S> {
    // private _componentDidMount: () => void;
    protected title: string = '';
    constructor(props) {
        super(props)
        this.state = { master: this.defaultMaster() } as S;
    }
    abstract defaultMaster(): M;
    abstract renderMaster(master: M): JSX.Element;
    render() {
        let { master } = this.state;
        return <>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">
                    {this.title}
                </div>
            </header>
            <section className="container">
                <form className="master">
                    {this.renderMaster(master)}
                </form>
            </section>
        </>
    }
}

export type MasterDetailState<M, D> = {
    master?: M,
    details?: D[],
}
export abstract class MasterDetailPage<
    S extends MasterDetailState<M, D>, M,
    D extends { ID: number, ProductName: string }> extends Page<S> {
    protected title: string = '';
    constructor(props) {
        super(props)
        this.state = { master: this.defaultMaster(), details: [] } as S;
    }
    abstract defaultMaster(): M;
    abstract renderMaster(master: M): JSX.Element;
    abstract renderDetail(detail: D): JSX.Element;
    abstract save(master: M, details: D[]): Promise<any>;
    abstract createDetail(): Promise<D>;

    removeDetail(detail: D) {
        let { details } = this.state;
        details = details.filter(o => o != detail);
        this.setState({ details });
    }
    render() {
        let { master, details } = this.state;
        return <>
            <header>
                <div className="pull-left">
                    <button type="button" className="btn-link" onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                </div>
                <div className="title">
                    {this.title}
                </div>
            </header>
            <section className="container">
                {this.renderMaster(master)}
                <hr />
                <h4>物资明细</h4>
                {details.length == 0 ?
                    <div className="empty">
                        暂无物资明细，点击“新增物资”按钮添加
                        </div> :
                    <ul className="list-group">
                        {details.map((o, i) =>
                            <li key={i} className="list-group-item">
                                <div className="pull-right"
                                    onClick={
                                        Utility.elementOnClick(
                                            () => this.removeDetail(o),
                                            {
                                                confirm: () => `确定删除'${o.ProductName}'吗`
                                            }
                                        )
                                    }>
                                    <i className="icon-remove" />
                                </div>
                                <div style={{ marginRight: 40 }}>
                                    {this.renderDetail(o)}
                                </div>

                            </li>
                        )}
                    </ul>
                }
            </section>
            <footer>
                <div className="form-group">
                    <div className="col-xs-6" style={{ padding: 0 }}>
                        <button type="button" className="btn btn-primary btn-block"
                            onClick={() => {
                                this.createDetail().then(detail => {
                                    console.assert(detail != null);
                                    details.push(detail);
                                    this.setState({ details });
                                })
                            }}>
                            <i className="icon-plus" />
                            <span>新增物资</span>
                        </button>
                    </div>
                    <div className="col-xs-6" style={{ padding: 0 }}>
                        <button type="button" className="btn btn-primary btn-block"
                            onClick={Utility.elementOnClick(() => this.save(master, details), { toast: '保存成功' })}>
                            <i className="icon-save" />
                            <span>保存</span>
                        </button>
                    </div>
                </div>
            </footer>
        </>
    }
}


