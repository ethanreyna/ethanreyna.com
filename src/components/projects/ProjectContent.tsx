import { useState } from "react";
import DownArrowButton from "./DownArrowButton";


type Image = {
	smallUrl: string;
	largeUrl: string;
}

interface Props {
	project_name: string;
	company?: string;
	description?: string;
    images?:Image[];
}

const ProjectContent: React.FC<Props> = ({ project_name, company, description, images }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand =()=>{
        setExpanded(!expanded);
    }

    return (
        <>
        <div style={{ display: "flex"}}>
            <div className="row">
                <span style={{
                    color: "gainsboro",
                    fontSize: "1.75rem",
                    fontWeight: 500,
                }}>
                    {project_name}
                </span>
                <span style={{
                    color: "gainsboro",
                    fontSize: "1.25rem",
                    paddingLeft: "1rem"
                }}>
                    {company}
                </span>
            </div>
            <DownArrowButton expanded={expanded} handleExpand={handleExpand}/>
        </div>
        <span style={{
                    color: "gainsboro",
                    fontSize: "1rem",
                }}>
            {description}
        </span>
        <div style={{
            display:'flex',
            justifyContent: 'center',
            paddingTop: '1rem'
        }}>
        {expanded && (
            <>
                {images && images.map((image, index) => (
                    <img src={image.smallUrl}/>
                ))
                }
            </>
        )}
        </div>
        
        </>
    )
}

export default ProjectContent;
