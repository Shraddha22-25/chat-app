import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  // LocalStorage se user fetch karna with fallback
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");

  // Image Preview Handler
  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("User session not found. Please log in again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", user.id);
      formData.append("name", name);
      formData.append("bio", bio);

      if (image) {
        formData.append("image", image);
      }
       console.log("User:", user);
       console.log("FormData ID:", user.id);
       console.log("Name:", name);
       console.log("Bio:", bio);
      // Axios Call with Multipart Headers
      const res = await axios.put(
        "http://localhost:5000/api/chat/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // LocalStorage update (agar backend naya user object bhej raha ho)
      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      alert(res.data.message || "Profile Updated!");
      navigate("/chat");
    } catch (error) {
      console.error("Frontend Error Details:", error);
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              type="file"
              id="avatar"
              hidden
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
            />
            <img src={previewUrl || assets.avatar_icon} alt="Avatar" />
            <span>Upload profile image</span>
          </label>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            rows="4"
            placeholder="Write something about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />

          <button type="submit">Save</button>
        </form>

        <img
          className="profile-pic"
          src={previewUrl || assets.logo_icon}
          alt="Preview"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;       