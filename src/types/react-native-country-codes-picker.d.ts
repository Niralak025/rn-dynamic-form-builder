declare module "react-native-country-codes-picker" {
  import type React from "react";

  export interface CountryPickerItem {
    dial_code: string;
    code: string;
    flag: string;
    name: Record<string, string>;
  }

  export interface CountryPickerProps {
    show: boolean;
    lang?: string;
    showOnly?: string[];
    initialState?: string;
    onBackdropPress?: () => void;
    pickerButtonOnPress: (item: CountryPickerItem) => void;
    style?: Record<string, any>;
  }

  export const CountryPicker: React.ComponentType<CountryPickerProps>;
}
