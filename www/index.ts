requirejs.config({
    shim: {
        app: {
            deps: ['react', 'react-dom', 'chitu', 'dilu', 'ui']
        },
        'react-dom': {
            deps: ['react']
        },
        dilu: {
            exports: 'dilu'
        },
        anypicker: {
            deps: ['jquery', 'css!anypicker_css']
        },
        anypicker_zh_cn: {
            deps: ['jquery', 'anypicker']
        },
        anypicker_i18n: {
            deps: ['jquery', 'anypicker']
        },
        jquery: {
            exports: '$'
        }
    },
    paths: {
        css: 'lib/css',
        less: 'lib/require-less-0.1.5/less',
        lessc: 'lib/require-less-0.1.5/lessc',
        normalize: 'lib/require-less-0.1.5/normalize',
        text: 'lib/text',

        chitu: 'lib/chitu',
        dilu: 'lib/dilu',
        ui: 'lib/ui',

        jquery: 'lib/jquery-2.1.3',

        anypicker: 'lib/AnyPicker/dist/anypicker',//anypicker-i18n-zh-cn
        anypicker_css: 'lib/AnyPicker/src/anypicker-all',
        anypicker_zh_cn: 'lib/AnyPicker/dist/i18n/anypicker-i18n-zh-cn',
        anypicker_i18n: 'lib/AnyPicker/dist/i18n/anypicker-i18n',

        react: 'lib/react.development',
        'react-dom': 'lib/react-dom.development'
    }
})

requirejs(['react', 'react-dom', 'app','anypicker_zh_cn'], function (react, reactDOM, app_exports) {
    window['React'] = react;
    window['ReactDOM'] = reactDOM;
    app_exports.app.run();
})