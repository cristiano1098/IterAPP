import { RouteVM } from "../viewModels/responses/RouteVM";
import { RoutePlaceType } from "../viewModels/Types/RoutePlaceType";
import { RouteResumeType } from "../viewModels/Types/RouteResumeType";
import { comment1 } from "./CommentType";

/**
 * Route 1
 */
export const route1 = new RouteVM(
    new Date(),
    new RouteResumeType(
        "Dia em Guimarães",
        1,
        4,
        "jose",
        true,
        true,
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta vero nesciunt velit quisquam facere sint explicabo repudiandae laudantium quos molestiae sequi magni, sunt voluptatibus sapiente non, atque iste. Officiis, odio!",
        500,
        5,
        [
            new RoutePlaceType("ChIJIzwXZuzvJA0ROaxWynCX6fw", new Date("2022-01-08T08:00:00.00"), new Date("2022-01-08T09:00:00.000Z")),
            new RoutePlaceType("ChIJH5BcfsLvJA0Ryeum7J8zKK8", new Date("2022-01-08T09:20:00.00"), new Date("2022-01-08T10:00:00.000Z")),
            new RoutePlaceType("ChIJJTc9gebvJA0R8za7VEngEcE", new Date("2022-01-08T10:20:00.00"), new Date("2022-01-08T11:00:00.000Z")),
            new RoutePlaceType("EipMYXJnbyBkbyBUb3VyYWwsIDQ4MTAgR3VpbWFyw6NlcywgUG9ydHVnYWwiLiosChQKEgm5-vUp6O8kDRHr1DBu_wmEPRIUChIJs2vwHxnwJA0RShUcmOiE4lM", new Date("2022-01-08T11:20:00.00"), new Date("2022-01-08T12:00:00.000Z"))
        ],
        "/assets/images/avatarmasculine2.png"
    ),
    [
        comment1,
        comment1,
        comment1,
        comment1,
        comment1,
        comment1,
        comment1
    ]
)