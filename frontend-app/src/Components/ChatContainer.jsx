import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import Input from "../Components/Input";
import Logout from "../Components/Logout";
import {
    recieveMessageRoute,
    sendMessageRoute,
} from "../utils/apiRoutes";

const ChatContainer = ({ currentChat, socket }) => {
    const scrollRef = useRef();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const handleSendMsg = async (msg) => {
        const data = JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );

        if (socket.current) {
            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: data._id,
                msg,
            });
        }

        await axios.post(sendMessageRoute, {
            from: data._id,
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({
                    fromSelf: false,
                    message: msg,
                });
            });
        }
    }, [socket]);

    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="username">
                        <h3>{currentChat?.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>

            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div ref={scrollRef} key={index}>
                        <div
                            className={`message ${
                                message.fromSelf ? "sended" : "recieved"
                            }`}
                        >
                            <div className="content">
                                <p>{message.message}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Input handleSendMsg={handleSendMsg} />
        </Container>
    );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;