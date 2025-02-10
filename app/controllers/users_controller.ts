import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import UserRepository from '../repositories/userRepository.js';

@inject()
export default class UsersController {

  constructor(
    private userRepository: UserRepository
  ) { }

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const users = await this.userRepository.list()
      return response.ok(users)
    } catch (error) {
      return response.internalServerError({ message: "Error al obtener los usuarios" })
    }
  }

  /**
   * Display form to create a new record 
   * 
   * NOT NEEDED
   */
  async create({ response }: HttpContext) {
    return response.noContent()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const userData = request.only(['name', 'email', 'password'])
      const user = await this.userRepository.create(userData)
      return response.created(user)
    } catch (error) {
      return response.badRequest({ message: 'Error al crear el usuario' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const user = await this.userRepository.findById(params.id)
      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: "Usuario no encontrado" })
    }
  }

  /**
   * Edit individual record
   * 
   * NOT NEEDED
   */
  async edit({ response }: HttpContext) {
    return response.noContent()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const userData = request.only(['name', 'email', 'password'])
      const user = await this.userRepository.update(params.id, userData)
      return response.ok(user)
    } catch (error) {
      return response.badRequest({ message: "Error al actualizar el usuario" })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const user = await this.userRepository.delete(params.id)
      return response.ok(user)
    } catch (error) {
      return response.badRequest({ message: "Error al eliminar usuario" })
    }
  }
}