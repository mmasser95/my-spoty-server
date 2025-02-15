import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Artist from './artist.js'
import { type ManyToMany, type HasMany } from '@adonisjs/lucid/types/relations'
import Song from './song.js'

export default class Album extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare coverImage: string | null

  @column()
  declare description: string | null

  @column()
  declare artistId: number | null

  @column()
  declare spotifyId: string | null

  @manyToMany(() => Artist, {
    pivotTable: 'album_artist',
  })
  declare artists: ManyToMany<typeof Artist>

  @hasMany(() => Song)
  declare songs: HasMany<typeof Song>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}