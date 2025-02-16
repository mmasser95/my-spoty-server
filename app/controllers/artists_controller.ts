import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import ArtistRepository from '../repositories/artistRepository.js';

@inject()
export default class ArtistsController {

  constructor(
    private artistRepository: ArtistRepository
  ) { }

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const artists = await this.artistRepository.list()
      return response.ok(artists)
    } catch {
      return response.internalServerError({ message: 'Error al obtener los artistas' })
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
      const artistData = request.only(['name', 'genre'])
      const artist = await this.artistRepository.create(artistData)
      return response.created(artist)
    } catch {
      return response.badRequest({ message: 'Error al crear el artista' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const artist = await this.artistRepository.findById(params.id)
      return response.ok(artist)
    } catch {
      return response.notFound({ message: 'Artista no encontrado' })
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
      const artistData = request.only(['name', 'genre'])
      const artist = await this.artistRepository.update(params.id, artistData)
      return response.ok(artist)
    } catch {
      return response.badRequest({ message: 'Error al actualizar el artista' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.artistRepository.delete(params.id)
      return response.noContent()
    } catch {
      return response.badRequest({ message: 'Error al eliminar el artista' })
    }
  }

  async searchArtists({ request, response }: HttpContext) {
    try {
      const { query } = request.body()
      let results
      if (query === "")
        results = await this.artistRepository.latestArtists()
      else
        results = await this.artistRepository.search(query)
      return response.ok(results)
    } catch (error) {
      return response.badRequest(`Error: ${error}`)
    }
  }
}