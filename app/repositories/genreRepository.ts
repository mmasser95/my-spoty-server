import Genre from "#models/genre"

export default class GenreRepository {
    public async create(data: Partial<Genre>) {
        return await Genre.create(data)
    }

    public async list() {
        return await Genre.query().preload('songs')
    }

    public async findById(id: number) {
        return await Genre.query().where('id', id).preload('songs').firstOrFail()
    }

    public async update(id: number, data: Partial<Genre>) {
        const genre = await Genre.findOrFail(id)
        genre.merge(data)
        await genre.save()
        return genre
    }

    public async delete(id: number) {
        const genre = await Genre.findOrFail(id)
        await genre.delete()
    }
}
