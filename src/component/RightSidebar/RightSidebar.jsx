import React, { useEffect, useState } from "react";
import "./RightSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({ loggedInUser: propUser }) => { 
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser || null);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.log("Error parsing user data:", err);
        }
      }
    }
  }, [propUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    navigate("/"); 
  };

  return (
    <div className="rs">
      <div className="rs-profile">
        <img 
          src={
            user?.image 
              ? `https://chat-app-2qez.onrender.com/uploads/${user.image}`
              : assets.profile_img 
          } 
          alt=""
        />
        <h3> 
          {user?.name || user?.username || "My Profile"} 
          <img 
            src={assets.green_dot}  
            className="dot" 
            alt="" 
            style={{ width: "10px", height: "10px", marginLeft: "6px" }} 
          />
        </h3>
        <p>{user?.bio || user?.email || "No Bio Available"}</p>
      </div>

      <hr />

      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default RightSidebar;