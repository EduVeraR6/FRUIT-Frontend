import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-fuzzy-diagram',
  standalone: true,
  imports: [ 
    CommonModule,
    NgChartsModule
  ],
  templateUrl: './fuzzy-diagram.component.html',
  styleUrl: './fuzzy-diagram.component.css'
})
export class FuzzyDiagramComponent {
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: Array.from({ length: 71 }, (_, i) => i * 10), // 0 a 700 ms
    datasets: [
      {
        label: 'Rápido',
        data: [],
        borderColor: 'green',
        fill: false, // No se rellena el área debajo de la línea
        tension: 0,  // No hay suavizado de la línea
        borderWidth: 2  // Ancho de la línea
      },
      {
        label: 'Medio',
        data: [],
        borderColor: 'orange',
        fill: false,
        tension: 0,
        borderWidth: 2
      },
      {
        label: 'Lento',
        data: [],
        borderColor: 'red',
        fill: false,
        tension: 0,
        borderWidth: 2
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y: { min: 0, max: 1 },
      x: { title: { display: true, text: 'Tiempo de respuesta (ms)' } }
    }
  };

  constructor() {
    const xValues = this.lineChartData.labels as number[];

    // Generar los valores para cada conjunto de datos usando la función trapezoidal
    this.lineChartData.datasets[0].data = this.generateTrapezoidalData(xValues, 0, 100, 200, 250); // Rápido
    this.lineChartData.datasets[1].data = this.generateTrapezoidalData(xValues, 150, 275, 400, 450); // Medio
    this.lineChartData.datasets[2].data = this.generateTrapezoidalData(xValues, 350, 525, 700, 750); // Lento
  }

  // Función para generar los datos de los trapecios
  generateTrapezoidalData(xValues: number[], a: number, b: number, c: number, d: number): number[] {
    const data: number[] = [];
    const step = (d - a) / (xValues.length - 1); // Calcular el paso entre puntos

    // Generar los puntos del trapecio
    xValues.forEach(x => {
      if (x <= a || x >= d) {
        data.push(0);  // Fuera del trapecio
      } else if (x >= b && x <= c) {
        data.push(1);  // Parte plana del trapecio
      } else if (x > a && x < b) {
        data.push((x - a) / (b - a));  // Lado ascendente
      } else {
        data.push((d - x) / (d - c));  // Lado descendente
      }
    });

    return data;
  }
}
