import "./globals.css";
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header";
import Footer from "./components/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Department of Computer Science & IT - University of Jammu",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
