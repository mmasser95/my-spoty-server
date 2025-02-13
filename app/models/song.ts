import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Album from './album.js'
import { type ManyToMany, type BelongsTo } from '@adonisjs/lucid/types/relations'
import Genre from './genre.js'
import Playlist from './playlist.js'
import Artist from './artist.js'

export default class Song extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare filePath: string

  @column()
  declare albumId: number | null

  @column()
  declare genreId: number | null

  @column()
  declare spotifyId: string | null

  @column()
  declare youtubeId: string | null

  @belongsTo(() => Album)
  declare album: BelongsTo<typeof Album>

  @belongsTo(() => Genre)
  declare genre: BelongsTo<typeof Genre>

  @manyToMany(() => Artist, {
    pivotTable: "artist_songs"
  })
  declare artists: ManyToMany<typeof Artist>

  @manyToMany(() => Playlist, { pivotTable: "playlist_songs" })
  declare playlists: ManyToMany<typeof Playlist>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}