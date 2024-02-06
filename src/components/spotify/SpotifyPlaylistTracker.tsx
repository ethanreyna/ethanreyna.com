import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowRight  } from "react-icons/fa";



const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Authorization",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Origin": "*",
};

async function getSpotifyAccessToken(): Promise<string>{
  const cachedAccessToken = localStorage.getItem("access_token");
  
  //Used to check local storage to validate token values
  //console.log("access token" + localStorage.getItem("access_token"), "refresh token"+localStorage.getItem("refresh_token"))
  
  if(cachedAccessToken){
    if(!checkExpiredAccessToken()){
      return cachedAccessToken;
    }
  }

  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    throw new Error(`no refresh token for ethanpreyna`);
  }

  const authBody = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });

  const client_id = localStorage.getItem("client_id");
  const client_secret = localStorage.getItem("client_secret");

  const authHeader = btoa(
    `${client_id}:${client_secret}`
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

  if(accessToken){
    const currentTime = new Date().getTime();
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("access_token_timestamp", currentTime.toString());
    console.log("Setting access token: ", accessToken);
  }

  return accessToken;
}

function checkExpiredAccessToken(){
  const storedTimestamp = localStorage.getItem("access_token_timestamp");
  if (storedTimestamp) {
    const currentTime = new Date().getTime();
    const storedTime = parseInt(storedTimestamp, 10);

    // Calculate the elapsed time in seconds
    const elapsedTimeInSeconds = (currentTime - storedTime) / 1000;

    if (elapsedTimeInSeconds >= 3500) {
      // It's been 3500 seconds (or more) since the token was set
      return true;
    } else {
      // Access token is still valid
      return false;
    }
  } else {
    // No stored timestamp found, handle accordingly
    return true;
  }
}

async function findPlaylistsByUser(userId: string, accessToken: string){
  const daylistParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  const daylistResponse = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    daylistParameters
  );
  const playlists = ((await daylistResponse.json()) as any);
  
  return playlists.items;
}

async function getPlaylistTracks(trackLink: string, accessToken: string){
  const daylistParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  const daylistResponse = await fetch(
    trackLink,
    daylistParameters
  );
  const tracks = ((await daylistResponse.json()) as any);
  return tracks;
}

const formatPlaylistName = (name: string) => {
  if (name) {
    // Remove unwanted characters (e.g., "daylist")
    const cleanedName = name.replace(/daylist/gi, "").replace(/ • /g, "").trim();

    // Capitalize the first letter of the first word
    const words = cleanedName.split(" ");
    if (words.length > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }

    return words.join(" ");
  }

  return "No name found";
};

type SpotifyTrack = {
  name: string;
  image?: string;
  preview_url?: string;
  track_url?: string;
}

type SpotifyPlaylist = {
  name: string;
  image?: string;
  track_link?: string;
  playlist_link?: string;
}

const getTrackData = (tracks:any):SpotifyTrack[] => {
  const items = tracks.items;
  const finalTracks:SpotifyTrack[] = [];
  items.forEach((item: any) => {
    const album: any = item.track.album;
    console.log(item.track.external_urls.spotify)
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

function findDaylist(playlists: any){
    const daylist = playlists.find((playlistItem: any) =>
      playlistItem.name.toLowerCase().includes("daylist")
    );

    if(daylist){
      const daylistFormatted: Playlist = {
        name: daylist.name,
        image: daylist.images[0].url,
        track_link: daylist.tracks.href,
        playlist_link: daylist.external_urls.spotify,
      }
      return daylistFormatted;
    }

    return daylist;
}


//Remove this when refresh token finalized
function generateRandomString(length: number) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}
async function authorize() {
  const CLIENT_ID = "a1d2a47bf91342929478261ee1db804e";
  const REDIRECT_URI = "http://localhost:4321/daylist";
  const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public playlist-read-collaborative user-read-recently-played user-top-read user-read-playback-position user-read-currently-playing user-read-playback-state';
  const state = generateRandomString(16);

  const spotifyAuthorizeURL = `https://accounts.spotify.com/authorize?` +
    `response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${state}`;

  window.location.href = spotifyAuthorizeURL;
}
function getCode() {
  const queryString = window.location.search;
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');

    if (code !== null) {
      return code;
    }
  }

  return "error"; 
}
function handleRedirect(){
  let code = getCode();
  const response = fetchAccessToken( code );
  const REDIRECT_URI = "http://localhost:4321/daylist";
  window.history.pushState("", "", REDIRECT_URI); // remove param from url
  return response;
}
async function fetchAccessToken(code: string){
  const CLIENT_ID = "a1d2a47bf91342929478261ee1db804e";
  const CLIENT_SECRET = "a0951e5b44c84430a910316a8a8754c6"
  const REDIRECT_URI = "http://localhost:4321/daylist";
  const authParameters = {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': 'Basic ' + btoa(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      )
    },
    body: 'grant_type=authorization_code'+
    '&code=' + code +
    '&client_id=' + CLIENT_ID + 
    '&client_secret=' + CLIENT_SECRET +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  };

  const tokenResponse = await fetch(
    'https://accounts.spotify.com/api/token', authParameters);
  const accessTokenJson = ((await tokenResponse.json()) as any);

  return accessTokenJson;
}

function handleAuthorizationResponse(response: { accessToken: any; access_token: string | undefined; refresh_token: string | undefined; }){
  if (response.access_token){
    localStorage.setItem("client_id", "a1d2a47bf91342929478261ee1db804e");
    localStorage.setItem("client_secret", "a0951e5b44c84430a910316a8a8754c6");
      if ( response.access_token != undefined ){
          localStorage.setItem("access_token", response.access_token);
      }
      if ( response.refresh_token != undefined ){
          localStorage.setItem("refresh_token", response.refresh_token);
      }
  }
  else {
      console.log(response);
  }
}


const SpotifyPlaylistTracker: React.FC= ({}) => {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [foundPlaylist, setFoundPlaylist] = useState<SpotifyPlaylist>();
  const [accessToken, setAccessToken] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    handleSync();
  }, []);

  useEffect(() => {
    if(playlists){
      setFoundPlaylist(findDaylist(playlists))

    }
  }, [playlists]);

  useEffect(() => {
    if(foundPlaylist){
      handleGetTracks();
    }
  }, [foundPlaylist]);
  

  const handleSync = async () => {
    try {
      const thisAccessToken = await getSpotifyAccessToken();
      setAccessToken(thisAccessToken);
      const playlistResults = await findPlaylistsByUser('ethanpreyna',thisAccessToken);
      setPlaylists(playlistResults)
    } catch (error) {
      console.error(error);
    }
  }

  const handleGetTracks = async() => {
    if(foundPlaylist){
      const tracksResults = await getPlaylistTracks(foundPlaylist.track_link, accessToken);
      setTracks(getTrackData(tracksResults));
    }
  }

  const handleExpand = () => {
    setExpanded(!expanded);
  }

  
  // This is used when I need to update the access token scope
  // const handleAuthorize = () => {
  //   authorize();
  // }
  // const handleNewSync = async() => {
  //   const response = await handleRedirect();
  //   handleAuthorizationResponse(response);
  //   console.log(localStorage.getItem("refresh_token"))
  // }


  return (
    <>
      {foundPlaylist ? (
        <>
        <div style={{ display: "flex", alignItems: "center"}}>

          <img src={foundPlaylist.image} height={"100rem"} style={{ borderRadius: "10px" }} />
            <span
            style={{
              color: "#28323E",
              fontSize: "1.7rem",
              fontWeight: 500,
              transition: "all .25s ease-out",
              paddingLeft: "1rem"
            }}
            >
            {foundPlaylist ? formatPlaylistName(foundPlaylist.name) : <>loading...</>}
            </span>
            {tracks && (
                <div
                style={{
                  cursor: "pointer",
                  marginLeft: "auto"
                }}
                onClick={() => handleExpand()}
              >
                  {expanded ? (
                    <FaArrowDown size={34} color="#28323E"/> 
                  ) : (
                    <FaArrowRight size={34} color="#28323E"/> 
                  )}
                  </div>
            )}
        </div>
        <div style={{ display: "flex", maxHeight: '30rem', overflow: 'auto'}}>
          {expanded && (
            <div >
              {tracks.map((track: SpotifyTrack, index: number) => (
                <div style={{ display: "flex", alignItems: "center", paddingTop: '1rem'}}>
                  <a
                    href={track.track_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <img src={track.image} height={"75rem"} style={{ borderRadius: "10px" }}/>
                  </a>
                  <a
                    href={track.track_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <span style ={{
                      paddingLeft: '1rem',
                      color: "#28323E",
                      fontWeight: 400,
                    }}>
                      {track.name}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
      ) : (
        <>
        <div style={{ display: "flex", alignItems: "center"}}>
          <img src={"https://daylist.spotifycdn.com/playlist-covers/early-morning_large.jpg"} height={"100rem"} style={{ borderRadius: "10px" }}/>
          <span
          style={{
            color: "#28323E",
            fontSize: "1.7rem",
            fontWeight: 500,
            transition: "all .25s ease-out",
            paddingLeft: "1rem"
          }}
          >
            Loading...
          </span>
        </div>
      </>
      )}
    </>
  );
}

export default SpotifyPlaylistTracker;