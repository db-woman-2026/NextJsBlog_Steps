import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const metadata = {
  title: "Next.js Blog",
  description: "A beginner-friendly blog built with Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
