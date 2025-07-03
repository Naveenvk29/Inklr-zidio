import React from "react";
import Hero from "./Hero";
import Footer from "./Footer";
import LatestBlog from "./LatestBlog";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <LatestBlog />
      <Footer />
    </div>
  );
};

export default Home;
