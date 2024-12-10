import React, { useEffect, useState } from 'react'
import axios from "axios";
import { baseUrl } from '../../apiConfig';
import { headerStyle } from '../../utils/tableStyles';
import moment from "moment";
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from 'react-bootstrap-table-next';
import { getEvents } from '../../api/events';
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import BlockingLoader from '../Common/Loader';
const UploadedData = () => {
const [list, setList] = useState([]);
const [loading, setLoading] = useState(false); 
const [selectedEvent, setSelectedEvent] = useState("")
const [events, setEvents] = useState([]);
const [isOpen, setIsOpen] = useState(false);
const handleToggle = () => {
  setIsOpen(!isOpen);
  console.log("clicked");
};

useEffect(() => {
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
      setEvents(allEvents);
    } catch (error) {
      console.log("Error during fetching events", error);;
    }
  }
  fetchData();
}, []);

  useEffect(()=> {
    const fetchList = async()=> {
      try {
        setLoading(true)
        const res = await axios.get(`${baseUrl}events/get-uploadedlist`);
        const listWithEventNames = res && res.data.map(item => {
          const event = events.find(event => event.id === item.eventId);
          console.log(event, "event")
          return { ...item, eventName: event ? event?.eventName : 'N/A' };
        });
        setList(listWithEventNames);
      } catch (error) {
          console.error("Error fetching list:", error);
        }
      finally {
        setLoading(false)
      }
     
    }
    if (events.length > 0) {
      fetchList();
    }
  }, [events]);
  function downloadExcel(row) {
    fetch(row.s3Url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const fileName = row.uploadExcelName || 'download.xlsx';
        link.href = url;
        link.setAttribute("download", fileName);
        link.setAttribute('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error("Error downloading the file:", error));
  }
  
  const formatDate = (dateString) => {
    return moment(dateString).format("DD-MM-YYYY HH:mm");
  };
  const eventOptions = list.reduce((acc, event) => {
    acc[event.eventName] = event.eventName;
    return acc;
  }, {});
  const columns = [
    {
      dataField: "uploadExcelName",
      text: "Upload excel name",
      headerStyle: headerStyle
    },
    {
      dataField: "numberOfEntries",
      text: "Number of entries",
      headerStyle: headerStyle
    },

    {
      dataField: "createdAt",
      text: "Uploaded at",
      formatter: (cell) => formatDate(cell),
      headerStyle: {
        verticalAlign: "middle",
        textAlign: "center",
        width: "300px",
      },
    },
    {
      dataField: "eventName",
      text: <div>Event</div>,
      filter: selectFilter({
        options:eventOptions,
        placeholder: "Select Event",
        onFilter: (filterValue) => {
          setSelectedEvent(filterValue);
        },
        style: {
          width: "200px",
          marginLeft: "3px",
        },
        className: "form-select",
      }),
      headerStyle: headerStyle,
    },
    {
      dataField: 'actions',
      text: 'Actions',
      formatter: (cell, row, rowIndex, formatExtraData) => (
        <div className="d-flex justify-content-center">
        <div
          className="download-text"
          onClick={() => downloadExcel(row)}
        >
          Download
        </div>
      </div>),
      headerStyle: headerStyle
    }, 
   ];

  const rowStyle = (row, rowIndex) => {
    return {
      verticalAlign: "middle",
      whiteSpace: "nowrap",
      width: "auto",
      textAlign: "center",
    };
  };
  const [filteredList, setFilteredList] = useState([]);
  useEffect(()=> {
    if (selectedEvent) {
      const filtered = list.filter(
        (importItem) => importItem.eventName === selectedEvent
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(list);
    }
  }, [list, selectedEvent])

  return (
    <>
        <div className="header-margin"></div>
 
 <DashboardHeader handleToggle={handleToggle} />

 <Sidebar isOpen={isOpen} handleToggle={handleToggle}/>
 <div className="content p-4">
    {list.length > 0 ? (
      <>
       <div className="mt-3">Total: <span style={{fontWeight: "bold"}}>{filteredList.length}</span></div>
       <PaginationProvider
       pagination={ paginationFactory({
         custom: true,
         sizePerPage:20,
totalSize: filteredList.length
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
          data={filteredList}
          columns={columns}
          rowStyle={rowStyle}
          filter={filterFactory()}
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
    ) : <BlockingLoader/>}
    </div>

    </>

  )
}

export default UploadedData;