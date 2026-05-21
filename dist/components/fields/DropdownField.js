"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownField = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const formik_1 = require("formik");
const react_native_element_dropdown_1 = require("react-native-element-dropdown");
const DropdownField = ({ field }) => {
    const { values, errors, touched, submitCount, setFieldValue, handleBlur } = (0, formik_1.useFormikContext)();
    const options = field.options ?? [];
    const labelField = field.optionLabelField ?? "label";
    const valueField = field.optionValueField ?? "value";
    const currentValue = values[field.name] ?? null;
    const shouldShowError = Boolean(touched[field.name] || submitCount > 0);
    const errorMessage = shouldShowError ? errors[field.name] : undefined;
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, field.containerStyle] },
        react_1.default.createElement(react_native_1.Text, { style: [styles.label, field.labelStyle] }, field.label),
        react_1.default.createElement(react_native_element_dropdown_1.Dropdown, { data: options, labelField: labelField, valueField: valueField, value: currentValue, placeholder: field.placeholder ?? `Select ${field.label}`, search: field.searchable, style: [styles.dropdown, Boolean(errorMessage) && styles.dropdownError, field.dropdownStyle], placeholderStyle: [styles.placeholderText, field.placeholderStyle], selectedTextStyle: [styles.selectedText, field.selectedTextStyle], itemContainerStyle: field.itemContainerStyle, itemTextStyle: field.itemTextStyle, onChange: (item) => setFieldValue(field.name, item[valueField]), onBlur: () => handleBlur(field.name), ...field.dropdownProps }),
        Boolean(errorMessage) && (react_1.default.createElement(react_native_1.Text, { style: [styles.errorText, field.errorTextStyle] }, String(errorMessage)))));
};
exports.DropdownField = DropdownField;
const styles = react_native_1.StyleSheet.create({
    container: {
        marginBottom: 14,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "600",
        color: "#1f2937",
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 12,
        minHeight: 44,
        backgroundColor: "#ffffff",
    },
    placeholderText: {
        color: "#9ca3af",
        fontSize: 14,
    },
    selectedText: {
        color: "#111827",
        fontSize: 14,
    },
    dropdownError: {
        borderColor: "#dc2626",
    },
    errorText: {
        marginTop: 6,
        fontSize: 12,
        color: "#dc2626",
    },
});
