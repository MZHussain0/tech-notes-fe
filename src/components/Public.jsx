import React from "react";
import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Zak H. Repairs!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful Downtown Hyderabad City, Zak H. Repairs provides
          a trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Zak H. Repairs
          <br />
          555 Marine Drive
          <br />
          Hyderabad City, 12345
          <br />
          <a href="tel:+91555555555">(+91) 55555-5555</a>
        </address>
        <br />
        <p>Owner: Zakir Hussain</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
