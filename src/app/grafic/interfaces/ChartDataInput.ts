export interface ChartDataInput {
  functions: {
    linguisticValue: string;
    functionType: string;
    points: any;
  }[];
  xAxisLimit: number;
  yAxisStep: number;
}