import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'playlist_songs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('playlist_id').unsigned().references('id').inTable('playlists').onDelete('CASCADE')
      table.integer('song_id').unsigned().references('id').inTable('songs').onDelete('CASCADE')
      table.unique(['playlist_id', 'song_id'])
      table.integer('order').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}