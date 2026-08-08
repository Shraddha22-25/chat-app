import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("https://chat-app-2qez.onrender.com");

const ChatBox = ({ selectedUser }) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [image, setImage] = useState(null);
    const messagesEndRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const fetchMessages = async () => {
      if (!selectedUser) return;
        try {
            const res = await axios.get(
                `https://chat-app-2qez.onrender.com/api/chat/messages/${loggedInUser.id}/${selectedUser?.id}`
            );

            if (res.data.success) {
                setMessages(res.data.messages);
            }

        } catch (error) {
            console.log(error);
        }
    };

const sendMessage = async () => {
    console.log("Image State:", image);

    if (!selectedUser) {
        alert("Please select a user first");
        return;
    }

    if (message.trim() === "" && !image) return;

    try {

        const formData = new FormData();

        formData.append("sender_id", loggedInUser.id);
        formData.append("receiver_id", selectedUser.id);
        formData.append("message", message.trim());

        if (image) {
            formData.append("image", image);
        }
        for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
}
        console.log("Image in FormData:", formData.get("image"));

        const res = await axios.post(
            "https://chat-app-2qez.onrender.com/api/chat/send",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        if (res.data.success) {

            socket.emit("send_message", {
                sender_id: loggedInUser.id,
                receiver_id: selectedUser.id,
                message: message.trim(),
    image: image ? image.name : null
});

            setMessage("");
            setImage(null);

            fetchMessages();
        }

    } catch (error) {
        console.log(error);
    }

};
const deleteMessage = async (id) => {

    const confirmDelete = window.confirm("Delete this message?");

    if (!confirmDelete) return;

    try {

        const res = await axios.delete(
            `https://chat-app-2qez.onrender.com/api/chat/delete/${id}`
        );

        if (res.data.success) {
            fetchMessages();
        }

    } catch (error) {
        console.log(error);
    }

};
const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
};
useEffect(() => {

    if (!selectedUser) return;
    fetchMessages();
    axios.put("https://chat-app-2qez.onrender.com/api/chat/seen", {
        sender_id: selectedUser.id,
        receiver_id: loggedInUser.id
    });

    socket.on("receive_message", () => {
        fetchMessages();
    });

    return () => {
        socket.off("receive_message");
    };

}, [selectedUser]);
 
    useEffect(() => {

    if (loggedInUser?.id) {
        socket.emit("user_online", loggedInUser.id);
    }

}, []);
    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
    });
}, [messages]);

    return (
        <div className="chat-box">

            <div className="chat-user">
                <img src={assets.profile_img} alt="" />
                <p>{selectedUser ? selectedUser.name : "Select a user"}
                    <img className="dot" src={assets.green_dot} alt="" />
                </p>

                <img
                    src={assets.help_icon}
                    className="help"
                    alt=""
                />
            </div>

            <div className="chat-msg">

                {  messages.map((msg) => (

               <div key={msg.id} 
                    className={ msg.sender_id === loggedInUser.id
                    ? "s-msg"
                    : "r-msg" }>
            <div className="msg-content">            
                {msg.image && (
            <img 
               src={`https://chat-app-2qez.onrender.com/uploads/${msg.image}`} className="msg-img" alt=""
    />
                )} {msg.message && (
    <p className="msg">{msg.message}</p>
)}
          {msg.sender_id === loggedInUser.id && (
    <div
    style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "8px",
        marginTop: "4px"
    }}
>
    <span
        style={{
            fontSize: "10px",
            color: msg.is_seen ? "#3c4c52" : "#888"
        }}
    >
        {msg.is_seen ? "✓✓" : "✓"}
    </span>

    <span
        onClick={() => deleteMessage(msg.id)}
        style={{
            cursor: "pointer",
            color: "red",
            fontSize: "14px"
        }}
        title="Delete Message"
    >
        🗑️
    </span>
</div>
)}
</div>
                <div className="user-info">
                <img src={assets.profile_img} alt="" />
                <p>{new Date(msg.created_at).toLocaleTimeString()}</p>
               </div>
            </div>

                    )) }
                
                <div ref={messagesEndRef}></div>

            </div>

            <div className="chat-input">
                <input type="text" placeholder="Send a message"
                 value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                sendMessage();
    }
}}
/>
 <input type="file" id="image" hidden accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <span
    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    style={{
        cursor: "pointer",
        fontSize: "24px"
    }}
>

</span>
     <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" />
                </label>

                <img src={assets.send_button} alt="send"
                    onClick={sendMessage}
                    style={{ cursor: "pointer" }}
                />
                {showEmojiPicker && (
    <div
        style={{
            position: "absolute",
            bottom: "60px",
            left: "10px",
            zIndex: 1000
        }}
    >
        <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
)}
                <span
                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 style={{
                 cursor: "pointer",
                 fontSize: "24px"
    }}
>
    😊
</span>

            </div>

        </div>
    );
};

export default ChatBox;