interface Utils {
    aoa_to_sheet(data: Array<Array<any>>): SheetJS;
    book_new(): BookJS;
    book_append_sheet(wb: BookJS, ws: SheetJS, sheet_name: string);
}
interface SheetJS {

}
interface BookJS {
    SheetNames: string[],
    Sheets: SheetJS[]
}
declare namespace XLSX {
    export let utils: Utils;
    function writeFile(wb: BookJS, file_name: string);
}