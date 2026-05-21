import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { FormValues, CheckboxFieldSchema } from "../../types/form.types";

const normalizeToArray = (value: unknown): Array<string | number> => {
  if (Array.isArray(value)) {
    return value as Array<string | number>;
  }
  return [];
};

export const CheckboxField: React.FC<{ field: CheckboxFieldSchema }> = ({ field }) => {
  const { values, errors, touched, submitCount, setFieldValue, setFieldTouched } = useFormikContext<FormValues>();
  const options = field.options ?? [];
  const labelField = field.optionLabelField ?? "label";
  const valueField = field.optionValueField ?? "value";
  const selectedValues = normalizeToArray(values[field.name]);
  const shouldShowError = Boolean((touched as FormValues)[field.name] || submitCount > 0);
  const errorMessage = shouldShowError ? (errors as FormValues)[field.name] : undefined;

  const toggleOption = (optionValue: string | number) => {
    const exists = selectedValues.includes(optionValue);
    const nextValues = exists
      ? selectedValues.filter((value) => value !== optionValue)
      : [...selectedValues, optionValue];

    setFieldValue(field.name, nextValues);
    setFieldTouched(field.name, true, false);
  };

  return (
    <View style={[styles.container, field.containerStyle]}>
      <Text style={[styles.label, field.labelStyle]}>{field.label}</Text>

      {options.map((option, index) => {
        const optionValue = option[valueField] as string | number;
        const optionLabel = option[labelField];
        const isSelected = selectedValues.includes(optionValue);

        return (
          <TouchableOpacity
            key={`${String(optionValue)}-${index}`}
            style={[styles.optionContainer, field.optionContainerStyle]}
            activeOpacity={0.8}
            onPress={() => toggleOption(optionValue)}
          >
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected, field.checkboxStyle]}>
              {isSelected && (
                <Text style={[styles.checkmark, field.checkmarkStyle]}>✓</Text>
              )}
            </View>
            <Text style={[styles.optionText, isSelected && styles.selectedOptionText, field.optionTextStyle, isSelected && field.selectedOptionTextStyle]}>
              {String(optionLabel)}
            </Text>
          </TouchableOpacity>
        );
      })}

      {Boolean(errorMessage) && (
        <Text style={[styles.errorText, field.errorTextStyle]}>{String(errorMessage)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
