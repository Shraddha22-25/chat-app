import React, { useState } from "react";
import "./Chat.css";
import LeftSidebar from "../../component/LeftSidebar/LeftSidebar";
import ChatBox from "../../component/ChatBox/ChatBox";
import RightSidebar from "../../component/RightSidebar/RightSidebar";

const Chat = () => {

    const [selectedUser, setSelectedUser] = useState(null);
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    return (
       <div className="Chat">
        <div className="chat-container">
           <LeftSidebar setSelectedUser={setSelectedUser}/>
           <ChatBox selectedUser={selectedUser}/>
           <RightSidebar selectedUser={loggedInUser}/>
         </div>
       </div>
    );
};

export default Chat;