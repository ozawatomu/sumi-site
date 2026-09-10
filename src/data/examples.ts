export interface Example {
  id: string;
  label: string;
  expression: string;
  expressionText: string;
  exact: string;
  exactText: string;
  decimal: string;
}

export const examples: Example[] = [
  {
    id: 'fractions',
    label: 'Fractions',
    expression:
      '<mfrac><mn>1</mn><mn>3</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>6</mn></mfrac>',
    expressionText: 'One third plus one sixth',
    exact: '<mfrac><mn>1</mn><mn>2</mn></mfrac>',
    exactText: 'One half',
    decimal: '0.5',
  },
  {
    id: 'roots',
    label: 'Roots',
    expression: '<msqrt><mn>8</mn></msqrt>',
    expressionText: 'Square root of eight',
    exact: '<mn>2</mn><msqrt><mn>2</mn></msqrt>',
    exactText: 'Two times the square root of two',
    decimal: '2.828427125',
  },
  {
    id: 'trigonometry',
    label: 'Trigonometry',
    expression:
      '<mi mathvariant="normal">sin</mi><mo>(</mo><mn>15</mn><mo>°</mo><mo>)</mo>',
    expressionText: 'Sine of fifteen degrees',
    exact:
      '<mfrac><mrow><msqrt><mn>6</mn></msqrt><mo>−</mo><msqrt><mn>2</mn></msqrt></mrow><mn>4</mn></mfrac>',
    exactText:
      'Square root of six minus square root of two, all divided by four',
    decimal: '0.2588190451',
  },
];
