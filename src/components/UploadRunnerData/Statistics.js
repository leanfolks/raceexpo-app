
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../apiConfig';
import { getEventBySlug } from "../../api/events";
import BootstrapTable from 'react-bootstrap-table-next';
import { headerStyle } from '../../utils/tableStyles';

const Statistics = ({ slug }) => {
  const [event, setEvent] = useState(null);
  const [runnerData, setRunnerData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [totals, setTotals] = useState({});
  const [distanceCategories, setDistanceCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRunners, setFilteredRunners] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
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
        const response = await axios.get(`${baseUrl}events/get-runnerdata?eventId=${event?.id}`);
        setRunnerData(response.data);
        setFilteredRunners(response.data);
        const distances = [...new Set(response.data.map((runner) => runner.distance))];
        setDistanceCategories(distances);
      } catch (error) {
        console.log(error);
      }
    };

    if (slug) {
      fetchEventData();
    }

    if (event?.id) {
      fetchRunnerData();
    }
  }, [slug, event?.id]);

  useEffect(() => {
    if (runnerData.length > 0) {
      const counts = {};
      const totalCounts = { Collected: 0, Pending: 0 };

      runnerData && runnerData?.forEach((runner) => {
        const { distance, isDistributed } = runner;
        const status = isDistributed ? 'Collected' : 'Pending';

        if (!counts[status]) {
          counts[status] = {};
        }

        if (!counts[status][distance]) {
          counts[status][distance] = 0;
        }

        counts[status][distance]++;
        totalCounts[status]++;
      });

      setStatusCounts(counts);
      setTotals(totalCounts);
    }
  }, [runnerData]);

  useEffect(() => {
    if (event?.category) {
      const distanceColumns = event?.category?.map((category) => ({
        dataField: category.name,
        text: category.name,
        headerStyle: headerStyle,
      }));
      setColumns([{ dataField: 'status', text: 'Collection Status',  headerStyle: {
        ...headerStyle,
        width: '100px'
      }, }, ...distanceColumns, { dataField: 'total', text: 'Total', headerStyle: headerStyle }]);
    }
  }, [event?.category]);

  const rows = ['Collected', 'Pending'].map((status) => {
    const row = { status, total: totals[status] || 0 };
    event?.category.forEach((category) => {
      row[category.name] = statusCounts[status]?.[category.name] || 0;
    });
    return row;
  });

  if (rows.length > 0) {
    const totalRow = {
      status: 'Total',
      total: (totals.Collected || 0) + (totals.Pending || 0),
    };

    event?.category.forEach((category) => {
      totalRow[category.name] = 
      (statusCounts.Collected?.[category.name] || 0) +
      (statusCounts.Pending?.[category.name] || 0); 
    });

    rows.push(totalRow);
  }

  const rowStyle = (row, rowIndex) => {
    return {
      verticalAlign: "middle",
      whiteSpace: "nowrap",
      width: "auto",
      textAlign: "center",
    };
  };
  const handleSearch = () => {
    const filtered = runnerData.filter(
      (runner) =>
        runner.bib?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        runner.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length === 0) {
      setAlertMessage("Please enter a valid Bib number or Name.");
    } else {
      setAlertMessage("");
        }
    setFilteredRunners(filtered);
  };
const handleKeyPress = (e)=> {
  if (e.key === "Enter") {
    handleSearch();
  }
}
  const runnerColumns = [
    { dataField: "bib", text: "Bib", headerStyle: headerStyle },
    { dataField: "firstName", text: "Name", headerStyle: headerStyle },
  ];
  return (
    <div className="container mt-4">
       {alertMessage && (
        <div className="alert alert-warning alert-dismissible fade show w-50 mx-auto text-center" role="alert">
          {alertMessage}
          </div>
       )}
      <div className="row justify-content-center">
        <div className="col-auto">
      <div className="d-flex flex-row gap-1 mb-3">
        <input
         type="text"
         placeholder="Search by Bib or Name"
         onKeyPress={handleKeyPress}
         value={searchTerm}

         onChange={(e) => {
           setSearchTerm(e.target.value)
         if(e.target.value === "") {
           setFilteredRunners(runnerData)
           setAlertMessage(""); 
         }
         }}
        className='form-control border custom-placeholder'
         
            />
        <div className="input-group-append">
          <button className="btn border" type="button"
            onClick={handleSearch}
              >
           Search
           </button>
        </div>
      </div>
    </div>
    </div>

      {columns.length > 0 && rows.length > 0 ? (
        <div
        style={{ maxHeight: "450px", overflowY: "auto" }}
        className="table-responsive pb-4"
      >
        <div style={{ 
          textAlign: "center", 
          fontWeight: "bold", 
          fontSize: "18px", 
          padding: "10px", 
          background: "#e9ecef", 
        }}>
          {event?.eventName || "Event Name"}
        </div>
        <BootstrapTable
          keyField="status"
          data={rows}
          columns={columns}
          bootstrap4
          rowStyle={rowStyle}
          bordered={false}
          striped
          hover
          condensed

        />
        </div>
      ) : (
        <p>Loading...</p>
      )}
     <div className="row mt-3">
      {distanceCategories.map((distance) => {
        const distanceFilteredRunners = filteredRunners.filter((runner) => runner.distance === distance && runner.isDistributed === true);
       
        return (
          <>
          {distanceFilteredRunners && distanceFilteredRunners?.length > 0 &&
          <div key={distance} className="mb-4 col-md-6 table-responsive">
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "10px",
                background: "#e9ecef",
              }}
            >
              {distance}
            </div>
            <div
    style={{
      maxHeight: "200px",
      overflowY: "auto", 
      border: "1px solid #dee2e6", 
      borderRadius: "4px", 
    }}
  >

            <BootstrapTable
              keyField="id"
              data={distanceFilteredRunners}
              columns={runnerColumns}
              bootstrap4
              bordered={false}
              striped
              hover
              condensed
              rowStyle={{
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            />
            </div>
          </div>
            }
            </>
        );
      })}
    </div>
    </div>
    
  );
};

export default Statistics;
