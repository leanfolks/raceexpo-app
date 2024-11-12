import React, { useState, useEffect } from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { baseUrl } from '../../apiConfig';
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import UploadExcel from './UploadExcel';
import UploadedData from './UploadedData';
import {Tabs, Tab} from "react-bootstrap";
const Index = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const slug = new URLSearchParams(location.search).get("slug");
  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log("clicked");
  };
  return (
    <>
       <div className="header-margin"></div>
 
 <DashboardHeader handleToggle={handleToggle} />

 <Sidebar isOpen={isOpen} handleToggle={handleToggle} slug={slug}/>
 <div className="content p-4">
 <Tabs defaultActiveKey="upload" id="data-tabs" className="mb-3">
          <Tab eventKey="upload" title="Upload Excel">
            <UploadExcel slug={slug}/>
          </Tab>
          <Tab eventKey="uploaded" title="Uploaded List ">
            <UploadedData />
          </Tab>
          </Tabs>
      </div>
    </>
  );
};

export default Index;
