import User from '#models/user'
import Library from '#models/library'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class LibraryPolicy extends BasePolicy {
    create(user: User): AuthorizerResponse {
        return true
    }
    edit(user: User, library: Library): AuthorizerResponse {
        return user.id == library.userId
    }
    delete(user: User, library: Library): AuthorizerResponse {
        return user.id == library.userId
    }
}