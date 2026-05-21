"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioField = void 0;
const react_1 = __importDefault(require("react"));
const formik_1 = require("formik");
const react_native_1 = require("react-native");
const RadioField = ({ field }) => {
    const { values, errors, touched, submitCount, setFieldValue, setFieldTouched } = (0, formik_1.useFormikContext)();
    const options = field.options ?? [];
    const labelField = field.optionLabelField ?? "label";
    const valueField = field.optionValueField ?? "value";
    const selectedValue = values[field.name];
    const shouldShowError = Boolean(touched[field.name] || submitCount > 0);
    const errorMessage = shouldShowError ? errors[field.name] : undefined;
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, field.containerStyle] },
        react_1.default.createElement(react_native_1.Text, { style: [styles.label, field.labelStyle] }, field.label),
        options.map((option, index) => {
            const optionValue = option[valueField];
            const optionLabel = option[labelField];
            const isSelected = selectedValue === optionValue;
            return (react_1.default.createElement(react_native_1.TouchableOpacity, { key: `${String(optionValue)}-${index}`, style: [styles.optionContainer, field.optionContainerStyle], activeOpacity: 0.8, onPress: () => {
                    setFieldValue(field.name, optionValue);
                    setFieldTouched(field.name, true, false);
                } },
                react_1.default.createElement(react_native_1.View, { style: [styles.radioOuter, isSelected && styles.radioOuterSelected, field.radioOuterStyle] }, isSelected && react_1.default.createElement(react_native_1.View, { style: [styles.radioInner, field.radioInnerStyle] })),
                react_1.default.createElement(react_native_1.Text, { style: [styles.optionText, isSelected && styles.selectedOptionText, field.optionTextStyle, isSelected && field.selectedOptionTextStyle] }, String(optionLabel))));
        }),
        Boolean(errorMessage) && (react_1.default.createElement(react_native_1.Text, { style: [styles.errorText, field.errorTextStyle] }, String(errorMessage)))));
};
exports.RadioField = RadioField;
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
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#9ca3af",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    radioOuterSelected: {
        borderColor: "#2563eb",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#2563eb",
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
