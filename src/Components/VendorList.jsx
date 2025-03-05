import React, { useState, useEffect } from "react";
import hotel from "../assets/vendors/hotel.png";
import photo from "../assets/vendors/camera.png";
import decoration from "../assets/vendors/decoration.png";
import tours from "../assets/vendors/tours.png";
import catering from "../assets/vendors/catering.png";
import varmala from "../assets/vendors/varmala.png";
import tent from "../assets/vendors/tent.png";
import makeup from "../assets/vendors/makeup.png";
import pandit from "../assets/vendors/pandit.png";
import weddingdress from "../assets/vendors/weddinddress.png";
import entertainment from "../assets/vendors/entertainment.png";
import venue from "../assets/vendors/venue.png";
import dhol from "../assets/vendors/dhol.png";
import dj from "../assets/vendors/dj.png";
import band from "../assets/vendors/band.png";

import { Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";

function VendorList() {
  const vendorsData = [
    { title: "Hotel", img: hotel, category: "Accommodation", Route: "/VendorList/Hotelregister" },
    { title: "Photo Video", img: photo, category: "Photography", Route: "/VendorList/Photvideo" },
    { title: "Decoration", img: decoration, category: "Decor", Route: "/VendorList/DecorationRegister" },
    { title: "Tours & Travels", img: tours, category: "Travel", Route: "/VendorList/ToursRegister" },
    { title: "Catering", img: catering, category: "Food", Route: "/VendorList/CateringRegister" },
    { title: "VarMala Entry", img: varmala, category: "Ceremony", Route: "/VendorList/WaramalaRegister" },
    { title: "Tent Houses", img: tent, category: "Venue", Route: "/VendorList/TentHouseRegister" },
    { title: "Makeup Artist", img: makeup, category: "Beauty", Route: "/VendorList/MakeupArtistRegister" },
    { title: "Pandit", img: pandit, category: "Ceremony", Route: "/VendorList/PanditRegister" },
    { title: "Wedding Dress", img: weddingdress, category: "Attire", Route: "/VendorList/WeddingDressRegister" },
    { title: "Entertainment", img: entertainment, category: "Performance", Route: "/VendorList/EntertainMentRegister/" },
    { title: "Venue", img: venue, category: "Venue", Route: "/VendorList/VenueRegister" },
    { title: "Dhol", img: dhol, category: "Music", Route: "/VendorList/DholRegister" },
    { title: "DJ", img: dj, category: "Music", Route: "/VendorList/DJRegister" },
    { title: "Band", img: band, category: "Music", Route: "/VendorList/BandRegister" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filteredData, setFilteredData] = useState(vendorsData);

  useEffect(() => {
    // Filter data only if search term length is 3 or more characters
    if (searchTerm.length >= 3 || categoryFilter) {
      const newData = vendorsData.filter((data) => {
        const matchesSearch = data.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              data.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "" || data.category === categoryFilter;
        return matchesSearch && matchesCategory;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(vendorsData);
    }
  }, [searchTerm, categoryFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white mt-14">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600">
           Vendors
          </span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Find the perfect vendors for your special day. All in one place.
        </p>

        {/* Search and filter section */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors..."
                className="pl-10 p-3 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 p-3 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {[...new Set(vendorsData.map((item) => item.category))].map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vendors grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-16">
          {filteredData.length > 0 ? (
            filteredData.map((vendor, index) => (
              <Link to={vendor.Route} key={index}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden h-full border border-gray-100">
                  <div className="p-4 text-center flex flex-col items-center h-full">
                    <div className="flex justify-center items-center h-20 w-20 mb-4 rounded-full bg-rose-50 p-4">
                      <img src={vendor.img} alt={vendor.title} className="max-h-12 max-w-12 object-contain" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">{vendor.title}</h3>
                    <p className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full inline-block">
                      {vendor.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-lg text-gray-600 mb-4">No vendors found matching your search</p>
              <button onClick={() => { setSearchTerm(""); setCategoryFilter(""); }} className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-2 rounded-full transition-colors duration-300">
                Show All Vendors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default VendorList;
