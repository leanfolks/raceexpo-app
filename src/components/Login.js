import { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../apiConfig";
import ToastComponent from "./Common/Toast.jsx";
import { login } from "../api/login";
import { setStringifiedLocalStorageData } from "../utils/functions.js";
import BlockingLoader from "./Common/Loader.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const initialValues = {
    userName: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("User Name is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // const response = await axios.post(
      //   `${baseUrl}users/organizerlogin`,
      //   values,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      setLoading(true);
      const response = await login(values);
      console.log(response, "response");
      if (response.status === 200) {
        // const token = response.data.token;
        // const role = response.data.role.name;
        // const data = response.data;
        // localStorage.setItem("authToken", token);
        const data = response.data;

        setStringifiedLocalStorageData("authToken", data.token);
        setStringifiedLocalStorageData("role", data.role);
        // axios.defaults.headers.common["Role"] = role;
        console.log("before navigate");
       
        console.log("after navigate");
        setToastMessage("Login successful!")
        setToastVariant("success");
        setShowToast(true);
        navigate(`/events?userId=${response.data.id}`);
      } else {
        const errorData = await response.json();
        console.error("Signin failed:", errorData);
        setToastVariant("danger");
        setToastMessage("Login failed");
        setShowToast(true);
            }
    } catch (error) {
      console.error("Error during signin:", error);
      setToastVariant("danger");
      setToastMessage("Login failed");
      setShowToast(true);
    }
    finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
useEffect(()=>{
if(showToast) {
  window.scrollTo({top: 0, behavior: "smooth"});
}
}, [showToast])
  return (
    <>
            {loading && <BlockingLoader />}
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 border rounded-3">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="mb-3 col-12">
              <label htmlFor="username" className="form-label fw-bold">
                User Name
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                name="userName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userName}
                required
              />
              {formik.touched.userName && formik.errors.userName && (
                <div className="text-danger">{formik.errors.userName}</div>
              )}
            </div>
            <div className="mb-3 col-12">
              <label htmlFor="password" className="form-label fw-bold">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
            </div>
          </div>
          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary border px-4">
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastComponent
      showToast={showToast}
      toastHeader="Sign In"
      setShowToast={setShowToast}
      toastMessage={toastMessage}
      toastVariant={toastVariant}
      />
    </div>
    </>
  );
};

export default Login;
