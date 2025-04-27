import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LinguisticValueComponent } from "./linguistic-value/linguistic-value.component";
import { PersonalizeScaleComponent } from "./personalize-scale/personalize-scale.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { TranslateModule } from '@ngx-translate/core';
import { ChartDataInput } from './interfaces/ChartDataInput';

@Component({
  selector: 'app-grafic',
  standalone: true,
  imports: [CommonModule, FormsModule, LinguisticValueComponent, PersonalizeScaleComponent, LineChartComponent, TranslateModule],
  templateUrl: './grafic.component.html',
  styleUrl: './grafic.component.css'
})

export default class GraficComponent {
  modalTitle: string = 'Agregar valor lingüístico';
  isEditing: boolean = false;
  selectedLinguisticVariable: string = '';
  showAddValueModal: boolean = false;
  showEditValueModal: boolean = false;
  showScaleModal: boolean = false;
  currentXAxisLimit: number = 1;
  currentYAxisStep: number = 0.5;
  initialXLimit: number = 1;
  initialYStep: number = 0.5;
  chartData: ChartDataInput = {
    functions: [],
    xAxisLimit: this.currentXAxisLimit,
    yAxisStep: this.currentYAxisStep
  };
  editingValue: any = null;
  maxXFromFunctions: number = 0;
  variableValues = {
    TRANSACCIONES: ['muchas', 'normales', 'pocas'],
    'NUMERO DE ERRORES': ['muchos', 'pocos'],
    COMPRENSION: ['facil', 'dificil']
  };
  currentVariableValues: string[] = [];
  linguisticVariables: string[] = ['TRANSACCIONES', 'NUMERO DE ERRORES', 'COMPRENSION'];

  constructor(private cdr: ChangeDetectorRef) {
    this.updateXAxisLimit();
  }

  ngOnInit(): void {    
    this.selectedLinguisticVariable = this.linguisticVariables[0] || '';    
  }

  areNewValuesAvailable(): boolean {
    if (!this.selectedLinguisticVariable) {
      return false;
    }
    const usedValues = this.chartData.functions.map(func => func.linguisticValue);
    const availableValues = this.variableValues[this.selectedLinguisticVariable as keyof typeof this.variableValues] || [];
    return availableValues.some(value => !usedValues.includes(value));
  }

  onLinguisticVariableChange() {
    this.currentVariableValues = this.variableValues[this.selectedLinguisticVariable as keyof typeof this.variableValues] || [];
  }

  closeAddValueModal() {
    this.showAddValueModal = false;
  }
  
  openAddValueModal() {
    this.editingValue = null;
    const usedValues = this.chartData.functions.map(func => func.linguisticValue);
    this.currentVariableValues = this.variableValues[this.selectedLinguisticVariable as keyof typeof this.variableValues]?.filter(
      value => !usedValues.includes(value)
    ) || [];
    this.showAddValueModal = true;
  }

  openEditValueModal(value: any) {
    if (value) {
      this.editingValue = { ...value, isEditing: true };
      this.modalTitle = 'Editar valor lingüístico';
      this.isEditing = true;
    } else {
      this.editingValue = { isEditing: false };
      this.modalTitle = 'Agregar valor lingüístico';
      this.isEditing = false;
    }
    this.showEditValueModal = true;
  }

  closeEditValueModal() {
    this.showEditValueModal = false;
    this.editingValue = null;
  }

  onValueAdded(newValue: any) {
    this.chartData = {
      ...this.chartData,
      functions: [...this.chartData.functions, newValue]
    };
    this.updateXAxisLimit();
    this.currentXAxisLimit = Math.max(this.currentXAxisLimit, this.initialXLimit);
    this.chartData.xAxisLimit = this.currentXAxisLimit;
  }

  onValueEdited(editedValue: any) {
    const index = this.chartData.functions.findIndex(
      (func) => func.linguisticValue === editedValue.linguisticValue
    );
    if (index !== -1) {
      const updatedFunctions = [...this.chartData.functions];
      updatedFunctions[index] = { ...editedValue };
      this.chartData = { ...this.chartData, functions: updatedFunctions };
      this.updateXAxisLimit();
      this.currentXAxisLimit = Math.max(this.currentXAxisLimit, this.initialXLimit);
      this.chartData.xAxisLimit = this.currentXAxisLimit;
      this.cdr.detectChanges();
    }
    this.closeEditValueModal();
  }

  openScaleModal() {
    this.updateXAxisLimit();
    this.initialXLimit = this.currentXAxisLimit;
    this.initialYStep = this.currentYAxisStep;
    this.cdr.detectChanges();
    this.showScaleModal = true;
    this.maxXFromFunctions = this.getMaxXFromAllFunctions();
  }

  closeScaleModal() {
    this.showScaleModal = false;
  }

  onScaleApplied(scale: { xAxisLimit: number; yAxisStep: number }) {
    this.currentXAxisLimit = scale.xAxisLimit;
    this.currentYAxisStep = scale.yAxisStep;
    this.chartData = {
      ...this.chartData,
      xAxisLimit: this.currentXAxisLimit,
      yAxisStep: this.currentYAxisStep
    };
  }

  updateXAxisLimit() {
    let maxX = 0;
    this.chartData.functions.forEach((func) => {
      if (func.functionType === 'trapezoidal' && func.points) {
        maxX = Math.max(maxX, func.points.a, func.points.b, func.points.c, func.points.d);
      } else if (func.functionType === 'triangular' && func.points) {
        maxX = Math.max(maxX, func.points.a, func.points.b, func.points.c);
      } else if (func.functionType === 'sigmoide' && func.points) {
        maxX = Math.max(maxX, func.points.a, func.points.b, func.points.c, func.points.d, func.points.e);
      }
    });
    this.initialXLimit = Math.max(1, maxX);
    if (this.currentXAxisLimit < this.initialXLimit) {
      this.currentXAxisLimit = this.initialXLimit;
      this.chartData.xAxisLimit = this.currentXAxisLimit;
    }
  }

  isLinguisticVariableValid(): boolean {
    return !!this.selectedLinguisticVariable;
  }

  getMaxXFromAllFunctions(): number {
    let maxX = 0;
    this.chartData.functions.forEach((func) => {
      if (func.functionType === 'trapezoidal' && func.points) {
        maxX = Math.max(maxX, func.points.a, func.points.b, func.points.c, func.points.d);
      } else if (func.functionType === 'triangular' && func.points) {
        maxX = Math.max(maxX, func.points.a, func.points.b, func.points.c);
      } else if (func.functionType === 'sigmoide' && func.points) {
        maxX = Math.max(maxX, func.points.a, func.points.b, func.points.c, func.points.d, func.points.e);
      }
    });
    return maxX;
  }
}