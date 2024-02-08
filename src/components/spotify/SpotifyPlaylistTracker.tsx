import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowRight  } from "react-icons/fa";

type SpotifyTrack = {
  name?: string;
  image?: string;
  preview_url?: string;
  track_url?: string;
}

type SpotifyPlaylist = {
  name?: string;
  image?: string;
  track_link?: string;
  playlist_link?: string;
}

const currentWorkerUrl = "http://127.0.0.1:8787";
//const currentWorkerUrl = "https://patient-unit-aece.ethanpreyna.workers.dev";

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

const getDaylist = async (): Promise<SpotifyPlaylist> => {
  let daylist = { name: "Error finding playlist" } as SpotifyPlaylist;
  try {
    const r = await fetch(
      currentWorkerUrl + "/playlists",
      {
        headers: {
          Authorization: `Basic a0951e5b44c84430a910316a8a8754c6`,
        },
      }
    );

    if (r.ok) {
      daylist = await r.json() as SpotifyPlaylist;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }

  return daylist;
}

const getTracks = async (daylistTrackId: string): Promise<SpotifyTrack[]> => {
  let daylist = [{ name: "Unknown Track" }] as SpotifyTrack[];
  try {
    const r = await fetch(
      currentWorkerUrl + '/tracks/' + daylistTrackId,
      {
        headers: {
          Authorization: `Basic a0951e5b44c84430a910316a8a8754c6`,
        },
      }
    );

    if (r.ok) {
      daylist = await r.json() as SpotifyTrack[];
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }

  return daylist;
}

const getCurrentTimeSection = () => {
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

const SpotifyPlaylistTracker: React.FC= () => {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [foundPlaylist, setFoundPlaylist] = useState<SpotifyPlaylist>();
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  }

  useEffect(() => {
    async function get() {
      const daylist = await getDaylist();
      setFoundPlaylist(daylist);

      const trackLink = daylist.track_link;
      if(trackLink){
        const startIndex = trackLink.indexOf("playlists/") + "playlists/".length;
        const endIndex = trackLink.indexOf("/tracks", startIndex);
        const daylistTrackId = trackLink.substring(startIndex, endIndex);
        const daylistTracks = await getTracks(daylistTrackId);
        setTracks(daylistTracks);
      }
      
    }
    get();
  }, []);



  return (
    <>
      {foundPlaylist ? (
        <>
        <div style={{ display: "flex", alignItems: "center"}}>

          <img src={foundPlaylist.image} height={"100rem"} style={{ borderRadius: "10px" }} />
            <span
            style={{
              color: "gainsboro",
              fontSize: "1.7rem",
              fontWeight: 500,
              transition: "all .25s ease-out",
              paddingLeft: "1rem"
            }}
            >
            {foundPlaylist.name ? formatPlaylistName(foundPlaylist.name) : <>loading...</>}
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
                    <FaArrowDown size={34} color="gainsboro"/> 
                  ) : (
                    <FaArrowRight size={34} color="gainsboro"/> 
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
                      color: "gainsboro",
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