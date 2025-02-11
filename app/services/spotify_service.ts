import env from "#start/env";

export default class SpotifyService {
    private clientId = env.get("SPOTIFY_CLIENT_ID")
    private clientSecret = env.get("SPOTIFY_CLIENT_SECRET")
    private token: string | null = null
    private tokenExpiration: number = 0
    /**
   * 🔑 Obtiene un nuevo token de acceso de Spotify
   */
    private async getAccessToken() {
        if (this.token && Date.now() < this.tokenExpiration) {
            return this.token;
        }

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64"),
            },
            body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
        });

        if (!response.ok) {
            throw new Error(`Error en la autenticación: ${response.statusText}`);
        }

        const data: any = await response.json();
        this.token = data.access_token;
        this.tokenExpiration = Date.now() + data.expires_in * 1000;
        if (this.token)
            return this.token;
    }

    /**
     * 🔎 Realiza una consulta a la API de Spotify
     */
    private async querySpotify(endpoint: string, params: Record<string, string> = {}) {
        const token = await this.getAccessToken();
        const url = new URL(`https://api.spotify.com/v1/${endpoint}`);

        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`Error en la petición a Spotify: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * 🔍 Buscar en Spotify (artistas, álbumes, canciones, playlists)
     */
    public async search(query: string, type: "artist" | "track" | "album" | "playlist") {
        return this.querySpotify("search", { q: query, type });
    }

    /**
     * 🎤 Obtener información de un artista
     */
    public async getArtist(artistId: string) {
        return this.querySpotify(`artists/${artistId}`);
    }

    /**
     * 📀 Obtener los álbumes de un artista
     */
    public async getArtistAlbums(artistId: string) {
        return this.querySpotify(`artists/${artistId}/albums`);
    }

    /**
     * 🎵 Obtener información de una canción
     */
    public async getTrack(trackId: string) {
        return this.querySpotify(`tracks/${trackId}`);
    }

    /**
     * 🎼 Obtener una playlist
     */
    public async getPlaylist(playlistId: string) {
        return this.querySpotify(`playlists/${playlistId}`);
    }
}