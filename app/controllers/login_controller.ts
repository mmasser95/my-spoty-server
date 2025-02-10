import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import LoginRepository from '../repositories/loginRepository.js'
import UserRepository from '../repositories/userRepository.js'

@inject()
export default class LoginController {

  constructor(
    private loginRepository: LoginRepository,
    private userRepository: UserRepository
  ) { }

  async login({ request, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await this.loginRepository.login(email, password)
      return response.ok(user)
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }

  async signin({ request, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')
    const fullName = request.input('fullName')
    try {
      const user = await this.userRepository.create({ email, password, fullName })
      return response.created(user)
    } catch (error) {
      return response.badRequest("No se ha podido crear el usuario")
    }
  }
}