var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "dilu"], function (require, exports, dilu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Utility {
        static today() {
            let now = new Date(Date.now());
            let today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            return today;
        }
        static elementOnClick(callback, options) {
            if (!callback)
                throw new Error(`Argument 'callback' cannt be null or empty.`);
            options = options || {};
            let confirmText;
            let toastText;
            if (options.confirm) {
                confirmText = typeof options.confirm == 'string' ? options.confirm : options.confirm();
            }
            if (options.toast) {
                toastText = typeof options.toast == 'string' ? options.toast : options.toast();
            }
            //========================================
            // 将 callback 函数转换为  () => Promise<any> 类型
            let func = () => {
                let result = callback();
                if (typeof result == 'object') {
                    return result;
                }
                return Promise.resolve();
            };
            //========================================
            if (confirmText) {
                let _func = func;
                func = () => {
                    return new Promise((resolve, reject) => {
                        ui.confirm({
                            title: '提示', message: confirmText,
                            confirm() {
                                _func()
                                    .then(() => resolve())
                                    .catch(e => reject(e));
                                return Promise.resolve();
                            }
                        });
                    });
                };
            }
            if (toastText) {
                let _func = func;
                func = () => {
                    return _func().then(o => {
                        ui.showToastMessage(toastText);
                    });
                };
            }
            options = options || {};
            return (event) => __awaiter(this, void 0, void 0, function* () {
                let element = event.target;
                let result = func();
                element.setAttribute('disabled', '');
                result
                    .then(() => {
                    element.removeAttribute('disabled');
                })
                    .catch((err) => {
                    element.removeAttribute('disabled');
                    throw err;
                });
            });
        }
        static date(element) {
            if (!element)
                throw dilu_1.errors.argumentNull('element');
            $(element).AnyPicker({
                mode: "datetime",
                dateTimeFormat: "yyyy-M-d",
                lang: 'zh-cn'
            });
        }
        static newGuid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
            // return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            //     s4() + '-' + s4() + s4() + s4();
        }
        static hideKeyboard() {
            window['Keyboard'].hide();
        }
    }
    exports.Utility = Utility;
});
