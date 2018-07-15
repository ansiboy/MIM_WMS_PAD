define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 实现扫描提交
     */
    class ScanInput extends React.Component {
        constructor(props) {
            super(props);
            this.value = this.props.value;
        }
        findForm() {
            let p = this.element.parentElement;
            while (p) {
                if (p.tagName.toUpperCase() == 'FORM') {
                    return p;
                }
            }
            return null;
        }
        render() {
            let { style, name, placeholder, onChange } = this.props;
            return React.createElement("input", { name: name, style: style, placeholder: placeholder, value: this.value, ref: e => this.element = e || this.element, onChange: e => {
                    if (onchange)
                        onChange(e);
                }, onKeyDown: (e) => {
                    this.value = e.target.value;
                    const KEYCODE_ENTER = 13;
                    if (e.keyCode == KEYCODE_ENTER) {
                        let scanText;
                        if (!this.value) {
                            scanText = this.element.value;
                        }
                        else {
                            if (this.element.value.startsWith(this.value)) {
                                scanText = this.element.value.substr(this.value.length);
                            }
                            else if (this.element.value.endsWith(this.value)) {
                                let len = this.element.value.length - this.value.length;
                                scanText = this.element.value.substr(0, len);
                            }
                            else {
                                scanText = ScanInput.NullValue;
                            }
                        }
                        let form = this.findForm();
                        if (form) {
                            if (form['BarCode']) {
                                form['BarCode'].value = scanText;
                            }
                            form.submit();
                        }
                    }
                } });
        }
    }
    ScanInput.NullValue = 'N/A';
    class NumberInput extends React.Component {
        render() {
            let { className, style, name, placeholder, value, onChange } = this.props;
            let valueString = value == null ? '' : `${value}`;
            return React.createElement(ScanInput, Object.assign({}, { className, name, placeholder, style, value: valueString, onChange }));
        }
    }
    exports.NumberInput = NumberInput;
});
