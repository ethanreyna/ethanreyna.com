import React from "react";

const modal = {
  position: "fixed",
  zIndex: 1,
  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh",
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.8)"
};

const close = {
    position: "absolute",
    top: 15,
    right: 35,
    color: "#f1f1f1",
    fontSize: 40,
    fontWeight: "bold",
    cursor: "pointer"
  };

const modalContent = {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "20px",
    maxWidth: "80%",
    maxHeight: "80%",
    overflow: "auto",
};

interface ModalProps {
    onOpen: any;
    children: any;
}

interface ModalContentProps {
    onClose: any;
    imageLink: string;
    children: any;
}


export const Modal: React.FC<ModalProps>  = ({ onOpen, children }) => {
  return <div onClick={onOpen}> {children}</div>;
};

export const ModalContent: React.FC<ModalContentProps>  = ({ onClose, imageLink, children }) => {
  return (
    <div style={{
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    }}>
        <a href={imageLink}
          target="_blank"
          style={{
            position: "fixed", 
            top: '2rem',
            left: "50%", 
            transform: "translateX(-50%)", 
            color: "#f1f1f1",
            fontSize: 20,
            cursor: "pointer"
          }}
          >
          click to open in another tab
        </a>
        <span style={{
        position: "absolute",
        top: 15,
        right: 35,
        color: "#f1f1f1",
        fontSize: 40,
        fontWeight: "bold",
        cursor: "pointer"
        }} 
        onClick={onClose}>
            &times;
        </span>
        <div style={{
        position: "relative",
        borderRadius: "5px",
        padding: "20px",
        maxWidth: "80%",
        maxHeight: "80%"
        }}>
            {children}
        </div>
    </div>
  );
};
