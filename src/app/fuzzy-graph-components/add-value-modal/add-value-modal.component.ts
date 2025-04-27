import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-value-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-value-modal.component.html',
  styleUrl: './add-value-modal.component.css',
})
export class AddValueModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() valueAdded = new EventEmitter<any>();
  @Input() editingValue: any = null; // Nuevo Input para el valor a editar

  modalTitle: string = ''; // Propiedad para el título del modal

  linguisticValue: string = '';
  functionType: string = 'trapezoidal';
  pointA: number | null = null;
  pointB: number | null = null;
  pointC: number | null = null;
  pointD: number | null = null;
  pointE: number | null = null;

  ngOnInit(): void {
    if (this.editingValue) {
      this.modalTitle = 'Editar valor lingüístico'; // Cambiar título a "Editar"
      this.linguisticValue = this.editingValue.linguisticValue;
      this.functionType = this.editingValue.functionType;
      if (this.editingValue.points) {
        this.pointA = this.editingValue.points.a;
        this.pointB = this.editingValue.points.b;
        this.pointC = this.editingValue.points.c;
        this.pointD = this.editingValue.points.d;
        this.pointE = this.editingValue.points.e;
      }
    } else {
      this.modalTitle = 'Agregar valor lingüístico'; // Título para "Agregar"
      this.onFunctionTypeChange(); // Resetear los puntos al agregar un nuevo valor
    }
  }

  onFunctionTypeChange() {
    this.pointA = null;
    this.pointB = null;
    this.pointC = null;
    this.pointD = null;
    this.pointE = null;
  }

  isValid(): boolean {
    // Primero validamos que exista un valor lingüístico
    if (!this.linguisticValue) {
      return false;
    }

    if (this.functionType === 'trapezoidal') {
      return (
        this.pointA !== null &&
        this.pointA >= 0 &&
        this.pointB !== null &&
        this.pointB >= 0 &&
        this.pointC !== null &&
        this.pointC >= 0 &&
        this.pointD !== null &&
        this.pointD >= 0 &&
        this.pointA < this.pointB && // Validación de orden
        this.pointB < this.pointC && // B debe ser estrictamente menor que C
        this.pointC < this.pointD
      );
    } else if (this.functionType === 'triangular') {
      return (
        this.pointA !== null &&
        this.pointA >= 0 &&
        this.pointB !== null &&
        this.pointB >= 0 &&
        this.pointC !== null &&
        this.pointC >= 0 &&
        this.pointA < this.pointB && // Validación de orden
        this.pointB < this.pointC
      );
    } else if (this.functionType === 'sigmoide') {
      return (
        this.pointA !== null &&
        this.pointA >= 0 &&
        this.pointB !== null &&
        this.pointB >= 0 &&
        this.pointC !== null &&
        this.pointC >= 0 &&
        this.pointD !== null &&
        this.pointD >= 0 &&
        this.pointE !== null &&
        this.pointE >= 0 &&
        this.pointA < this.pointB && // Validación de orden
        this.pointB < this.pointC &&
        this.pointC < this.pointD &&
        this.pointD < this.pointE
      );
    }
    return false;
  }

  isValidOrder(): boolean {
    if (this.functionType === 'trapezoidal') {
      return (
        this.pointA !== null &&
        this.pointB !== null &&
        this.pointC !== null &&
        this.pointD !== null &&
        this.pointA < this.pointB &&
        this.pointB < this.pointC && // B debe ser estrictamente menor que C
        this.pointC < this.pointD
      );
    } else if (this.functionType === 'triangular') {
      return (
        this.pointA !== null &&
        this.pointB !== null &&
        this.pointC !== null &&
        this.pointA < this.pointB &&
        this.pointB < this.pointC
      );
    } else if (this.functionType === 'sigmoide') {
      return (
        this.pointA !== null &&
        this.pointB !== null &&
        this.pointC !== null &&
        this.pointD !== null &&
        this.pointE !== null &&
        this.pointA < this.pointB &&
        this.pointB < this.pointC &&
        this.pointC < this.pointD &&
        this.pointD < this.pointE
      );
    }
    return true;
  }

  getOrderErrorMessage(): string {
    if (this.functionType === 'trapezoidal') {
      return 'Los puntos deben estar en orden: A < B < C < D';
    } else if (this.functionType === 'triangular') {
      return 'Los puntos deben estar en orden: A < B < C';
    } else if (this.functionType === 'sigmoide') {
      return 'Los puntos deben estar en orden: A < B < C < D < E';
    }
    return '';
  }

  hasValidationErrors(): boolean {
    if (!this.isValidOrder() && this.allPointsEntered()) {
      return true;
    }
    return false;
  }

  allPointsEntered(): boolean {
    if (this.functionType === 'trapezoidal') {
      return (
        this.pointA !== null &&
        this.pointB !== null &&
        this.pointC !== null &&
        this.pointD !== null
      );
    } else if (this.functionType === 'triangular') {
      return (
        this.pointA !== null && this.pointB !== null && this.pointC !== null
      );
    } else if (this.functionType === 'sigmoide') {
      return (
        this.pointA !== null &&
        this.pointB !== null &&
        this.pointC !== null &&
        this.pointD !== null &&
        this.pointE !== null
      );
    }
    return false;
  }

  addValue() {
    if (this.isValid()) {
      let newValue: any;
      if (this.functionType === 'trapezoidal') {
        newValue = {
          linguisticValue: this.linguisticValue,
          functionType: this.functionType,
          points: {
            a: this.pointA,
            b: this.pointB,
            c: this.pointC,
            d: this.pointD,
          },
        };
      } else if (this.functionType === 'triangular') {
        newValue = {
          linguisticValue: this.linguisticValue,
          functionType: this.functionType,
          points: { a: this.pointA, b: this.pointB, c: this.pointC },
        };
      } else if (this.functionType === 'sigmoide') {
        newValue = {
          linguisticValue: this.linguisticValue,
          functionType: this.functionType,
          points: {
            a: this.pointA,
            b: this.pointB,
            c: this.pointC,
            d: this.pointD,
            e: this.pointE,
          },
        };
      }

      this.valueAdded.emit(newValue);
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
