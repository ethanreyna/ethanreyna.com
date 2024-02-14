import { FaArrowRight } from "react-icons/fa";

interface Props {
    expanded: boolean;
    handleExpand: () => void;
}

const DownArrowButton: React.FC<Props> = ({expanded, handleExpand}) => {
    return (
        <div
        style={{
            cursor: "pointer",
            marginLeft: "auto",
            transition: "transform 0.3s ease-in-out"
        }}
        onClick={() => handleExpand()}
    >
        <div style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)"  }}> 
                <FaArrowRight size={34} color="gainsboro" />
        </div>
    </div>
    )
}

export default DownArrowButton;