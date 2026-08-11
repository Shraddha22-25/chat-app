
import React, { useState, useEffect } from "react";
import "./Chat.css";
import LeftSidebar from "../../component/LeftSidebar/LeftSidebar";
import ChatBox from "../../component/ChatBox/ChatBox";
import RightSidebar from "../../component/RightSidebar/RightSidebar";

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Safe JSON Parse from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setLoggedInUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
            }
        }
    }, []);

    return (
        <div className="Chat">
            <div className="chat-container">
                <LeftSidebar 
                    selectedUser={selectedUser} 
                    setSelectedUser={setSelectedUser} 
                />
                
                <ChatBox 
                    selectedUser={selectedUser} 
                    loggedInUser={loggedInUser} 
                />
                
                <RightSidebar 
                    loggedInUser={loggedInUser} 
                />
            </div>
        </div>
    );
};

export default Chat;