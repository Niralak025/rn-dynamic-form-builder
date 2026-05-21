import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";
export type FieldType = "text" | "dropdown" | "radio" | "checkbox";
export type TextFieldType = "text" | "email" | "phone" | "phone_with_code" | "password" | "number" | "decimal" | "otp" | "url" | "search" | "multiline" | "masked" | "custom";
export interface CountryCodeOption {
    code: string;
    label: string;
    dialCode: string;
}
export interface CountryCodePickerStyle {
    backdrop?: ViewStyle;
    modal?: ViewStyle;
    line?: ViewStyle;
    searchMessageText?: TextStyle;
    itemsList?: ViewStyle;
    modalInner?: ViewStyle;
    countryMessageContainer?: ViewStyle;
    textInput?: TextStyle;
    countryButtonStyles?: ViewStyle;
    flag?: TextStyle;
    dialCode?: TextStyle;
    countryName?: TextStyle;
}
export interface BaseFieldSchema {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    requiredMessage?: string;
}
export interface TextFieldSchema extends BaseFieldSchema {
    type: "text";
    textFieldType?: TextFieldType;
    placeholder?: string;
    emailRegex?: RegExp;
    emailValidationMessage?: string;
    validationRegex?: RegExp;
    validationMessage?: string;
    textInputProps?: TextInputProps;
    containerStyle?: StyleProp<ViewStyle>;
    phoneWithCodeContainerStyle?: StyleProp<ViewStyle>;
    countryCodeButtonStyle?: StyleProp<ViewStyle>;
    countryCodeTextStyle?: StyleProp<TextStyle>;
    countryCodeDropdownStyle?: StyleProp<ViewStyle>;
    countryCodeItemStyle?: StyleProp<ViewStyle>;
    countryCodeItemTextStyle?: StyleProp<TextStyle>;
    countryCodePickerStyle?: CountryCodePickerStyle;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
    countryCodes?: CountryCodeOption[];
    defaultCountryCode?: string;
    countryCodeFieldName?: string;
    passwordVisibilityButtonStyle?: StyleProp<ViewStyle>;
    passwordVisibilityTextStyle?: StyleProp<TextStyle>;
    renderEyeIcon?: (visible: boolean) => React.ReactNode;
}
export interface DropdownOption {
    label: string;
    value: string | number;
    [key: string]: any;
}
export interface DropdownFieldSchema extends BaseFieldSchema {
    type: "dropdown";
    options?: DropdownOption[];
    placeholder?: string;
    searchable?: boolean;
    optionLabelField?: string;
    optionValueField?: string;
    dropdownProps?: Record<string, any>;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    dropdownStyle?: StyleProp<ViewStyle>;
    placeholderStyle?: StyleProp<TextStyle>;
    selectedTextStyle?: StyleProp<TextStyle>;
    itemContainerStyle?: StyleProp<ViewStyle>;
    itemTextStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
}
export interface RadioFieldSchema extends BaseFieldSchema {
    type: "radio";
    options?: DropdownOption[];
    optionLabelField?: string;
    optionValueField?: string;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    optionContainerStyle?: StyleProp<ViewStyle>;
    optionTextStyle?: StyleProp<TextStyle>;
    selectedOptionTextStyle?: StyleProp<TextStyle>;
    radioOuterStyle?: StyleProp<ViewStyle>;
    radioInnerStyle?: StyleProp<ViewStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
}
export interface CheckboxFieldSchema extends BaseFieldSchema {
    type: "checkbox";
    options?: DropdownOption[];
    optionLabelField?: string;
    optionValueField?: string;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    optionContainerStyle?: StyleProp<ViewStyle>;
    optionTextStyle?: StyleProp<TextStyle>;
    selectedOptionTextStyle?: StyleProp<TextStyle>;
    checkboxStyle?: StyleProp<ViewStyle>;
    checkmarkStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
}
export type FieldSchema = TextFieldSchema | DropdownFieldSchema | RadioFieldSchema | CheckboxFieldSchema;
import type React from "react";
import type { FormikProps } from "formik";
export type FormValues = Record<string, any>;
export interface FormBuilderProps {
    schema: FieldSchema[];
    initialValues: FormValues;
    onSubmit: (values: FormValues) => void;
    showSubmitButton?: boolean;
    children?: React.ReactNode | ((formikProps: FormikProps<FormValues>) => React.ReactNode);
}
