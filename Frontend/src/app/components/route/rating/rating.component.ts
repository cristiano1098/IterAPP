import { Component, Input, OnInit } from '@angular/core';

/**
 * Displays a star representation of a rating from 0 to 5
 */
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  /**
   * The rating to be displayed
   */
  @Input()
  rating: number | undefined

  /**
   * Size of the stars in the star rating
   */
  @Input()
  starSize: number = 20

  /**
   * @ignore
   */
  constructor() { }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * Returns an array wich length is equal to the amount of full stars to be displayed in a {@link Route} card given the rating of the route.
   * There is a need to return an array because *ngFor directive only works on iterable objects. There is no way to make a traditional for.
   * 
   * @param averageRating the rating of the {@link Route}.
   * @returns An array with the amount of full stars that will be displayed in the {@link Route} card.
   */
  amountOfFullStars(averageRating: number | undefined): Array<any> {
    if (!averageRating) return new Array()

    let integer = Number.parseInt(averageRating.toString())
    let decimals = averageRating - integer
    decimals = Number.parseFloat(decimals.toFixed(2))

    if (decimals > 0.75) {
      integer++
    }

    return new Array(integer)
  }

  /**
   * Returns an array wich length is equal to the amount of half stars to be displayed in a {@link Route} card given the rating of the route.
   * There is a need to return an array because *ngFor directive only works on iterable objects. There is no way to make a traditional for.
   * 
   * @param averageRating the rating of the {@link Route}.
   * @returns An array with the amount of half filled stars that will be displayed in the {@link Route} card.
   */
  displayHalfStar(averageRating: number | undefined): boolean {

    if (!averageRating) return false

    let integer = Number.parseInt(averageRating.toString())
    let decimals = averageRating - integer
    decimals = Number.parseFloat(decimals.toFixed(2))

    return 0.25 <= decimals && decimals <= 0.75
  }

  /**
   * Returns an array wich length is equal to the amount of empty stars to be displayed in a {@link Route} card given the rating of the route.
   * There is a need to return an array because *ngFor directive only works on iterable objects. There is no way to make a traditional for.
   * 
   * @param averageRating the rating of the {@link Route}.
   * @returns An array with the amount of empty filled stars that will be displayed in the {@link Route} card.
   */
  amountOfEmptyStars(averageRating: number | undefined): Array<any> {

    if (!averageRating) return new Array(5)

    let amount = 0

    if (averageRating < 5) {
      let integer = Number.parseInt(averageRating.toString())
      let decimals = averageRating - integer
      decimals = Number.parseFloat(decimals.toFixed(2))

      amount = 5 - integer

      if (decimals >= 0.25) {
        amount--
      }

    }

    return new Array(amount)
  }
}
