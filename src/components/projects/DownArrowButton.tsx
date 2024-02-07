import { useState } from "react";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";

interface Props {
    expanded: boolean;
    handleExpand: () => void;
}

const DownArrowButton: React.FC<Props> = ({expanded, handleExpand}) => {
    return (
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
    )
}

export default DownArrowButton;