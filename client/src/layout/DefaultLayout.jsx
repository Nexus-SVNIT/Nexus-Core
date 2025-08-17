import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../components";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import CustomSideBar from "../components/SideNavigationBar/SideBar";

const DefaultLayout = () => {
  return (
    <div className="">
      <div className="hidden md:block">
        <CustomSideBar />
      </div>
      <div className=" h-full w-[100vw] scroll-smooth bg-[#000000] text-white backdrop-blur-sm md:w-full">
        <header className="sticky left-0 top-0 z-50 bg-[#000000] bg-opacity-75 backdrop-blur-sm backdrop-filter md:mx-20">
          <Navbar />
        </header>
        <main className="relative isolate z-10 mx-auto mb-10 w-[100vw] md:w-full">
          <ScrollToTop />
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default DefaultLayout;
