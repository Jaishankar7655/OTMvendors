import React, { useState } from "react";

const HotelRegister = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelAddress: "",
    regularPrice: "",
    offerPrice: "",
    description: "",
    starCategory: "",
  });

  const [uploadedImages, setUploadedImages] = useState({
    videos: [],
    rooms: [],
    entrance: [],
    washroom: [],
    swimingPool: [],
    garden: [],
    reception: [],
    commonArea: [],
    restaurant: [],
  });

  const imageCategories = [
    { key: "videos", label: "Add Videos" },
    { key: "rooms", label: "Add Room Images" },
    { key: "entrance", label: "Add Entrance Images" },
    { key: "washroom", label: "Add Washroom Images" },
    { key: "swimingPool", label: "Add Swimming Pool Images" },
    { key: "garden", label: "Add Garden Images" },
    { key: "reception", label: "Add Reception Images" },
    { key: "commonArea", label: "Add Common Area Images" },
    { key: "restaurant", label: "Add Restaurant Images" },
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = (category, event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setUploadedImages((prev) => ({
      ...prev,
      [category]: [...prev[category], ...imageFiles],
    }));
  };

  const handleImageDelete = (category, index) => {
    setUploadedImages((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();

    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    // Create an object to store all data including image URLs
    const completeFormData = {
      ...formData,
      images: Object.entries(uploadedImages).reduce((acc, [category, images]) => {
        acc[category] = images.map(image => ({
          name: image.name,
          size: image.size,
          type: image.type,
          url: URL.createObjectURL(image)
        }));
        return acc;
      }, {})
    };

    // Log the complete data in console
    console.log("Complete Form Submission:", completeFormData);

    // Cleanup URLs after logging
    Object.values(completeFormData.images).forEach(categoryImages => {
      categoryImages.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-red-600 px-4 py-8 text-white text-center">
        <h1 className="text-4xl font-bold">Register your Hotel with OTM!</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg">
          <div className="p-8 space-y-8">
            <h2 className="text-2xl font-semibold text-red-700 border-b pb-4">
              Add Hotel Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageCategories.map((category) => (
                <div
                  key={category.key}
                  className="bg-slate-50 p-4 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">{category.label}</h3>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      id={`upload-${category.key}`}
                      className="hidden"
                      onChange={(e) => handleImageUpload(category.key, e)}
                    />
                    <label
                      htmlFor={`upload-${category.key}`}
                      className="border bg-red-200 b px-4 py-2 rounded-md cursor-pointer hover:bg-red-700 transition duration-300"
                    >
                      +
                    </label>
                  </div>

                  {uploadedImages[category.key].length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {uploadedImages[category.key].map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`${category.key}-${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageDelete(category.key, index)}
                            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {Object.entries({
                hotelName: "Hotel Name",
                hotelAddress: "Hotel Address",
                regularPrice: "Regular Price",
                offerPrice: "Offer Price",
                description: "Short Description",
                starCategory: "Hotel Star Category",
              }).map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-lg text-red-700 mb-2">
                    {label}
                  </label>
                  {key === "description" ? (
                    <textarea
                      id={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${label}`}
                      className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-32"
                      required
                    />
                  ) : key === "starCategory" ? (
                    <select
                      id={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Star Category</option>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                          {star} Star
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={key.includes("Price") ? "number" : "text"}
                      id={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${label}`}
                      className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300"
            >
              Get Subscriptions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelRegister;