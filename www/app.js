define(["require", "exports", "react", "react-dom", "./service", "pages"], function (require, exports, React, ReactDOM, service_1, pages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Page = pages_1.Page;
    exports.InputPage = pages_1.InputPage;
    class Application extends chitu.Application {
        constructor() {
            super(Application.createSiteMap());
            this.error.add((sender, error) => {
                if (error.name == `${service_1.ajaxCodes.NotLogin}`) {
                    exports.app.redirect('user_login');
                    return;
                }
                ui.alert(error.message);
            });
            document.addEventListener('deviceready', () => {
                window['Keyboard'].hide();
            });
        }
        static createSiteMap() {
            let nodes = {};
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
            };
        }
        static createAction(path) {
            console.assert(typeof path == 'string');
            let action = function (page) {
                console.assert(typeof path == 'string');
                requirejs([path], function (exports) {
                    console.assert(exports != null);
                    console.assert(exports.default != null);
                    let element = React.createElement(exports.default, { source: page });
                    ReactDOM.render(element, page.element);
                    if (page.element.querySelector('header') != null) {
                        page.element.className = `${page.element.className} showHeader`;
                    }
                    if (page.element.querySelector('footer') != null) {
                        page.element.className = `${page.element.className} showFooter`;
                    }
                });
            };
            return action;
        }
        createPageElement(pageName) {
            let element = document.createElement('div'); //super.createPageElement(pageName);
            element.className = `page ${pageName}`;
            // let path = pageName.split('_').join('/');
            // requirejs([`less!modules/${path}.less`])
            let app_element = document.getElementById('app_element');
            console.assert(app_element != null);
            app_element.appendChild(element);
            // app_element.className = 'page showHeader';
            return element;
        }
        loadPageLess(pageName) {
            console.assert(pageName != null);
            let path = pageName.split('_').join('/');
            requirejs([`less!modules/${path}.less`]);
        }
        run() {
            super.run();
            if (!location.hash)
                this.redirect('user_login');
        }
    }
    window.setTimeout;
    requirejs(['less!site']);
    requirejs(['cordova']);
    exports.app = window['app'] = window['app'] || new Application();
});
