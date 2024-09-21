import axios from "axios"
import { z } from "zod"
// import { object, string, number, InferOutput, parse } from "valibot"
import { SearchType } from "../types"

// Type Guards/Assertions
// function isWeatherResponse(weather: unknown): weather is Weather {
//     return (
//         Boolean(weather) &&
//         typeof weather === 'object' &&
//         typeof (weather as Weather).name === 'string' &&
//         typeof (weather as Weather).main.temp === 'number' &&
//         typeof (weather as Weather).main.temp_max === 'number' &&
//         typeof (weather as Weather).main.temp_min === 'number'
//     )
// }

// Zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})
type Weather = z.infer<typeof Weather>

// Valibot
// const Weather = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// })
// type Weather = InferOutput<typeof Weather>

export default function useWeather() {

    const fetchWeather = async (search: SearchType) => {
        const apiKey = import.meta.env.VITE_API_KEY
        try {
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiKey}`
            const { data } = await axios.get(geoUrl)

            const lat = data[0].lat
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`

            // Cast Type
            // const { data: weatherResult } = await axios.get<Weather>(weatherUrl)
            // console.log(weatherResult)

            // Type Guards
            // const { data: weatherResult } = await axios.get(weatherUrl)
            // const result = isWeatherResponse(weatherResult)
            // if (result) {
            //     console.log(weatherResult)
            // } else {
            //     console.error('Invalid weather response')
            // }

            // Zod
            const { data: weatherResult } = await axios.get(weatherUrl)
            const result = Weather.safeParse(weatherResult)
            if (result.success) {
                console.log(result.data)
            } else {
                console.error('Invalid weather response')
            }

            // Valibot
            // const { data: weatherResult } = await axios.get(weatherUrl)
            // const result = parse(Weather, weatherResult)
            // if (result) {
            //     console.log(result)
            // } else {
            //     console.error('Invalid weather response')
            // }

        } catch (error) {
            console.error(error)
        }
    }

    return {
        fetchWeather
    }
}