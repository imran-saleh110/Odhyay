import "../styles/HomePage.css";
import { NavLink } from "react-router";
import FeatureArt from "../components/FeatureArt";
import HomeShowcase from "../components/HomeShowcase";

const FEATURES = [
  { to: "/questionsolving", label: "প্রশ্নব্যাংক", art: "questions" },
  { to: "/modeltest", label: "পরীক্ষা", art: "exam" },
  { to: "/rankedtest", label: "র‍্যাংকিং", art: "ranking" },
  { to: "/questionsolving", label: "অনুশীলন", art: "practice" },
];

const HomePage = () => {
  return (
    <>
      <div className="upper-grid">
        <div className="vertical-divider-left rail-lead"></div>

        <section className="section-band">
          <div className="grid-cell band-main">
            <div className="band-copy">
              <h2 className="band-display">
                প্রশ্ন অনুশীলন করুন, নিজেকে যাচাই করুন
              </h2>
              <p className="band-sub">
                প্রতিদিনের অনুশীলনের জন্য যা যা দরকার — সব এক জায়গায়
              </p>
            </div>

            <div className="fig-row">
              {FEATURES.map(({ to, label, art }) => (
                <NavLink key={label} to={to} className="fig-card">
                  <FeatureArt name={art} className="fig-art" />
                  <span className="fig-label">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </section>

        <div className="vertical-divider-right rail-lead"></div>
      </div>

      <div className="band-divider"></div>

      <div className="upper-grid">
        <div className="vertical-divider-left"></div>

        <section className="section-band">
          <div className="grid-cell band-embed">
            <div className="embed-split">
              <div className="embed-empty" aria-hidden="true" />
              <div className="showcase-wrapper">
                {" "}
                <HomeShowcase />{" "}
              </div>
            </div>
          </div>
        </section>

        <div className="vertical-divider-right"></div>
      </div>

      <div className="band-divider"></div>

      <div className="hero-card">
        <div className="left">
          <div className="hero-description">
            <p id="hero-heading">অধ্যায়ের সকল সেবা পেতে সাইন ইন করুন </p>
          </div>

          <div className="hero-page-links">
            <NavLink to={"/signin"} className="solve-question">
              সাইন ইন করুন
            </NavLink>

            <NavLink to={"/questionsolving"} className="custom-exam">
              প্রশ্ন সমাধান করুন
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
