import { API_CONFIG } from "./config.js";

export function displayMessage(error, element, inputs, id) {
    const message = document.getElementById(id)
    message.textContent = error
    message.style.visibility = 'visible';
    inputs.forEach(input => {
        if (element == input.getAttribute('id')) {
            document.getElementById(element).style.border = '1.5px solid red';
            setTimeout(() => {
                document.getElementById(element).style.border = '1px solid black';
                message.style.visibility = 'hidden';
            }, 1000);
        }
    });
}

export async function refreshAccessToken() {
    const endpoint = `${API_CONFIG.API_URL}token/refresh/`;
    try {
        const response = await callAPI(endpoint, 'POST', {refresh:localStorage.getItem("refresh_token")});
        const data = await response.json();
        if (response.ok) {
            setTokens(data);
            console.log('tokens refreshed');
        } else if (data.code === "token_not_valid" || data.detail === "Token is blacklisted") {
            console.warn("Refresh token is blacklisted or invalid. Logging out the user.");
            localStorage.clear(); 
            window.location.href = "home.html";
        } else {
            console.log('Please login again.');
            window.location.href = "home.html";
        }
    } catch (error) {
        console.error(error);
    }
}

export async function callAPI(endpoint, method, body = null, req_auth = true) {
    const headers = {
        "Content-Type": "application/json",
        ...(req_auth && { Authorization: `Bearer ${localStorage.getItem('access_token')}` })
    };

    const options = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) })
    };

    return await fetch(endpoint, options);
}

export function setTokens(tokens) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
}

