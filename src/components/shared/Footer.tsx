import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="flex flex-col items-start text-left">
              <div className="w-[240px] h-[72px] flex items-start justify-start overflow-hidden">
                <Image
                  src="/new.png"
                  alt="Techna Logo"
                  width={240}
                  height={240}
                  className="object-contain object-left -mt-[82px] -ml-[45px]"
                />
              </div>

              <p
                className="text-[14px] leading-[23px] mt-0 mb-3 text-left"
                style={{ color: "#34BFF3" }}
              >
                Smart Thinking Leads To Innovate.
                <br />
                Build Your Dreams with Technology
              </p>

              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/1BmffY511q/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#1877F2] hover:opacity-90 flex items-center justify-center transition"
                >
                  <FaFacebookF className="text-white text-lg" />
                </a>

                <a
                  href="https://www.youtube.com/@techna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#FF0000] hover:opacity-90 flex items-center justify-center transition"
                >
                  <FaYoutube className="text-white text-lg" />
                </a>

                <a
                  href="https://www.linkedin.com/company/techna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#0A66C2] hover:opacity-90 flex items-center justify-center transition"
                >
                  <FaLinkedinIn className="text-white text-lg" />
                </a>

                <a
                  href="https://www.instagram.com/techna_technical_institute?igsh=N2lmaTVqMG12eXVu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 flex items-center justify-center transition"
                >
                  <FaInstagram className="text-white text-lg" />
                </a>
                <a
                  href="https://www.tiktok.com/@technatechnicalinstitute?_r=1&_t=ZS-992FYtbizKu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-black hover:opacity-90 flex items-center justify-center transition"
                >
                  <FaTiktok className="text-white text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="font-bold mb-5 text-[18px] uppercase"
                style={{ color: "#0183CB" }}
              >
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Home", path: "/" },
                  { label: "Subjects", path: "/modules" },
                  { label: "Contact Us", path: "/contact" },
                  { label: "Login", path: "/login" },
                  { label: "Register", path: "/register" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-[14px]"
                      style={{ color: "#34BFF3" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subjects */}
            <div>
              <h4
                className="font-bold mb-5 text-[18px] uppercase"
                style={{ color: "#0183CB" }}
              >
                Subjects Offered
              </h4>
              <ul className="space-y-4">
                {[
                  "Engineering Technology",
                  "Bio Systems Technology",
                  "Science For Technology",
                  "ICT",
                  "Agricultural Science",
                  "Mathematics",
                  "Geography",
                ].map((subject) => (
                  <li key={subject}>
                    <Link
                      href="https://www.techna.lk/modules"
                      className="text-[14px]"
                      style={{ color: "#34BFF3" }}
                    >
                      {subject}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="font-bold mb-5 text-[18px] uppercase"
                style={{ color: "#0183CB" }}
              >
                Contact Us
              </h4>
              <ul className="space-y-5">
                <li
                  className="flex items-start gap-3 text-[14px]"
                  style={{ color: "#34BFF3" }}
                >
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span>Veerasingam Hall, 3rd Floor, Jaffna</span>
                </li>

                <li
                  className="flex items-center gap-3 text-[14px]"
                  style={{ color: "#34BFF3" }}
                >
                  <Phone className="w-5 h-5 shrink-0" />
                  <a href="tel:0771703549">0771703549</a>
                </li>

                <li
                  className="flex items-start gap-3 text-[14px]"
                  style={{ color: "#34BFF3" }}
                >
                  <Mail className="w-5 h-5 shrink-0" />
                  <a
                    href="mailto:technatechnicalinstitute@gmail.com"
                    className="break-all"
                  >
                    technatechnicalinstitute@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-4" style={{ background: "#0183CB" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 text-center">
            <p className="text-xs text-white md:text-left">
              © {new Date().getFullYear()} Techna Technical Institute. All
              Rights Reserved.
            </p>

            <a
              href="https://www.theneonlabz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white no-underline hover:no-underline hover:text-gray-200 md:justify-self-center"
            >
              Developed by NeonLabz (Pvt) Ltd.
            </a>

            <Link
              href="/terms-and-conditions"
              className="text-xs text-white underline underline-offset-2 hover:text-gray-200 md:justify-self-end"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
