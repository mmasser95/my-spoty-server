import Album from "#models/album";
import { inject } from "@adonisjs/core";
import ArtistRepository from "./artistRepository.js";

@inject()
export default class AlbumRepository {
    constructor(
        private artistRepository: ArtistRepository
    ) { }
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
            .preload('artists')
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

    public async getAlbumOrCreate(
        album: {
            name: string,
            spotifyId: string,
            coverImage: string
            artists: { name: string, spotifyId: string }[]
        }
    ) {
        let albumRecord = await Album.findBy('spotifyId', album.spotifyId);

        if (!albumRecord) {
            const artistIds = await this.artistRepository.getArtistsOrCreate(album.artists);

            albumRecord = await Album.create({
                name: album.name,
                spotifyId: album.spotifyId,
                coverImage: album.coverImage
            });

            await albumRecord.related('artists').attach(artistIds);
        }

        return albumRecord;
    }
    public async search(query: string) {
        return await Album.query()
            .whereLike('name', `%${query}%`)
            .preload('artists')
            .preload('songs')
    }
    public async latestAlbums() {
        return await Album.query()
            .preload('artists')
            .preload('songs')
            .orderBy('created_at', 'desc')
            .limit(10)
    }
}