import Library from "#models/library"

export default class LibraryRepository {
    public async create(data: Partial<Library>) {
        return await Library.create(data)
    }

    public async list() {
        return await Library.query()
    }

    public async findById(id: number) {
        return await Library.query().where('id', id).firstOrFail()
    }

    public async update(id: number, data: Partial<Library>) {
        const library = await Library.findOrFail(id)
        library.merge(data)
        await library.save()
        return library
    }

    public async delete(id: number) {
        const library = await Library.findOrFail(id)
        await library.delete()
    }
}
