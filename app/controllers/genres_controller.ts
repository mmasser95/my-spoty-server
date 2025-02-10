import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import GenreRepository from '../repositories/genreRepository.js';

@inject()
export default class GenresController {

  constructor(
    private genreRepository: GenreRepository
  ) { }

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const genres = await this.genreRepository.list()
      return response.ok(genres)
    } catch {
      return response.internalServerError({ message: 'Error al obtener los géneros' })
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
      const genreData = request.only(['name'])
      const genre = await this.genreRepository.create(genreData)
      return response.created(genre)
    } catch {
      return response.badRequest({ message: 'Error al crear el género' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const genre = await this.genreRepository.findById(params.id)
      return response.ok(genre)
    } catch {
      return response.notFound({ message: 'Género no encontrado' })
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
      const genreData = request.only(['name'])
      const genre = await this.genreRepository.update(params.id, genreData)
      return response.ok(genre)
    } catch {
      return response.badRequest({ message: 'Error al actualizar el género' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.genreRepository.delete(params.id)
      return response.noContent()
    } catch {
      return response.badRequest({ message: 'Error al eliminar el género' })
    }
  }
}