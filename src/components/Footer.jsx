// src/components/Footer.jsx
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaWhatsapp, FaRegEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const SocialIcon = ({ icon, href }) => (
  <a href={href} className="w-10 h-10 bg-mint-green rounded-full flex items-center justify-center text-dark-brown hover:bg-dark-brown hover:text-white transition-all">
    {icon}
  </a>
);

const Footer = () => {
  return (
    <footer className="pt-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Social Media */}
        <div className="text-center mb-16">
          <h3 className="text-xl font-semibold mb-6">Social Media</h3>
          <div className="flex justify-center gap-4">
            <SocialIcon icon={<FaFacebookF />} href="#" />
            <SocialIcon icon={<FaTwitter />} href="#" />
            <SocialIcon icon={<FaInstagram />} href="#" />
            <SocialIcon icon={<FaYoutube />} href="#" />
            <SocialIcon icon={<FaLinkedinIn />} href="#" />
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left mb-16">
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2"><FaWhatsapp /><span>(671) 555-0110</span></li>
              <li className="flex items-center justify-center md:justify-start gap-2"><FaRegEnvelope /><span>Jendoale@mail.com</span></li>
              <li className="flex items-center justify-center md:justify-start gap-2"><FaMapMarkerAlt /><span>6391 Elgin St. Celina, Delaware 10299</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Information</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Career</a></li>
              <li><a href="#" className="hover:underline">Gallery</a></li>
              <li><a href="#" className="hover:underline">News and Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Policies</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* We Accept */}
        <div className="text-center mb-10">
          <h4 className="font-bold text-lg mb-4">We Accept</h4>
          {/* Replace this with the actual image of payment methods */}
          <img src="https://i.ibb.co/xL3b1k1/payment-methods.png" alt="Payment methods" className="mx-auto" />
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-dark-khaki text-center py-4">
        <p className="text-sm text-white/80">2025 Financial literacy for kids</p>
      </div>
    </footer>
  );
};

export default Footer;