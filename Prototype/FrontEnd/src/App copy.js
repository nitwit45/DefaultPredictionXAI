import React from "react";
import Hero from "./Page/Hero";
import Snippets from "./Page/Snippets";
import Access from "./Page/Access";
import Supercharge from "./Page/Supercharge";
import Agents from "./Page/Agents";
import Action from "./Page/Action";
import Footer from "./Page/Footer";
import Predict from "./Page/Predict"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <>
        <main className="main">
          <Hero />
          <Snippets />
          <Access />
          <Supercharge />
          <Agents />
          <Action />
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      <Route path="/predict" exact component={Predict} />
      </>
    </Router>
  );
}

export default App;
