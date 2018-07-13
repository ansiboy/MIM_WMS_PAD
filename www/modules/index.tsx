import { app, Page } from 'app';
import { pagePaths } from 'siteMap';
import React = require('react');
import { Service } from 'service';

app.loadPageLess('index');
export default class StartPage extends Page<any>{
    logout() {
        let service = this.createService(Service);
        service.logout();
        app.redirect('user_login');
    }
    render() {
        return <React.Fragment>
            <header>
                <div className="pull-right">
                    <button className="btn-link" onClick={() => this.logout()}>退出</button>
                </div>
                <div className="title">
                    物资信息化管理系统
                </div>
            </header>
            <section>
                <div className="row">
                    <div className="col-xs-4 text-center"
                        onClick={() => {
                            app.redirect('inStorage_add')
                        }}>
                        <div>
                            <i className="icon-double-angle-right" />
                        </div>
                        <div className="name">入库管理</div>
                    </div>
                    <div className="col-xs-4 text-center"
                        onClick={() => app.redirect('move_add')}>
                        <div>
                            <i className="icon-cloud-upload" />
                        </div>
                        <div className="name">验收上架</div>
                    </div>
                    <div className="col-xs-4 text-center">
                        <div>
                            <i className="icon-refresh" />
                        </div>
                        <div className="name">物资申领</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-4 text-center">
                        <div onClick={() => app.redirect('outStorage_add')}>
                            <i className="icon-random" />
                        </div>
                        <div className="name">
                            备件领用 </div>
                    </div>
                    <div className="col-xs-4 text-center">
                        <div onClick={() => app.redirect('repair_add')}>
                            <i className="icon-wrench" />
                        </div>
                        <div className="name">
                            物资返修</div>
                    </div>
                    <div className="col-xs-4 text-center">
                        <div onClick={() => app.redirect('bad_add')}>
                            <i className="icon-trash" />
                        </div>
                        <div className="name">
                            物资报废
                    </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    }
}