// app/login/layout.js
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
export default function HomeLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
