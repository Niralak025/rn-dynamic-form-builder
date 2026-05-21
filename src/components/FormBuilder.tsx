import React from "react";
import { View, Button } from "react-native";
import { Formik, FormikProps } from "formik";
import { TextField } from "./fields/TextField";
import { DropdownField } from "./fields/DropdownField";
import { RadioField } from "./fields/RadioField";
import { CheckboxField } from "./fields/CheckboxField";
import type { FormBuilderProps, FormValues } from "../types/form.types";

const DEFAULT_EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (value: unknown, field: Extract<FormBuilderProps["schema"][number], { type: "text" }>): string | undefined => {
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

const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  return false;
};

const isEmptySelection = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return isEmptyValue(value);
};

const validateForm = (schema: FormBuilderProps["schema"]) => (values: FormValues) => {
  const errors: FormValues = {};

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

export const FormBuilder = React.forwardRef<FormikProps<any>, FormBuilderProps>(
  ({ schema, initialValues, onSubmit, showSubmitButton = true, children }, ref) => {
    return (
      <Formik
        innerRef={ref}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validateForm(schema)}
      >
        {(formikProps) => {
          const { handleSubmit } = formikProps;
          return (
            <View>
              {schema.map((field) => {
                switch (field.type) {
                  case "text":
                    return <TextField key={field.name} field={field} />;
                  case "dropdown":
                    return <DropdownField key={field.name} field={field} />;
                  case "radio":
                    return <RadioField key={field.name} field={field} />;
                  case "checkbox":
                    return <CheckboxField key={field.name} field={field} />;
                  default:
                    return null;
                }
              })}

              {typeof children === "function" ? children(formikProps) : children}

              {showSubmitButton && !children && (
                <Button title="Submit" onPress={() => handleSubmit()} />
              )}
            </View>
          );
        }}
      </Formik>
    );
  }
);

