import type { KVNamespace } from "@cloudflare/workers-types";

export interface Env {
    kv_ethanreyna_com_spotify: KVNamespace;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
  }

type SpotifyPlaylist = {
	name: string;
	image?: string;
	track_link?: string;
	playlist_link?: string;
}

type SpotifyTrack = {
	name: string;
	image?: string;
	preview_url?: string;
	track_url?: string;
}

  const KINDA_SECRET = "a0951e5b44c84430a910316a8a8754c6";
  const SPOTIFY_USER_ID = "ethanpreyna";

  const CORS_HEADERS = {
    "Access-Control-Allow-Headers": "Authorization",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Origin": "*",
  };

  async function getSpotifyAccessToken(env: Env): Promise<string> {
    const cachedAccessToken = await env.kv_ethanreyna_com_spotify.get(
      `access_token:${SPOTIFY_USER_ID}`
    );
    if (cachedAccessToken) {
      return cachedAccessToken;
    }
    const refresh_token = await env.kv_ethanreyna_com_spotify.get(
      `refresh:${SPOTIFY_USER_ID}`
    );
    if (!refresh_token) {
      throw new Error(`no refresh token for '${SPOTIFY_USER_ID}'`);
    }
    const authBody = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    });
    const authHeader = btoa(
      `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
    );
    const tokenResp = await fetch("https://accounts.spotify.com/api/token", {
      body: authBody,
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    const accessToken = ((await tokenResp.json()) as any).access_token;
    await env.kv_ethanreyna_com_spotify.put(
      `access_token:${SPOTIFY_USER_ID}`,
      accessToken,
      {
        expirationTtl: 3500,
      }
    );
    return accessToken;
  }


  
  async function current(env: Env): Promise<string> {
    const cacheHit = await env.kv_ethanreyna_com_spotify.get(
      `current:${SPOTIFY_USER_ID}`
    );
    if (cacheHit) {
      return cacheHit;
    }
    const accessToken = await getSpotifyAccessToken(env);
    const currentlyPlayingResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (currentlyPlayingResponse.status === 204) {
      return "";
    }
    const respBody = JSON.stringify(await currentlyPlayingResponse.json());
    await env.kv_ethanreyna_com_spotify.put(
      `current:${SPOTIFY_USER_ID}`,
      respBody,
      { expirationTtl: 60 }
    );
    return respBody;
  }
  
  async function recent(env: Env): Promise<string> {
    const cacheHit = await env.kv_ethanreyna_com_spotify.get(
      `recent:${SPOTIFY_USER_ID}`
    );
    if (cacheHit) {
      return cacheHit;
    }
    const accessToken = await getSpotifyAccessToken(env);
    const recentlyPlayedResponse = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const respBody = JSON.stringify(await recentlyPlayedResponse.json());
    await env.kv_ethanreyna_com_spotify.put(
      `recent:${SPOTIFY_USER_ID}`,
      respBody,
      { expirationTtl: 120 }
    );
    return respBody;
  }

  async function playlists(env: Env): Promise<string> {
	const currentTimeSection = getCurrentTimeSection();
    const cacheHit = await env.kv_ethanreyna_com_spotify.get(
      `playlists:${currentTimeSection}`
    );
	console.log(cacheHit);
    if (cacheHit) {
      return cacheHit;
    }
    const accessToken = await getSpotifyAccessToken(env);
    const recentlyPlayedResponse = await fetch(
		`https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const respBody = ((await recentlyPlayedResponse.json()) as any);

	let foundPlaylist: SpotifyPlaylist = {name:'Playlist not found.'}

	if(respBody){
		const playlists = respBody.items;
		foundPlaylist = findDaylist(playlists);
	}

    const finalBody = JSON.stringify(foundPlaylist);

    await env.kv_ethanreyna_com_spotify.put(
      `playlists:${currentTimeSection}`,
      finalBody,
      { expirationTtl: 1209600 }
    );

    return finalBody;
  }

  
  function getCurrentTimeSection():string{
	const date = new Date();
	const currentHour = date.getHours();
	
	let currentTimeSection = 1;
	if (currentHour >= 4) currentTimeSection = 2;
	if (currentHour >= 8) currentTimeSection = 3;
	if (currentHour >= 12) currentTimeSection = 4;
	if (currentHour >= 16) currentTimeSection = 5;
	if (currentHour >= 20) currentTimeSection = 6;
	
	const currentDate = new Date();
	const secondsPerDay = 24 * 60 * 60; 
	
	const currentDayVal = Math.floor(+currentDate / secondsPerDay);
	
	return `${currentDayVal}${currentTimeSection}`;
  }


  function findDaylist(playlists: any){
    const daylist = playlists.find((playlistItem: any) =>
      playlistItem.name.toLowerCase().includes("daylist")
    );

    if(daylist){
      const daylistFormatted: SpotifyPlaylist = {
        name: daylist.name,
        image: daylist.images[0].url,
        track_link: daylist.tracks.href,
        playlist_link: daylist.external_urls.spotify,
      }
      return daylistFormatted;
    }

    return daylist;
	}

async function tracks(env: Env, playlistId: string): Promise<string> {
    const cacheHit = await env.kv_ethanreyna_com_spotify.get(
      `tracks:${SPOTIFY_USER_ID}`
    );
    if (cacheHit) {
      return cacheHit;
    }
    const accessToken = await getSpotifyAccessToken(env);
    const recentlyPlayedResponse = await fetch(
		`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const respBody = ((await recentlyPlayedResponse.json()) as any);

	let finalTracks:SpotifyTrack[] = [];

	if(respBody){
		finalTracks = getTrackData(respBody);
	}

    const finalBody = JSON.stringify(finalTracks);

    await env.kv_ethanreyna_com_spotify.put(
      `tracks:${SPOTIFY_USER_ID}`,
      finalBody,
      { expirationTtl: 120 }
    );

    return finalBody;
  }

  const getTrackData = (tracks:any):SpotifyTrack[] => {
	const items = tracks.items;
	const finalTracks:SpotifyTrack[] = [];
	items.forEach((item: any) => {
	  const album: any = item.track.album;
	  const currentTrack: SpotifyTrack = {
		name: album.name, 
		image: album.images[0].url, 
		preview_url: item.track.preview_url,
		track_url: item.track.external_urls.spotify,
	  }
	  finalTracks.push(currentTrack);
	})
  
	return finalTracks;
  }
	




  export default {
    async fetch(
      request: Request,
      env: Env,
    ): Promise<Response> {
      if (request.method === "OPTIONS") {
        return new Response("OK", {
          headers: CORS_HEADERS,
        });
      }
      if (request.method !== "GET") {
        return new Response("Not Found", {
          status: 404,
        });
      }
      const authHeader = request.headers.get("Authorization")?.split(" ");
      if (
        authHeader?.length !== 2 ||
        authHeader[0] !== "Basic" ||
        authHeader[1] !== KINDA_SECRET
      ) {
        return new Response("Unauthorized", { status: 401 });
      }
      const url = new URL(request.url);
      switch (url.pathname) {
        case "/current":
          const rCurrent = await current(env);
          if (rCurrent === "") {
            return new Response(rCurrent, { headers: CORS_HEADERS, status: 204 });
          }
        	return new Response(rCurrent, { headers: CORS_HEADERS, status: 200 });
        case "/playlists":
        	const rPlaylists = await playlists(env);
        	return new Response(rPlaylists, { headers: CORS_HEADERS, status: 200 });
		case "/recent":
			const rRecent = await recent(env);
			return new Response(rRecent, { headers: CORS_HEADERS, status: 200 });
		default:
			if (url.pathname.startsWith("/tracks/")) {
				const exampleId = url.pathname.substring("/tracks/".length);
				const rTracks = await tracks(env, exampleId);
				return new Response(rTracks, { headers: CORS_HEADERS, status: 200 });
			}
      }
      return new Response("Not Found", { status: 404 });
    },
  };