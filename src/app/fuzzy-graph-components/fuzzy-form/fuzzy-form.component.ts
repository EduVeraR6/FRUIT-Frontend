import { Component, EventEmitter, Output } from '@angular/core';
import { ChartDataOutput, FormDataItem } from './fuzzyForm.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fuzzy-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fuzzy-form.component.html',
  styleUrl: './fuzzy-form.component.css'
})
export class FuzzyFormComponent {
  @Output() generateChart = new EventEmitter<ChartDataOutput>(); // Definimos el tipo del evento

  formItems: FormDataItem[] = [{
    linguisticValue: 'valorA',
    functionType: 'trapezoidal',
    pointA_x: 0,
    pointB_x: 0.5,
    pointC_x: 1.5,
    pointD_x: 2.5,
    pointA_t_x: 0,
    pointB_t_x: 1,
    pointC_t_x: 2
  }];

  xAxisLimit: number = 3;
  yAxisStep: number = 0.25;

  addFormItem() {
    this.formItems.push({
      linguisticValue: 'valorA',
      functionType: 'trapezoidal',
      pointA_x: undefined,
      pointB_x: undefined,
      pointC_x: undefined,
      pointD_x: undefined,
      pointA_t_x: undefined,
      pointB_t_x: undefined,
      pointC_t_x: undefined
    });
  }

  removeFormItem(index: number) {
    if (this.formItems.length > 1) {
      this.formItems.splice(index, 1);
    }
  }

  onFunctionChange(item: FormDataItem) {
    // Puedes agregar lógica adicional aquí si es necesario al cambiar la función para un item específico
  }

  onSubmit() {
    const chartDataArray = this.formItems.map(item => {
      if (item.functionType === 'trapezoidal' && item.pointA_x !== undefined && item.pointB_x !== undefined && item.pointC_x !== undefined && item.pointD_x !== undefined) {
        return {
          linguisticValue: item.linguisticValue,
          functionType: item.functionType,
          points: {
            a: item.pointA_x,
            b: item.pointB_x,
            c: item.pointC_x,
            d: item.pointD_x
          }
        };
      } else if (item.functionType === 'triangular' && item.pointA_t_x !== undefined && item.pointB_t_x !== undefined && item.pointC_t_x !== undefined) {
        return {
          linguisticValue: item.linguisticValue,
          functionType: item.functionType,
          points: {
            a: item.pointA_t_x,
            b: item.pointB_t_x,
            c: item.pointC_t_x
          }
        };
      }
      return null;
    }).filter((item): item is { linguisticValue: string; functionType: string; points: any } => item !== null); // Usamos un type predicate

    const outputData: ChartDataOutput = {
      functions: chartDataArray,
      xAxisLimit: this.xAxisLimit,
      yAxisStep: this.yAxisStep
    };

    this.generateChart.emit(outputData);
  }
}
