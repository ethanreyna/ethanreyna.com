import { useState } from "react";
import DownArrowButton from "./DownArrowButton";
import type { ProjectProps } from "../types/ProjectTypes";
import { Modal, ModalContent } from "../images/Modal";
import { motion } from "framer-motion";
import { Scrollbar } from "react-scrollbars-custom";

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
        setIsModalOpen(false); 
    }
    

    return (
    <motion.div 
        transition={{ duration: 0.5, type: 'spring' }} 
        layout 
        style={{
            backgroundColor: '#28323E',
            backgroundSize: '400%',
            borderRadius: '1rem',
            padding: '1.25rem',
            marginTop: '1rem',
            maxHeight: '30rem',
        }}
        >
        <motion.div layout="position">
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
                        paddingBottom: '1rem'
                    }}>
                {description}
            </span>
        </motion.div>
        {expanded && (
            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            >
            <Scrollbar style={{height: '25rem' }}>
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
                                paddingTop: '1rem'
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
                                                {index + 1}
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
                    <div key={index} style={{paddingTop: '1rem'}}>
                        <div>
                            <span style={{ color: "gainsboro", fontSize: "1.50rem", fontWeight: 500 }}>
                                {section?.name}
                            </span>
                        </div>
                        <div>
                        {section?.description?.split('\n').map((line, index) => (
                                <div key={index} style={{paddingBottom: '1rem'}}>
                                    <span style={{ color: "gainsboro", fontSize: "1rem"}}>
                                        &emsp;{line}
                                    </span>
                                </div>
                            ))}
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
                </Scrollbar>
            </motion.div>
        )}
        </motion.div>
    )
}

export default ProjectContent;
