import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import LibraryRepository from '../repositories/libraryRepository.js';

@inject()
export default class LibrariesController {

  constructor(
    private libraryRepository: LibraryRepository
  ) { }

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const libraries = await this.libraryRepository.list()
      return response.ok(libraries)
    } catch {
      return response.internalServerError({ message: 'Error al obtener las bibliotecas' })
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
      const libraryData = request.only(['userId', 'path'])
      const library = await this.libraryRepository.create(libraryData)
      return response.created(library)
    } catch {
      return response.badRequest({ message: 'Error al crear la biblioteca' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const library = await this.libraryRepository.findById(params.id)
      return response.ok(library)
    } catch {
      return response.notFound({ message: 'Biblioteca no encontrada' })
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
      const libraryData = request.only(['userId', 'path'])
      const library = await this.libraryRepository.update(params.id, libraryData)
      return response.ok(library)
    } catch {
      return response.badRequest({ message: 'Error al actualizar la biblioteca' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.libraryRepository.delete(params.id)
      return response.noContent()
    } catch {
      return response.badRequest({ message: 'Error al eliminar la biblioteca' })
    }
  }
}