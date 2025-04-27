import { Component, OnInit } from '@angular/core';
import { GameDataParamsService } from '../game/params/game-data-params.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultsQuestionsResponse } from './interfaces/ResultsQuestionsResponse';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export default class ResultsComponent implements OnInit {
  resultData: ResultsQuestionsResponse | null = null;
  expandedIndex: number | null = null;

  constructor(private gameDataService: GameDataParamsService, private router: Router) {}

  ngOnInit(): void {
    const result = this.gameDataService.getGameResult();

    if (result && result.data) {
      this.resultData = result.data;
    } else {
      // const gameResult = localStorage.getItem('gameResult'); //BORRAR
      // this.resultData = gameResult ? JSON.parse(gameResult) : null; //BORRAR
      this.router.navigate(['/game']);
      this.router.navigate(['/game'], {
        queryParams: { mode: 'find' }, 
      });
    }
  }

  toggleCard(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  backHome(): void {
    this.router.navigate(['/home']);
  }

  goGrafic(): void {
    this.router.navigate(['/grafic']);
  }

}
