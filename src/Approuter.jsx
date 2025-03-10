import { Routes, Route } from "react-router-dom";
import App from "./App";
import HotelRegister from "./Vendors/HotelRegister";
import PhotoVideoRegister from "./Vendors/Photvideo";
import DecorationRegister from "./Vendors/DecorationRegister";
import ToursRegister from "./Vendors/ToursRegister";
import CateringRegister from "./Vendors/CateringRegister";
import VarmalaRegister from "./Vendors/WaramalaRegister";
import TentHouseRegister from "./Vendors/TentHouseRegister";
import MakeupArtistRegister from "./Vendors/MakeupArtistRegister";
import PanditRegister from "./Vendors/PanditRegister";
import WeddingDressRegister from "./Vendors/WeddingDressRegister";
import EntertainmentRegister from "./Vendors/EntertainmentRegister";
import VenueRegister from "./Vendors/VenueRigister";
import DholRegister from "./Vendors/DholRegister";
import DJRegister from "./Vendors/DJRegister";
import BandRegister from "./Vendors/BandRegister";

import VendorProfile from "./Profile/VendorProfile";
import UserLogin from "./UserLog/UserLogin";
import UserRegistration from "./UserLog/UserRegister";
import VendorLogin from "./UserLog/VendorLogin";
import VendorRegistration from "./UserLog/VendorRegistration";

import VendorList from "./Components/VendorList";
import LoverStrip from "./Components/VendorList";
import Services from "./Components/Services";
import ServiceDetails from "./Components/ServiceDetails";
import EditServices from "./Components/EditServices";
import PaymentComponent from "./Payment/PaymentComponent";

function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/VendorProfile" element={<VendorProfile />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/UserRegister" element={<UserRegistration />} />
        <Route path="/VendorLogin" element={<VendorLogin />} />
        <Route path="/VendorRegistration" element={<VendorRegistration />} />
        <Route path="/VendorList/Hotelregister" element={<HotelRegister />} />
        <Route path="/VendorList/Photvideo" element={<PhotoVideoRegister />} />
        <Route
          path="/VendorList/DecorationRegister"
          element={<DecorationRegister />}
        />
        <Route path="/VendorList/ToursRegister" element={<ToursRegister />} />
        <Route
          path="/VendorList/CateringRegister"
          element={<CateringRegister />}
        />
        <Route
          path="/VendorList/WaramalaRegister"
          element={<VarmalaRegister />}
        />
        <Route
          path="/VendorList/TentHouseRegister"
          element={<TentHouseRegister />}
        />
        <Route
          path="/VendorList/MakeupArtistRegister"
          element={<MakeupArtistRegister />}
        />
        <Route path="/VendorList/PanditRegister" element={<PanditRegister />} />
        <Route
          path="/VendorList/WeddingDressRegister"
          element={<WeddingDressRegister />}
        />
        <Route
          path="/VendorList/EntertainmentRegister"
          element={<EntertainmentRegister />}
        />
        <Route path="/VendorList/VenueRegister" element={<VenueRegister />} />
        <Route path="/VendorList/DholRegister" element={<DholRegister />} />
        <Route path="/VendorList/DJRegister" element={<DJRegister />} />
        <Route path="/VendorList/BandRegister" element={<BandRegister />} />
        <Route path="/ServiceDetails" element={<ServiceDetails />} />
        <Route path="/VendorList" element={<VendorList />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/EditServices" element={<EditServices />} />
        <Route path="/payment" element={<PaymentComponent />} />
      </Routes>
    </>
  );
}

export default AppRouter;
