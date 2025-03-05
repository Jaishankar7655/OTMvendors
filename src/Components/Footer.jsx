import React from "react";

const Footer = () => {
  return (
    <footer className="bg-red-500 text-white py-4 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm mb-2 md:mb-0">
          © {new Date().getFullYear()} One Touch Moment
          <span className="hidden md:inline ml-2">All rights reserved</span>
        </div>
        <p>
          Created and developed by{" "}
          <a
            href="https://cynctech.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Cynctech IT Solution
          </a>
        </p>
        <div className="flex space-x-4">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
