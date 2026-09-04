import { useState } from 'react'
import '../styles/Navbar.css'
import { NavLink } from 'react-router'
import {Menu, X, HomeIcon, FileText, Bookmark, Lock, Award, BarChart3, LogIn, ChevronDown, User, LogOut} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

 const Navbar = () => {
  const [isMenuOpen, SetIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, SetIsProfileMenuOpen] = useState(false);
  const toggleMenu = () => {
    SetIsMenuOpen((prev) => !prev);
  };

  const { user, isAuthenticated, signout } = useAuth();
  
  const isSignedIn = (user);

  const handleSignOut = () => {
      signout();
      SetIsProfileMenuOpen(false);
  }

  return (
    <div className='navbar-container'>

      <button className="mobile-menu-button" onClick={ toggleMenu }>
        <Menu size={22} />
      </button>

        <div className={`mobile-menu ${isMenuOpen ? "mobile-menu-open" : ""}`}>
            <div className="mobile-menu-logo-div">
            <div className="mobile-logo-container">
                <NavLink id='logo' to={"/"}>
                    অধ্যায়.
                </NavLink>
            </div>

            <button className="mobile-menu-x-button" onClick={ toggleMenu }>
                <X size={22} />
            </button>
            </div>

            <div className='mobile-links-container'>
            <NavLink to={"/"} className={({isActive}) => isActive ? "mobile-active-links":"mobile-non-active-links"}>
                <HomeIcon size={16}/>
                হোম
            </NavLink>

            <NavLink to={"/questionsolving"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <FileText size={16}/>
                প্রশ্নব্যাংক
            </NavLink>

            <NavLink to={"/savedquestions"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <Bookmark size={16}/>
                সংরক্ষিত প্রশ্ন
            </NavLink>

            <NavLink to={"/unrankedexam"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <Award size={16}/>
                মডেল টেস্ট
            </NavLink>

            <NavLink to={"/rankedexam"} className={({isActive}) => isActive? "mobile-active-links":"mobile-non-active-links"}>
                <BarChart3 size={16}/>
                প্রতিযোগীতামূলক পরীক্ষা
            </NavLink>
            </div>

            <div className="mobile-menu-footer-div">
            <div className="mobile-menu-footer-logo">
                <div id='small-logo'>
                    অধ্যায়.
                </div>
            </div>

            <div className='mobile-menu-footer-text'>Built for students, by students</div>
            </div>

        </div>


      <div className="app-logo-container">
        <NavLink id='logo' to={"/"}>
            অধ্যায়.
        </NavLink>
      </div>


      <div className="page-links">
        <NavLink to={"/"} className={({isActive}) => isActive ? "active-links":"non-active-links"}>
            <HomeIcon size={16}/>
            হোম
        </NavLink>

        <NavLink to={"/questionsolving"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <FileText size={16}/>
            প্রশ্নব্যাংক
        </NavLink>

        <NavLink to={"/savedquestions"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <Bookmark size={16}/>
            সংরক্ষিত প্রশ্ন
        </NavLink>

        <NavLink to={"/unrankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <Award size={16}/>
            মডেল টেস্ট
        </NavLink>

        <NavLink to={"/rankedexam"} className={({isActive}) => isActive? "active-links":"non-active-links"}>
            <BarChart3 size={16}/>
            প্রতিযোগীতামূলক পরীক্ষা
        </NavLink>
      </div>

      <div className="sign-in-container">
          <div className={`profile-menu-wrapper ${isAuthenticated ? "":"hidden-profile"}`}>
            <button
              className="profile-trigger"
              onClick={() => SetIsProfileMenuOpen(prev => !prev)}
            >
              <span className="profile-avatar">{ (isAuthenticated) ? Array.from(user.displayName)[0] : null }</span>
              <span className="active-profile">
                { (isAuthenticated) ? user.displayName : "null" }
                {/* <span className="role">{ (user && user.user.role) ? user.user.role : "Student" }</span> */}
                <span className="role">Student</span>
              </span>
              <ChevronDown className="profile-chevron" size={14}/>
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
              <LogIn size={16}/>
              সাইন ইন
          </NavLink>
      </div>

    </div>
  )
}

export default Navbar;