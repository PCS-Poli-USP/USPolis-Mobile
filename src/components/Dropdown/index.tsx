import { Picker } from '@react-native-picker/picker'
import React from 'react'
import { Box } from '../ui'
import { Platform } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '@/theme/theme'

export interface IPickerOption {
  label: string
  value: string
}

interface DropdownProps {
  label: string
  data: Array<IPickerOption>
  selected?: string
  onSelect: (item: string) => void
  disabled?: boolean
}

export const Dropdown = ({
  disabled,
  label,
  data,
  onSelect,
  selected,
}: DropdownProps) => {
  const theme = useTheme<Theme>()

  const onItemPress = (item: any): void => {
    onSelect(item)
  }

  if (Platform.OS === 'ios') {
    return (
      <Box bg="grayFive" width={'100%'} borderRadius={8}>
        <Picker
          style={{
            backgroundColor: theme.colors.grayFive,
            borderRadius: 8,
            height: 100,
          }}
          itemStyle={{
            height: 100,
            fontSize: 10,
          }}
          enabled={!disabled}
          selectedValue={selected}
          numberOfLines={2}
          onValueChange={(itemValue) => {
            onItemPress(itemValue)
          }}
        >
          {data.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
              color={theme.colors.white}
            />
          ))}
        </Picker>
      </Box>
    )
  }

  return (
    <Box bg="grayFive" width={'100%'} borderRadius={8}>
      <Picker
        mode="dropdown"
        dropdownIconColor={theme.colors.primary}
        style={{
          borderRadius: 8,
          height: 70,
          color: theme.colors.grayTwo,
        }}
        prompt={label}
        enabled={!disabled}
        selectedValue={selected}
        onValueChange={(itemValue) => {
          onItemPress(itemValue)
        }}
      >
        {data.map((item, index) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
            color={theme.colors.grayFive}
          />
        ))}
      </Picker>
    </Box>
  )
}
