import Playlist from "#models/playlist"
import PlaylistPolicy from "#policies/playlist_policy"

export default class PlaylistRepository {
  public async create(data: Partial<Playlist>, bouncer: any) {
    if (await bouncer.with(PlaylistPolicy).allows('create'))
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

  public async update(id: number, data: Partial<Playlist>, bouncer: any) {
    const playlist = await Playlist.findOrFail(id)
    if (await bouncer.with(PlaylistPolicy).denies('edit', playlist))
      throw new Error("Unauthorized")
    playlist.merge(data)
    await playlist.save()
    return playlist
  }

  public async delete(id: number, bouncer: any) {
    const playlist = await Playlist.findOrFail(id)
    if (await bouncer.with(PlaylistPolicy).allows('delete', playlist))
      await playlist.delete()
  }
}
