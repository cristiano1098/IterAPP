import { Component, Input, OnInit } from '@angular/core';
import { categoriesTranslations } from '../categoriesTranslations';

/**
 * Displays an array of string categories
 */
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  /**
   * Translations for the given categories.
   */
  translations: any = categoriesTranslations

  /**
   * The categories to be displayed.
   */
  @Input()
  categories?: Array<string>

  /**
   * Custom classes that can be added 
   */
  @Input()
  customClass?: string

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
