import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import axios from "axios";
import {baseUrl} from "../../apiConfig"
import { useNavigate } from "react-router-dom";
import ToastComponent from "../Common/Toast";
import BlockingLoader from "../Common/Loader";
const CreateVolunteers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const row = state && state?.row;
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [loading, setLoading] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log("clicked");
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      phoneNumber: "",
      email: "",
      gender: ""
  },
  
  validationSchema: Yup.object().shape({
    userName: Yup.string().required("User Name is required"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .length(10, "Phone number must be exactly 10 digits")
      .matches(/^\d+$/, "Phone number must be numeric"),
    email: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
    gender: Yup.string().required("Gender is required"),
  }),
  onSubmit: async (values) => {
    try {
      setLoading(true);
      if (row) {
        await axios.put(`${baseUrl}volunteers/crud-volunteer?id=${row?.id}`, {
          ...values,
          isAdd: false
        });
        setToastMessage(`Volunteer updated successfully!`);
      } else {
        await axios.put(`${baseUrl}volunteers/crud-volunteer`, {
          ...values,
          isAdd: true
        });
        setToastMessage(`Volunteer created successfully!`);
      }
      setToastVariant("success");
      setShowToast(true);
      setTimeout(() => {
        navigate(`/volunteers`);
      }, 1000);
    } catch (error) {
      setToastMessage(
        row
          ? "Failed to update volunteer"
          : "Failed to create volunteer. Please try again."
      );
      setToastVariant("danger");
      setShowToast(true);
    }
    finally {
      setLoading(false);
    }
  },
});
useEffect(() => {
  if (row) {
    formik.setValues({
      ...formik.values,
      userName: row.userName || "",
      email: row.email || "",
      phoneNumber: row.phoneNumber || "",
      gender: row.gender || "",
    });
  }
}, [row]);
useEffect(()=>{
  if(showToast){
window.scrollTo({top: 0, behavior:"smooth"})
  }
}, [showToast])


  return (
    <>
      <div className="header-margin"></div>

      <DashboardHeader handleToggle={handleToggle} />

      <Sidebar isOpen={isOpen} handleToggle={handleToggle} />

      <div className="content">
        <div className="d-flex flex-column flex-md-row justify-content-end gap-md-5 py-4">
        </div>
        {loading && <BlockingLoader />}
        <div className="container p-3">
          <div className="row y-gap-20 justify-center items-center">
          <h3 className="text-center mb-5">
            Volunteer SignUp
          </h3>
          <form
        className="col-xl-7 col-lg-8 mt-30 mx-auto absolute"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
              return false;
            }}
          >
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="userName"
                  placeholder="User Name"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur} 
                  required
                  style={{ height: "50px" }}
                />
                {formik.touched.userName && formik.errors.userName && (
                  <div className="text-danger">{formik.errors.userName}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label fw-bold">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  style={{ height: "50px" }}
                />
                {formik.touched.phoneNumber &&  formik.errors.phoneNumber && (
                  <div className="text-danger">{formik.errors.phoneNumber}</div>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  style={{ height: "50px" }}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="gender" className="form-label fw-bold">
                  Gender
                </label>
                <select
                  className="form-select"
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  style={{ height: "50px" }}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-danger">{formik.errors.gender}</div>
                )}
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary mt-4">
                {row ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
        </div>
        <ToastComponent
      showToast={showToast}
      toastHeader={row ? "Update" : "Create"}
      setShowToast={setShowToast}
      toastMessage={toastMessage}
      toastVariant={toastVariant}
      />
      </div>
    </>
  );
};

export default CreateVolunteers;
