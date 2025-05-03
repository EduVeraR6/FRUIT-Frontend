export interface GraficChartData {
    game_room_id: string;
    variable_linguistica: string;
    escala: number;
    data: any[]; // Dependiendo de los datos específicos que recibas, puedes definir un tipo más específico
  }
  

  export interface ApiResponse {
    data: any; // Los datos de la respuesta, si es que devuelve algo (puede ser `null`, un objeto, etc.)
    message: string;
    statusCode: number;
  }
  