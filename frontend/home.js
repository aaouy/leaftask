import {displayMessage, callAPI, setTokens} from "./functions.js";
import { API_CONFIG } from "./config.js";

main();

function main() {
    localStorage.removeItem("access_token");
    localStorage.removeItem('refresh_token');
    const phrases = ["Grow your productivity, one task at a time.", 
        "Nurture your goals, watch them flourish.", 
        "Plant your ideas, harvest success.",
    ]
    typeWriterWelcomeEffect(phrases);
    const submit_registration_button = document.getElementById('submit-register-button');
    registerUser(submit_registration_button);
    const submit_login_button = document.getElementById("submit-login-button");
    userLogin(submit_login_button);
}

function typeWriterWelcomeEffect(phrases) {

    let phrases_index = 0
    let phrase_index = 1
    let current_text = ""

    function animateText() {
        const phrase = phrases[phrases_index % phrases.length]
        if (phrase_index <= phrase.length) {
            current_text = phrase.substring(0, phrase_index);
            document.getElementById('introduction-phrases').textContent = current_text;
            phrase_index += 1
            setTimeout(animateText, 100);
        } else {
            setTimeout(deleteText, 2000);
        }
    }

    function deleteText() {
        const phrase = phrases[phrases_index % phrases.length]
        if (phrase_index >= 0) {
            current_text = phrase.substring(0, phrase_index);
            document.getElementById('introduction-phrases').textContent = current_text;
            phrase_index -= 1
            setTimeout(deleteText, 75);
        } else {
            phrases_index += 1
            setTimeout(animateText, 1000);
        }
    }

   animateText();
}

function registerUser(submit_registration_button) {
    submit_registration_button.addEventListener('click', async (event) => {
        event.preventDefault();
        const inputs = document.getElementById('register-form').querySelectorAll('input');
        const body = {'email': inputs[0].value, 'username': inputs[1].value, 'password': inputs[2].value, 'confirm_password': inputs[3].value};
        console.log('login button clicked!');
        try {
            const response = await callAPI(`${API_CONFIG.API_URL}user/register/`, 'POST', body, false);
            if (!response.ok) {
                const data = await response.json();
                console.log(data)
                for (const key in data) {
                    if (data[key]) {
                        displayMessage(data[key], "register-" + key, inputs, 'register-error');
                        throw new Error(data[key]);
                    }
                }
                throw new Error('signup_error');
            }
            const data = await response.json();
            const message = document.getElementById('register-error');
            message.textContent = 'Registration Successful! Please login below.'
            message.style.color = 'green';
            message.style.visibility = 'visible';
            setTimeout(() => {
                message.style.visibility = 'hidden';
            }, 3000);
            console.log('Registration successful!', data);
        } catch (error) {
            console.error(error);
        }
    })
};

function userLogin(submit_login_button) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('referesh_token');
    submit_login_button.addEventListener('click', async (event) => {
        event.preventDefault();
        const inputs = document.getElementById('login-form').querySelectorAll('input');
        const body = {'username': inputs[0].value, 'password': inputs[1].value}
        try {
            const response = await callAPI(`${API_CONFIG.API_URL}token/`, 'POST', body);
            const data = await response.json();
            if (!response.ok) {
                console.log(data);
                for (const key in data) {
                    displayMessage(data[key], "login-" + key, inputs, 'login-error');
                    throw new Error(data[key]);
                }
            }
            setTokens(data);
            localStorage.setItem('username', inputs[0].value);
            const message = document.getElementById('login-error');
            message.textContent = 'Login Successful! Please Wait a Moment.';
            message.style.color = 'green';
            message.style.visibility = 'visible';
            setTimeout(() => {
                message.style.visibility = 'hidden';
            }, 3000);
            console.log('login successful!')
            window.location.href = 'notes.html';
        } catch (error) {
            console.log(error);
        }
    })
}
