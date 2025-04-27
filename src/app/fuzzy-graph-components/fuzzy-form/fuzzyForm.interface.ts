export interface FormDataItem {
    linguisticValue: string;
    functionType: string;
    pointA_x?: number;
    pointB_x?: number;
    pointC_x?: number;
    pointD_x?: number;
    pointA_t_x?: number;
    pointB_t_x?: number;
    pointC_t_x?: number;
  }
  
  export interface ChartDataOutput {
    functions: {
      linguisticValue: string;
      functionType: string;
      points: any; // La estructura de 'points' dependerá del tipo de función
    }[];
    xAxisLimit: number;
    yAxisStep: number;
  }