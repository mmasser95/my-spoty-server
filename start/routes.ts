/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const AlbumsController = () => import('#controllers/albums_controller')
const ArtistsController = () => import('#controllers/artists_controller')
const SongsController = () => import('#controllers/songs_controller')
const PlaylistsController = () => import('#controllers/playlists_controller')
const LibrariesController = () => import('#controllers/libraries_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('users', UsersController)
router.resource('albums', AlbumsController)
router.resource('artists', ArtistsController)
router.resource('songs', SongsController)
router.resource('playlists', PlaylistsController)
router.resource('libraries', LibrariesController)