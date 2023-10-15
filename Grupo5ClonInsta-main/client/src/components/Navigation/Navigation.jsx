import { useState } from "react";
import homeIcon from "../../assets/home-icon.png";
import searchIcon from "../../assets/search-icon.png";
import searchIcon_2 from "../../assets/search-icon-2.png";
import addIcon from "../../assets/add-icon.png";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar-1.png";

import Upload from "../Upload/Upload";

import "./Navigation.css";
import { NavLink } from "react-router-dom";
import { useUpload } from "../../context/UploadContext";

const Navigation = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const { isUpload, setIsUpload } = useUpload();

  const isLoggedIn = true;

  return (
    <>
      <nav className="navigation_container">
        <ul className="navigation_left">
          <li>
            <a href="#">
              <img src={homeIcon} alt="" />
            </a>
          </li>
          <li onClick={() => setShowSearchBar(!showSearchBar)}>
            <img src={searchIcon} alt="" />
          </li>
          <li onClick={() => setIsUpload(!isUpload)}>
            <img src={addIcon} alt="" />
          </li>
        </ul>

        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        {!isLoggedIn ? (
          <div className="auth_btns">
            <NavLink to="/register">
              <button>Regístrate</button>
            </NavLink>
            <NavLink to="/login">
              <button>log in</button>
            </NavLink>
          </div>
        ) : (
          <NavLink to="/profile">
            <div className="avatar_container">
              <div className="avatar">
                <img src={avatar} alt="Avatar" />
              </div>
              <p>@gatitolindo</p>
            </div>
          </NavLink>
        )}
      </nav>

      {showSearchBar && (
        <div className="search_container">
          <div>
            <img src={searchIcon_2} alt="" />
          </div>

          <input type="text" />
        </div>
      )}
    </>
  );
};

export default Navigation;
