import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import AlbumRepository from '../repositories/albumRepository.js';

@inject()
export default class AlbumsController {
  constructor(
    private albumRepository: AlbumRepository
  ) { }
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const albums = await this.albumRepository.list()
      return response.ok(albums)
    } catch {
      return response.internalServerError({ message: 'Error al obtener los álbumes' })
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
      const albumData = request.only(['name', 'artistId', 'coverImage', 'description', 'spotifyId'])
      const album = await this.albumRepository.create(albumData)
      return response.created(album)
    } catch {
      return response.badRequest({ message: 'Error al crear el álbum' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const album = await this.albumRepository.findById(params.id)
      return response.ok(album)
    } catch {
      return response.notFound({ message: 'Álbum no encontrado' })
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
      const albumData = request.only(['title', 'artistId', 'releaseDate'])
      const album = await this.albumRepository.update(params.id, albumData)
      return response.ok(album)
    } catch {
      return response.badRequest({ message: 'Error al actualizar el álbum' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.albumRepository.delete(params.id)
      return response.noContent()
    } catch {
      return response.badRequest({ message: 'Error al eliminar el álbum' })
    }
  }

  async searchAlbums({ request, response }: HttpContext) {
    try {
      const { query } = request.body()
      const results = await this.albumRepository.search(query)
      return response.ok(results)
    } catch (error) {
      return response.badRequest(`Error: ${error}`)
    }
  }
}