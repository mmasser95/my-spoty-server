import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'songs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('file_path').notNullable()
      // table.integer('album_id').unsigned().references('id').inTable('albums').onDelete('SET NULL')
      table.integer('genre_id').unsigned().references('id').inTable('genres').onDelete('SET NULL')
      table.string("spotify_id").nullable()
      table.string("youtube_id").nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}