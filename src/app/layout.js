import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Chatbot from "@/component/Chatbot";
import "leaflet/dist/leaflet.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/component/navbar/Navbar";
import { AppProvider } from "@/context/context";
import AuthProvider from "@/component/AuthProvider/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  // variable: "--font-space_grotesk",
});

export const metadata = {
  title: "Newgaurd Security and Consultancy Services | Western Corridor",
  description:
    "Western Corridor Pipeline Security and Surveillance Dashboard and Incident Management System",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${space_grotesk.className} `}>
        <AppProvider>
          <AuthProvider>
            <div>
              <Navbar />
              {children}
              <ToastContainer autoClose={5000} />
              {/* <Chatbot /> */}
            </div>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
