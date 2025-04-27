export interface DataPoint {
  x: number;
  y: number;
}

export interface ChartDataInput {
  functions: {
    linguisticValue: string;
    functionType: string;
    points: any;
  }[];
  xAxisLimit: number;
  yAxisStep: number;
}
