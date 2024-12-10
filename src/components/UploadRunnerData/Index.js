import React, { useState, useEffect } from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { baseUrl } from '../../apiConfig';
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import UploadExcel from './UploadExcel';
import {Tabs, Tab} from "react-bootstrap";
import GenerateQrCodes from './GenerateQrCodes';
import Statistics from './Statistics';
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
          <Tab eventKey="GenerateQRCode" title="Generate QR Codes">
            <GenerateQrCodes slug={slug}/>
          </Tab>
          <Tab eventKey="statistics" title="Statistics ">
            <Statistics slug={slug}/>
          </Tab>
          </Tabs>
      </div>
    </>
  );
};

export default Index;
