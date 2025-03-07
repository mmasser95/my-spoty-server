/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const AlbumsController = () => import('#controllers/albums_controller')
const ArtistsController = () => import('#controllers/artists_controller')
const SongsController = () => import('#controllers/songs_controller')
const PlaylistsController = () => import('#controllers/playlists_controller')
const LibrariesController = () => import('#controllers/libraries_controller')
const GenresController = () => import('#controllers/genres_controller')
const LoginController = () => import('#controllers/login_controller');


router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('users', UsersController)
router.resource('albums', AlbumsController)
router.resource('artists', ArtistsController)
router.resource('songs', SongsController)
router.resource('genres', GenresController)

router.post('/login', [LoginController, 'login'])
router.post('/signin', [LoginController, 'signin'])

router.post('/download', [SongsController, 'downloadMp3'])
router.post('/youtube/search', [SongsController, 'searchYoutubeSong'])
router.post('/spotify/search', [SongsController, 'searchSpotifySong'])
router.post('/lyrics', [SongsController, 'getLyrics'])
router.post('/songs/search', [SongsController, 'searchSongs'])
router.post('/albums/search', [AlbumsController, 'searchAlbums'])
router.post('/artists/search', [ArtistsController, 'searchArtists'])
router.get('/artist/:id/songs', [SongsController, 'getSongsOfArtist'])

router.group(() => {
  router.resource('libraries', LibrariesController)
  router.resource('playlists', PlaylistsController)
  router.post('/playlists/:id/songs/:idSong', [PlaylistsController, 'addSongToPlaylist'])
  router.delete('/playlists/:id/songs/:idSong', [PlaylistsController, 'deleteSongFromPlaylist'])
}).use(middleware.auth({ guards: ['api'] }))