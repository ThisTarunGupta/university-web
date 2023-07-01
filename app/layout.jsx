"use client";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Header from "./components/header";
import Footer from "./components/footer";
import AuthContext from "./context/auth";

//export const metadata = {
//  title: "Department of Computer Science & IT - University of Jammu",
//  description: "",
//};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const RootLayout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    user === null ? setUser(null) : setUser(user);
  }, []);

  return (
    <html lang="en">
      <body className={`${poppins.className} bg-light`}>
        <AuthContext.Provider value={{ user, setUser }}>
          <Header />
          {children}
          <Footer />
        </AuthContext.Provider>
      </body>
    </html>
  );
};

export default RootLayout;
