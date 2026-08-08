import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LeftSidebar.css"
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://chat-app-2qez.onrender.com");

const LeftSidebar = ({ selectedUser, setSelectedUser }) => { 
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const fetchUsers = async () => {

    try {

        const res = await axios.get(
            "https://chat-app-2qez.onrender.com/api/chat/users"
        );

        if (res.data.success) {
            setUsers(res.data.users);
        }

    } catch (error) {
        console.log(error);
    }

};
const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

};

useEffect(() => { fetchUsers(); }, []);
useEffect(() => { socket.on("online_users", (users) => {
                 setOnlineUsers(users);
    });

    return () => {
        socket.off("online_users");
    };

}, []);

    return (
    <div className="ls">
        <div className="ls-top">
            <div className="ls-nav">
                <img src={assets.logo} className="logo" alt="" />
                <div className="menu">
                    <img src={assets.menu_icon} alt="" />
                    <div className="sub-menu">
                        
                        <p onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>Edit Profile
                        </p>
                        <hr />
                         <p onClick={handleLogout} style={{ cursor: "pointer" }}>Logout
                        </p>
                     </div>
                </div>
            </div>
            <div className="ls-search">
                <img src={assets.search_icon} alt="" />
                <input type="text" placeholder="Search here..." value={search}
                       onChange={(e) => setSearch(e.target.value)}/>
            </div>
        </div>

         <div className="ls-list">
        {users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    )
    .map((user) => (
        <div key={user.id}className={`friends ${selectedUser?.id === user.id ? "active" : ""}`}
             onClick={() => setSelectedUser(user)}>
                
            <img src={ user.image ? `https://chat-app-2qez.onrender.com/uploads/${user.image}` : assets.profile_img}alt=""/>
            <div>
            <p>{user.name} {onlineUsers.includes(user.id.toString()) && (
            <img src={assets.green_dot} alt=""
                style={{ width: "10px",
                       marginLeft: "8px"
                }}
            />
        )}
    </p>
    <span>{user.email}</span>
</div>
    </div>
    ))}
</div>  
</div>
    );
};

export default LeftSidebar;