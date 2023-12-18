import React from "react";
import Hero from "./Page/Hero";
import Snippets from "./Page/Snippets";
import Access from "./Page/Access";
import Supercharge from "./Page/Supercharge";
import Agents from "./Page/Agents";
import Action from "./Page/Action";
import Footer from "./Page/Footer";
import Predict from "./Page/Predict";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/predict">Predict Now</Link>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/predict" element={<Predict />} />
          </Routes>
          <Snippets />
          <Access />
          <Supercharge />
          <Agents />
          <Action />
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </>
    </Router>
  );
}

export default App;
