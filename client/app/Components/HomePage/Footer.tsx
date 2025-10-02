"use client";
import React from "react";
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Shield,
  Award,
  Users,
  CreditCard,
  Download,
  ArrowUp,
} from "lucide-react";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white">EasyDrive</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Premium car rental service offering the finest selection of
              vehicles for your travel needs. Experience comfort, reliability,
              and exceptional service.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <Award className="h-6 w-6 text-white mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">4.9★</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <Users className="h-6 w-6 text-white mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">10K+</div>
                <div className="text-xs text-gray-400">Customers</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-sky-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/cars" className="hover:text-white  transition-colors">
                  Browse Cars
                </a>
              </li>
              <li>
                <a
                  href="/locations"
                  className="hover:text-white  transition-colors"
                >
                  Locations
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="hover:text-white  transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-white  transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white  transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white  transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white  transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-white  transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/economy-cars"
                  className="hover:text-white  transition-colors"
                >
                  Economy Cars
                </a>
              </li>
              <li>
                <a
                  href="/luxury-cars"
                  className="hover:text-white  transition-colors"
                >
                  Luxury Cars
                </a>
              </li>
              <li>
                <a
                  href="/suv-rental"
                  className="hover:text-white  transition-colors"
                >
                  SUV Rental
                </a>
              </li>
              <li>
                <a
                  href="/long-term"
                  className="hover:text-white  transition-colors"
                >
                  Long-term Rental
                </a>
              </li>
              <li>
                <a
                  href="/corporate"
                  className="hover:text-white  transition-colors"
                >
                  Corporate Plans
                </a>
              </li>
              <li>
                <a
                  href="/airport-pickup"
                  className="hover:text-white  transition-colors"
                >
                  Airport Pickup
                </a>
              </li>
              <li>
                <a
                  href="/chauffeur"
                  className="hover:text-white  transition-colors"
                >
                  Chauffeur Service
                </a>
              </li>
              <li>
                <a
                  href="/insurance"
                  className="hover:text-white  transition-colors"
                >
                  Insurance Options
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Main Office</p>
                  <p className="text-gray-400 text-sm">
                    123 Business District
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">24/7 Support</p>
                  <p className="text-gray-400 text-sm">
                    <a
                      href="tel:+15551234567"
                      className="hover:text-white  transition-colors"
                    >
                      +1 (555) 123-4567
                    </a>
                  </p>
                  <p className="text-gray-400 text-sm">
                    <a
                      href="tel:+15559876543"
                      className="hover:text-white  transition-colors"
                    >
                      +1 (555) 987-6543
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Email Us</p>
                  <p className="text-gray-400 text-sm">
                    <a
                      href="mailto:info@rentacar.com"
                      className="hover:text-white  transition-colors"
                    >
                      info@rentacar.com
                    </a>
                  </p>
                  <p className="text-gray-400 text-sm">
                    <a
                      href="mailto:support@rentacar.com"
                      className="hover:text-white transition-colors"
                    >
                      support@rentacar.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>© 2024 RentACar. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
              <button
                onClick={scrollToTop}
                className="flex items-center text-gray-400 hover:text-blue-400 transition-colors"
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
