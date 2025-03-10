import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const countdownIntervalRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Load Razorpay script and trigger payment automatically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      // Automatically trigger payment when script loads
      handlePayment();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      document.body.removeChild(script);
    };
  }, []);

  // Get query parameters using useLocation
  const getQueryParam = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(true);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev - 1;
        
        if (progressBarRef.current) {
          const widthPercent = (newCount / 5) * 100;
          progressBarRef.current.style.width = `${widthPercent}%`;
        }
        
        if (newCount <= 0) {
          clearInterval(countdownIntervalRef.current);
          navigate('/services'); // Navigate using React Router
        }
        
        return newCount;
      });
    }, 1000);
  };

  const handlePayment = () => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const service_id = getQueryParam('service_id');
    const vendor_id = getQueryParam('vendor_id');

    if (!service_id || !vendor_id) {
      console.error("Error: service_id or vendor_id is missing.");
      return;
    }

    fetch(`https://backend.onetouchmoments.com/vendor_controller/Vendor_checkout/index_get?service_id=${service_id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 1) {
          const options = {
            key: data.key_id,
            amount: data.amount,
            currency: "INR",
            name: "Acme Corp",
            description: "Test transaction",
            image: "https://cdn.razorpay.com/logos/GhRQcyean79PqE_medium.png",
            order_id: data.order_id,
            handler: function (response) {
              // Verify that we have all required fields from Razorpay
              if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                console.error("Missing required Razorpay response fields:", response);
                return;
              }

              // Log the complete response for debugging
              console.log("Razorpay Response:", response);

              const paymentData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                service_id: service_id,
                vendor_id: vendor_id
              };

              // Create FormData and explicitly set each field
              const formData = new FormData();
              formData.append('razorpay_payment_id', response.razorpay_payment_id);
              formData.append('razorpay_order_id', response.razorpay_order_id);
              formData.append('razorpay_signature', response.razorpay_signature);
              formData.append('service_id', service_id);
              formData.append('vendor_id', vendor_id);

              // Log FormData entries for verification
              for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
              }

              fetch('https://backend.onetouchmoments.com/vendor_controller/Vendor_payment/index_post', {
                method: 'POST',
                body: formData
              })
              .then(response => response.json())
              .then(result => {
                console.log("Payment verification result:", result);
                if (result.status === 1) {
                  handlePaymentSuccess();
                } else {
                  console.error("Payment verification failed:", result);
                  alert("Payment verification failed. Please contact support.");
                }
              })
              .catch(error => {
                console.error("Payment verification error:", error);
                alert("Error verifying payment. Please contact support.");
              });
            },
            prefill: {
              name: userData.vendor_name || "",
              email: userData.vendor_email || "",
              contact: userData.vendor_phone || ""
            },
            theme: {
              color: "#3399cc"
            },
            // Add modal closing handling
            modal: {
              ondismiss: function() {
                console.log("Checkout form closed");
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          alert("Order creation failed!");
        }
      })
      .catch(error => console.error("Error fetching order:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className=" text-2xl font-bold text-gray-800 mb-6 text-center">
          Initializing Payment...
        </h2>
        
        {/* Hidden button with zero opacity */}
        <button 
          id="paybutton"
          onClick={handlePayment}
          className="opacity-0 invisible absolute"
          aria-hidden="true"
        >
          Pay with Razorpay
        </button>

        {/* Loading indicator */}
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-80">
              <p className="text-gray-800 mb-4 text-center">
                Payment successful! Redirecting in <span className="font-bold">{countdown}</span> seconds...
              </p>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div 
                  ref={progressBarRef}
                  className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentComponent;