import React from "react";
import "./RightSidebar.css"
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({ loggedInUser }) => { 
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    navigate("/login");
  };
    return (
    <div className="rs">
      <div className="rs-profile">
        <img src={ loggedInUser?.image 
        ? `https://chat-app-2qez.onrender.com/uploads/${loggedInUser.image}`
      : assets.profile_img 
      } 
      alt=""/>
        <h3> {loggedInUser?.name || loggedInUser?.username || "My Profile"} 
          <img src={assets.green_dot}  className="dot" alt="" /></h3>
        <p>{loggedInUser?.bio || loggedInUser?.email || "No Bio Available"}</p>
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
  )
}

export default RightSidebar