
type Playlist = {
    name: string;
    collaborative?: boolean;
    description?: string;
    id?: string;
    images?: {
        height: number | null;
        url?: string;
        width: number | null;
    }[];
    owner?: {
        display_name?: string;
        external_urls?: {
        spotify?: string;
        };
        href?: string;
        id?: string;
        type?: string;
        uri?: string;
    };
    public?: boolean;
}

interface Props {
  playlist: Playlist
}

const PlaylistBadge: React.FC<Props> = ({playlist}) => {
    return(
        <div>
            {playlist.name}
        </div>
    
    )
}

export default PlaylistBadge;