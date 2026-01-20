import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-none">
                  Smart Service
                </span>
                <span className="text-[10px] text-white/70 leading-none">
                  Platform
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 max-w-xs">
              Connecting households, universities, and companies with skilled workers across Sri Lanka.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-sm text-white/70 hover:text-white transition-colors">Find Services</Link></li>
              <li><Link to="/register" className="text-sm text-white/70 hover:text-white transition-colors">Become a Worker</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="text-sm text-white/70 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Plumbing</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Electrical Work</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">House Cleaning</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Carpentry</a></li>
              <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Event Staff</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Faculty of IT, University of Moratuwa, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@smartservice.lk</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © 2026 Smart Service Platform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
