import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Artist from './artist.js'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
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

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @hasMany(() => Song)
  declare songs: HasMany<typeof Song>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}