"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxField = void 0;
const react_1 = __importDefault(require("react"));
const formik_1 = require("formik");
const react_native_1 = require("react-native");
const normalizeToArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
};
const CheckboxField = ({ field }) => {
    const { values, errors, touched, submitCount, setFieldValue, setFieldTouched } = (0, formik_1.useFormikContext)();
    const options = field.options ?? [];
    const labelField = field.optionLabelField ?? "label";
    const valueField = field.optionValueField ?? "value";
    const selectedValues = normalizeToArray(values[field.name]);
    const shouldShowError = Boolean(touched[field.name] || submitCount > 0);
    const errorMessage = shouldShowError ? errors[field.name] : undefined;
    const toggleOption = (optionValue) => {
        const exists = selectedValues.includes(optionValue);
        const nextValues = exists
            ? selectedValues.filter((value) => value !== optionValue)
            : [...selectedValues, optionValue];
        setFieldValue(field.name, nextValues);
        setFieldTouched(field.name, true, false);
    };
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, field.containerStyle] },
        react_1.default.createElement(react_native_1.Text, { style: [styles.label, field.labelStyle] }, field.label),
        options.map((option, index) => {
            const optionValue = option[valueField];
            const optionLabel = option[labelField];
            const isSelected = selectedValues.includes(optionValue);
            return (react_1.default.createElement(react_native_1.TouchableOpacity, { key: `${String(optionValue)}-${index}`, style: [styles.optionContainer, field.optionContainerStyle], activeOpacity: 0.8, onPress: () => toggleOption(optionValue) },
                react_1.default.createElement(react_native_1.View, { style: [styles.checkbox, isSelected && styles.checkboxSelected, field.checkboxStyle] }, isSelected && (react_1.default.createElement(react_native_1.Text, { style: [styles.checkmark, field.checkmarkStyle] }, "\u2713"))),
                react_1.default.createElement(react_native_1.Text, { style: [styles.optionText, isSelected && styles.selectedOptionText, field.optionTextStyle, isSelected && field.selectedOptionTextStyle] }, String(optionLabel))));
        }),
        Boolean(errorMessage) && (react_1.default.createElement(react_native_1.Text, { style: [styles.errorText, field.errorTextStyle] }, String(errorMessage)))));
};
exports.CheckboxField = CheckboxField;
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
    optionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "#9ca3af",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        backgroundColor: "#ffffff",
    },
    checkboxSelected: {
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
    },
    checkmark: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 14,
    },
    optionText: {
        fontSize: 14,
        color: "#111827",
    },
    selectedOptionText: {
        color: "#1d4ed8",
        fontWeight: "600",
    },
    errorText: {
        marginTop: 6,
        fontSize: 12,
        color: "#dc2626",
    },
});
