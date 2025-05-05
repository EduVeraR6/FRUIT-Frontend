import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/AuthService.service';
import { environment } from '../../../environments/environment';
import { GraficChartGameModel } from '../interfaces/ApiResponse';


@Injectable({
  providedIn: 'root'
})
export class GraficService {

  private apiUrlResults = environment.apiUrl + 'grafic-chart/graficas';
  private apiUrlResultsGraphicsByRoomQuestionUser = environment.apiUrl + 'grafic-chart/getGraficByRoomQuestionUser';
  private apiUrlAddGrafica = environment.apiUrl + 'grafic-chart/add-grafica';

  
  private againQuestionSource = new Subject<any>();
  againQuestion$ = this.againQuestionSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  

  getGraphics(): Observable<any> {
    const userData = this.authService.getUserData();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userData?.access_token}`,
    });
  
    return this.http
      .get<any>(`${this.apiUrlResults}`, { headers })
      .pipe(
        tap((response) => {
          console.log('SERVICE | Respuesta obtenida:', response);  // Aquí se muestra la respuesta cruda
          return response;
        }),
        catchError((error) => {
          console.error('SERVICE | Error al obtener gráficos:', error);
          return throwError(
            () => new Error(
              error.error.message || 'SERVICE | Ocurrió un error. Intenta más tarde.'
            )
          );
        })
      );
  }


  getGraficByRoomAndQuestionAndUser(game_room_id: number, question_id : number): Observable<any> {
    const userData = this.authService.getUserData();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userData?.access_token}`,
    });
  
    return this.http
      .post<any>(this.apiUrlResultsGraphicsByRoomQuestionUser, {game_room_id, question_id}, { headers })

      .pipe(
        tap((response) => {
          return response.data;
        }),
        catchError((error) => {
          console.error('SERVICE | Error al obtener gráficos:', error);
          return throwError(
            () => new Error(
              error.error.message || 'SERVICE | Ocurrió un error. Intenta más tarde.'
            )
          );
        })
      );
  }
  

  createGraphics(graphicData: GraficChartGameModel): Observable<any> {

    const userData = this.authService.getUserData();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userData?.access_token}`,
    });

    return this.http
      .post<any>(this.apiUrlAddGrafica, graphicData, { headers })
      .pipe(
        tap((response) => {
          console.log('SERVICE | Gráfica creada con éxito', response);  // Puedes agregar más lógica si es necesario
          return response;  
        }),
        catchError((error) => {
          return throwError(
            () =>
              new Error(
                error.error.message || 'SERVICE | Ocurrió un error. Intenta más tarde.'
              )
          );
        })
      );
  }


}
