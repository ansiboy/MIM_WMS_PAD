import { FormValidator, rules as r } from 'dilu';
import { Service } from 'service';
import { app, Page } from 'app';
import React = require('react');
import { Utility } from 'utilty';

export default class LoginPage extends Page<any>{
    private validator: FormValidator;
    private formElement: HTMLFormElement;

    async login() {
        this.validator.clearErrors();
        let isValid = this.validator.check();
        if (!isValid) return;
        let service = this.createService(Service);
        let username = this.formElement["username"].value;
        let password = this.formElement["password"].value;
        await service.login(username, password);
        app.redirect('index');
    }
    componentDidMount() {
        this.validator = new FormValidator(this.element,
            { name: 'username', rules: [r.required('请输入用户名')] },
            { name: 'password', rules: [r.required('请输入密码')] }
        )
    }
    render() {
        return <section className="container">
            <form ref={(e: HTMLFormElement) => this.formElement = e || this.formElement}>
                <h3 className="text-center">物资信息化管理系统</h3>
                <div className="form-group">
                    <input name="username" className="form-control" placeholder="请输入用户名" />
                </div>
                <div className="form-group">
                    <input name="password" type="password" className="form-control" placeholder="请输入密码" />
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-primary btn-block"
                        onClick={Utility.elementOnClick(() => this.login())}>登录</button>
                </div>
            </form>
        </section>
    }
}
