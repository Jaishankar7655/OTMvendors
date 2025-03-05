import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const Services = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      navigate("/"); // Redirect to login if not logged in
      return;
    }

    const vendorUniqueId = userData.vendor_unique_id;
    const apiUrl = `https://backend.onetouchmoments.com/vendor_controller/vendor_bussiness/index_get?vendor_id=${vendorUniqueId}`;

    setLoading(true);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("API Response:", result);
        setData(result.data || []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Error fetching data.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggleVendorExpand = (vendorId) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };

  const renderVendorDetails = (item) => {
    const fields = [
      { label: "Service ID", value: item.service_id },
      { label: "Service Category", value: item.service_cat },
      { label: "Vendor ID", value: item.vendor_id },
      { label: "Email", value: item.email },
      { label: "Phone", value: item.phone }
    ];

    return (
      <div className="bg-gray-50 p-4 rounded-lg mt-2 shadow-inner">
        {fields.map((field) => (
          <div key={field.label} className="mb-2">
            <span className="font-semibold text-gray-700">{field.label}:</span>{" "}
            <span className="text-gray-600">{field.value || "N/A"}</span>
          </div>
        ))}
        <Link
          to={`/ServiceDetails?vendor=${item.vendor_id}&data=${encodeURIComponent(item.firm_name || "N/A")}`}
          className="mt-2 inline-block text-red-600 hover:underline"
        >
          View Full Details
        </Link>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Service Details</h1>

      {error && <p className="text-red-500 text-lg">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-center text-lg">Loading...</p>
      ) : data.length > 0 ? (
        <div className="space-y-4">
          {data.map((item) => (
            <div 
              key={item.vendor_id} 
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <div 
                onClick={() => toggleVendorExpand(item.vendor_id)}
                className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-800">
                    {item.firm_name || "Unnamed Vendor"}
                  </span>
                </div>
                {expandedVendor === item.vendor_id ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </div>
              
              {expandedVendor === item.vendor_id && renderVendorDetails(item)}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600 text-lg text-center">
          No data available.
        </p>
      )}

      <div className="mt-6 text-center">
        <Link to="/" className="text-red-600 hover:underline text-lg">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Services;