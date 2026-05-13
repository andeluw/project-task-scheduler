'use client';

import { Search } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { DatePicker } from '@/components/datepicker';
import { DropzoneInput } from '@/components/dropzone-input';
import { HelperText } from '@/components/helper-text';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Radio } from '@/components/radio';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { Typography } from '@/components/typography';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

import { FileWithPreview } from '@/types/dropzone';

interface FormValues {
  basic: string;
  readOnly: string;
  prefix: string;
  suffix: string;
  leftIcon: string;
  rightIcon: string;
  helper: string;
  validation: string;
  helperValidation: string;
  password: string;
  select: string;
  selectReadOnly: string;
  requiredSelect: string;
  multiSelect: string[];
  textarea: string;
  checkbox: boolean;
  pilihan: string;
  dropzone: FileWithPreview[];
  dropzoneReadOnly: FileWithPreview[];
  dateSingle: Date;
  dateRange: DateRange;
  dateWithProps: DateRange;
}

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const multiOptions = [
  { label: 'Option A', value: 'optiona' },
  { label: 'Option B', value: 'optionb' },
  { label: 'Option C', value: 'optionc' },
];

export default function InputSandbox() {
  const [mounted, setMounted] = React.useState(false);

  const [baseSingleDate, setBaseSingleDate] = React.useState<Date | undefined>(
    undefined,
  );
  const [baseRangeDate, setBaseRangeDate] = React.useState<
    DateRange | undefined
  >(undefined);
  const [baseWithPropsDate, setBaseWithPropsDate] = React.useState<
    DateRange | undefined
  >(undefined);

  const methods = useForm<FormValues>();

  const { handleSubmit, reset } = methods;
  const [formOutput, setFormOutput] = React.useState<FormValues | null>(null);

  React.useEffect(() => {
    setMounted(true);

    const fileWithPreviewDemoList: FileWithPreview[] = Array.from(
      { length: 3 },
      (_, i) => {
        const file = new File(['dummy content'], `test-${i}.jpg`, {
          type: 'image/jpeg',
        });

        return Object.assign(file, {
          preview: `https://picsum.photos/1200/800`,
        });
      },
    );

    reset({
      readOnly: 'Hello',
      dropzoneReadOnly: fileWithPreviewDemoList,
      dateSingle: new Date(),
    });
  }, [reset]);

  if (!mounted) {
    return null;
  }

  const onSubmit = (data: FormValues) => {
    setFormOutput(data);
  };

  return (
    <SandboxLayout title='Form Sandbox'>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Input id='basic' label='Basic Input' placeholder='Type here...' />
          <Input id='readOnly' label='Read Only' readOnly />
          <Input
            id='prefix'
            label='With Prefix'
            prefix='Rp'
            placeholder='10000'
          />
          <Input
            id='suffix'
            label='With Suffix'
            suffix='IDR'
            placeholder='Amount'
          />
          <Input
            id='leftIcon'
            label='With Left Icon'
            leftIcon={Search}
            placeholder='Search...'
          />
          <Input
            id='rightIcon'
            label='With Right Icon'
            rightIcon={Search}
            placeholder='Search...'
          />
          <Input
            id='helper'
            label='With Helper'
            helperText='This is some helper text'
          />
          <Input
            id='validation'
            label='With Validation'
            validation={{ required: 'Required field' }}
          />
          <Input
            id='helperValidation'
            label='With Helper + Validation'
            validation={{ required: 'Required field' }}
            helperText='Helper text here'
          />
          <Input
            id='password'
            label='Password'
            type='password'
            placeholder='Enter your password'
            validation={{ required: 'Password is required' }}
          />

          <Textarea
            id='textarea'
            label='Textarea'
            placeholder='Type here...'
            rows={5}
            validation={{ required: 'Textarea is required' }}
          />

          <Select
            id='select'
            label='Normal Select'
            options={options}
            placeholder='Select gender'
            helperText='This is some helper text'
          />

          <Select
            id='selectReadOnly'
            label='Read Only Select'
            options={options}
            readOnly
            helperText='This is some helper text'
          />

          <Select
            id='requiredSelect'
            label='Required Select'
            options={options}
            placeholder='Select something'
            helperText='This is some helper text'
            validation={{ required: 'This field is required' }}
          />

          <Select
            id='multiSelect'
            label='Multi Select'
            isMulti
            options={multiOptions}
            helperText='This is some helper text'
            placeholder='Select options'
          />

          <div>
            <Label required>Radio Button</Label>
            <div className='flex gap-10 mt-1'>
              <Radio
                label='Option 1'
                name='pilihan'
                value='1'
                validation={{ required: 'Field must be filled' }}
              />
              <Radio label='Option 2' name='pilihan' value='2' />
            </div>
            <HelperText helperTextClassName='mt-2'>
              This is some helper text
            </HelperText>
          </div>

          <DropzoneInput
            id='dropzone'
            label='Dropzone Input'
            helperText='Files must be in .jpg, .jpeg, .png format and a maximum of 2MB'
            validation={{ required: 'This field is required' }}
            maxFiles={3}
            maxSize={2 * 1024 * 1024} // 2MB
          />

          <DropzoneInput
            id='dropzoneReadOnly'
            label='Dropzone Input (Read Only)'
            maxFiles={3}
            helperText='Files must be in .jpg, .jpeg, .png format and a maximum of 2MB'
            validation={{ required: 'This field is required' }}
            readOnly
          />

          <Checkbox
            label='Checkbox'
            name='checkbox'
            size='base'
            value='checkbox'
            validation={{ required: 'This field is required' }}
          />

          <DatePicker
            name='dateSingle'
            label='RHF (Single)'
            validation={{ required: 'This field is required' }}
          />

          <DatePicker name='dateRange' label='RHF (Range)' range />

          <DatePicker
            name='dateWithProps'
            label='RHF (With Calendar Props)'
            range
            numberOfMonths={2}
            disabled={(date: Date) => date.getDay() === 0}
          />

          <DatePicker
            label='Base (Single)'
            value={baseSingleDate}
            onChange={(d) => setBaseSingleDate(d as Date)}
          />

          <DatePicker
            label='Base (Range)'
            range
            value={baseRangeDate}
            onChange={(d) => setBaseRangeDate(d as DateRange)}
          />

          <DatePicker
            label='Base (With Calendar Props)'
            range
            numberOfMonths={2}
            disabled={(date: Date) => date.getDay() === 6}
            value={baseWithPropsDate}
            onChange={(d) => setBaseWithPropsDate(d as DateRange)}
          />

          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </FormProvider>

      {formOutput && (
        <div className='rounded-lg bg-white p-4 shadow mt-8'>
          <Typography as='h2' variant='h3' className='mb-2'>
            Submitted Data
          </Typography>
          <pre className='whitespace-pre-wrap text-sm text-gray-800'>
            {JSON.stringify(formOutput, null, 2)}
          </pre>
        </div>
      )}
    </SandboxLayout>
  );
}
