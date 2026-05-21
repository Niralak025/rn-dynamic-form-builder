import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { FormValues, RadioFieldSchema } from "../../types/form.types";

export const RadioField: React.FC<{ field: RadioFieldSchema }> = ({ field }) => {
  const { values, errors, touched, submitCount, setFieldValue, setFieldTouched } = useFormikContext<FormValues>();
  const options = field.options ?? [];
  const labelField = field.optionLabelField ?? "label";
  const valueField = field.optionValueField ?? "value";
  const selectedValue = values[field.name];
  const shouldShowError = Boolean((touched as FormValues)[field.name] || submitCount > 0);
  const errorMessage = shouldShowError ? (errors as FormValues)[field.name] : undefined;

  return (
    <View style={[styles.container, field.containerStyle]}>
      <Text style={[styles.label, field.labelStyle]}>{field.label}</Text>

      {options.map((option, index) => {
        const optionValue = option[valueField];
        const optionLabel = option[labelField];
        const isSelected = selectedValue === optionValue;

        return (
          <TouchableOpacity
            key={`${String(optionValue)}-${index}`}
            style={[styles.optionContainer, field.optionContainerStyle]}
            activeOpacity={0.8}
            onPress={() => {
              setFieldValue(field.name, optionValue);
              setFieldTouched(field.name, true, false);
            }}
          >
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected, field.radioOuterStyle]}>
              {isSelected && <View style={[styles.radioInner, field.radioInnerStyle]} />}
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
