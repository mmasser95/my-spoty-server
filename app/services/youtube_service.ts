import path from "path";
import { youtubeDl } from "youtube-dl-exec";
import { YouTube } from "youtube-sr";
import fs from 'fs/promises'

export default class YoutubeService {
    public async getInfo(url: string) {
        try {
            const info = await youtubeDl(url, {
                dumpSingleJson: true
            })
            return info
        } catch (error) {
            console.error("Error obteniendo la informacion del video ", error);
        }
    }

    public async downloadmp3(url: string) {
        const outputDir = path.join("./public")
        await fs.mkdir(outputDir, { recursive: true })
        const outputFile = path.join(outputDir, '%(title)s.%(ext)s')
        try {
            const audio = await youtubeDl(url, {
                extractAudio: true,
                audioFormat: 'mp3',
                output: outputFile
            })
            // Convertir el output en un array de líneas
            const outputLines = audio.toString().split("\n")

            // Buscar la línea que contiene '[ExtractAudio] Destination:'
            const destinationLine = outputLines.find(line => line.includes("[ExtractAudio] Destination:"))

            if (!destinationLine) {
                throw new Error("No se encontró la ruta de destino en la salida de youtube-dl.")
            }

            // Extraer la ruta de destino del archivo MP3
            const destinationPath = destinationLine.split("[ExtractAudio] Destination: ")[1].trim()

            return destinationPath
        } catch (error) {
            console.error("Error al descargar el audio: ", error);
        }
    }
    public async searchSong(query: string) {
        return await YouTube.search(query, { type: 'video', limit: 20 })
    }
}