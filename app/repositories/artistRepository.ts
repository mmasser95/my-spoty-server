import Artist from "#models/artist";

export default class ArtistRepository {
    public async create(data: Partial<Artist>) {
        return await Artist.create(data)
    }

    public async list() {
        return await Artist.query()
    }

    public async findById(id: number) {
        return await Artist.query()
            .where('id', id)
            .preload('songs', (songsQuery) => {
                songsQuery
                    .preload('album')
                    .preload('artists')
            })
            .firstOrFail()
    }

    public async search(query: string) {
        return await Artist.query()
            .whereLike('name', `%${query}%`)
            .preload('albums')
            .preload('songs', (songsQuery) => {
                songsQuery
                    .preload('album')
                    .preload('artists')
            })
    }

    public async update(id: number, data: Partial<Artist>) {
        const artist = await Artist.findByOrFail('id', id)
        artist.merge(data)
        await artist.save()
        return artist
    }

    public async delete(id: number) {
        const artist = await Artist.findByOrFail('id', id)
        await artist.delete()
        return artist
    }

    public async getArtistsOrCreate(
        artists: {
            name: string,
            spotifyId: string
        }[]
    ) {
        let artistIds = []
        for (const artistsData of artists) {
            let artist = await Artist.findBy('spotifyId', artistsData.spotifyId);
            if (!artist)
                artist = await Artist.create({
                    name: artistsData.name,
                    spotifyId: artistsData.spotifyId
                })
            artistIds.push(artist.id)
        }
        return artistIds
    }
    public async latestArtists() {
        return await Artist.query()
            .preload('albums')
            .preload('songs', (songsQuery) => {
                songsQuery
                    .preload('album')
                    .preload('artists')
            })
            .orderBy('created_at', 'desc')
            .limit(10)
    }
}