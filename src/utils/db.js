import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin, FaSquareXTwitter, FaYoutube } from "react-icons/fa6";

export const links = [
  { linkName: "Monthly Incident Dashboard", url: "/incident" },
  { linkName: "2025 YTD Incident Trends", url: "/chart" },
  //   { linkName: "Sign In", url: "/" },
  // {linkName: "Projects", url: "/projects"},
  // {linkName: "Contact", url: "/contact"},
];

export const servicesList = [
  {
    service: "Frontend and Detailed Engineering Design (FEED)",
    summary:
      "Through our FEED services at BlueMach we translate early-stage concepts into precise, constructible designs by integrating multidisciplinary engineering principles, regulatory standards, and client-specific requirements.",
    img: "/bluemach-feed-engineering-drawings.jpg",
  },
  {
    service:
      "Engineerign, design, Construction, Installation and Commisioning (EPCIC)",
    summary:
      "BlueMach delivers fully integrated EPCIC solutions, managing the entire project lifecycle from concept through commissioning with precision and accountability throug a seamless turnkey approach.",
    img: "/bluemach_EPCIC.jpg",
  },
  {
    service: "Consultancy & Project Management",
    summary:
      "BlueMach provides expert consultancy and end-to-end project management services that drive successful outcomes across complex engineering and infrastructure projects with proven technical excellence and industry foresight.",
    img: "/bluemach-consutancy.jpg",
  },
  {
    service: "Offshore Structure Designs",
    summary:
      "We integrate advanced Naval Architecture with precision Mechanical Systems Engineering in the design and engineering of offshore structures that are robust, compliant, and optimized for long-term performance in challenging marine environments.",
    img: "/bluemach-offshore-structures-service.webp",
  },
];

export const socialLinks = [
  {
    name: "LinkedIn",
    link: "https://ng.linkedin.com/company/bluemach-engineering-limited",
    icon: <FaLinkedin />,
  },
  {
    name: "X (Formerly Twitter",
    link: "https://twitter.com/bluemach_eri",
    icon: <FaSquareXTwitter />,
  },
  {
    name: "Youtube",
    link: "https://www.youtube.com/@bluemachengineering1779",
    icon: <FaYoutube />,
  },
  {
    name: "Facebook",
    link: " ",
    icon: <FaFacebookSquare />,
  },
];

export const servicePageList = [
  {
    service: "Frontend and Detailed Engineering Design (FEED)",
    summary:
      "From site layouts and process flow diagrams to detailed 3D modeling and fabrication drawings, BlueMach delivers comprehensive engineering packages that reduce risks, enhance constructability, and streamline project delivery.",
    img: "/bluemach-feed-engineering-drawings.jpg",
    points: [
      "Concept-to-Construction Translation",
      "Multidisciplinary Expertise",
      "Standards & Compliance",
      "Comprehensive Deliverables",
      "Innovation-Driven",
      "Design Optimization",
    ],
  },
  {
    service:
      "Engineerign, design, Construction, Installation and Commisioning (EPCIC)",
    summary:
      "Our multidisciplinary teams collaborate closely with clients to deliver on time, within budget, and beyond expectations—whether onshore or offshore.",
    img: "/bluemach_EPCIC.jpg",
    points: [
      "Turnkey Project Delivery",
      "Integrated Execution",
      "Proven Track Record",
      "Safety & Compliance",
      "Multidisciplinary Teams",
      "Operational Readiness",
    ],
  },
  {
    service: "Consultancy & Project Management",
    summary:
      "At BlueMach, we provide expert consultancy and end-to-end project management services that drive technical excellence and strategic execution from project inception to close-out.",
    img: "/bluemach-consutancy.jpg",
    points: [
      "Technical & Strategic Advisory",
      "Feasibility & Risk Management",
      "End-to-End Oversight",
      "Proven Methodologies",
      "Stakeholder Alignment",
      "Budget & Schedule Control",
    ],
  },
  {
    service: "Offshore Structure Designs",
    summary:
      "We integrate advanced Naval Architecture with precision Mechanical Systems Engineering to design and engineering of offshore structures that are robust, compliant, and optimized for long-term performance in challenging marine environments.",
    img: "/bluemach-offshore-structures-service.webp",
    points: [
      "Integrated Disciplines",
      "Hydrodynamic & Structural Analysis",
      "Mechanical Systems Integration",
      "Versatile Applications",
      "Lifecycle Optimization",
      "Regulatory Assurance",
    ],
  },
];
