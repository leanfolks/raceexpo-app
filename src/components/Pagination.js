import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ totalEvents, itemsPerPage = 10, currentPage, setCurrentPage }) => {
 
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPage = (pageNumber, isActive = false) => {
    const className = `size-40 flex-center cursor-pointer p-2 cirlce-number ${
      isActive ? "bg-dark-1 text-white" : ""
    }`;
    return (
      <div key={pageNumber} className="col-auto">
        <div className={className} onClick={() => handlePageClick(pageNumber)}>
          {pageNumber}
        </div>
      </div>
    );
  };

  const renderPages = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    const pages = pageNumbers.map((pageNumber) =>
      renderPage(pageNumber, pageNumber === currentPage)
    );
    return pages;
  };

  return (
    <>
   <style>
    {
        `
        .cirlce-number{
  width: 35px; 
  height: 35px;
  border-radius: 50%; 
  border:1px solid #697488;
  display: flex;
  cursor:pointer;
  align-items: center; 
  justify-content: center;
  }
        .bg-dark-1{
        background-color: #292662;
        }
        .only-on-mobile {
  display: none;
}
@media (max-width: 767px) {
  .only-on-mobile {
    display: flex;
  }
}
          .only-on-desktop {
  display: flex;
}

@media (max-width: 767px) {
  .only-on-desktop {
    display: none;
  }
}
  .hide-in-mob{
         display: flex;
        }
         @media (max-width: 767px) {
  .hide-in-mob {
    display: none;
  }
}
  .display-in-mob{
    display: none;
  }
        @media (max-width: 767px) {
  .display-in-mob {
    display: flex;
    justify-content: center;
    gap: 20px;
    
  }
}
        `
    }
   </style>
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-content-between md:justify-content-end">
        <div className="col-auto md:order-1 hide-in-mob">
          <button className="button size-40 cirlce-number"
          onClick={handlePrevPageClick}
          >
                 <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
        <div className="col-auto md:order-1 display-in-mob mx-auto mb-2">
        <button className="button size-40 cirlce-number"
          onClick={handlePrevPageClick}
          >
                 <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button className="button size-40 cirlce-number"
          onClick={handleNextPageClick}
          >
          <FontAwesomeIcon icon={faChevronRight} />
          </button>
            </div>
        <div className="col-md-auto md:order-3">
          <div className="row x-gap-20 y-gap-20 align-items-center only-on-desktop">
            {renderPages()}
            <div className="col-auto">
              <div className="size-40 flex-center rounded-full p-2">...</div>
            </div>
            <div className="col-auto">
              <div className="size-40 flex-center rounded-full">
                {totalPages}
              </div>
            </div>
          </div>

          <div className="row x-gap-10 y-gap-20 justify-content-center items-center only-on-mobile">
            {renderPages()}
          </div>

          <div className="text-center mt-30 md:mt-10">
            <div className="text-14 text-light-1">
              {currentPage * itemsPerPage - itemsPerPage + 1} –{" "}
              {Math.min(currentPage * itemsPerPage, totalEvents)} of {totalEvents} items found
            </div>
          </div>
        </div>

        <div className="col-auto md:order-2 hide-in-mob">
               <button className="button size-40 cirlce-number"
          onClick={handleNextPageClick}
          >
          <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Pagination;
