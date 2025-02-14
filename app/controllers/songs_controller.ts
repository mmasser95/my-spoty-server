import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import SongRepository from '../repositories/songRepository.js';
import YoutubeService from '#services/youtube_service';
import SpotifyService from '#services/spotify_service';
import ArtistRepository from '../repositories/artistRepository.js';

@inject()
export default class SongsController {

  constructor(
    private songRepository: SongRepository,
    private artistRepository: ArtistRepository,
    private youtubeService: YoutubeService,
    private spotifyService: SpotifyService
  ) { }

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const songs = await this.songRepository.list()
      return response.ok(songs)
    } catch {
      return response.internalServerError({ message: 'Error al obtener las canciones' })
    }
  }

  /**
   * Display form to create a new record
   */
  async create({ response }: HttpContext) {
    return response.noContent()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const songData = request.only(['title', 'albumId', 'artistId', 'duration', 'spotifyId', 'youtubeId'])
      const song = await this.songRepository.create(songData)
      return response.created(song)
    } catch {
      return response.badRequest({ message: 'Error al crear la canción' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const song = await this.songRepository.findById(params.id)
      return response.ok(song)
    } catch {
      return response.notFound({ message: 'Canción no encontrada' })
    }
  }

  /**
   * Edit individual record
   */
  async edit({ response }: HttpContext) {
    return response.noContent()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const songData = request.only(['title', 'albumId', 'artistId', 'duration'])
      const song = await this.songRepository.update(params.id, songData)
      return response.ok(song)
    } catch {
      return response.badRequest({ message: 'Error al actualizar la canción' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.songRepository.delete(params.id)
      return response.noContent()
    } catch {
      return response.badRequest({ message: 'Error al eliminar la canción' })
    }
  }


  async downloadMp3({ request, response }: HttpContext) {
    try {
      const { url, youtubeId, spotifyId, title, artists } = request.body()
      const artistsIds = await this.artistRepository.getArtistsOrCreate(artists)
      const info = await this.youtubeService.downloadmp3(url)
      const song = await this.songRepository.create({
        youtubeId,
        spotifyId,
        title,
        filePath: info,
      })
      await this.songRepository.addArtistsToSong(song, artistsIds)
      return response.ok(song)
    } catch (error) {
      return response.badRequest({ message: "Error en la request" })
    }
  }

  async searchYoutubeSong({ request, response }: HttpContext) {
    try {
      const { query } = request.body()
      const results = await this.youtubeService.searchSong(query)
      return response.ok(results)
    } catch (error) {
      return response.badRequest({ message: "Error en la request" + error })
    }
  }

  async searchSpotifySong({ request, response }: HttpContext) {
    try {
      const { query } = request.body()
      const results = await this.spotifyService.search(query, "track")
      return response.ok(results)
    } catch (error) {
      return response.badRequest({ message: "Error en la request " + error })
    }
  }

  async searchAllSongs({ request, response }: HttpContext) {
    try {
      const { query } = request.body()

      // Buscar en YouTube
      const youtubeResults = await this.youtubeService.searchSong(query)

      // Para cada resultado de YouTube, verificar si existe en la base de datos
      const resultsWithFilePath = []

      for (const youtubeSong of youtubeResults) {
        const { id: youtubeId } = youtubeSong
        if (!youtubeId) {
          resultsWithFilePath.push(youtubeSong)
          continue
        }
        // Buscar en la base de datos si la canción ya existe usando el youtubeId
        const existingSong = await this.songRepository.searchByYoutube(youtubeId)

        if (existingSong) {
          // Si la canción existe, añadir la información de la canción con la URL local (filePath)
          resultsWithFilePath.push({
            ...youtubeSong,
            filePath: existingSong.filePath
          })
        } else {
          // Si la canción no existe, simplemente añadir la información de YouTube
          resultsWithFilePath.push(youtubeSong)
        }
      }

      return response.ok(resultsWithFilePath)
    } catch (error) {
      return response.badRequest({ message: "Error en la búsqueda: " + error.message })
    }
  }
}