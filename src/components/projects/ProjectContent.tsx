import { useState } from "react";
import DownArrowButton from "./DownArrowButton";
import type { ProjectProps } from "../types/ProjectTypes";
import { Modal, ModalContent } from "../images/Modal";

const ProjectContent: React.FC<ProjectProps> = ({ project_name, company, description, images, sections }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    }

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true); 
    }

    const handleCloseModal = () => {
        console.log("foundClose")
        setIsModalOpen(false); 
    }

    


    return (
    <div>
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
        {expanded && (
            <>
                {images && (
                <>
                    {images && (
                        <>
                            <div style={{
                                color: "gainsboro",
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: "1.50rem",
                                fontWeight: 500,
                            }}>
                                Project Screencaps
                            </div>
                            <div style={{ 
                                paddingTop: '1rem',
                                display: 'flex', 
                                justifyContent: 'center',
                            }}>
                                {images.map((image, index) => (
                                    <div style={{
                                        paddingRight: '1rem', 
                                        paddingLeft: '1rem'
                                    }}>
                                        <div key={index} style={{ 
                                            cursor: 'pointer',
                                            borderRadius: "50%",
                                            border: '2px solid gainsboro',
                                            width: '3rem',
                                            height: '3rem',
                                            display: 'inline-flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }} onClick={() => handleImageClick(index)}>
                                            <span style={{
                                                color: "gainsboro"
                                            }}>
                                                {index}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {isModalOpen && (
                        <ModalContent onClose={handleCloseModal} imageLink={images[selectedImageIndex].largeUrl}>
                            <img src={images[selectedImageIndex].largeUrl} height='100%' width='100%' alt={`Project Image ${selectedImageIndex}`} />
                        </ModalContent>
                    )}
                </>
                )}
                {sections && sections.map((section, index) => ( 
                    <div key={index} style={{ paddingTop: '1rem' }}>
                        <div>
                            <span style={{ color: "gainsboro", fontSize: "1.50rem", fontWeight: 500 }}>
                                {section?.name}
                            </span>
                        </div>
                        <div>
                            <span style={{ color: "gainsboro", fontSize: "1rem" }}>
                                {section?.description}
                            </span>
                            <ul style={{ margin: 0}}>
                                {section.list_description && section.list_description.map((item, index) => (
                                    
                                    <li key={index} style={{ color: "gainsboro", fontSize: "1rem" }}>{item}</li>
                                    
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
                { !(sections) && !(images) && (
                    <>
                        <div style={{ 
                                display: 'flex',
                                justifyContent: 'center'
                                }}>
                            <span style={{ color: "gainsboro", fontSize: "1.50rem", fontWeight: 500 }}>
                                Under construction...
                            </span>
                        </div>
                    </>
                )}
            </>
        )}
    </div>
    )
}

export default ProjectContent;
