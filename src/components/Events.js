import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../api/events";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import BlockingLoader from "./Common/Loader";
import Pagination from "./Pagination";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [navbar, setNavbar] = useState(window.scrollY >= 10);
  const changeBackground = () => setNavbar(window.scrollY >= 10);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  const sortEvents = (field, order) => {
    const sortedEvents = events?.sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    setEvents(sortedEvents);
  };
  const fetchData = async () => {
    // const response = await axios.get(`${baseUrl}events/get-results`);
    try {
      setError("");
      setLoading(true);
      const response = await getEvents({page: currentPage, perPage: 10});/*axios.get(`${baseUrl}events/get-results?userId=${userId}`
  , {
      params: {
      page: currentPage,
        perPage: 10,
      },
    }); */
    const totalCountHeader = response.headers.get('x-total-count');
    console.log('Total Count Header:', totalCountHeader);
    const totalCount = parseInt(totalCountHeader, 10);
        setEvents(response.data);
        setTotalEvents((prevTotal) => totalCount || prevTotal);
    } catch (error) {
      console.log("Error during fetching events", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=> {
fetchData();
  }, [currentPage])
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log("clicked");
  };
  return (
    <>
      <div className="header-margin"></div>
 
      <DashboardHeader handleToggle={handleToggle} />

      <Sidebar isOpen={isOpen} handleToggle={handleToggle}/>
      <div className="content p-4">
      <div className="mt-4 row y-gap-20 justify-content-center items-center">
      <div className="row y-gap-30">
        {loading && <BlockingLoader />}
            {events.map((item) => (
              <div className="col-lg-2 col-sm-6" key={item?.id}>
                <div className="hotelsCard__image">
                  <div className="cardImage inside-slider">
                    <Link
                      to={`/upload-runnerdata?slug=${item?.slug}`}
                      className="hotelsCard -type-1 hover-inside-slider ratio"
                    >
                      <img
                        src={item?.eventPicture}
                        className="img-thumbnail"
                        alt="Event"
                      />
                    </Link>
                    
                  </div>
                </div>
                <div className="hotelsCard__content">
                  <div className="d-flex flew-row justify-content-between mt-2">
                    <div>
                      <Link
                        to={`/event/${item.slug}`}
                        className="hotelsCard -type-1"
                      >
                        <h5 className="hotelsCard__title text-14 fw-500">
                          <span>{item?.eventName}</span>
                        </h5>
                        <p className="text-14">{item?.location}</p>
                        <p className="text-14">{moment(item?.date).format('MMMM D, YYYY')}</p>
                      </Link>
                    </div>
              
                  </div>
                </div>
              </div>
            ))}
          </div>
    
        </div>
        {totalEvents > 10 &&
            <Pagination 
            totalEvents={totalEvents}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            />
        }
        </div>
    </>
  );
};

export default Events;
