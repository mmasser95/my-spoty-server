import Library from "#models/library"
import LibraryPolicy from "#policies/library_policy"

export default class LibraryRepository {
    public async create(data: Partial<Library>, bouncer: any) {
        if (await bouncer.with(LibraryPolicy).allows('create'))
            return await Library.create(data)
    }

    public async list(userId: number) {
        return await Library.query()
            .where('userId', userId)
    }

    public async findById(id: number) {
        return await Library.query().where('id', id).firstOrFail()
    }

    public async update(id: number, data: Partial<Library>, bouncer: any) {
        const library = await Library.findOrFail(id)
        if (await bouncer.with(LibraryPolicy).denies('edit', library))
            throw new Error("Unauthorized");
        library.merge(data)
        await library.save()
        return library
    }

    public async delete(id: number, bouncer: any) {
        const library = await Library.findOrFail(id)
        if (await bouncer.with(LibraryPolicy).allows('delete', library))
            await library.delete()
    }
}
