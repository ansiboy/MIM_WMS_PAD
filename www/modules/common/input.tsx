import React = require("react");

interface TextInputProps {
    className?: string,
    name?: string,
    placeholder?: string,
    style?: React.CSSProperties,
    value?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
}

/**
 * 实现扫描提交
 */
 class ScanInput extends React.Component<TextInputProps, any>{
    // private valueStack: string[] = []
    private element: HTMLInputElement
    private value: string;

    static NullValue = 'N/A'

    constructor(props) {
        super(props)
        this.value = this.props.value
    }
    private findForm(): HTMLFormElement {
        let p = this.element.parentElement
        while (p) {
            if (p.tagName.toUpperCase() == 'FORM') {
                return p as HTMLFormElement;
            }
        }
        return null
    }
    render() {
        let { style, name, placeholder, onChange } = this.props
        return <input name={name} style={style} placeholder={placeholder}
            value={this.value} ref={e => this.element = e || this.element}
            onChange={e => {
                if (onchange)
                    onChange(e)
            }}
            onKeyDown={(e) => {
                this.value = (e.target as HTMLInputElement).value
                const KEYCODE_ENTER = 13;
                if (e.keyCode == KEYCODE_ENTER) {
                    let scanText: string
                    if (!this.value) {
                        scanText = this.element.value
                    }
                    else {
                        if (this.element.value.startsWith(this.value)) {
                            scanText = this.element.value.substr(this.value.length)
                        }
                        else if (this.element.value.endsWith(this.value)) {
                            let len = this.element.value.length - this.value.length
                            scanText = this.element.value.substr(0, len)
                        }
                        else {
                            scanText = ScanInput.NullValue
                        }
                    }
                    let form = this.findForm()
                    if (form) {
                        if (form['BarCode']) {
                            form['BarCode'].value = scanText
                        }
                        form.submit()
                    }
                }
            }} />
    }
}

export interface NumberInputProps {
    className?: string,
    name?: string,
    placeholder?: string,
    style?: React.CSSProperties,
    value?: number,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
}
export class NumberInput extends React.Component<NumberInputProps, any> {
    render() {
        let { className, style, name, placeholder, value, onChange } = this.props
        let valueString = value == null ? '' : `${value}`
        return <ScanInput {...{ className, name, placeholder, style, value: valueString, onChange }} />
    }
}

