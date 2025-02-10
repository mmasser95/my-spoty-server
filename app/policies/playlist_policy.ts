import User from '#models/user'
import Playlist from '#models/playlist'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PlaylistPolicy extends BasePolicy {
    create(user: User): AuthorizerResponse {
        return true
    }
    edit(user: User, playlist: Playlist): AuthorizerResponse {
        return user.id == playlist.userId
    }
    delete(user: User, playlist: Playlist): AuthorizerResponse {
        return user.id == playlist.userId
    }
}