import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../apiConfig';
import ToastComponent from '../Common/Toast';
import { getEventBySlug } from "../../api/events";
import BlockingLoader from '../Common/Loader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import moment from "moment";
const GenerateQrCodes = ({slug}) => {
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
  const [runnerData, setRunnerData] = useState()
  const [event, setEvent] = useState("")
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await getEventBySlug({ slug });
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    const fetchRunnerData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}events/get-last-runnerdata?eventId=${event?.id}`);
        setRunnerData(response.data);
        } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEventData();
    }

    if (event?.id) {
      fetchRunnerData();
    }
  }, [slug, event?.id]);

  const columns = runnerData && runnerData?.length > 0 ? Object.keys(runnerData[0]).map(key => ({
    dataField: key,
    text: key.charAt(0).toUpperCase() + key.slice(1),
    formatter: (cell, row) => {
      if (key === 'dateOfBirth' && cell) {
        return moment(cell).format('YYYY-MM-DD');
      }
      return cell;
    },
    style: {
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  },
  headerStyle: {
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  })) : [];
  
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
      {runnerData?.length > 0 &&
          <PaginationProvider
          pagination={ paginationFactory({
            custom: true,
            sizePerPage:20,
   totalSize: runnerData?.length
          }) }
        >
          {
            ({
              paginationProps,
              paginationTableProps
            }) => (
              <div>
               <div style={{ overflowX:"auto", marginTop:"15px"}}>
                <PaginationListStandalone
                  { ...paginationProps }
                />
                </div>
         <div
           style={{ maxHeight: "450px", overflowY: "auto" }}
           className="table-responsive pb-4"
         >
                <BootstrapTable
            keyField="id" 
            data={runnerData}
            columns={columns}
            {...paginationTableProps}
/>
</div>
      </div>
)
}
</PaginationProvider>
}
    </>
  );
};

export default GenerateQrCodes;
