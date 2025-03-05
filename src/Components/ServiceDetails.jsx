  import React, { useEffect, useState } from "react";
  import { useNavigate, Link, useLocation } from "react-router-dom";
  import { Pencil, Trash2, PlusCircle, CheckCircle, X, Save } from 'lucide-react';

  const ServiceDetails = () => {
    const [serviceData, setServiceData] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedSpecification, setSelectedSpecification] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch and process services
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      if (!userData) {
        navigate("/");
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const firmName = searchParams.get("data");
      const vendor = searchParams.get("vendor");

      if (!firmName) {
        setError("❌ Invalid firm name!");
        setLoading(false);
        return;
      }

      const apiUrl = `https://backend.onetouchmoments.com/vendor_controller/Vendor_service/index_get_service?data=${encodeURIComponent(firmName.trim())}`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.status === 1 && Array.isArray(data.data) && data.data.length > 0) {
            setServiceData(data.data);
            setFilteredServices(data.data);
          } else {
            setError("⚠ No services found.");
          }
        })
        .catch(error => {
          console.error("❌ Error fetching data:", error);
          setError("⚠ Error fetching data. Please try again.");
        })
        .finally(() => setLoading(false));
    }, [navigate, location.search]);

    // Handle edit input changes
    const handleEditInputChange = (e, field) => {
      const { value } = e.target;
      setEditingService(prev => ({
        ...prev,
        [field]: value
      }));
    };

    // Update service handler
    const handleUpdateService = async () => {
      if (!editingService) return;

      try {
        const formDataObj = new FormData();
        
        // Append all relevant fields
        Object.entries(editingService).forEach(([key, value]) => {
          formDataObj.append(key, value);
        });

        const response = await fetch('https://backend.onetouchmoments.com/vendor_controller/vendor_service/index_post', {
          method: 'POST',
          body: formDataObj
        });

        const result = await response.json();

        if (result.status === 1) {
          // Update local state
          const updatedServices = filteredServices.map(service => 
            service.service_id === editingService.service_id ? editingService : service
          );
          
          setFilteredServices(updatedServices);
          setServiceData(updatedServices);
          setEditingService(null);
          
          alert('Service updated successfully!');
        } else {
          alert(result.message || "Update failed");
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the service.');
      }
    };

    // Delete service handler
    const handleDeleteService = async (serviceId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this service?");
      
      if (!confirmDelete) return;

      try {
        const formDataObj = new FormData();
        formDataObj.append('service_id', serviceId);

        const response = await fetch('https://backend.onetouchmoments.com/vendor_controller/vendor_service/delete_service', {
          method: 'POST',
          body: formDataObj
        });

        const result = await response.json();

        if (result.status === 1) {
          // Remove service from local state
          const updatedServices = filteredServices.filter(service => 
            service.service_id !== serviceId
          );
          
          setFilteredServices(updatedServices);
          setServiceData(updatedServices);
          
          alert('Service deleted successfully!');
        } else {
          alert(result.message || "Deletion failed");
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the service.');
      }
    };

    // Get unique specifications
    const getSpecifications = () => {
      const specs = new Set();
      
      serviceData.forEach(record => {
        if (record.specification) {
          const specArray = record.specification.includes(',') 
            ? record.specification.split(',') 
            : [record.specification];
            
          specArray.forEach(spec => specs.add(spec.trim()));
        }
      });
      
      return Array.from(specs);
    };

    // Filter services by specification
    const handleSpecificationFilter = (spec) => {
      setSelectedSpecification(spec);
      const filtered = spec 
        ? serviceData.filter(service => service.specification === spec)
        : serviceData;
      setFilteredServices(filtered);
    };

    // Extract URL search params
    const searchParams = new URLSearchParams(location.search);
    const firmName = searchParams.get("data");
    const vendor = searchParams.get("vendor");

    return (
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 md:mt-20  ">
        <h1 className="text-4xl font-extrabold mb-8 text-red-600 text-center">
          Service Management
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
            <p className="font-semibold text-xl">{error}</p>
          </div>
        ) : (
          <>
            {/* Firm and Vendor Info */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-red-100 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Firm: <span className="text-gray-800">{firmName}</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Vendor ID: <span className="font-medium">{vendor}</span>
                </p>
              </div>
              <button 
                className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-red-700 transition-colors shadow-md"
                onClick={() => navigate('/VendorList')}
              >
                <PlusCircle className="mr-2" size={24} /> Add New Service
              </button>
            </div>

            {/* Specification Filter */}
            <div className="mb-8 flex flex-wrap gap-3 justify-center">
              <button
                className={`px-5 py-2 rounded-full font-semibold transition-all ${selectedSpecification === '' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                onClick={() => handleSpecificationFilter('')}
              >
                All Services
              </button>
              {getSpecifications().map((spec) => (
                <button
                  key={spec}
                  className={`px-5 py-2 rounded-full font-semibold transition-all ${selectedSpecification === spec ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  onClick={() => handleSpecificationFilter(spec)}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div 
                  key={service.service_id} 
                  className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden transform transition-all hover:scale-105"
                >
                  {editingService && editingService.service_id === service.service_id ? (
                    // Editing Mode
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-red-600">
                          {service.specification}
                        </h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={handleUpdateService}
                            className="text-green-500 hover:text-green-700 transition-colors"
                            title="Save Changes"
                          >
                            <Save size={24} />
                          </button>
                          <button 
                            onClick={() => setEditingService(null)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Cancel"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            MRP Price
                          </label>
                          <input 
                            type="number"
                            value={editingService.mrp_price}
                            onChange={(e) => handleEditInputChange(e, 'mrp_price')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Offer Price
                          </label>
                          <input 
                            type="number"
                            value={editingService.off_price}
                            onChange={(e) => handleEditInputChange(e, 'off_price')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-red-600">
                          {service.specification}
                        </h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setEditingService({...service})}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Edit Service"
                          >
                            <Pencil size={20} />
                          </button>
                          <button 
                            onClick={() => handleDeleteService(service.service_id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">MRP Price</span>
                          <span className="text-red-600 font-bold">₹{service.mrp_price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Offer Price</span>
                          <span className="text-green-600 font-bold">₹{service.off_price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Service ID</span>
                          <span className="text-gray-800 font-semibold">{service.service_id}</span>
                        </div>
                        <div className="flex items-center text-green-600 mt-2">
                          <CheckCircle className="mr-2" size={18} />
                          <span className="font-medium">Active Service</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-red-600 text-2xl font-bold mb-4">No services found</p>
                <p className="text-gray-600">Try adjusting your filter or add a new service</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  export default ServiceDetails;