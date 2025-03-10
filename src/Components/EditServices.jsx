import React, { useState, useEffect } from "react";

const EditServices = () => {
  const [formData, setFormData] = useState({
    service_cat: "",
    vendor_id: "",
    firm_name: "",
    email: "",
    phone: "",
    house_no: "",
    city: "",
    near_by: "",
    district: "",
    state: "",
    pincode: "",
    specifications: [],
    images: [],
    videos: [],
  });

  const [resultMessage, setResultMessage] = useState("");

  // Function to get query params from URL
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  const firmName = getQueryParam("firm_name");
  const apiUrl = `https://backend.onetouchmoments.com/vendor_controller/vendor_service/index_get_service_details?data=${firmName}`;

  // Fetch data from the API
  useEffect(() => {
    if (firmName) {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const records = data.data || [];
          if (Array.isArray(records) && records.length > 0) {
            const record = records[0];
            setFormData({
              service_cat: record.service_cat || "",
              vendor_id: record.vendor_id || "",
              firm_name: record.firm_name || "",
              email: record.email || "",
              phone: record.phone || "",
              house_no: record.house_no || "",
              city: record.city || "",
              near_by: record.near_by || "",
              district: record.district || "",
              state: record.state || "",
              pincode: record.pincode || "",
              specifications: record.specifications || [],
              images: [],
              videos: [],
            });
          } else {
            setResultMessage("No data available.");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setResultMessage("Error fetching data.");
        });
    }
  }, [firmName]);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedSpecifications = checked
          ? [...prevData.specifications, value]
          : prevData.specifications.filter((spec) => spec !== value);
        return { ...prevData, specifications: updatedSpecifications };
      });
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => formDataToSend.append(key, item));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(
        "https://backend.onetouchmoments.com/vendor_controller/vendor_service/index_put",
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      const result = await response.json();
      if (result.status === 1) {
        // On success, redirect to services page
        window.location.href = `services.html?data=${formData.vendor_id}`;
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "700px",
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "50px",
      }}
    >
      <h2 className="text-center mb-4">Submit Your Service</h2>
      <p id="result" className="text-center text-danger">
        {resultMessage}
      </p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Service Category</label>
          <input
            type="text"
            name="service_cat"
            className="form-control"
            value={formData.service_cat}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Vendor ID</label>
          <input
            type="text"
            name="vendor_id"
            className="form-control"
            value={formData.vendor_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Firm Name</label>
          <input
            type="text"
            name="firm_name"
            className="form-control"
            value={formData.firm_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">House No.</label>
          <input
            type="text"
            name="house_no"
            className="form-control"
            value={formData.house_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nearby Location</label>
          <input
            type="text"
            name="near_by"
            className="form-control"
            value={formData.near_by}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">District</label>
          <input
            type="text"
            name="district"
            className="form-control"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <input
            type="text"
            name="state"
            className="form-control"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Pincode</label>
          <input
            type="text"
            name="pincode"
            className="form-control"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Service Specifications</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="specifications"
              value="Fast Service"
              checked={formData.specifications.includes("Fast Service")}
              onChange={handleChange}
            />
            <label className="form-check-label">Fast Service</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="specifications"
              value="24/7 Support"
              checked={formData.specifications.includes("24/7 Support")}
              onChange={handleChange}
            />
            <label className="form-check-label">24/7 Support</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="specifications"
              value="Affordable Price"
              checked={formData.specifications.includes("Affordable Price")}
              onChange={handleChange}
            />
            <label className="form-check-label">Affordable Price</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="specifications"
              value="Premium Quality"
              checked={formData.specifications.includes("Premium Quality")}
              onChange={handleChange}
            />
            <label className="form-check-label">Premium Quality</label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Images (Multiple)</label>
          <input
            type="file"
            name="images"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Video (Multiple)</label>
          <input
            type="file"
            name="videos"
            className="form-control"
            multiple
            accept="video/*"
            onChange={handleChange}
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>

      <div className="text-center mt-3">
        <a href="dashboard.html" className="btn btn-secondary">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default EditServices;
