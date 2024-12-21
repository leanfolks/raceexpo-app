import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastComponent from "./Common/Toast";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { baseUrl } from "../apiConfig";
import Race from "./Race";

const EventCreate = () => {
  const navigate = useNavigate();
//const {slug} = useParams();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId")
const state = location.state || {};
const eventData = state.item;

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: null, height: null });
  const [showRace, setShowRace] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [giveAways, setGiveAways] = useState({
    'Race T-shirt': false,
    "Finisher's Medal": false,
    'Bib Number with timing chip': false,
    'Goodie Bag': false,
    'Finisher e-Certificate': false,
    'Hydration Support': false,
    "Non Timed BIB": false,
    "Breakfast": false,
    "Refreshments": false,
    "Certificate": false,
    "Physio": false,
    "Selfie Booth": false,
    "Online Photos": false
  });

  const handleGiveAwayChange = (giveAway, checked) => {
    setGiveAways(prevState => ({
      ...prevState,
      [giveAway]: checked,
    }));
  };
  const validationSchema = Yup.lazy((values) => {
    let schema = Yup.object({
      eventName: Yup.string().required("Event Name is required"),
      shortName: Yup.string().required("Event Short Name is required")
      .max(15, "Event Short Name should not exceed 15 characters"),
      eventType: Yup.string().required("Event Type is required"),
      orderIdFormat: Yup.string().required("Order id format is required")
      .max(5, "Order Id Format should not exceed 5 characters"),
      location: Yup.string().required("Location is required"),
      aboutEvent: Yup.string().required("About Event is required"),
      orgEmail: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      regOpenDate: Yup.date().required("Registration Open Date is required"),
      regCloseDate: Yup.date().required("Registration Close Date is required"),
      tag: Yup.string().required("Tag is required"),
      date: Yup.date().required("Date is required"),
      eventPicture: Yup.mixed().required("Event Poster is required"),
      emailBanner: Yup.mixed().required("Email Banner is required"),
      // categories: Yup.array()
      //   .of(
      //     Yup.object().shape({
      //       name: Yup.string().required("Category Name is required"),
      //       amount: Yup.string().required("Registration Amount is required"),
      //       minimumAge: Yup.string().required("Minimum age is required"),
      //       maximumAge: Yup.string().required("Maximum age is required"),
      //       gender: Yup.string().required("Gender is required"),
      //       description: Yup.string().required("Description is required"),
      //       ageBracket: Yup.array().of(
      //         Yup.object().shape({
      //           name: Yup.string().required("Age bracket name is required"),
      //           gender: Yup.string().required("Gender is required"),
      //           minimumAge: Yup.string().required("Minimum age is required"),
      //           maximumAge: Yup.string().required("Maximum age is required"),
      //           description: Yup.string().required("Description is required"),
      //         })
      //       ).min(1, "At least one age bracket must be added"),
      //     })
      //   )
      //   .min(1, "At least one category must be added"),
        giveAway: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Give Away is required"),
          })
        ),
       // race: Yup.array().of(Yup.string().required("Race is required")),
  });
  if (values.eventType !== "Others" && !values.url) {
      schema = schema.concat(
        Yup.object().shape({
          categories: Yup.array().of(
            Yup.object().shape({
              distance: Yup.string().required("Distance is required")
            })
          )
        })
      );
    }
    if (!values.url) {
      schema = schema.concat(
        Yup.object().shape({
        categories: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Category Name is required"),
            amount: Yup.string().required("Registration Amount is required"),
            minimumAge: Yup.string().required("Minimum age is required"),
            maximumAge: Yup.string().required("Maximum age is required"),
            gender: Yup.string().required("Gender is required"),
            description: Yup.string().required("Description is required"),
            ageBracket: Yup.array().of(
              Yup.object().shape({
                name: Yup.string().required("Age bracket name is required"),
                gender: Yup.string().required("Gender is required"),
                minimumAge: Yup.string().required("Minimum age is required"),
                maximumAge: Yup.string().required("Maximum age is required"),
                description: Yup.string().required("Description is required"),
              })
            ).min(1, "At least one age bracket must be added"),
          })
        )
        .min(1, "At least one category must be added"),
        race: Yup.array().of(Yup.string().required("Race is required"))
      })
      );
    }
    return schema;
  });
  const formik = useFormik({
    initialValues: {
      eventName: "",
      shortName: "",
      eventType: "",
      location: "",
      orderIdFormat: "",
      aboutEvent: "",
      orgEmail: "",
      contactNum: "",
      secondaryContactNumber: "",
      regOpenDate: "",
      regCloseDate: "",
      tag: "",
      status: "",
      date: "",
      eventPicture: null,
      emailBanner: null,
      url: "",
      externalLinkForResults: "",
      externalLinkForPhotos: "",
      categories: [{ name: "", amount: "", minimumAge: "", maximumAge: "", gender: "", description: "", distance: "", ageBracket: [{name: "", gender: "", minimumAge: "", maximumAge: "", description: ""}] }],
      giveAway: [{name: ""}],
      race: []
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("userId", userId);
formData.append("eventName", values.eventName);
        const slug = values.eventName.replace(/\s+/g, '-');
formData.append("slug", slug);
formData.append("shortName", values.shortName);
formData.append("eventType", values.eventType);
        formData.append("location", values.location);
        formData.append("orderIdFormat", values.orderIdFormat);
        formData.append("aboutEvent", values.aboutEvent);
        formData.append("orgEmail", values.orgEmail);
        formData.append("contactNum", values.contactNum);
        formData.append("secondaryContactNumber", values.secondaryContactNumber);
        formData.append("regOpenDate", values.regOpenDate);
        formData.append("regCloseDate", values.regCloseDate);
        formData.append("tag", values.tag);
        formData.append("status", values.status);
        formData.append("date", values.date);
        formData.append("eventPicture", values.eventPicture);
        formData.append("emailBanner", values.emailBanner);
        formData.append("url", values.url);
        formData.append("externalLinkForResults", values.externalLinkForResults);
        formData.append("externalLinkForPhotos", values.externalLinkForPhotos);
        values.categories.forEach((category, index) => {
          formData.append(`category[${index}][name]`, category.name);
          formData.append(`category[${index}][amount]`, category.amount);
          formData.append(
            `category[${index}][minimumAge]`,
            category.minimumAge
          );
          formData.append(
            `category[${index}][maximumAge]`,
            category.maximumAge
          );
          formData.append(`category[${index}][distance]`, category.distance);
          formData.append(
            `category[${index}][description]`,
            category.description
          );
          formData.append(`category[${index}][gender]`, category.gender);
          category.ageBracket.forEach((ageBracket, ageIndex) => {
            formData.append(`category[${index}][ageBracket][${ageIndex}][name]`, ageBracket.name);
            formData.append(`category[${index}][ageBracket][${ageIndex}][gender]`, ageBracket.gender);
            formData.append(`category[${index}][ageBracket][${ageIndex}][minimumAge]`, ageBracket.minimumAge);
            formData.append(`category[${index}][ageBracket][${ageIndex}][maximumAge]`, ageBracket.maximumAge);
            formData.append(`category[${index}][ageBracket][${ageIndex}][description]`, ageBracket.description);
          });
        });
        const selectedGiveAways = Object.entries(giveAways)
        .filter(([_, checked]) => checked)
        .map(([giveAway]) => ({ name: giveAway }));
      formData.append('giveAway', JSON.stringify(selectedGiveAways));
      values.race.forEach((race, index) => {
        formData.append(`race[${index}]`, race);
      });

        // let response;
        //   response = await axios.put(`${baseUrl}events/edit-event?eventId=${event.id}`, formData, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   });
        let response;
        if (eventData) {
          response = await axios.put(`${baseUrl}events/edit-event?eventId=${eventData?.id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
        response = await axios.post(`${baseUrl}events/create-event`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
        if (response.status === 200) {
          setToastVariant("success");
          setToastMessage(eventData ? "Event updated successfully" : "Event created successfully")
          setShowToast(true);
          setFormSubmitted(true);
          setTimeout(()=>{
            navigate(`/events?userId=${userId}`);
          }, 1000)
            
            } else {
        const errorData = await response.json();
              setToastVariant("danger");
              setToastMessage(eventData ? 'Event updation failed' : "Event creation failed");
              setShowToast(true);
              setFormSubmitted(true);
            }
          }
      catch (error) {
        setToastVariant("danger");
        const errorMessage = error.response?.data?.error || (eventData ? "Error during event updation" : "Error during event creation");
        setToastMessage(errorMessage)
        setShowToast(true);
        setFormSubmitted(true)
        window.scrollTo({top: 0, behavior:"smooth"})
      }
      finally {
        setIsLoading(false);
      }
    },
  });
  useEffect(() => {
  
    if (eventData) {
      formik.setValues({
        ...formik.values,
        eventName: eventData.eventName || "",
        shortName: eventData.shortName || "",
        eventType: eventData.eventType || "",
        location: eventData.location || "",
        orderIdFormat: eventData.orderIdFormat || "",
        aboutEvent: eventData.aboutEvent || "",
        orgEmail: eventData.orgEmail || "",
        contactNum: eventData.contactNum || "",
        secondaryContactNumber: eventData.secondaryContactNumber || "",
        regOpenDate: eventData.regOpenDate ? new Date(eventData.regOpenDate) : "",
        regCloseDate: eventData.regCloseDate ? new Date(eventData.regCloseDate) : "",
        tag: eventData.tag || "",
        date: eventData.date ? new Date(eventData.date) : "",
        status: eventData.status || "",
         eventPicture: eventData.eventPicture || null,
         emailBanner: eventData.emailBanner || null,
         url: eventData.url || "",
         externalLinkForResults: eventData.externalLinkForResults || "",
         externalLinkForPhotos: eventData.externalLinkForPhotos || "",
//         categories: eventData.category !== undefined ? eventData.category : [{ name: "", amount: "", distance:"", ageBracket: [{name: "", gender: "", minimumAge: "", maximumAge: "", description: ""}] }],
categories: eventData.category 
? eventData.category.map(category => ({
    ...category,
    ageBracket: category.ageBracket?.length 
      ? category.ageBracket 
      : [{ name: "", gender: "", minimumAge: "", maximumAge: "", description: "" }],
  }))
: [{ name: "", amount: "", gender: "", minimumAge: "", maximumAge: "", description: "", distance:"", ageBracket: [{ name: "", gender: "", minimumAge: "", maximumAge: "", description: "" }] }],
         giveAway: eventData.giveAway !== undefined ? eventData.giveAway : [{name: ""}],
         race: eventData.race !== undefined ? eventData.race : [""]
        });
  }
  
}, [eventData]);

useEffect(() => {
  const selectedGiveAways = Object.entries(giveAways)
    .filter(([_, checked]) => checked)
    .map(([giveAway]) => ({ name: giveAway }));
  formik.setFieldValue("giveAway", selectedGiveAways);
}, [giveAways]);

useEffect(() => {
  if (eventData && Array.isArray(eventData.giveAway)) {
    const updatedGiveAways = { ...giveAways };
    eventData.giveAway.forEach(giveAway => {
      updatedGiveAways[giveAway.name] = true;
    });
    setGiveAways(updatedGiveAways);
  }
}, [eventData]);

console.log(eventData?.giveAway, "giveaway")
  
  useEffect(()=>{
    if(formSubmitted){
  window.scrollTo({top: 0, behavior:"smooth"})
    }
  }, [formSubmitted])



  const handleDayChange = (date) => {
    const utcDate = date && new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    formik.setFieldValue("date", utcDate);
    formik.setFieldTouched('date', false);
  };
  const handleDateBlur = () => {
    formik.setFieldTouched('date', true);
  };

  const handleRegOpenDayChange = (date) => {
    const utcDate = date && new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    formik.setFieldValue("regOpenDate", utcDate);
    formik.setFieldTouched('regOpenDate', false);
  };
    const handleRegOpenBlur = () => {
    formik.setFieldTouched('regOpenDate', true);
  };

  const handleRegCloseDayChange = (date) => {
    const utcDate = date && new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    formik.setFieldValue("regCloseDate", utcDate);
    formik.setFieldTouched('regCloseDate', false);
  };
  const handleRegCloseBlur = () => {
    formik.setFieldTouched('regCloseDate', true);
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    
    if (file) {
      const fileSizeKB = file.size / 1024;
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split('.').pop().toLowerCase();
  
      if (allowedExtensions.includes(fileExtension)) {
       if(fileSizeKB <= 5120){ 
          formik.setFieldValue("eventPicture", file);
          setSelectedFile(file);
          formik.setFieldError("eventPicture", "");
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
          
            img.onload = () => {
              const width = img.width;
              const height = img.height;
              setImageDimensions({width: width, height: height})
            };
          };
          reader.readAsDataURL(file);
          console.log(reader.result.data,  "reader==========")
        }
        else
        {
          formik.setFieldError("eventPicture", "File size should not be exceeds more than 5MB");
        }
      } else {
        formik.setFieldError("eventPicture", "Please select a valid JPG or PNG file.");
      }
    }
  };

  const handleBannerChange = (event) => {
    const file = event.currentTarget.files[0];
    
    if (file) {
   formik.setFieldValue("emailBanner", file);
          setSelectedFile(file);
          formik.setFieldError("emailBanner", "");
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
          
            img.onload = () => {
              const width = img.width;
              const height = img.height;
              setImageDimensions({width: width, height: height})
            };
          };
          reader.readAsDataURL(file);
        
   
    }
  };

  const handleCategoryChange = (index, key, value) => {
    const updatedCategories = [...formik.values.categories];
    updatedCategories[index][key] = value;

    const isDuplicate = updatedCategories.some(
      (category, i) => i !== index && category.name === value
    );

    if (isDuplicate) {
      formik.setFieldError(
        `categories[${index}].name`,
        "Category Name already exists. Please create category with another name"
      );
    } else {
      formik.setFieldValue("categories", updatedCategories);
    }
  };

  const addCategoryInput = () => {
    const newCategory = { name: "", amount: "", gender: "", minimumAge: "", maximumAge: "", description: "", distance: "", ageBracket: [{name: "", minimumAge: "", maximumAge: "", gender: "", description: ""}] };
    formik.setFieldValue("categories", [
      ...formik.values.categories,
      newCategory,
    ]);
  };

  const removeCategory = (index) => {
    const updatedCategories = [...formik.values.categories];
    updatedCategories.splice(index, 1);
    formik.setFieldValue("categories", updatedCategories);
  };
  const handleAgeBracketChange = (categoryIndex, ageIndex, field, value) => {
    const updatedCategories = [...formik.values.categories];
    updatedCategories[categoryIndex].ageBracket[ageIndex][field] = value;
    formik.setFieldValue("categories", updatedCategories);
  };
  
  const addAgeBracket = (categoryIndex) => {
    const updatedCategories = [...formik.values.categories];
    updatedCategories[categoryIndex].ageBracket.push({ name: "",  minimumAge: "", maximumAge: "", gender: "", description: ""});
    formik.setFieldValue("categories", updatedCategories);
  };
  
  const removeAgeBracket = (categoryIndex, ageIndex) => {
    const updatedCategories = [...formik.values.categories];
    updatedCategories[categoryIndex].ageBracket.splice(ageIndex, 1);
    formik.setFieldValue("categories", updatedCategories);
  };
  const showInputs = () => {
    setShowCategories(true);
  };
  const handleAddRaceBtnClick = () => {
    if (!showRace) setShowRace(true);
    else {
      const currentRace = formik.values.race || [];
      formik.setFieldValue("race", [...currentRace, ""]);
    }
  };
  const [showCategories, setShowCategories] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChangeLocation = async (e) => {
    const newValue = e.target.value;
    formik.setFieldValue("location", newValue);
    if (newValue.length === 0) {
      setLatitude(null);
      setLongitude(null);
      setSuggestions([]);
    }
    if (newValue.length > 2) {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newValue)}`);
      const data = await response.json();
      setSuggestions(data);
    }
  };

  const handleSelect = (address, lat, lon) => {
    setLatitude(lat);
    setLongitude(lon);
    formik.setFieldValue("location", address);
    setSuggestions([]);
  };
  return (
    <>
    <style>
      {`
      .datepicker-no-outline:focus {
        outline: none;
      }
      .form-input {
        //position: relative;
      
        //display: flex;
      
        label {
          //position: absolute;
          top: 0;
          margin-top:5px;
          pointer-events: none;
          font-size: 14px;
        }
      
        textarea,
        input {
          border: 1px solid lightgray;
          border-radius: 4px;
          padding: 0 15px;
          padding-top: 25px;
          min-height: 50px;
      
          &:focus {
            border: 2px solid #051036 !important;
          }
        }
        select {
          border: 1px solid lightgray;
          border-radius: 4px;
          padding: 0 15px;
          //padding-top: 25px;
          min-height: 50px;
      
          &:focus {
            border: 2px solid #051036 !important;
          }
        }
      
      input:not(:placeholder-shown) {
        padding-top: 0px;
      }
      textarea:not(:placeholder-shown) {
        padding-top: 5px;
      }
        textarea:focus ~ label,
        textarea:valid ~ label,
        input:focus ~ label,
        input:valid ~ label {
          transform: translateY(-10px);
        }
      }
      `}
    </style>
    <div className="container p-4">
    {isLoading ? (
        <div className="loading-overlay text-center d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border text-primary">
          </div>
        </div>
      ) : (
        <>
        <div className="row justify-content-center">
      <form
        className="col-xl-10 col-lg-11 mt-30"
        id="reg"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
          return false;
        }}
      >

        <div className="row x-gap-40 y-gap-20">
          <div className="col-md-6 mt-3">
          <div className="form-group form-input">
            <label className="text-16 fw-bold">Event Display Name <span className="text-danger">*</span></label>
              <input
                type="text"
                id="eventname"
                className="form-control"
                name="eventName"
                value={formik.values.eventName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              </div>
              {formik.touched.eventName && formik.errors.eventName ? (
              <div className="text-danger">{formik.errors.eventName}</div>
            ) : null}
          </div>
          <div className="col-md-6 mt-3">
          <div className="form-group form-input">
            <label className="text-16 fw-bold">Event Short Name <span className="text-danger">*</span></label>
              <input
                type="text"
                id="shortName"
                className="form-control"
                name="shortName"
                value={formik.values.shortName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              </div>
              {formik.touched.shortName && formik.errors.shortName ? (
              <div className="text-danger">{formik.errors.shortName}</div>
            ) : null}
          </div>
          <div className="col-md-6 mt-3">
          <div className="form-group form-input">
            <label className="text-16 fw-bold">
                Order ID Format <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                    className="form-control"
                id="orderIdFormat"
                name="orderIdFormat"
                value={formik.values.orderIdFormat}
                onChange={(e) => {
                  const uppercasedValue = e.target.value.toUpperCase();
                  formik.setFieldValue('orderIdFormat', uppercasedValue);
                }}
                onBlur={formik.handleBlur}
                required
              />
            </div>
            {formik.touched.orderIdFormat &&
            formik.errors.orderIdFormat ? (
              <div className="text-danger">{formik.errors.orderIdFormat}</div>
            ) : null}
          </div>
          <div className="col-md-6 mt-3">
            <div className="form-group form-input">
            <label className="text-16 fw-bold">
                Event Type <span className="text-danger">*</span>
              </label>
              <select
                id="eventType"
                className="text-dark-1 border p-2 rounded-2 form-select"
                name="eventType"
                value={formik.values.eventType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Please Select</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {formik.touched.eventType && formik.errors.eventType ? (
              <div className="text-danger">{formik.errors.eventType}</div>
            ) : null}
          </div>
          <div className="col-md-6 mt-3">
            <div className="form-group form-input">
            <label className="text-16 fw-bold">Location <span className="text-danger">*</span></label>
            <input
                type="text"
                id="location"
                name="location"
                value={formik.values.location}
                onChange={handleChangeLocation}
                className="p-2 form-control custom-placeholder"
                onBlur={formik.handleBlur}
                required
          placeholder="Search for a location"
        />
        </div>
            {formik.touched.location && formik.errors.location ? (
              <div className="text-danger">{formik.errors.location}</div>
            ) : null}
        {formik.values.location && suggestions.length > 0 && (
          <ul>
            {suggestions.map((item) => (
              <li
                key={item.place_id}
                style={{cursor:"pointer"}}
                onClick={() => handleSelect(item.display_name, item.lat, item.lon)}
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
        {latitude && longitude && 
<div className="mt-3 iframe-container">
<iframe
  src={`https://maps.google.com/maps?q=${encodeURIComponent(formik.values.location)}&output=embed&ll=${latitude},${longitude}&z=8&iwloc`}
  width="100%"
  height="450"
  allowfullscreen=""
  loading="lazy"
></iframe>
</div>
}
</div>

          <div className="col-md-6 mt-3">
            <div className="form-input">
             <label className="text-16 fw-bold">Event Date <span className="text-danger">*</span></label>
             </div>
             <div className="form-control" style={{lineHeight:"40px"}}>
              <DatePicker
                selected={formik.values.date}
                onChange={handleDayChange}
                dateFormat="dd/MM/yyyy"
                className="border-0 datepicker-no-outline"
                onBlur={handleDateBlur}
              /> 
 </div>
            {formik.touched.date && formik.errors.date ? (
              <div className="text-danger">{formik.errors.date}</div>
            ) : null}
          </div>
          <div className="col-md-6">
            <div>
              <label className="text-16 fw-bold mt-3">Event Poster <span className="text-danger">*</span></label>
             </div>
             {eventData?.eventPicture ?
             <>
               <input
              className="text-dark-1"
                type="file"
                id="eventpicture"
                name="eventPicture"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
              />
              {eventData.eventPicture}
              </>
             :
              <input
              className="text-dark-1"
                type="file"
                id="eventpicture"
                name="eventPicture"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                required
              />
             }
               {selectedFile && (
          <div className="d-flex flex-inline x-gap-10">
            <p>Size: {Math.round(selectedFile.size / 1024)} KB;</p>
            <p>Width: {imageDimensions.width};</p>
            <p>Height: {imageDimensions.height}</p>
            
          </div>
        )}
              {formik.touched.eventPicture && formik.errors.eventPicture ? (
                <div className="text-danger">{formik.errors.eventPicture}</div>
              ) : null}
          </div>
          <div className="col-md-6 mt-3">
            <div className="form-input ">
            <label className="text-16 fw-bold">
                Contact Number
              </label>
              <input
                type="text"
                id="conatctNum"
                className="form-control"
                name="contactNum"
                value={formik.values.contactNum}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {/^0|^(\+91)/.test(formik.values.contactNum) && (
              <div className="text-danger font-weight-bold">
                Do not start with 0 or +91
              </div>
            )}
            {formik.touched.contactNum && formik.values.contactNum && formik.values.contactNum.length !== 10 && (
  <div className="text-danger font-weight-bold">
    Please enter a valid 10-digit mobile number.
  </div>
)}
          </div>
          <div className="col-md-6">
          <div>
              <label className="text-16 fw-bold mt-3">Email Banner <span className="text-danger">*</span></label>
             </div>
              {eventData?.emailBanner ?
              <>
           <input
           className="text-dark-1"
             type="file"
             id="emailbanner"
             name="emailBanner"
             onChange={handleBannerChange}
             onBlur={formik.handleBlur}
           />
           {eventData.emailBanner}
          </>  
            :
            <input
            className="text-dark-1"
              type="file"
              id="emailbanner"
              name="emailBanner"
              onChange={handleBannerChange}
              onBlur={formik.handleBlur}
              required
            />
              }
              {formik.touched.emailBanner && formik.errors.emailBanner ? (
                <div className="text-danger">{formik.errors.emailBanner}</div>
              ) : null}
          </div>
          <div className="col-md-6 mt-3">
            <div className="form-input ">
            <label className="text-16 fw-bold">
                Secondary Contact Number
              </label>
              <input
                type="text"
                id="secondaryContactNumber"
                className="form-control"
                name="secondaryContactNumber"
                value={formik.values.secondaryContactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {/^0|^(\+91)/.test(formik.values.secondaryContactNumber) && (
              <div className="text-danger font-weight-bold">
                Do not start with 0 or +91
              </div>
            )}
            {formik.values.secondaryContactNumber && formik.values.contactNum === formik.values.secondaryContactNumber &&(
              <div className="text-danger font-weight-bold">
              Contact number and secondary contact number cannot be the same.
              </div>
            )}
           {formik.touched.secondaryContactNumber && formik.values.secondaryContactNumber && formik.values.secondaryContactNumber.length !== 10 && (
  <div className="text-danger font-weight-bold">
    Please enter a valid 10-digit mobile number.
  </div>
)}
          </div>
          <div className="col-md-6 mt-3">
            <div className="form-group form-input">
            <label className="text-16 fw-bold">
                Tag <span className="text-danger">*</span>
              </label>
              <select
                id="tag"
                className="text-dark-1 border p-2 rounded-2 form-select"
                name="tag"
                value={formik.values.tag}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Please Select</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Fast Filling">Fast Filling</option>
              </select>
            </div>
            {formik.touched.tag && formik.errors.tag ? (
              <div className="text-danger">{formik.errors.tag}</div>
            ) : null}
          </div>

          <div className="col-md-6 mt-3">
            <div className="form-input ">
            <label className="text-16 fw-bold">
                Registration Open Date <span className="text-danger">*</span>
              </label>
              </div>
             <div className="form-control" style={{lineHeight:"40px"}}>
              <DatePicker
                selected={formik.values.regOpenDate}
                onChange={handleRegOpenDayChange}
                dateFormat="dd/MM/yyyy"
                className="border-0 datepicker-no-outline"
                onBlur={handleRegOpenBlur}
              />
             
            </div>
            {formik.touched.regOpenDate && formik.errors.regOpenDate ? (
              <div className="text-danger">{formik.errors.regOpenDate}</div>
            ) : null}
          </div>
          <div className="col-md-6 mt-3">
            <div className="form-group form-input">
            <label className="text-16 fw-bold">
                Organizer Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="orgemail"
                className="form-control"
                name="orgEmail"
                value={formik.values.orgEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />

            </div>
            {formik.touched.orgEmail && formik.errors.orgEmail ? (
              <div className="text-danger">{formik.errors.orgEmail}</div>
            ) : null}
          </div>
          <div className="col-md-6 mt-3">
          <div className="form-group form-input">
          <label className="text-16 fw-bold">
              Status <span className="text-danger">*</span>
            </label>
            <select
              id="status"
              className="text-dark-1 border p-2 rounded-2 form-select"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Please Select</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="OPENFORREGISTRATION">OPENFORREGISTRATION</option>
              <option value="REGISTRATIONCLOSED">REGISTRATIONCLOSED</option>
              <option value="EVENTDATEEXPIRED">EVENTDATEEXPIRED</option>
              <option value="RESULTSUPLOADED">RESULTSUPLOADED</option>
              <option value="PHOTOSUPLOADED">PHOTOSUPLOADED</option>
              <option value="ARCHIVED">ARCHIVED</option>
              </select>
          </div>
        </div>
       
          <div className="col-md-6 mt-3">
            <div className="form-group form-input">
            <label className="text-16 fw-bold">
                Registration Close Date <span className="text-danger">*</span>
                </label>
              </div>
             <div className="form-control" style={{lineHeight:"40px"}}>
              <DatePicker
                inputClass=""
                selected={formik.values.regCloseDate}
                onChange={handleRegCloseDayChange}
                dateFormat="dd/MM/yyyy"
                className="border-0 datepicker-no-outline"
                onBlur={handleRegCloseBlur}
              />
            </div>
            {formik.touched.regCloseDate && formik.errors.regCloseDate ? (
              <div className="text-danger">{formik.errors.regCloseDate}</div>
            ) : null}
          </div>
          <div className="col-md-12 mt-3">
            <div className="form-group form-input">
            <label className="text-16 fw-bold">About Event <span className="text-danger">*</span></label>
            <CKEditor
              editor={ClassicEditor}
              data={formik.values.aboutEvent}
              onChange={(event, editor) => {
                formik.setFieldValue("aboutEvent", editor.getData());
              }}
            />
            </div>
            {formik.touched.aboutEvent && formik.errors.aboutEvent ? (
              <div className="text-danger">{formik.errors.aboutEvent}</div>
            ) : null}
          </div>
          <div className="col-md-6 mt-3">
            <div className="form-input">
            <label className="text-16 fw-bold">
            External Link For Registration
              </label>
              <input
                type="text"
                id="url"
                className="form-control"
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
 {formik.touched.url && formik.errors.url ? (
   <div className="text-danger">{formik.errors.url}</div>
 ) : null}
</div>
<div className="col-md-6 mt-3">
            <div className="form-input">
            <label className="text-16 fw-bold">
                External Link For Results
              </label>
              <input
                type="text"
                id="externalLinkForResults"
                className="form-control"
                name="externalLinkForResults"
                value={formik.values.externalLinkForResults}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
</div>
<div className="col-md-6 mt-3">
            <div className="form-input">
            <label className="text-16 fw-bold">
                External Link For Photos
              </label>
              <input
                type="text"
                id="externalLinkForPhotos"
                className="form-control"
                name="externalLinkForPhotos"
                value={formik.values.externalLinkForPhotos}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
</div>
    </div>
    <div className="row y-gap-10 items-center">
    <div className="col-md-12">
          <div className="row x-gap-40 y-gap-10 items-center mt-2">
                      <div className="col-md-5">
          {!showCategories && (
            <button
              type="button"
              onClick={showInputs}
              className="button btn border p-2 fw-bold rounded-3 mt-3"
            >
              Categories
            </button>
          )}
        </div>
</div>
<div className="row x-gap-40 items-center">
                      <div className="col-md-6">
            {showCategories && (
              <button
                type="button"
                onClick={addCategoryInput}
                className="button border btn p-2 fw-bold rounded-3 mt-3"
              >
                Add Category
              </button>
            )}
          </div>
        </div>
        <div className="x-gap-20">
            {showCategories &&
              formik.values.categories.map((category, index) => (
                <div key={index}>
                  <div className="" style={{ marginTop: "0.5em" }}>
                    <div className="row x-gap-20 y-gap-10 align-items-end">
                      <div className="col-md-2">
                        <div className="form-group form-input">
                        <label className="text-16 fw-bold">Category Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={category.name}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                        </div>

                        {formik.touched.categories && formik.errors.categories && Array.isArray(formik.errors.categories) && (
  formik.errors.categories[index] &&
  formik.errors.categories[index].name && (
    <div className="text-danger">
      {formik.errors.categories[index].name}
    </div>
  )
)}
                      </div>
                      <div className="col-md-2">
                          <div className="form-input">
                            <label className="text-16 fw-bold">
                              Gender
                            </label>
                            <select
                              className="form-select"
                              name="gender"
                              id="gender"
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "gender",
                                  e.target.value
                                )
                              }
                              onBlur={formik.handleBlur}
                              value={category.gender}
                            >
                              <option value="">Select Gender</option>
                              <option>MALE</option>
                              <option>FEMALE</option>
                              <option>BOTH</option>
                            </select>
                            {formik.touched.categories &&
                              formik.errors.categories &&
                              Array.isArray(formik.errors.categories) &&
                              formik.errors.categories[index] &&
                              formik.errors.categories[index].gender && (
                                <div className="text-danger">
                                  {formik.errors.categories[index].gender}
                                </div>
                              )}
                          </div>
                        </div>
            <div className="col-md-2">
                        <div className="form-group form-input">
                        <label className="text-16 fw-bold">Amount</label>
                          <input
                            type="text"
                            className="form-control"
                            value={category.amount}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {formik.touched.categories && formik.errors.categories && Array.isArray(formik.errors.categories) && (
  formik.errors.categories[index] &&
  formik.errors.categories[index].amount && (
    <div className="text-danger">
      {formik.errors.categories[index].amount}
    </div>
  )
)}
                      </div>
                      <div className="col-md-2">
                          <div className="form-group form-input">
                            <label className="text-16 fw-bold">
                              Minimum Age
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={category.minimumAge}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "minimumAge",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {formik.touched.categories &&
                            formik.errors.categories &&
                            Array.isArray(formik.errors.categories) &&
                            formik.errors.categories[index] &&
                            formik.errors.categories[index].minimumAge && (
                              <div className="text-danger">
                                {formik.errors.categories[index].minimumAge}
                              </div>
                            )}
                        </div>
                        <div className="col-md-2">
                        <div className="form-group form-input">
                            <label className="text-16 fw-bold">
                              Maximum Age
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={category.maximumAge}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "maximumAge",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {formik.touched.categories &&
                            formik.errors.categories &&
                            Array.isArray(formik.errors.categories) &&
                            formik.errors.categories[index] &&
                            formik.errors.categories[index].maximumAge && (
                              <div className="text-danger">
                                {formik.errors.categories[index].maximumAge}
                              </div>
                            )}
                        </div>
                        {formik.values.eventType !== "Others" &&
                      <div className="col-md-2">
                        <div className="form-group form-input">
                        <label className="text-16 fw-bold">Distance</label>
                          <input
                            type="text"
                            className="form-control"
                            value={category.distance}
                            onChange={(e) =>
                              handleCategoryChange(
                                index,
                                "distance",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {formik.touched.categories && formik.errors.categories && Array.isArray(formik.errors.categories) && (
  formik.errors.categories[index] &&
  formik.errors.categories[index].distance && (
    <div className="text-danger">
      {formik.errors.categories[index].distance}
    </div>
  )
)}
                      </div>
}
                      <div className="col-md-2">
                      <div className="form-group form-input">
                            <label className="text-16 fw-bold">
                              Description
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={category.description}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {formik.touched.categories &&
                            formik.errors.categories &&
                            Array.isArray(formik.errors.categories) &&
                            formik.errors.categories[index] &&
                            formik.errors.categories[index].description && (
                              <div className="text-danger">
                                {formik.errors.categories[index].description}
                              </div>
                            )}
                        </div>
                        <div className="mt-3">
                          <button
                          type="button"
                            className="border p-2 rounded-1 btn fw-bold"
                            onClick={() => addAgeBracket(index)}
                          >
                    Add Age Brackets
                          </button>
                          {formik.touched.categories &&
  formik.errors.categories &&
  Array.isArray(formik.errors.categories) &&
  formik.errors.categories[index] &&
  typeof formik.errors.categories[index].ageBracket === "string" && (
    <div className="text-danger">
      {formik.errors.categories[index].ageBracket}
    </div>
  )}
                        </div>
                      {category.ageBracket && category.ageBracket.map((bracket, ageIndex) => (
                        <>
                         <div className="row align-items-start">
                      <div className="col-md-2">
      <div className="form-group form-input">
        <label className="text-16 fw-bold">Name</label>

          <input
            key={ageIndex}
            type="text"
            className="form-control"
            value={bracket.name}
            onChange={(e) =>
              handleAgeBracketChange(index, ageIndex, "name", e.target.value)
            }
            onBlur={formik.handleBlur}
          />
    
    {formik.touched.categories &&
    formik.errors.categories &&
    Array.isArray(formik.errors.categories) &&
    formik.errors.categories[index] &&
    formik.errors.categories[index].ageBracket &&
    formik.errors.categories[index].ageBracket[ageIndex]?.name && (
      <div className="text-danger">
        {formik.errors.categories[index].ageBracket[ageIndex].name}
      </div>
    )}
      </div>
    </div>
    <div className="col-md-2">
  <div className="form-group form-input">
    <label className="text-16 fw-bold">Gender</label>
    <select
      className="form-select"
      value={bracket.gender || ''}
      onChange={(e) =>
        handleAgeBracketChange(index, ageIndex, "gender", e.target.value)
      }
      onBlur={formik.handleBlur}
    >
      <option value="">Select Gender</option>
      <option value="MALE">MALE</option>
      <option value="FEMALE">FEMALE</option>
      <option value="BOTH">BOTH</option>
    </select>
    {formik.touched.categories &&
      formik.errors.categories &&
      Array.isArray(formik.errors.categories) &&
      formik.errors.categories[index] &&
      formik.errors.categories[index].ageBracket &&
      formik.errors.categories[index].ageBracket[ageIndex]?.gender && (
        <div className="text-danger">
          {formik.errors.categories[index].ageBracket[ageIndex].gender}
        </div>
      )}
  </div>
</div>
<div className="col-md-2">
      <div className="form-group form-input">
        <label className="text-16 fw-bold">Minimum Age</label>

          <input
            key={ageIndex}
            type="text"
            className="form-control"
            value={bracket.minimumAge}
            onChange={(e) =>
              handleAgeBracketChange(index, ageIndex, "minimumAge", e.target.value)
            }
            onBlur={formik.handleBlur}
          />
    
    {formik.touched.categories &&
      formik.errors.categories &&
      Array.isArray(formik.errors.categories) &&
      formik.errors.categories[index] &&
      formik.errors.categories[index].ageBracket &&
      formik.errors.categories[index].ageBracket[ageIndex]?.minimumAge && (
        <div className="text-danger">
          {formik.errors.categories[index].ageBracket[ageIndex].minimumAge}
        </div>
      )}
      </div>
    </div>
    <div className="col-md-2">
      <div className="form-group form-input">
        <label className="text-16 fw-bold">Maximum Age</label>

          <input
            key={ageIndex}
            type="text"
            className="form-control"
            value={bracket.maximumAge}
            onChange={(e) =>
              handleAgeBracketChange(index, ageIndex, "maximumAge", e.target.value)
            }
            onBlur={formik.handleBlur}
          />
    
    {formik.touched.categories &&
      formik.errors.categories &&
      Array.isArray(formik.errors.categories) &&
      formik.errors.categories[index] &&
      formik.errors.categories[index].ageBracket &&
      formik.errors.categories[index].ageBracket[ageIndex]?.maximumAge && (
        <div className="text-danger">
          {formik.errors.categories[index].ageBracket[ageIndex].maximumAge}
        </div>
      )}
      </div>
    </div>
    <div className="col-md-2">
      <div className="form-group form-input">
        <label className="text-16 fw-bold">Description</label>

          <input
            key={ageIndex}
            type="text"
            className="form-control"
            value={bracket.description}
            onChange={(e) =>
              handleAgeBracketChange(index, ageIndex, "description", e.target.value)
            }
            onBlur={formik.handleBlur}
          />
    
    {formik.touched.categories &&
      formik.errors.categories &&
      Array.isArray(formik.errors.categories) &&
      formik.errors.categories[index] &&
      formik.errors.categories[index].ageBracket &&
      formik.errors.categories[index].ageBracket[ageIndex]?.description && (
        <div className="text-danger">
          {formik.errors.categories[index].ageBracket[ageIndex].description}
        </div>
      )}
      </div>
    </div>
    <div className="col-md-2" style={{marginTop:"1.6em"}}>
                        <div className="form-group form-input">
                          <button
                            type="button"
                            className="border p-2 rounded-1 btn"
                            onClick={() => removeAgeBracket(index, ageIndex)}
                          >
                   Remove
                    </button>
                        </div>
                      </div>
                      </div>
   
    </>
  ))}

                      <div className="col-md-2 mt-3">
                        <div className="form-group form-input">
                          <button
                            type="button"
                            className="border p-2 rounded-1 btn"
                            onClick={() => removeCategory(index)}
                          >
                    Remove
                          </button>
                        </div>
                      </div>
               
                    </div>
                  </div>
                </div>
              ))}
        </div>
        </div>
        
        <Race
            formik={formik}
            // race={formik.values.race}
            showRace={showRace}
            handleAddRaceBtnClick={handleAddRaceBtnClick}
          />

        <div className="col-md-12 mt-3">
        <div className="text-16 fw-bold">Give Aways</div>
{Object.entries(giveAways).map(([giveAway, checked]) => (
  <>
  <div className="d-flex gap-3 align-items-start">
        <div key={giveAway}>
          <input
            type="checkbox"
            name={giveAway}
            className="form-check-input border p-2"
            id={giveAway}
            checked={checked}
            onChange={(e) => handleGiveAwayChange(giveAway, e.target.checked)}
          />
          </div>
          <div>
          <label htmlFor={giveAway} className="text-16 fw-bold">{giveAway}</label>
          </div>
        </div>
        </>
      ))}
        </div>
        </div>
        <div className='mt-3'>
<span className="text-danger">*</span> Indicates mandatory fields
</div>
        <div className="row x-gap-20 y-gap-20 pt-10">
          <div className="col-12">
            <button
            className="button border btn btn-primary px-4 py-2 text-light-1 rounded-3 mt-3" 
              type="submit"
            >
              { eventData ? "Save" : "Submit" }
            </button>
          </div>
        </div>
      </form>
      </div>
</>
      )
}
      <ToastComponent
      showToast={showToast}
      toastHeader={eventData ? "Event Edit" : "Create Eevnt"}
      setShowToast={setShowToast}
      toastMessage={toastMessage}
      toastVariant={toastVariant}
      />
      </div>
 </>
  );
};

export default EventCreate;
