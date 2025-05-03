import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/ApiResponse';
import { AuthService } from '../../auth/services/AuthService.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GraficService {

  private apiUrlResultsGraphics = environment.apiUrl + 'grafic-chart/get-grafic-chart?game_room_id=49';
  private apiUrlResultsSala = environment.apiUrl + 'grafic-chart/graficas';
  private apiUrlAddGrafica = environment.apiUrl + 'grafic-chart/add-grafica';


  private currentQuestionIndex = 0;
  private readonly timePerStep = 30; 
  
  private againQuestionSource = new Subject<any>();
  againQuestion$ = this.againQuestionSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  

  getGraphics(): Observable<any> {
    const userData = this.authService.getUserData();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userData?.access_token}`,
    });
  
    return this.http
      .get<any>(`${this.apiUrlResultsGraphics}`, { headers })
      .pipe(
        tap((response) => {
          console.log('Respuesta obtenida:', response);  // Aquí se muestra la respuesta cruda
          return response;
        }),
        catchError((error) => {
          console.error('Error al obtener gráficos:', error);
          return throwError(
            () => new Error(
              error.error.message || 'Ocurrió un error. Intenta más tarde.'
            )
          );
        })
      );
  }

  getGraphicsPorSala(): Observable<any> {
    const userData = this.authService.getUserData();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userData?.access_token}`,
    });
  
    return this.http
      .get<any>(`${this.apiUrlResultsSala}`, { headers })
      .pipe(
        tap((response) => {
          console.log('Respuesta obtenida:', response);  // Aquí se muestra la respuesta cruda
          return response;
        }),
        catchError((error) => {
          console.error('Error al obtener gráficos:', error);
          return throwError(
            () => new Error(
              error.error.message || 'Ocurrió un error. Intenta más tarde.'
            )
          );
        })
      );
  }
  
  


  // Método para enviar una nueva gráfica (POST)
  createGraphics(graphicData: any): Observable<any> {

    const userData = this.authService.getUserData();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userData?.access_token}`,
    });

    return this.http
      .post<any>(this.apiUrlAddGrafica, graphicData, { headers })
      .pipe(
        tap((response) => {
          console.log('Gráfica creada con éxito', response);  // Puedes agregar más lógica si es necesario
          return response;  
        }),
        catchError((error) => {
          return throwError(
            () =>
              new Error(
                error.error.message || 'Ocurrió un error. Intenta más tarde.'
              )
          );
        })
      );
  }


}
