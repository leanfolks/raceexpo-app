import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../apiConfig';
import ToastComponent from '../Common/Toast';
import BlockingLoader from '../Common/Loader';
const GenerateQrCodes = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`${baseUrl}events/generate-qrcodes`);
      setToastMessage("QR codes generated successfully!");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error generating QR codes:", error);
      setToastMessage(
        error.response?.data?.message || "An error occurred while generating QR codes."
      );
      setToastVariant("danger");
      setShowToast(true);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
 {loading && <BlockingLoader />}
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Generate QR Codes
        </button>
      </div>
      <ToastComponent
        showToast={showToast}
        toastHeader="Generate QR Codes"
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        toastVariant={toastVariant}
      />
    </>
  );
};

export default GenerateQrCodes;
