export const queryKeys = {
  conversions: {
    all: ['conversions'] as const,
    list: () => [...queryKeys.conversions.all, 'list'] as const,
  },
  conversion: {
    toRoman: (number: string) => ['conversion', 'toRoman', number] as const,
    toNumber: (roman: string) => ['conversion', 'toNumber', roman] as const,
  },
};
