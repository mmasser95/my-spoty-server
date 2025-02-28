import env from "#start/env";
import { load } from "cheerio";

export default class GeniusService {
    private access_token = env.get("GENIUS_ACCESS_TOKEN")
    private API_URL = "https://api.genius.com"

    public async getLyrics(artist: string, title: string) {
        try {
            const query = `${artist} ${title}`
            const query_url = `${this.API_URL}/search?q=${encodeURIComponent(query)}`

            const res = await fetch(query_url, {
                headers: {
                    'Authorization': `Bearer ${this.access_token}`
                }
            })
            if (!res.ok)
                throw new Error(await res.text());
            let data: {
                response: {
                    hits: any
                }
            } = await res.json()

            const hits = data.response.hits
            if (!hits || hits.length === 0)
                throw new Error("Any song found");

            const songPath = hits[0].result.url

            const lyrics = await this.scrapeLyrics(songPath)

            return lyrics
        } catch (error) {
            throw new Error(error);
        }
    }

    private async scrapeLyrics(songPath: string) {
        try {
            const res = await fetch(songPath)
            if (!res.ok)
                throw new Error(await res.text());
            const response = await res.text()
            const $ = load(response)
            // Extraer las letras respetando los saltos de línea
            let lyrics = ''
            // lyrics = $('div[data-lyrics-container="true"]').html()
            // if (!lyrics)
            //     lyrics = $('.lyrics').html()
            // if (!lyrics)
            //     throw new Error("Lyrics not found");
            $('div[data-lyrics-container="true"]').each((i, el) => {
                $(el)
                    .contents()
                    .each((_, element) => {
                        if (element.type === 'text') {
                            lyrics += $(element).text().trim() + '\n'
                        } else if (element.tagName === 'br') {
                            lyrics += '\n'
                        }
                    })
            })

            // Fallback: Si no se encontraron letras con data-lyrics-container, intentar con .lyrics
            if (!lyrics.trim()) {
                $('.lyrics').each((_, el) => {
                    lyrics += $(el).text().replace(/\n+/g, '\n').trim() + '\n'
                })
            }
            return lyrics
        } catch (error) {
            throw new Error(error);
        }
    }
}