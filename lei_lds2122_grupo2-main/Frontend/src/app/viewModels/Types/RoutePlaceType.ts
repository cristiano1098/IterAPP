
/**
 * This type represents the visiting time of a place in a route
 */
export class RoutePlaceType {

    /**
     * Construct's an instance of {@link RoutePlaceType}.
     * 
     * @param idPlace place's id
     * @param startTime place's start visiting time
     * @param finishTime place's finish visiting time
     */
    constructor(
        public idPlace: string,
        public startTime: Date,
        public finishTime: Date
    ) { }

    /**
     * Returns a representation of the hours and minues of the date ("hh:mm").
     * 
     * @param date the date to be transformed.
     * @returns a string representation of the time ("hh:mm").
     */
    static getStringTime(date: Date): string {
        let hours = date.getHours()
        let minutes = date.getMinutes()

        let hoursString = hours.toString();
        let minutesString = minutes.toString();

        if (hours < 10) {
            hoursString = "0" + hoursString
        }

        if (minutes < 10) {
            minutesString = "0" + minutesString
        }

        return hoursString + ":" + minutesString
    }

}

/**
 * This class is used to help the creation of a {@link RoutePlaceType}.
 * The user can specifie the startTime and finishTime properties as an hour and minutes ("hh:mm").
 * It is possible to transform this class into a {@link RoutePlaceType} via the {@link RoutePlaceTypeHelper#toRoutePlaceType}.
 */
export class RoutePlaceTypeHelper {

    /**
     * Construct's an instance of {@link RoutePlaceTypeHelper}.
     * 
     * @param idPlace place's id
     * @param startTime place's start time
     * @param finishTime place's finish time
     */
    constructor(
        public idPlace: string,
        public startTime: string,
        public finishTime: string
    ) { }

    /**
     * Creates a {@link RoutePlaceType} instance based on the {@link RoutePlaceTypeHelper} instance
     * 
     * @returns a {@link RoutePlaceType} instance
     */
    toRoutePlaceType(): RoutePlaceType {
        let startDate = new Date()
        let finishDate = new Date()

        let timeStart = this.startTime.split(":")
        let timeEnd = this.finishTime.split(":")

        startDate.setHours(Number(timeStart[0]))
        startDate.setMinutes(Number(timeStart[1]))
        startDate.setSeconds(0)
        startDate.setMilliseconds(0)

        finishDate.setHours(Number(timeEnd[0]))
        finishDate.setMinutes(Number(timeEnd[1]))
        finishDate.setSeconds(0)
        finishDate.setMilliseconds(0)


        return new RoutePlaceType(this.idPlace, startDate, finishDate)
    }
}
