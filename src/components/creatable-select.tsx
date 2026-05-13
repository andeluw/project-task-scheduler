'use client';

import get from 'lodash.get';
import { ChevronDown, X } from 'lucide-react';
import type { RegisterOptions } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import type { MultiValue, StylesConfig } from 'react-select';
import { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import type { ExtractProps } from '@/lib/helper';
import { cn } from '@/lib/utils';

import { ErrorMessage } from '@/components/error-message';
import { HelperText } from '@/components/helper-text';
import { Label } from '@/components/label';

type Option = {
  label: string;
  value: string;
};

export type CreatableSelectInputProps = {
  label: string | null;
  id: string;
  placeholder?: React.ReactNode;
  helperText?: string;
  isMulti?: boolean;
  readOnly?: boolean;
  hideError?: boolean;
  validation?: RegisterOptions;
  options: Option[];
  containerClassName?: string;
} & ExtractProps<CreatableSelect>;

const CreatableSelectInput = ({
  label,
  id,
  isMulti = true,
  placeholder,
  helperText,
  validation,
  readOnly,
  hideError = false,
  options,
  containerClassName,
  ...rest
}: CreatableSelectInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);
  const withLabel = label !== null;

  const customStyles: StylesConfig = {
    control: (styles) => ({
      ...styles,
      border: `solid ${error ? '2px #EF4444' : '1.5px #D1D5DB'}`,
      boxShadow: 'none',
      background: readOnly ? '#F3F4F6' : 'white',
      borderRadius: '0.5rem',
      padding: '0 0.75rem',
      cursor: readOnly ? 'not-allowed' : 'pointer',
      minHeight: '2.5rem',
      '&:hover': {
        border: `solid 2px ${error ? '#EF4444' : '#D1D5DB'}`,
      },
      '&:focus-within': {
        border: `solid 2px ${error ? '#EF4444' : '#D1D5DB'}`, // ✅ prevent blue/purple ring
        boxShadow: 'none',
      },
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: 0,
      gap: '0.5rem',
    }),
    input: (styles) => ({
      ...styles,
      padding: 0,
      margin: 0,
      caretColor: '#374151',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      '::placeholder': {
        color: '#9CA3AF',
      },
    }),

    singleValue: (styles) => ({
      ...styles,
      color: 'inherit',
      margin: 0,
    }),

    indicatorsContainer: (styles) => ({
      ...styles,
      '&>div': {
        padding: 0,
      },
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: '#878787',
      '&:hover': {
        color: '#878787',
      },
    }),
    option: (styles, state) => ({
      ...styles,
      color: 'black',
      background: state.isFocused
        ? 'var(--color-primary-50)'
        : state.isSelected
          ? 'var(--color-primary-100)'
          : 'white',
      ':hover': {
        background: '#E5E7EB',
      },
      cursor: 'pointer',
    }),
    multiValue: (styles) => ({
      ...styles,
      background: 'var(--color-primary-100)',
      borderRadius: '0.375rem',
      padding: '0.25rem 0.75rem',
      margin: 0,
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: 'var(--color-primary-700)',
      padding: 0,
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: 'var(--color-primary-700)',
      paddingLeft: '0.5rem',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'var(--color-primary-700)',
      },
    }),
    menu: (styles) => ({
      ...styles,
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }),
    menuPortal: (styles) => ({
      ...styles,
      zIndex: 1,
    }),
  };

  return (
    <div className={containerClassName}>
      {withLabel && <Label required={!!validation?.required}>{label}</Label>}
      <div className={cn('relative', withLabel && 'mt-1')}>
        <Controller
          control={control}
          name={id}
          rules={validation}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti={isMulti}
              isClearable
              isDisabled={readOnly}
              inputId={id}
              options={options}
              placeholder={placeholder}
              styles={customStyles}
              classNames={{
                control: () => '!h-[2.5rem]',
              }}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: (props) => (
                  <components.DropdownIndicator {...props}>
                    <ChevronDown size={18} />
                  </components.DropdownIndicator>
                ),
                ClearIndicator: (props) => (
                  <components.ClearIndicator {...props}>
                    <X
                      className='mr-0.5 text-typo-icons hover:text-typo-secondary'
                      size={18}
                    />
                  </components.ClearIndicator>
                ),
                MultiValueRemove: (props) => (
                  <components.MultiValueRemove {...props}>
                    <X size={18} />
                  </components.MultiValueRemove>
                ),
              }}
              onChange={(newValue) => {
                field.onChange(
                  isMulti
                    ? (newValue as MultiValue<Option>).map((v) => v.value)
                    : ((newValue as Option)?.value ?? ''),
                );
              }}
              value={
                isMulti
                  ? field.value?.map(
                      (val: string) =>
                        options.find((opt) => opt.value === val) ?? {
                          label: val,
                          value: val,
                        },
                    )
                  : (options.find((opt) => opt.value === field.value) ?? {
                      label: field.value,
                      value: field.value,
                    })
              }
              {...rest}
            />
          )}
        />
        {!hideError && error && (
          <ErrorMessage className='mt-2'>
            {String(error.message ?? '')}
          </ErrorMessage>
        )}
        {helperText && (
          <HelperText helperTextClassName='mt-2'>{helperText}</HelperText>
        )}
      </div>
    </div>
  );
};

CreatableSelectInput.displayName = 'CreatableSelectInput';
export default CreatableSelectInput;
