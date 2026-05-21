import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, TextInput, Text, TouchableOpacity, View } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import type { CountryPickerItem } from "react-native-country-codes-picker";
import type { FormValues, TextFieldSchema, TextFieldType } from "../../types/form.types";

const keyboardTypeByFieldType: Partial<Record<TextFieldType, "default" | "email-address" | "phone-pad" | "numeric" | "decimal-pad" | "url" | "web-search" | "number-pad">> = {
  email: "email-address",
  phone: "phone-pad",
  phone_with_code: "phone-pad",
  number: "numeric",
  decimal: "decimal-pad",
  otp: "number-pad",
  url: "url",
  search: "web-search",
};

const splitInputStyle = (style: any) => {
  if (!style) return { containerStyle: {}, textStyle: {} };
  const flat = StyleSheet.flatten(style);
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

  const containerStyle: Record<string, any> = {};
  const textStyle: Record<string, any> = {};

  Object.keys(flat).forEach((key) => {
    if (containerKeys.includes(key)) {
      containerStyle[key] = flat[key];
    } else {
      textStyle[key] = flat[key];
    }
  });

  return { containerStyle, textStyle };
};

export const TextField: React.FC<{ field: TextFieldSchema }> = ({ field }) => {
  const { values, errors, touched, handleChange, handleBlur, submitCount, setFieldValue } = useFormikContext<FormValues>();
  const fieldType = field.textFieldType ?? "text";
  const value = values[field.name] ?? "";
  const shouldUseMultiline = fieldType === "multiline";
  const isPhoneWithCode = fieldType === "phone_with_code";
  const isPasswordField = fieldType === "password";
  const shouldShowError = Boolean((touched as FormValues)[field.name] || submitCount > 0);
  const errorMessage = shouldShowError ? (errors as FormValues)[field.name] : undefined;
  const showOnlyCodes = field.countryCodes?.map((item) => item.code) ?? [];

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const getDefaultDialCode = React.useCallback(() => {
    if (field.defaultCountryCode) {
      return field.defaultCountryCode;
    }
    return "+1";
  }, [field.defaultCountryCode]);

  const initialDialCodeFromFormik = field.countryCodeFieldName ? String(values[field.countryCodeFieldName] ?? "") : "";
  const [selectedDialCode, setSelectedDialCode] = React.useState(initialDialCodeFromFormik || getDefaultDialCode());
  const [isCountryPickerVisible, setCountryPickerVisible] = React.useState(false);

  React.useEffect(() => {
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

  const handleCountrySelect = (dialCode: string) => {
    setSelectedDialCode(dialCode);
    setCountryPickerVisible(false);
    if (field.countryCodeFieldName) {
      setFieldValue(field.countryCodeFieldName, dialCode);
    }
  };

  const { containerStyle: customContainerStyle, textStyle: customTextStyle } = React.useMemo(
    () => splitInputStyle(field.inputStyle),
    [field.inputStyle]
  );

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

  return (
    <View style={[styles.container, field.containerStyle]}>
      <Text style={[styles.label, field.labelStyle]}>{field.label}</Text>
      {isPhoneWithCode ? (
        <View style={[styles.phoneRow, field.phoneWithCodeContainerStyle]}>
          <TouchableOpacity
            style={[styles.countryCodeButton, Boolean(errorMessage) && styles.inputError, field.countryCodeButtonStyle]}
            activeOpacity={0.8}
            onPress={() => setCountryPickerVisible(true)}
          >
            <Text style={[styles.countryCodeText, field.countryCodeTextStyle]}>{selectedDialCode}</Text>
            <Text style={styles.countryCodeChevron}>▼</Text>
          </TouchableOpacity>
          <TextInput {...inputProps} style={[styles.phoneInput, inputProps.style]} />
        </View>
      ) : isPasswordField ? (
        <View
          style={[
            styles.passwordRow,
            Boolean(errorMessage) && styles.inputError,
            customContainerStyle,
          ]}
        >
          <TextInput
            {...inputProps}
            style={[styles.passwordInput, customTextStyle]}
          />
          <TouchableOpacity
            style={[styles.eyeButton, field.passwordVisibilityButtonStyle]}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            {field.renderEyeIcon ? (
              field.renderEyeIcon(isPasswordVisible)
            ) : (
              <Text style={[styles.eyeText, field.passwordVisibilityTextStyle]}>
                {isPasswordVisible ? "👁️" : "🙈"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput {...inputProps} />
      )}
      {Boolean(errorMessage) && (
        <Text style={[styles.errorText, field.errorTextStyle]}>{String(errorMessage)}</Text>
      )}
      <CountryPicker
        show={isCountryPickerVisible}
        lang="en"
        showOnly={showOnlyCodes.length > 0 ? showOnlyCodes : undefined}
        initialState={selectedDialCode}
        pickerButtonOnPress={(item: CountryPickerItem) => handleCountrySelect(item.dial_code)}
        onBackdropPress={() => setCountryPickerVisible(false)}
        style={{
          modal: {
            ...styles.dropdownCard,
            ...StyleSheet.flatten(field.countryCodeDropdownStyle),
            ...(field.countryCodePickerStyle?.modal ?? {}),
          },
          countryButtonStyles: {
            ...styles.countryCodeItem,
            ...StyleSheet.flatten(field.countryCodeItemStyle),
            ...(field.countryCodePickerStyle?.countryButtonStyles ?? {}),
          },
          countryName: {
            ...styles.countryCodeItemText,
            ...StyleSheet.flatten(field.countryCodeItemTextStyle),
            ...(field.countryCodePickerStyle?.countryName ?? {}),
          },
          dialCode: {
            ...styles.countryCodeItemText,
            ...StyleSheet.flatten(field.countryCodeItemTextStyle),
            ...(field.countryCodePickerStyle?.dialCode ?? {}),
          },
          ...(field.countryCodePickerStyle ?? {}),
        }}
      />
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
