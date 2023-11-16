import './select-project.css';
import React from 'react';
import { useState } from "react";

function SelectProject() {

    function projectHelper() {
        if (cards.length > 0) {
            return
        }
        console.log(cards.length)
        fetch('https://rsf6bjt4de6goirsyfvxfs2zdy0vquva.lambda-url.us-east-1.on.aws?' + new URLSearchParams({
            userID: JSON.parse(localStorage.getItem("authData")).username
        })).then(response => {
            return response.json()
        }).then(data => {
            let colorDict = {}
            var cardArr = []
            data['data'].forEach(project => {
                cardArr.push({
                    title: project.projectName,
                    text: project.description,
                    urllink: "/projects/" + project.projectID
                })
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                colorDict[project.projectID] = color
            })
            data['color'] = colorDict
            // setProjectsList(data)
            setCards(cardArr)
        })
    }
    function loginHelper() {
        try {
            let token = JSON.parse(localStorage.getItem("authData")).authInfo.AccessToken
            projectHelper()
            return true
        } catch (error) {
            return false
        }
    }

    const [cards, setCards] = useState([])
    loginHelper()
    return (
        <div>
            <section>
                <div className="container">
                    <h4>Current Projects</h4>
                    <div className="cards">
                        {
                            cards.map((card, i) => (
                                <div key={i} className="card">
                                    <h5> {card.title}</h5>
                                    <p> {card.text}</p>
                                    <a href= {card.urllink}>
                                        <button className="btn"> View Project</button>
                                    </a>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SelectProject;
