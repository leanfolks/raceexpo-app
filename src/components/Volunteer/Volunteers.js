import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { baseUrl } from "../../apiConfig";
import BlockingLoader from "../Common/Loader"
import { headerStyle } from "../../utils/tableStyles";
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToastComponent from "../Common/Toast";
import BootstrapTable from "react-bootstrap-table-next";
const Volunteers = () => {
  const { slug } = useParams();
  const [isOpen, setIsOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [volunteers, setVolunteers] = useState([]);
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastVariant, setToastVariant] = useState("");
  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log("clicked");
  };
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}volunteers/volunteers-list`);
      setVolunteers(response?.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVolunteers();
  }, []);
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${baseUrl}volunteers/crud-volunteer?id=${id}`, {
        isRemove: true
      });
      await fetchVolunteers();
    } catch (error) {
      console.error("Error deleting violunteer:", error);
    }
    finally {
      setLoading(false);
    }
  };
  const handleToggleChange = async (volunteerId, isActive) => {
    try {
      setLoading(true);
      setVolunteers((prev) =>
        prev.map((volunteer) =>
          volunteer.id === volunteerId ? { ...volunteer, isActive: isActive } : volunteer
        )
      );
      await axios.put(`${baseUrl}volunteers/crud-volunteer?id=${volunteerId}`, {
        isActive: isActive,
        isAdd: false
      });
      setShowToast(true);
      setToastMessage(
        `Volunteer ${isActive ? "activated" : "deactivated"} successfully!`
      );
      setToastVariant("success");
    } catch (error) {
      console.error("Error updating volunteer:", error);
      setShowToast(true);
      setToastMessage("Failed to update volunteer. Please try again.");
      setToastVariant("danger");
    }
    finally {
      setLoading(false);
    }
  };
  const tableHeaders = [
    {
      dataField: "id",
      text: "Id",
      headerStyle: headerStyle,
    },
    {
      dataField: "userName",
      text: "Name",
      headerStyle: headerStyle,
    },
    {
      dataField: "email",
      text: "Email",
      headerStyle: headerStyle,
    },
    {
      dataField: "phoneNumber",
      text: "Phone Number",
      headerStyle: headerStyle,
    },
    {
      dataField: "gender",
      text: "Gender",
      headerStyle: headerStyle,
    },

    {
      text: "Actions",
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-row gap-2 align-items-center justify-content-center">
            <Link
              className="btn text-secondary border-0"
              to={`/create-volunteers`}
              state={{ row }}
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"></path></svg>
            </Link>
            <button
              className="btn text-danger border-0"
              onClick={() => handleDelete(row?.id)} 
            >
         <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"></path></svg>
            </button>
            <Form>
              <Form.Check
                type="switch"
                id={`custom-switch-${row.id}`}
                label=""
                checked={row.isActive}
                onChange={(e) => handleToggleChange(row.id, e.target.checked)}
              />
            </Form>
          </div>
        );
      },
      headerStyle: headerStyle,
    },
  ];

  const rowStyle = {
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    textAlign: "center",
  };
  useEffect(()=>{
    if(showToast){
  window.scrollTo({top: 0, behavior:"smooth"})
    }
  }, [showToast])
  return (
    <>
      <div className="header-margin"></div>

      <DashboardHeader handleToggle={handleToggle} />

      <Sidebar isOpen={isOpen} handleToggle={handleToggle} slug={slug} />

      <div className="content">

{loading && <BlockingLoader/>}
        <div className="d-flex flex-column flex-md-row justify-content-end gap-md-2 py-4">
          <Link
            className="btn border btn-primary mb-3 mobile-width"
            to="/create-volunteer"
          >
            Create Volunteer
          </Link>
          <Link
            className="btn border btn-primary mb-3 mobile-width"
            to="/assign-volunteers"
          >
            Mapping
          </Link>
        </div>
        {volunteers?.length > 0 && (
          <>
          <div>Total volunteers: <span style={{fontWeight: "bold"}}>{volunteers?.length}</span></div>
               <PaginationProvider
               pagination={ paginationFactory({
                 custom: true,
                 sizePerPage:20,
totalSize: volunteers?.length
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
            className="table-responsive mx-auto"
          >
            <BootstrapTable
              keyField="id"
              data={volunteers}
              columns={tableHeaders}
              rowStyle={rowStyle}
              headerClasses="sticky-header"
              { ...paginationTableProps }
              bootstrap4
              striped
              hover
              condensed
            />
          </div>
          </div>
    )
  }
</PaginationProvider>
</>
        )}
            <ToastComponent
      showToast={showToast}
      toastHeader="Volunteer Update"
      setShowToast={setShowToast}
      toastMessage={toastMessage}
      toastVariant={toastVariant}
      />
</div>

        
    </>
  );
};

export default Volunteers;
