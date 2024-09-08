import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import { BoardInterface } from '../../../shared/types/board.interface';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<BoardInterface>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error('Cannot get board ID from url.');
    }

    this.boardId = boardId;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });
  }
}
