"use client";
import { config } from "dotenv";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";

import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import AuthContext from "./context/auth";

config();
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const RootLayout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    restoreUser();
  }, []);

  const restoreUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    user ? setUser(user) : setUser(null);

    //onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //    const userData = await getDoc(doc(db, "users", user.uid));
    //   if (userData.exists()) setUser({ id: user.uid, ...userData });
    //   } else console.error("No user found");
    //  });
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <title>Department of Computer Science</title>
      </head>
      <body className={`${poppins.className} bg-light`}>
        <AuthContext.Provider value={{ user, setUser }}>
          <Header />
          {children}
          <Footer />
        </AuthContext.Provider>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
          integrity="sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNTlrdUmTzrDgektczlKNRRhy5X5AAOnx5S09ydFYWWNSfcEqDTTHgtNA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          async
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"
          integrity="sha512-UnrKxsCMN9hFk7M56t4I4ckB4N/2HHi0w/7+B/1JsXIX3DmyBcsGpT3/BsuZMZf+6mAr0vP81syWtfynHJ69JA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          async
        ></script>
      </body>
    </html>
  );
};

export default RootLayout;
