import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartDataInput } from './fuzzyVariable.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { AddValueModalComponent } from "../add-value-modal/add-value-modal.component";
import { LineChartComponent } from "../line-chart/line-chart.component";
import { ScaleModalComponent } from "../scale-modal/scale-modal.component";
import { GameDataParamsService } from '../../game/params/game-data-params.service';
import { Router } from '@angular/router';
import { NfrResult, ResultsQuestionsResponse } from '../../results/interfaces/ResultsQuestionsResponse';


@Component({
  selector: 'app-fuzzy-variable',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, AddValueModalComponent, LineChartComponent, ScaleModalComponent],
  templateUrl: './fuzzy-variable.component.html',
  styleUrl: './fuzzy-variable.component.css'
})
export class FuzzyVariableComponent implements OnInit {

  resultData: ResultsQuestionsResponse | null = null;
  // Variables linguisticas para el gráfico
  linguisticVariables: string[] = [];



  modalTitle: string = 'Agregar valor lingüístico'; // Título del modal
  isEditing: boolean = false; // Variable para determinar si estamos editando un valor
  linguisticVariable: string = '';
  showAddValueModal: boolean = false;
  showEditValueModal: boolean = false;
  showScaleModal: boolean = false;
  currentXAxisLimit: number = 1; // Rastrea el límite actual del eje X   
  currentYAxisStep: number = 0.5; // Rastrea el salto actual del eje Y   
  initialXLimit: number = 1;
  initialYStep: number = 0.5;
  chartData: ChartDataInput = {
    functions: [],
    xAxisLimit: this.currentXAxisLimit,
    yAxisStep: this.currentYAxisStep
  };
  editingValue: any = null;
  maxXFromFunctions: number = 0;  // Se agrega esta propiedad para almacenar el valor máximo de X

  constructor(private cdr: ChangeDetectorRef, private gameDataService: GameDataParamsService, private router: Router) {
    this.updateXAxisLimit();
  }
  ngOnInit(): void {
    const result = this.gameDataService.getGameResult();

    if (result && result.data) {
      this.resultData = result.data;

    } 

    console.log('Result Data:', this.resultData);

    this.linguisticVariables = this.resultData?.result?.map((item: NfrResult) => item.user_variable) || [];

    console.log('Linguistic Variables:', this.linguisticVariables);

  }

  openAddValueModal() {
    this.editingValue = null;
    this.showAddValueModal = true;
  }

  closeAddValueModal() {
    this.showAddValueModal = false;
  }

  openEditValueModal(value: any) {
    if (value) {
      // Si el valor existe, estamos editando
      this.editingValue = { ...value, isEditing: true };
      this.modalTitle = 'Editar valor lingüístico'; // Cambiamos el título a "Editar"
      this.isEditing = true; // Establecemos isEditing como true (editando)
    } else {
      // Si no hay valor, es para agregar
      this.editingValue = { isEditing: false };
      this.modalTitle = 'Agregar valor lingüístico'; // Título para agregar
      this.isEditing = false; // Establecemos isEditing como false (agregando)
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
    this.currentXAxisLimit = Math.max(this.currentXAxisLimit, this.initialXLimit); // Actualizar límite si es necesario     
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
      this.currentXAxisLimit = Math.max(this.currentXAxisLimit, this.initialXLimit); // Actualizar límite si es necesario       
      this.chartData.xAxisLimit = this.currentXAxisLimit;
      this.cdr.detectChanges();
    }
    this.closeEditValueModal();
  }

  openScaleModal() {
    this.updateXAxisLimit();
    this.initialXLimit = this.currentXAxisLimit; // Usar el valor actual     
    this.initialYStep = this.currentYAxisStep; // Usar el valor actual     
    this.cdr.detectChanges();
    this.showScaleModal = true;
    this.maxXFromFunctions = this.getMaxXFromAllFunctions();  // Asignar el valor máximo de X
  }

  closeScaleModal() {
    this.showScaleModal = false;
  }

  onScaleApplied(scale: { xAxisLimit: number; yAxisStep: number }) {
    this.currentXAxisLimit = scale.xAxisLimit; // Actualizar el valor actual     
    this.currentYAxisStep = scale.yAxisStep; // Actualizar el valor actual     
    this.chartData = {
      ...this.chartData,
      xAxisLimit: this.currentXAxisLimit,
      yAxisStep: this.currentYAxisStep
    };
    console.log('Escala aplicada:', scale);
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
      this.chartData.xAxisLimit = this.currentXAxisLimit; // Asegurar que el gráfico también se actualice     
    }
  }

  isLinguisticVariableValid(): boolean {
    return !!this.linguisticVariable && this.linguisticVariable.trim() !== '';
  }

  // Método para obtener el máximo valor de X de todas las funciones
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
