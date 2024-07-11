import { PRODUCT_PRICES } from '@/config/products'

// fixing the value for the colors for the phone back
export const COLORS = [
  { label: 'Black', value: 'black', tw: 'zinc-900' },
  {
    label: 'Blue',
    value: 'blue',
    tw: 'blue-950',
  },
  { label: 'Rose', value: 'rose', tw: 'rose-950' },
] as const


// fixing the value for the models for the phone
export const MODELS = {
  name: 'models',
  options: [
    {
      label: 'iPhone X',
      value: 'iphonex',
    },
    {
      label: 'iPhone 11',
      value: 'iphone11',
    },
    {
      label: 'iPhone 12',
      value: 'iphone12',
    },
    {
      label: 'iPhone 13',
      value: 'iphone13',
    },
    {
      label: 'iPhone 14',
      value: 'iphone14',
    },
    {
      label: 'iPhone 15',
      value: 'iphone15',
    },
  ],
} as const

// fixing the value for the materials used for the phone case building
export const MATERIALS = {
  name: 'material',
  options: [
    {
      label: 'Silicone',
      value: 'silicone',
      description: undefined,
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: 'Soft Polycarbonate',
      value: 'polycarbonate',
      description: 'Scratch-resistant coating',
      price: PRODUCT_PRICES.material.polycarbonate,
    },
  ],
} as const

// fixing the value for the finishing used for the phone case building
export const FINISHES = {
  name: 'finish',
  options: [
    {
      label: 'Smooth Finish',
      value: 'smooth',
      description: undefined,
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: 'Textured Finish',
      value: 'textured',
      description: 'Soft grippy texture',
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
} as const
