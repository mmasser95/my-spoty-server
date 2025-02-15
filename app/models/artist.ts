import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Song from './song.js'
import { type ManyToMany } from '@adonisjs/lucid/types/relations'
import Album from './album.js'

export default class Artist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare photo: string | null

  @column()
  declare bio: string | null

  @column()
  declare spotifyId:string|null

  @manyToMany(() => Song, {
    pivotTable: "artist_songs"
  })
  declare songs: ManyToMany<typeof Song>

  @manyToMany(() => Album, {
    pivotTable: 'album_artist',
  })
  declare albums: ManyToMany<typeof Album>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}