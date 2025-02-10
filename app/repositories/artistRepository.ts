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
            .preload('songs')
            .firstOrFail()
    }

    public async search(query: string) {
        return await Artist.query()
            .whereILike('name', `%${query}%`)
            .preload('songs')
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
}