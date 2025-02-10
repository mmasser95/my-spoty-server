import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Song from './song.js'
import { type ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Artist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare photo: string | null

  @column()
  declare bio: string | null

  @manyToMany(() => Song, {
    pivotTable: "artist_songs"
  })
  declare songs: ManyToMany<typeof Song>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}