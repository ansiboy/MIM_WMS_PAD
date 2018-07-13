define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let modules_path = 'modules';
    exports.pagePaths = {
        index: `${modules_path}/index`,
        user_login: `${modules_path}/user/login`,
        inStorage_list: `${modules_path}/inStorage/list`,
        inStorage_add: `${modules_path}/inStorage/add`,
        inStorage_addProduct: `${modules_path}/inStorage/addProduct`,
        supplier_list: `${modules_path}/supplier/list`,
        product_add: `${modules_path}/product/add`,
    };
});
