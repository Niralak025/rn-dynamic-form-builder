"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormBuilder = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const formik_1 = require("formik");
const TextField_1 = require("./fields/TextField");
const DropdownField_1 = require("./fields/DropdownField");
const RadioField_1 = require("./fields/RadioField");
const CheckboxField_1 = require("./fields/CheckboxField");
const DEFAULT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateField = (value, field) => {
    const raw = value ?? "";
    const normalizedValue = String(raw).trim();
    if (field.required && normalizedValue.length === 0) {
        return field.requiredMessage ?? `${field.label} is required`;
    }
    if (normalizedValue.length === 0) {
        return undefined;
    }
    if (field.textFieldType === "email") {
        const emailRegex = field.emailRegex ?? DEFAULT_EMAIL_REGEX;
        if (!emailRegex.test(normalizedValue)) {
            return field.emailValidationMessage ?? "Please enter a valid email address";
        }
    }
    if (field.validationRegex && !field.validationRegex.test(normalizedValue)) {
        return field.validationMessage ?? "Invalid value";
    }
    return undefined;
};
const isEmptyValue = (value) => {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === "string") {
        return value.trim().length === 0;
    }
    return false;
};
const isEmptySelection = (value) => {
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    return isEmptyValue(value);
};
const validateForm = (schema) => (values) => {
    const errors = {};
    schema.forEach((field) => {
        if (field.type === "text") {
            const error = validateField(values[field.name], field);
            if (error) {
                errors[field.name] = error;
            }
            return;
        }
        if (field.type === "dropdown" && field.required && isEmptyValue(values[field.name])) {
            errors[field.name] = field.requiredMessage ?? `${field.label} is required`;
            return;
        }
        if (field.type === "radio" && field.required && isEmptyValue(values[field.name])) {
            errors[field.name] = field.requiredMessage ?? `${field.label} is required`;
            return;
        }
        if (field.type === "checkbox" && field.required && isEmptySelection(values[field.name])) {
            errors[field.name] = field.requiredMessage ?? `${field.label} is required`;
            return;
        }
    });
    return errors;
};
exports.FormBuilder = react_1.default.forwardRef(({ schema, initialValues, onSubmit, showSubmitButton = true, children }, ref) => {
    return (react_1.default.createElement(formik_1.Formik, { innerRef: ref, initialValues: initialValues, onSubmit: onSubmit, validate: validateForm(schema) }, (formikProps) => {
        const { handleSubmit } = formikProps;
        return (react_1.default.createElement(react_native_1.View, null,
            schema.map((field) => {
                switch (field.type) {
                    case "text":
                        return react_1.default.createElement(TextField_1.TextField, { key: field.name, field: field });
                    case "dropdown":
                        return react_1.default.createElement(DropdownField_1.DropdownField, { key: field.name, field: field });
                    case "radio":
                        return react_1.default.createElement(RadioField_1.RadioField, { key: field.name, field: field });
                    case "checkbox":
                        return react_1.default.createElement(CheckboxField_1.CheckboxField, { key: field.name, field: field });
                    default:
                        return null;
                }
            }),
            typeof children === "function" ? children(formikProps) : children,
            showSubmitButton && !children && (react_1.default.createElement(react_native_1.Button, { title: "Submit", onPress: () => handleSubmit() }))));
    }));
});
