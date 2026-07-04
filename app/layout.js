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
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
