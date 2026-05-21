# rn-dynamic-form-builder

Dynamic form builder for React Native using Formik.

## Features

- Schema-driven rendering
- Built-in text field variants
- Basic validation support (required, email, regex)
- `phone_with_code` support via `react-native-country-codes-picker`
- Project-level style overrides for text fields and country picker

## Install

```bash
npm i rn-dynamic-form-builder
```

Install peer dependencies in your app:

```bash
npm i react react-native formik
```

`react-native-country-codes-picker` is already a library dependency of this package.

## Exports

```ts
import { FormBuilder } from "rn-dynamic-form-builder";
import type {
  FieldSchema,
  FormValues,
  TextFieldSchema,
  TextFieldType,
  CountryCodeOption,
} from "rn-dynamic-form-builder";
```

## Quick Start

```tsx
import React from "react";
import { SafeAreaView } from "react-native";
import { FormBuilder } from "rn-dynamic-form-builder";
import type { FieldSchema, FormValues } from "rn-dynamic-form-builder";

const schema: FieldSchema[] = [
  {
    type: "text",
    name: "fullName",
    label: "Full Name",
    textFieldType: "text",
    required: true,
  },
  {
    type: "text",
    name: "email",
    label: "Email",
    textFieldType: "email",
    required: true,
  },
  {
    type: "text",
    name: "phone",
    label: "Phone",
    textFieldType: "phone_with_code",
    countryCodeFieldName: "phoneCode",
    defaultCountryCode: "+91",
  },
  {
    type: "dropdown",
    name: "role",
    label: "Role",
    options: [
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
    ],
  },
];

const initialValues: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  phoneCode: "+91",
  role: "",
};

export default function App() {
  return (
    <SafeAreaView>
      <FormBuilder
        schema={schema}
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log("submitted", values);
        }}
      />
    </SafeAreaView>
  );
}
```

## Schema

### Field Types

```ts
type FieldType = "text" | "dropdown";
```

### Text Field Types

```ts
type TextFieldType =
  | "text"
  | "email"
  | "phone"
  | "phone_with_code"
  | "password"
  | "number"
  | "decimal"
  | "otp"
  | "url"
  | "search"
  | "multiline"
  | "masked"
  | "custom";
```

## Text Field API

`TextFieldSchema` supports:

- `name`, `label`, `type: "text"`, `required`
- `textFieldType`
- `placeholder`
- `textInputProps` (passes to React Native `TextInput`)
- `requiredMessage`
- `emailRegex`
- `emailValidationMessage`
- `validationRegex`
- `validationMessage`
- `containerStyle`
- `labelStyle`
- `inputStyle`
- `errorTextStyle`

### `phone_with_code` props

- `countryCodes?: { code: string; label: string; dialCode: string }[]`
- `defaultCountryCode?: string` (example: `"+91"`)
- `countryCodeFieldName?: string` (Formik key where selected dial code is stored)

Style overrides:

- `phoneWithCodeContainerStyle`
- `countryCodeButtonStyle`
- `countryCodeTextStyle`
- `countryCodeDropdownStyle`
- `countryCodeItemStyle`
- `countryCodeItemTextStyle`
- `countryCodePickerStyle` (direct style object for `react-native-country-codes-picker`)

## Validation Behavior

Validation is automatic for `text` fields and runs through Formik `validate`.

- Required:
- If `required: true` and value is empty/whitespace, error is shown.
- Default message: `"<Label> is required"`
- Override with `requiredMessage`

- Email:
- Applied when `textFieldType === "email"`
- Default regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Override regex with `emailRegex`
- Override message with `emailValidationMessage`

- Custom regex:
- If `validationRegex` exists and fails, shows `validationMessage`
- Default message: `"Invalid value"`

Error text is displayed when field is touched or after submit.

## Example: Custom Validation + Styles

```ts
const schema: FieldSchema[] = [
  {
    type: "text",
    name: "email",
    label: "Work Email",
    textFieldType: "email",
    required: true,
    requiredMessage: "Email is required",
    emailValidationMessage: "Please enter a valid work email",
    emailRegex: /^[^\s@]+@mycompany\.com$/,
    inputStyle: {
      borderColor: "#1d4ed8",
      backgroundColor: "#eff6ff",
    },
    errorTextStyle: {
      color: "#b91c1c",
      fontSize: 13,
    },
  },
  {
    type: "text",
    name: "phone",
    label: "Phone",
    textFieldType: "phone_with_code",
    countryCodeFieldName: "phoneCode",
    defaultCountryCode: "+1",
    countryCodes: [
      { code: "US", label: "United States", dialCode: "+1" },
      { code: "IN", label: "India", dialCode: "+91" },
      { code: "GB", label: "United Kingdom", dialCode: "+44" },
    ],
    countryCodeButtonStyle: {
      borderColor: "#94a3b8",
    },
    countryCodePickerStyle: {
      modal: { borderRadius: 14, height: 500 },
      countryButtonStyles: { paddingVertical: 14 },
      countryName: { fontSize: 15 },
      dialCode: { fontSize: 15 },
    },
    validationRegex: /^[0-9]{10}$/,
    validationMessage: "Phone must be exactly 10 digits",
  },
];
```

## Current Notes

- `FormBuilder` currently renders:
- `text`
- `dropdown`

## Development

```bash
npm run build
npm run watch
```
