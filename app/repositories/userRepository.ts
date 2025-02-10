import User from "#models/user";

export default class UserRepository {
    public async create(data: Partial<User>) {
        return await User.create(data)
    }
    public async list() {
        return await User.query().preload('playlists').preload('libraries')
    }

    public async findById(id: number) {
        return await User.query()
            .where('id', id)
            .preload("playlists")
            .preload("libraries")
            .firstOrFail()
    }
    public async findByEmail(email: string) {
        return await User.query()
            .where('email', email)
            .preload("playlists")
            .preload("libraries")
            .firstOrFail()
    }
    public async update(id: number, data: Partial<User>) {
        const user = await User.findByOrFail('id', id)
        user.merge(data)
        await user.save()
        return user
    }
    public async delete(id: number) {
        const user = await User.findByOrFail('id', id)
        await user.delete()
        return user
    }
}