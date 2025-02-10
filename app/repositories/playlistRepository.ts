import Playlist from "#models/playlist"

export default class PlaylistRepository {
  public async create(data: Partial<Playlist>) {
    return await Playlist.create(data)
  }

  public async list() {
    return await Playlist.query().preload('songs').preload('user')
  }

  public async findById(id: number) {
    return await Playlist.query()
      .where('id', id)
      .preload('songs')
      .preload('user')
      .firstOrFail()
  }

  public async update(id: number, data: Partial<Playlist>) {
    const playlist = await Playlist.findOrFail(id)
    playlist.merge(data)
    await playlist.save()
    return playlist
  }

  public async delete(id: number) {
    const playlist = await Playlist.findOrFail(id)
    await playlist.delete()
  }
}
