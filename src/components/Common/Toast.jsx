import React from 'react';
import { Toast } from "react-bootstrap";

const ToastComponent = ({setShowToast, showToast, toastVariant, toastMessage, toastHeader}) => {
  return (
    <div style={{ position: "absolute", top: "100px", right: "10px" }}>
           <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
        className={`bg-${toastVariant}`}
      >
        <Toast.Header closeButton={true} className="d-flex justify-content-between align-items-center">
          <strong className="mr-auto">{toastHeader}</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      </div>
  )
}
export default ToastComponent;
