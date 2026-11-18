import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../Pages/Logo.jpeg";

const AllContacts = ({ contacts, changeChat }) => {
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
        const data = localStorage.getItem(
            process.env.REACT_APP_LOCALHOST_KEY
        );

        if (data) {
            const user = JSON.parse(data);
            setCurrentUserName(user?.username || "");
        }
    }, []);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    return (
        <>
            {currentUserName && (
                <Container>
                    <div className="heading">
                        <img src={Logo} alt="logo" />
                        <h2>Buzz Chat</h2>
                    </div>

                    <div className="contacts">
                        {contacts?.map((contact, index) => {
                            return (
                                <div
                                    className={`contact ${
                                        index === currentSelected ? "selected" : ""
                                    }`}
                                    key={contact._id}
                                    onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="current-user">
                        <div className="username">
                            <h2>{currentUserName}</h2>
                        </div>
                    </div>
                </Container>
            )}
        </>
    );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;

  .heading {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 2rem;
    }

    h2 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
  }

  .contact {
    background-color: #ffffff34;
    min-height: 5rem;
    cursor: pointer;
    width: 90%;
    border-radius: 0.2rem;
    padding: 0.4rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: 0.5s ease-in-out;
  }

  .contact .username h3 {
    color: white;
  }

  .selected {
    background-color: #9a86f3;
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .current-user .username h2 {
    color: white;
  }
`;

export default AllContacts;