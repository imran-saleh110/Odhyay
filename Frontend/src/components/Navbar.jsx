import { useState } from 'react'
import '../styles/Navbar.css'
import { NavLink } from 'react-router'
import {Menu, X, FileText, Bookmark, Award, BarChart3, LogIn, User, LogOut} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: "/questionsolving", label: "প্রশ্নব্যাংক", icon: FileText },
  { to: "/savedquestions", label: "সংরক্ষিত প্রশ্ন", icon: Bookmark },
  { to: "/modeltest", label: "মডেল টেস্ট", icon: Award },
  { to: "/rankedtest", label: "প্রতিযোগীতামূলক পরীক্ষা", icon: BarChart3 },
]

  const Navbar = () => {
  const [isMenuOpen, SetIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, SetIsProfileMenuOpen] = useState(false);
  const toggleMenu = () => {
    SetIsMenuOpen((prev) => !prev);
  };

  const { user, isAuthenticated, signout } = useAuth();

  const handleSignOut = () => {
      signout();
      SetIsProfileMenuOpen(false);
  }

  return (
    <div className='navbar-container'>

      <nav className="navbar-panel">

        <div className="navbar-brand">
          <button className="navbar-icon-button navbar-menu-button" onClick={ toggleMenu } aria-label="মেনু">
            <Menu size={20} />
          </button>

          <NavLink to="/" className="navbar-logo" aria-label="অধ্যায়">
            অধ্যায়
          </NavLink>
        </div>

        <div className="navbar-links">
          { NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-account">
          <div className={`profile-menu-wrapper ${isAuthenticated ? "":"hidden-profile"}`}>
            <button
              className="profile-trigger"
              aria-label="প্রোফাইল মেনু"
              aria-expanded={isProfileMenuOpen}
              onClick={() => SetIsProfileMenuOpen(prev => !prev)}
            >
              { (isAuthenticated) && (
                <span className="profile-meta">
                  <span className="profile-name">{user.displayName}</span>
                  <span className="profile-role">{user.role}</span>
                </span>
              )}
              <span className="profile-avatar">{ (isAuthenticated) ? Array.from(user.displayName)[0] : null }</span>
            </button>

            { isProfileMenuOpen && isAuthenticated && (
              <div className="profile-dropdown-menu">

                <NavLink
                  to={"/profile"}
                  onClick={() => SetIsProfileMenuOpen(false)}
                  className="profile-dropdown-item"
                >
                  <User className="profile-dropdown-icon profile-dropdown-icon-user" size={16}/>
                  প্রোফাইল
                </NavLink>

                <div className="profile-dropdown-divider" />

                <button
                  className="profile-dropdown-item profile-dropdown-logout"
                  onClick={handleSignOut}
                >
                  <LogOut className="profile-dropdown-icon" size={16}/>
                  সাইন আউট
                </button>
              </div>
            )}
          </div>

          <NavLink to="/signin" className={isAuthenticated ? "hidden-sign-in-link":"sign-in-link"}>
              <LogIn size={15}/>
              সাইন ইন
          </NavLink>
        </div>

      </nav>

        <div className={`mobile-menu ${isMenuOpen ? "mobile-menu-open" : ""}`}>
            <div className="mobile-menu-logo-div">
            <div className="mobile-logo-container">
                <NavLink id='logo' to={"/"} onClick={toggleMenu}>
                    অধ্যায়.
                </NavLink>
            </div>

            <button className="mobile-menu-x-button" onClick={ toggleMenu } aria-label="মেনু বন্ধ করুন">
                <X size={22} />
            </button>
            </div>

            <div className='mobile-links-container'>
            { NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={toggleMenu}
                className={({isActive}) => isActive ? "mobile-active-links":"mobile-non-active-links"}
              >
                <Icon size={16}/>
                {label}
              </NavLink>
            ))}
            </div>

            <div className="mobile-menu-footer-div">
            <div id='small-logo'>
                অধ্যায়.
            </div>

            <div className='mobile-menu-footer-text'>শিক্ষার্থীদের জন্য, শিক্ষার্থীদের হাতেই তৈরি</div>
            </div>

        </div>

    </div>
  )
}

export default Navbar;
