import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation} from "react-router-dom";
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { baseUrl } from "../../apiConfig";
import BlockingLoader from "../Common/Loader";
import { headerStyle } from "../../utils/tableStyles";
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToastComponent from "../Common/Toast";
import BootstrapTable from "react-bootstrap-table-next";
import { getEvents } from "../../api/events";

const AssignVolunteers = () => {
    const location = useLocation();
    const userId = new URLSearchParams(location.search).get("userId");
  const [isOpen, setIsOpen] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
const [selectedEvent, setSelectedEvent] = useState("");
  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log("Sidebar toggled");
  };

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}volunteers/volunteers-list`);
      setVolunteers(response?.data?.filter(item => item.isActive));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchData = async () => {
    try {
      let allEvents = [];
      let currentPage = 1;
      const perPage = 10;
      let totalEvents = 0;
      const response = await getEvents({ page: currentPage, perPage });
      const totalCountHeader = response.headers.get('x-total-count');
      console.log('Total Count Header:', totalCountHeader);
  
      totalEvents = parseInt(totalCountHeader, 10);
      const totalPages = Math.ceil(totalEvents / perPage);
      console.log(`Total Pages to fetch: ${totalPages}`);

      allEvents = response.data;
      while (currentPage < totalPages) {
        currentPage++;
        const pageResponse = await getEvents({ page: currentPage, perPage });
        allEvents = allEvents.concat(pageResponse.data);
      }
      setEvents(allEvents?.sort((a, b)=> a.eventName.localeCompare(b.eventName)));
    } catch (error) {
      console.log("Error during fetching events", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(selectedEvent, "selectedEvent")
  const event = events?.find(item => item?.eventName === selectedEvent);
  const handleAssignVolunteers = async () => {

    try {
      await axios.post(`${baseUrl}volunteers/assign-volunteers`, {
        eventId: event?.id,
        volunteerIds: selectedVolunteerIds,
      });
      setShowToast(true);
      setToastVariant("success");
      setToastMessage("Volunteers assigned successfully!")

      setSelectedVolunteerIds([]);
    } catch (error) {
      console.error("Error assigning volunteers:", error);
      setShowToast(true);
      setToastVariant("danger");
      setToastMessage(error?.response?.data?.error || "Error assigning volunteers")
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
  ];

  const rowStyle = {
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    textAlign: "center",
  };

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSelectedVolunteerIds((prev) => [...prev, row.id]);
      } else {
        setSelectedVolunteerIds((prev) => prev.filter(id => id !== row.id));
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      const ids = isSelect ? rows.map(row => row.id) : [];
      setSelectedVolunteerIds(ids);
    }
  };
  useEffect(()=>{
    if(showToast){
  window.scrollTo({top: 0, behavior:"smooth"})
    }
  }, [showToast])
  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };
  return (
    <>
      <div className="header-margin"></div>

      <DashboardHeader handleToggle={handleToggle} />

      <Sidebar isOpen={isOpen} handleToggle={handleToggle} />

      <div className="content">

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="col-md-6 fs-4 mt-3">
            <select
              className="form-select"
              id="event"
              name="event"
              value={selectedEvent} 
              onChange={handleEventChange} 
              required
              style={{ width: "300px" }}
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.eventName}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleAssignVolunteers}>
            Assign
          </button>
        </div>

        {volunteers?.length > 0 && (
          <>
            <div>Total volunteers: <span style={{ fontWeight: "bold" }}>{volunteers?.length}</span></div>
            <PaginationProvider
              pagination={paginationFactory({
                custom: true,
                sizePerPage: 20,
                totalSize: volunteers?.length
              })}
            >
              {({ paginationProps, paginationTableProps }) => (
                <div>
                  <div style={{ overflowX: "auto", marginTop: "15px" }}>
                    <PaginationListStandalone {...paginationProps} />
                  </div>
                  <div style={{ maxHeight: "450px", overflowY: "auto" }} className="table-responsive mx-auto">
                    <BootstrapTable
                      keyField="id"
                      data={volunteers}
                      columns={tableHeaders}
                      rowStyle={rowStyle}
                      headerClasses="sticky-header"
                      {...paginationTableProps}
                      bootstrap4
                      striped
                      hover
                      condensed
                      selectRow={selectRow}
                    />
                  </div>
                </div>
              )}
            </PaginationProvider>
          </>
        )}
      </div>

      <ToastComponent
      showToast={showToast}
      toastHeader="Assign volunteers"
      setShowToast={setShowToast}
      toastMessage={toastMessage}
      toastVariant={toastVariant}
      />
    </>
  );
};

export default AssignVolunteers;
