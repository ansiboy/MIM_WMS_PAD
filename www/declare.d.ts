declare module 'dilu' {
    export = dilu;
}
declare module 'chitu' {
    export = chitu;
}
interface JQuery {
    AnyPicker(options: {
        mode?: string,
        dateTimeFormat?: string,
        lang?: string
    }): JQuery
}