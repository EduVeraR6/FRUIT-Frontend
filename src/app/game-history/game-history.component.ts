import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../shared/alert.service';
import { LoadingService } from '../shared/loading.service';
import { GameHistoryService } from './services/game-history.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AnsweredQuestion, GameHistoryInterface } from './interfaces/GameHistoryInterface';
import { GameDataParamsService } from '../game/params/game-data-params.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './game-history.component.html',
  styleUrl: './game-history.component.css'
})
export default class GameHistoryComponent implements OnInit {
  gameHistory: GameHistoryInterface[] = [];
  paginatedData: GameHistoryInterface[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  searchTerm: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: 'code' | 'createdAt' | 'expirationAt'= 'code';
  filteredGameRooms: any[] = [];

  showModal: boolean = false;
  selectedAnswers: AnsweredQuestion[] = [];

  gameHistoryPrint: GameHistoryInterface = {} as GameHistoryInterface;

  constructor(
    private gameHistoryService: GameHistoryService,
    private alertService: AlertService, 
    private loadingService: LoadingService,
    private gameDataParamsService: GameDataParamsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getGameHistory();
  }

  getGameHistory() {
    this.loadingService.showLoading();
    this.gameHistoryService.getGameHistory().subscribe({
      next: (response) => {
        this.loadingService.hideLoading();
        this.gameHistory = response.data;
        this.filteredGameRooms = [...this.gameHistory];
        this.updatePagination();
      },
      error: (error) => {
        this.loadingService.hideLoading();
        this.alertService.showAlert(error.message, true);
      },
    });
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredGameRooms.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.gameHistory.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredGameRooms.length / this.itemsPerPage);
  }

  searchGameRooms(): void {
    this.filteredGameRooms = this.gameHistory.filter(room => {
      const roomCode = (room.game_room?.code || room.game_room.code || '').toLowerCase();
      return roomCode.includes(this.searchTerm.toLowerCase());
    });
    this.sortGameRooms();
    this.currentPage = 1;
    this.updatePagination();
  }

  // Add sort method
  sortGameRooms(): void {
    const DEFAULT_DATE = '1969-12-31T19:00:00';
    this.filteredGameRooms.sort((a, b) => {
      if (this.sortField === 'code') {
        const valueA = (a.game_room?.code || a.code || '').toLowerCase();
        const valueB = (b.game_room?.code || b.code || '').toLowerCase();
        return this.sortDirection === 'asc' ? 
          valueA.localeCompare(valueB) : 
          valueB.localeCompare(valueA);
      } else if (this.sortField === 'createdAt') {
        const dateStrA = a.created_at || a.createdAt || DEFAULT_DATE;
        const dateStrB = b.created_at || b.createdAt || DEFAULT_DATE;
        
        if (!dateStrA || !dateStrB) {
          console.warn('Using default date for missing field:', { a, b });
        }

        const dateA = new Date(dateStrA).getTime();
        const dateB = new Date(dateStrB).getTime();
        
        if (isNaN(dateA) || isNaN(dateB)) {
          console.error('Invalid date format, using default:', { dateA, dateB });
          return 0;
        } 

        return this.sortDirection === 'asc' ? 
          dateA - dateB : 
          dateB - dateA;
        } else if (this.sortField === 'expirationAt') {
          const dateStrA = a.expiration_date || a.expirationAt || DEFAULT_DATE;
          const dateStrB = b.expiration_date || b.expirationAt || DEFAULT_DATE;
    
          if (!dateStrA || !dateStrB) {
            console.warn('Missing date field:', { a, b });
            return 0;
          }
    
          const dateA = new Date(dateStrA).getTime();
          const dateB = new Date(dateStrB).getTime();
    
          return this.sortDirection === 'asc' ? 
            dateA - dateB : 
            dateB - dateA;
      }
    });
    this.updatePagination();
  }

  toggleSort(field: 'code' | 'createdAt' | 'expirationAt'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.sortGameRooms();
    this.updatePagination();
  }

  openAnswersModal(answers: AnsweredQuestion[], gameHistory: GameHistoryInterface): void {
    this.selectedAnswers = answers;
    this.gameHistoryPrint = gameHistory;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAnswers = [];
    this.gameHistoryPrint = {} as GameHistoryInterface;
  }

  printResults(): void {
    const printContent = document.getElementById('print-content');
    const gameHistory = this.gameHistoryPrint;
  
    const score = gameHistory.score;
    const names = gameHistory.user.names;
    const surnames = gameHistory.user.surnames;
    const duration = gameHistory.duration;
    const code_sala = gameHistory.game_room.code;
    
    if (printContent) {
      document.title = `Resultados - ${surnames} ${names} - ${code_sala}`;

      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
  
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
            <title>Resultados - ${surnames} ${names} - ${code_sala}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  color: #4a5568;
                }
                .header {
                  margin-bottom: 20px;
                  border-bottom: 1px solid #e2e8f0;
                  position: relative;
                }
                .score-box {
                  position: absolute;
                  top: 0;
                  right: 10px;
                  padding: 10px;
                  border: 2px solid #4a5568;
                  font-weight: bold;
                  font-size: 16px;
                  text-align: center;
                  color: #4a5568;
                  background-color: #f1f5f9;
                }
                .font-bold {
                  font-weight: bold;
                }
                .text-gray-700 {
                  color: #4a5568;
                }
                .text-green-500 {
                  color: #48bb78;
                }
                .text-red-500 {
                  color: #f56565;
                }
                .text-sm {
                  font-size: 0.875rem;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="score-box">
                  SCORE<br>${score} / 100
                </div>
                <h2 class="font-bold text-gray-700">Resultado</h2>
                <p><strong>Nombres:</strong> ${names}</p>
                <p><strong>Apellidos:</strong> ${surnames}</p>
                <p><strong>Duración:</strong> ${duration}</p>
                <p><strong>Código de sala:</strong> ${code_sala}</p>
              </div>
              ${printContent.outerHTML}
            </body>
          </html>
        `);
        doc.close();
      }
  
      iframe.onload = () => {
        iframe.contentWindow?.print();
        document.title = 'FRUIT';
        document.body.removeChild(iframe);
      };
    } else {
      console.error('No se encontró el contenido a imprimir.');
    }
  }


  isExpiredGame(expiration_date : string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(expiration_date);
    return expirationDate >= currentDate;
  }


  goResults(game: GameHistoryInterface): void {
    
    this.gameDataParamsService.setGameRoomIdLocalStorage(game.game_room.id.toString());

    this.gameDataParamsService.setGameResultLocalStorage(
      JSON.stringify({
        result: game.answered_questions,
        total_score: game.score
      })
    );

    this.router.navigate(['/results']);

  }

}
