import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFormikContext } from "formik";
import { Dropdown } from "react-native-element-dropdown";
import type { DropdownFieldSchema, FormValues } from "../../types/form.types";

export const DropdownField: React.FC<{ field: DropdownFieldSchema }> = ({ field }) => {
  const { values, errors, touched, submitCount, setFieldValue, handleBlur } = useFormikContext<FormValues>();
  const options = field.options ?? [];
  const labelField = field.optionLabelField ?? "label";
  const valueField = field.optionValueField ?? "value";
  const currentValue = values[field.name] ?? null;
  const shouldShowError = Boolean((touched as FormValues)[field.name] || submitCount > 0);
  const errorMessage = shouldShowError ? (errors as FormValues)[field.name] : undefined;

  return (
    <View style={[styles.container, field.containerStyle]}>
      <Text style={[styles.label, field.labelStyle]}>{field.label}</Text>
      <Dropdown
        data={options}
        labelField={labelField}
        valueField={valueField}
        value={currentValue}
        placeholder={field.placeholder ?? `Select ${field.label}`}
        search={field.searchable}
        style={[styles.dropdown, Boolean(errorMessage) && styles.dropdownError, field.dropdownStyle]}
        placeholderStyle={[styles.placeholderText, field.placeholderStyle]}
        selectedTextStyle={[styles.selectedText, field.selectedTextStyle]}
        itemContainerStyle={field.itemContainerStyle}
        itemTextStyle={field.itemTextStyle}
        onChange={(item) => setFieldValue(field.name, item[valueField])}
        onBlur={() => handleBlur(field.name)}
        {...field.dropdownProps}
      />
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
