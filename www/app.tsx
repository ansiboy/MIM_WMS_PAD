import React = require("react");
import ReactDOM = require("react-dom");
import { pagePaths } from 'siteMap'
import { ajaxCodes } from './service';
import { PageNode } from "chitu";
import { PageProps } from 'pages';
export { PageProps, Page, InputPage } from 'pages';

class Application extends chitu.Application {
    constructor() {
        super(Application.createSiteMap())
        this.error.add((sender, error) => {
            if (error.name == `${ajaxCodes.NotLogin}`) {
                app.redirect('user_login');
                return;
            }

            ui.alert(error.message);
        })

        document.addEventListener('deviceready',()=>{
            window['Keyboard'].hide();
        })
    }

    private static createSiteMap(): chitu.SiteMap {
        let nodes: { [key: string]: chitu.PageNode } = {}
        return {
            nodes,
            pageNameParse: (pageName) => {
                let node = nodes[pageName];
                if (node == null) {
                    let path = `modules_${pageName}`.split('_').join('/');
                    node = { action: this.createAction(path), name: pageName };
                    nodes[pageName] = node;
                }
                return node;
            }
        }
    }

    private static createAction(path) {
        console.assert(typeof path == 'string');
        let action = function (page: chitu.Page) {
            console.assert(typeof path == 'string');
            requirejs([path], function (exports) {
                console.assert(exports != null);
                console.assert(exports.default != null);
                let element = React.createElement(exports.default, { source: page } as PageProps);
                ReactDOM.render(element, page.element);
                if (page.element.querySelector('header') != null) {
                    page.element.className = `${page.element.className} showHeader`;
                }
                if (page.element.querySelector('footer') != null) {
                    page.element.className = `${page.element.className} showFooter`;
                }
            })
        }
        return action;
    }

    protected createPageElement(pageName: string) {
        let element = document.createElement('div'); //super.createPageElement(pageName);
        element.className = `page ${pageName}`
        // let path = pageName.split('_').join('/');
        // requirejs([`less!modules/${path}.less`])

        let app_element = document.getElementById('app_element');
        console.assert(app_element != null);
        app_element.appendChild(element);
        // app_element.className = 'page showHeader';

        return element;
    }

    loadPageLess(pageName: string) {
        console.assert(pageName != null);
        let path = pageName.split('_').join('/');
        requirejs([`less!modules/${path}.less`])
    }

    public run() {
        super.run();
        if (!location.hash)
            this.redirect('user_login');
    }
}
window.setTimeout
requirejs(['less!site'])
requirejs(['cordova'])

export let app: Application = window['app'] = window['app'] || new Application();
