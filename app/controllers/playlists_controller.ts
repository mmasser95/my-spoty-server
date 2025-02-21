import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import PlaylistRepository from '../repositories/playlistRepository.js';

@inject()
export default class PlaylistsController {

  constructor(
    private playlistRepository: PlaylistRepository
  ) { }
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const playlists = await this.playlistRepository.list()
      return response.ok(playlists)
    } catch {
      return response.internalServerError({ message: 'Error al obtener las playlists' })
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
  async store({ auth, request, response, bouncer }: HttpContext) {
    try {
      const user = auth.user;
      if (!user) return response.unauthorized({ message: 'Usuario no autorizado' })
      const playlistData = request.body()
      const playlist = await this.playlistRepository.create({ ...playlistData, userId: user.id }, bouncer)
      return response.created(playlist)
    } catch {
      return response.badRequest({ message: 'Error al crear la playlist' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const playlist = await this.playlistRepository.findById(params.id)
      return response.ok(playlist)
    } catch {
      return response.notFound({ message: 'Playlist no encontrada' })
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
  async update({ params, request, response, bouncer }: HttpContext) {
    try {
      const playlistData = request.only(['name', 'userId'])
      const playlist = await this.playlistRepository.update(params.id, playlistData, bouncer)
      return response.ok(playlist)
    } catch {
      return response.badRequest({ message: 'Error al actualizar la playlist' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response, bouncer }: HttpContext) {
    try {
      await this.playlistRepository.delete(params.id, bouncer)
      return response.noContent()
    } catch {
      return response.badRequest({ message: 'Error al eliminar la playlist' })
    }
  }

  async addSongToPlaylist({ params, response }: HttpContext) {
    try {
      const { id, idSong } = params
      await this.playlistRepository.addSongToPlaylist(id, idSong)
      return response.noContent()
    } catch (error) {
      return response.badRequest({ message: `Error al agregar la cancion a la playlist: ${error}` })
    }
  }
  async deleteSongFromPlaylist({ params, response }: HttpContext) {
    try {
      const { id, idSong } = params
      await this.playlistRepository.deleteSongFromPlaylist(id, idSong)
      return response.noContent()
    } catch (error) {
      return response.badRequest({ message: `Error al eliminar cancion de la playlist: ${error}` })
    }
  }
}