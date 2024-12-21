import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {baseUrl} from "../../apiConfig";
import { Toast } from "react-bootstrap";
import { useEffect, useState } from "react";

const OrganizerSignupForm = ({isRaceExpoOrganizer=false, setLoading}) => {
const navigate = useNavigate();

const [formSubmitted, setFormSubmitted] = useState(false);
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastVariant, setToastVariant] = useState("");

  const initialValues = {
    userName: '',
    password: '',
    phoneNumber:"",
    email:"",
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('User Name is required'),
    password: Yup.string().required('Password is required'),
    phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits and contain only integers').required('Phone number is required'),
    email:Yup.string().required('Email is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      values.isRaceExpoOrganizer=isRaceExpoOrganizer
      const response = await axios.post(`${baseUrl}users/organizersignup`, 
        values,
        {
        headers: {
          'Content-Type': 'application/json',
        }
      }
      );

      if (response.status === 200) {        
    setToastVariant("success");
    setToastMessage("Signup successful!")
    setShowToast(true);
    setFormSubmitted(true);
      navigate(`/login`)
      } else {
  
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        setToastVariant("danger");
        setToastMessage("Signup failed");
        setShowToast(true);
        setFormSubmitted(true);
      }
    } catch (error) {
      console.error("Error during Signup:", error);
      setToastVariant("danger");
      setToastMessage("Error during Signup");
      setShowToast(true);
      setFormSubmitted(true);

    }
finally{
  setLoading(false);
    setSubmitting(false);
}
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

useEffect(()=>{
  if(showToast){
window.scrollTo({top: 0, behavior:"smooth"})
  }
}, [showToast])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
    <div className="col-12 mb-3">
    <h2 className="text-center mb-4">Signup</h2>
        <p className="mt-10">
          Already have an account yet?{" "}
          <Link to="/login" className="text-primary">
            Log in
          </Link>
        </p>
      </div>

      <div className="col-12 mb-3">
        <div className="">
        <label className="lh-1 text-14 fw-bold">User Name</label>
       
        <input
        className="form-control"
          id="userName"
          name="userName"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.userName}
          required
        />
      
           </div>
        {formik.touched.userName && formik.errors.userName && (
          <div className="text-danger">{formik.errors.userName}</div>
        )}
      </div>
      <div className="col-12 mb-3">
        <div className="form-input">
        <label className="lh-1 text-14 fw-bold">Email</label>
        
        <input
        className="form-control"
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          required
        />
      
        </div>
        {formik.touched.email && formik.errors.email && (
          <div className="text-danger">{formik.errors.email}</div>
        )}
      </div>
      <div className="col-12 mb-3">
        <div className="form-input ">
        <label className="lh-1 text-14 fw-bold">Phone Number</label>
       
        <input
        className="form-control"
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneNumber}
          required
        />
          </div>
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <div className="text-danger">{formik.errors.phoneNumber}</div>
        )}
      </div>
      <div className="col-12 mb-3">
        <div className="form-input ">
        <label className="lh-1 text-14 fw-bold">Password</label>
       
        <input
        className="form-control"
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          required
        />
         </div>
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger">{formik.errors.password}</div>
        )}
      </div>


      <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary border px-4">
              Signup
            </button>
          </div>
    </form>

    <div style={{ position: "absolute", top: "100px", right: "10px" }}>
    <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
        className={`bg-${toastVariant}`}
      >
        <Toast.Header closeButton={true} className="d-flex justify-content-between align-items-center">
          <strong className="mr-auto">Sign Up</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      </div>
      </>
  );
};

export default OrganizerSignupForm;
