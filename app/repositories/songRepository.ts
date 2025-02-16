import Album from "#models/album";
import Song from "#models/song";

export default class SongRepository {

    /**
     * create
     */
    public async create(data: Partial<Song>) {
        return await Song.create(data)
    }

    /**
     * list
     */
    public async list() {
        return await Song.query()
            .preload("artists")
            .preload('album')
    }

    public async findById(id: number) {
        return await Song.query()
            .where('id', id)
            .preload('album')
            .preload('genre')
            .preload('artists')
            .firstOrFail()
    }

    public async search(query: string) {
        return await Song.query()
            .whereLike('title', `%${query}%`)
            .preload('album')
            .preload('artists')
            .preload('genre')
    }

    public async update(id: number, data: Partial<Song>) {
        const song = await Song.findByOrFail('id', id)
        song.merge(data)
        await song.save()
        return song
    }

    public async delete(id: number) {
        const song = await Song.findByOrFail('id', id)
        await song.delete()
        return song
    }

    public async searchBySpotify(spotifyId: string) {
        return await Song.query()
            .where('spotifyId', spotifyId)
    }
    public async searchByYoutube(youtubeId: string) {
        return await Song.query()
            .where('youtubeId', youtubeId).firstOrFail()
    }

    public async addArtistsToSong(song: Song, artists: number[]) {
        await song.related('artists').attach(artists)
    }
    public async addAlbumToSong(song: Song, album: Album) {
        await song.related('album').associate(album)
    }

}