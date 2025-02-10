import Album from "#models/album";

export default class AlbumRepository {
    public async create(data: Partial<Album>) {
        return await Album.create(data)
    }

    public async list() {
        return await Album.query()
    }

    public async findById(id: number) {
        return await Album.query()
            .where('id', id)
            .preload('songs')
            .preload('artist')
            .firstOrFail()
    }

    public async update(id: number, data: Partial<Album>) {
        const album = await Album.findByOrFail('id', id)
        album.merge(data)
        await album.save()
        return album
    }

    public async delete(id: number) {
        const album = await Album.findByOrFail('id', id)
        await album.delete()
        return album
    }
}