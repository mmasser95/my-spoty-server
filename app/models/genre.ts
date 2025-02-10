import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Song from './song.js'
import { type HasMany } from '@adonisjs/lucid/types/relations'

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name:string

  @hasMany(()=>Song)
  declare songs:HasMany<typeof Song>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}