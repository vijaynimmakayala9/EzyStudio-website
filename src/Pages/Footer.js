import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { InView } from 'react-intersection-observer';
import 'animate.css';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-16">
      <div className="container mx-auto px-6">

        {/* Intro Description */}
        <InView triggerOnce={true} threshold={0.5}>
          {({ inView, ref }) => (
            <div ref={ref} className={`mb-10 ${inView ? 'animate__animated animate__fadeIn' : ''}`}>
              <p className="text-lg sm:text-xl md:text-2xl text-center">
                At **CredentHEALTH**, we offer expert healthcare solutions, trusted by professionals and patients alike. Our mission is to provide affordable and accessible medical services to everyone. Join us in your healthcare journey.
              </p>
            </div>
          )}
        </InView>

        {/* Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10 text-center sm:text-left">

          {/* About Us */}
          <InView triggerOnce={true} threshold={0.5}>
            {({ inView, ref }) => (
              <div ref={ref} className={`space-y-2 ${inView ? 'animate__animated animate__fadeIn' : ''}`}>
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">About Us</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="/" className="hover:text-blue-400">Home</a></li>
                  <li><a href="/our-story" className="hover:text-blue-400">Our Story</a></li>
                  <li><a href="/services" className="hover:text-blue-400">Our Services</a></li>
                  <li><a href="/contact-us" className="hover:text-blue-400">Contact Us</a></li>
                </ul>
              </div>
            )}
          </InView>

          {/* Healthcare Services */}
          <InView triggerOnce={true} threshold={0.5}>
            {({ inView, ref }) => (
              <div ref={ref} className={`space-y-2 ${inView ? 'animate__animated animate__fadeIn' : ''}`}>
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Healthcare Services</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="/doctor-consultation" className="hover:text-blue-400">Doctor Consultation</a></li>
                  <li><a href="/lab-tests" className="hover:text-blue-400">Lab Tests</a></li>
                  <li><a href="/health-packages" className="hover:text-blue-400">Health Packages</a></li>
                  <li><a href="/book-appointment" className="hover:text-blue-400">Book Appointment</a></li>
                </ul>
              </div>
            )}
          </InView>

          {/* Customer Support */}
          <InView triggerOnce={true} threshold={0.5}>
            {({ inView, ref }) => (
              <div ref={ref} className={`space-y-2 ${inView ? 'animate__animated animate__fadeIn' : ''}`}>
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Support</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="/help-center" className="hover:text-blue-400">Help Center</a></li>
                  <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
                  <li><a href="/appointment-guide" className="hover:text-blue-400">Booking Guide</a></li>
                </ul>
              </div>
            )}
          </InView>

          {/* Legal & Policies */}
          <InView triggerOnce={true} threshold={0.5}>
            {({ inView, ref }) => (
              <div ref={ref} className={`space-y-2 ${inView ? 'animate__animated animate__fadeIn' : ''}`}>
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Legal & Policies</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="/privacy-policy" className="hover:text-blue-400">Privacy Policy</a></li>
                  <li><a href="/terms-and-conditions" className="hover:text-blue-400">Terms & Conditions</a></li>
                  <li><a href="/refund-policy" className="hover:text-blue-400">Refund Policy</a></li>
                  <li><a href="/cancellation-policy" className="hover:text-blue-400">Cancellation Policy</a></li>
                </ul>
              </div>
            )}
          </InView>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-center sm:text-left mb-4 sm:mb-0">
            © 2025 <a href="https://credenthealth.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold uppercase">CredentHEALTH</a>. All Rights Reserved.
          </p>

          <div className="flex space-x-4 justify-center sm:justify-start">
            <FaFacebook size={20} className="text-white hover:text-blue-500" />
            <FaTwitter size={20} className="text-white hover:text-blue-400" />
            <FaInstagram size={20} className="text-white hover:text-pink-500" />
            <FaLinkedin size={20} className="text-white hover:text-blue-300" />
            <FaWhatsapp size={20} className="text-white hover:text-green-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
