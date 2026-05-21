"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextField = void 0;
const react_1 = __importDefault(require("react"));
const formik_1 = require("formik");
const react_native_1 = require("react-native");
const react_native_country_codes_picker_1 = require("react-native-country-codes-picker");
const keyboardTypeByFieldType = {
    email: "email-address",
    phone: "phone-pad",
    phone_with_code: "phone-pad",
    number: "numeric",
    decimal: "decimal-pad",
    otp: "number-pad",
    url: "url",
    search: "web-search",
};
const splitInputStyle = (style) => {
    if (!style)
        return { containerStyle: {}, textStyle: {} };
    const flat = react_native_1.StyleSheet.flatten(style);
    const containerKeys = [
        "borderColor",
        "borderWidth",
        "borderRadius",
        "borderStyle",
        "backgroundColor",
        "margin",
        "marginBottom",
        "marginTop",
        "marginLeft",
        "marginRight",
        "marginVertical",
        "marginHorizontal",
        "shadowColor",
        "shadowOffset",
        "shadowOpacity",
        "shadowRadius",
        "elevation",
    ];
    const containerStyle = {};
    const textStyle = {};
    Object.keys(flat).forEach((key) => {
        if (containerKeys.includes(key)) {
            containerStyle[key] = flat[key];
        }
        else {
            textStyle[key] = flat[key];
        }
    });
    return { containerStyle, textStyle };
};
const TextField = ({ field }) => {
    const { values, errors, touched, handleChange, handleBlur, submitCount, setFieldValue } = (0, formik_1.useFormikContext)();
    const fieldType = field.textFieldType ?? "text";
    const value = values[field.name] ?? "";
    const shouldUseMultiline = fieldType === "multiline";
    const isPhoneWithCode = fieldType === "phone_with_code";
    const isPasswordField = fieldType === "password";
    const shouldShowError = Boolean(touched[field.name] || submitCount > 0);
    const errorMessage = shouldShowError ? errors[field.name] : undefined;
    const showOnlyCodes = field.countryCodes?.map((item) => item.code) ?? [];
    const [isPasswordVisible, setIsPasswordVisible] = react_1.default.useState(false);
    const getDefaultDialCode = react_1.default.useCallback(() => {
        if (field.defaultCountryCode) {
            return field.defaultCountryCode;
        }
        return "+1";
    }, [field.defaultCountryCode]);
    const initialDialCodeFromFormik = field.countryCodeFieldName ? String(values[field.countryCodeFieldName] ?? "") : "";
    const [selectedDialCode, setSelectedDialCode] = react_1.default.useState(initialDialCodeFromFormik || getDefaultDialCode());
    const [isCountryPickerVisible, setCountryPickerVisible] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        if (!field.countryCodeFieldName) {
            return;
        }
        const formikDialCode = String(values[field.countryCodeFieldName] ?? "");
        if (!formikDialCode) {
            setFieldValue(field.countryCodeFieldName, selectedDialCode);
            return;
        }
        if (formikDialCode !== selectedDialCode) {
            setSelectedDialCode(formikDialCode);
        }
    }, [field.countryCodeFieldName, selectedDialCode, setFieldValue, values]);
    const handleCountrySelect = (dialCode) => {
        setSelectedDialCode(dialCode);
        setCountryPickerVisible(false);
        if (field.countryCodeFieldName) {
            setFieldValue(field.countryCodeFieldName, dialCode);
        }
    };
    const { containerStyle: customContainerStyle, textStyle: customTextStyle } = react_1.default.useMemo(() => splitInputStyle(field.inputStyle), [field.inputStyle]);
    const inputProps = {
        style: isPasswordField
            ? []
            : [
                styles.input,
                shouldUseMultiline && styles.multilineInput,
                Boolean(errorMessage) && styles.inputError,
                field.inputStyle,
            ],
        value: String(value),
        onChangeText: handleChange(field.name),
        onBlur: handleBlur(field.name),
        placeholder: field.placeholder,
        keyboardType: field.textInputProps?.keyboardType ?? keyboardTypeByFieldType[fieldType] ?? "default",
        secureTextEntry: field.textInputProps?.secureTextEntry ?? (isPasswordField ? !isPasswordVisible : false),
        multiline: field.textInputProps?.multiline ?? shouldUseMultiline,
        numberOfLines: field.textInputProps?.numberOfLines ?? (shouldUseMultiline ? 4 : 1),
        autoCapitalize: field.textInputProps?.autoCapitalize ?? (fieldType === "email" || fieldType === "password" || fieldType === "url" ? "none" : "sentences"),
        autoCorrect: field.textInputProps?.autoCorrect ?? fieldType !== "email",
        autoComplete: field.textInputProps?.autoComplete ?? (fieldType === "email" ? "email" : fieldType === "password" ? "password" : fieldType === "phone" || fieldType === "phone_with_code" ? "tel" : fieldType === "otp" ? "one-time-code" : "off"),
        ...field.textInputProps,
    };
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, field.containerStyle] },
        react_1.default.createElement(react_native_1.Text, { style: [styles.label, field.labelStyle] }, field.label),
        isPhoneWithCode ? (react_1.default.createElement(react_native_1.View, { style: [styles.phoneRow, field.phoneWithCodeContainerStyle] },
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.countryCodeButton, Boolean(errorMessage) && styles.inputError, field.countryCodeButtonStyle], activeOpacity: 0.8, onPress: () => setCountryPickerVisible(true) },
                react_1.default.createElement(react_native_1.Text, { style: [styles.countryCodeText, field.countryCodeTextStyle] }, selectedDialCode),
                react_1.default.createElement(react_native_1.Text, { style: styles.countryCodeChevron }, "\u25BC")),
            react_1.default.createElement(react_native_1.TextInput, { ...inputProps, style: [styles.phoneInput, inputProps.style] }))) : isPasswordField ? (react_1.default.createElement(react_native_1.View, { style: [
                styles.passwordRow,
                Boolean(errorMessage) && styles.inputError,
                customContainerStyle,
            ] },
            react_1.default.createElement(react_native_1.TextInput, { ...inputProps, style: [styles.passwordInput, customTextStyle] }),
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.eyeButton, field.passwordVisibilityButtonStyle], onPress: () => setIsPasswordVisible(!isPasswordVisible), activeOpacity: 0.7 }, field.renderEyeIcon ? (field.renderEyeIcon(isPasswordVisible)) : (react_1.default.createElement(react_native_1.Text, { style: [styles.eyeText, field.passwordVisibilityTextStyle] }, isPasswordVisible ? "👁️" : "🙈"))))) : (react_1.default.createElement(react_native_1.TextInput, { ...inputProps })),
        Boolean(errorMessage) && (react_1.default.createElement(react_native_1.Text, { style: [styles.errorText, field.errorTextStyle] }, String(errorMessage))),
        react_1.default.createElement(react_native_country_codes_picker_1.CountryPicker, { show: isCountryPickerVisible, lang: "en", showOnly: showOnlyCodes.length > 0 ? showOnlyCodes : undefined, initialState: selectedDialCode, pickerButtonOnPress: (item) => handleCountrySelect(item.dial_code), onBackdropPress: () => setCountryPickerVisible(false), style: {
                modal: {
                    ...styles.dropdownCard,
                    ...react_native_1.StyleSheet.flatten(field.countryCodeDropdownStyle),
                    ...(field.countryCodePickerStyle?.modal ?? {}),
                },
                countryButtonStyles: {
                    ...styles.countryCodeItem,
                    ...react_native_1.StyleSheet.flatten(field.countryCodeItemStyle),
                    ...(field.countryCodePickerStyle?.countryButtonStyles ?? {}),
                },
                countryName: {
                    ...styles.countryCodeItemText,
                    ...react_native_1.StyleSheet.flatten(field.countryCodeItemTextStyle),
                    ...(field.countryCodePickerStyle?.countryName ?? {}),
                },
                dialCode: {
                    ...styles.countryCodeItemText,
                    ...react_native_1.StyleSheet.flatten(field.countryCodeItemTextStyle),
                    ...(field.countryCodePickerStyle?.dialCode ?? {}),
                },
                ...(field.countryCodePickerStyle ?? {}),
            } })));
};
exports.TextField = TextField;
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
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: "#111827",
        backgroundColor: "#ffffff",
    },
    phoneRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    countryCodeButton: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
        minWidth: 88,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
    },
    countryCodeText: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "500",
    },
    countryCodeChevron: {
        color: "#6b7280",
        fontSize: 10,
        marginLeft: 8,
    },
    phoneInput: {
        flex: 1,
    },
    multilineInput: {
        minHeight: 96,
        textAlignVertical: "top",
    },
    inputError: {
        borderColor: "#dc2626",
    },
    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        backgroundColor: "#ffffff",
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: "#111827",
    },
    eyeButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    eyeText: {
        fontSize: 16,
    },
    errorText: {
        marginTop: 6,
        fontSize: 12,
        color: "#dc2626",
    },
    dropdownCard: {
        height: 520,
        borderRadius: 10,
        backgroundColor: "#ffffff",
    },
    countryCodeItem: {
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    countryCodeItemText: {
        fontSize: 14,
        color: "#111827",
    },
});
