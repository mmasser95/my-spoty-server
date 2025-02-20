import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'playlist_songs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('order')
      table.integer('order').unsigned().nullable()      
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table)=>{
      table.dropColumn('order')
      table.integer('order').unsigned().notNullable()
    })
  }
}