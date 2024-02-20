import { Component, Input, OnInit } from '@angular/core';
import { CommentType } from 'src/app/viewModels/Types/CommentType';

/**
 * This component displays a list of {@link CommentType}.
 */
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  /**
   * Comments to be displayed
   */
  @Input()
  comments?: CommentType[]

  /**
   * @ignore
   */
  constructor() { }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

}
