declare namespace dilu {
    let errors: {
        argumentNull(parameterName: any): Error;
        elementValidateRuleNotSet(element: HTMLInputElement): Error;
        fieldElementCanntNull(fieldIndex?: number): Error;
        elementNotExists(name: string): Error;
        fieldResultExpectBooleanType(name: string): Error;
    };
}
declare namespace dilu {
    type InputElement = HTMLElement & {
        name: string;
        value: string;
    } | HTMLAreaElement;
    type ValidateField = {
        name: string;
        rules: Rule[];
        errorElement?: HTMLElement;
        depends?: ((() => Promise<boolean>) | (() => boolean))[];
        condition?: () => boolean;
    };
    /**
     * 表单验证器，用于对表单中的字段进行验证
     */
    class FormValidator {
        static errorClassName: string;
        private form;
        private fields;
        private elementEvents;
        constructor(form: HTMLElement, ...fields: ValidateField[]);
        /**
         * 清除表单的错误信息
         */
        clearErrors(): void;
        /**
         * 清除表单的指定元素错误信息
         * @param name 指定的元素名称
         */
        clearElementError(name: string): void;
        private fieldElement;
        private fieldErrorElement;
        /**
         * 验证字段
         */
        check(): boolean;
        /**
         * 异步验证字段
         */
        checkAsync(): Promise<boolean>;
        private bindElementEvent;
        private checkField;
        private checkFieldAsync;
        private showElement;
        /**
         * 异步验证 HTML 元素
         * @param name HTML 元素名称
         */
        checkElementAsync(name: string): Promise<boolean>;
        /**
         * 同步验证 HTML 元素
         * @param name HTML 元素名称
         */
        checkElement(name: string): boolean;
        static elementValue(element: InputElement): string;
        private elementName;
    }
}
declare namespace dilu {
    function errorText(err: ErrorInfo): string;
    type Validate = (value: any) => boolean | Promise<boolean>;
    type RuleDepend = Rule | (() => boolean);
    type ErrorInfo = string | (() => string);
    type Rule = {
        validate: (value: any) => boolean | Promise<boolean>;
        error?: ErrorInfo;
    };
    /**
     * 表单验证规则
     */
    let rules: {
        /**
         * 验证必填字段
         * @param error 错误提示文字
         */
        required(error?: ErrorInfo): Rule;
        /**
         * 验证两个字段值是否相等
         * @param otherElement 另外一个字段
         * @param error 错误提示文字
         */
        matches(otherElement: InputElement, error?: ErrorInfo): Rule;
        /**
         * 验证邮箱
         * @param error 错误提示文字
         */
        email(error?: ErrorInfo): Rule;
        /**
         * 验证字段最小长度
         * @param length 最小长度
         * @param error 错误提示文字
         */
        minLength(length: number, error?: ErrorInfo): Rule;
        /**
         * 验证字段的最大长度
         * @param length 最大长度
         * @param error 错误提示文字
         */
        maxLength(length: number, error?: ErrorInfo): Rule;
        /**
         * 验证字段大于或等于指定的值
         * @param value 指定的值
         * @param error 错误提示文字
         */
        greaterThan(value: () => number | Date, error?: ErrorInfo): Rule;
        /**
         * 验证字段小于或等于指定的值
         * @param value 指定的值
         * @param error 错误提示文字
         */
        lessThan(value: () => string | number | Date, error?: ErrorInfo): Rule;
        /**
         * 验证字段等于指定的值
         * @param value 指定的值
         * @param error 错误提示文字
         */
        equal(value: () => string | number | Date, error?: ErrorInfo): Rule;
        /**
         * 验证字段为 IP
         * @param error 错误提示文字
         */
        ip(error?: ErrorInfo): Rule;
        /**
         * 验证字段为 URL
         * @param error 错误提示文字
         */
        url(error?: ErrorInfo): Rule;
        /**
         * 验证字段为手机号码
         * @param error 错误提示文字
         */
        mobile(error?: ErrorInfo): Rule;
        /**
         * 验证字段为数字
         * @param error 错误提示文字
         */
        numeric(error?: ErrorInfo): Rule;
        /**
         * 自定义验证
         * @param validate 自定义验证的方法
         * @param error 错误提示文字
         */
        custom(validate: (value: any) => boolean | Promise<boolean>, error?: ErrorInfo): Rule;
    };
}
