import { motion } from "framer-motion";
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
            <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.25 }}
            >
                <FaArrowRight size={34} color="gainsboro" style={{ transform: 'rotate(var(--rotate))' }} />
            </motion.div>
        </div>
    )
}

export default DownArrowButton;