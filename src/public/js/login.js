/**
 * replaces the href attribute in every element with the .login-link class
 * checks for a new token in the url fragment; if there is one it's stored
 * via the auth helper
 * if the token is about to expire and a refresh token is available,
 * refreshes the token
 */
import { AuthHelper } from "/js/auth_helper.js";
import { AUTH_CLIENT_ID, AUTH_DOMAIN, LOGIN_URL } from "/js/constants.js";
import { apiUrl } from "/js/fetch_helper.js";

function onDocumentLoaded() {
    insertLoginUrls();
    handleNewToken();
    handleExpiringTokens();
}

/**
 * replaces the href attribute in every element with the .login-link class
 */
function insertLoginUrls() {
    document.querySelectorAll(".login-link").forEach((element) => {
        element.setAttribute("href", LOGIN_URL);
    });
}

/**
 * if there are tokens in the url fragment stores them in the auth
 * helper; if a new token is detected, calls POST /api/1/users/
 */
async function handleNewToken() {
    const fragment = window.location.hash;
    if (fragment === "") {
        return;
    }
    /** @type {URLSearchParams} */
    let args;
    try {
        args = new URLSearchParams(fragment.substring(1));
    } catch {
        return;
    }
    if (args.has("id_token")) {
        AuthHelper.store(args.get("id_token"), args.get("access_token"), args.get("refresh_token"));
        await fetch(apiUrl("/api/1/users/"), AuthHelper.auth({ method: "POST" }));
        window.location.replace(window.location.href.split("#", 2)[0]);
    }
}

/**
 * if the token is expired, we purge it from our storage
 * if it's about to expire and it's possible to refresh it,
 * we refresh it
 */
async function handleExpiringTokens() {
    if (!AuthHelper.isLoggedIn()) {
        return;
    }
    const tokens = AuthHelper.retrieve();
    const claimsRaw = atob(tokens.id.split(".")[1]);
    const claimsUnverified = JSON.parse(claimsRaw);
    const expiresAt = new Date(claimsUnverified.exp * 1000);
    const now = new Date();
    if (expiresAt < now) {
        AuthHelper.clear();
        return;
    }
    const soon = new Date(now.getTime() + 1000 * 60 * 10);
    if (expiresAt > soon) {
        return;
    }
    if (tokens.refresh === null || tokens.refresh === undefined) {
        return;
    }
    const response = await fetch(
        "https://" + AUTH_DOMAIN.substring(0, AUTH_DOMAIN.length - 1) + "/",
        {
            method: "POST",
            headers: {
                "content-type": "application/x-amz-json-1.1",
                "x-amz-target": "AWSCognitoIdentityProviderService/InitiateAuth",
            },
            body: JSON.stringify({
                AuthFlow: "REFRESH_TOKEN_AUTH",
                AuthParameters: {
                    REFRESH_TOKEN: tokens.refresh
                },
                ClientId: AUTH_CLIENT_ID
            })
        }
    );
    if (!response.ok) {
        window.location.href = LOGIN_URL;
        return;
    }
    const data = await response.json();
    if (data.ChallengeName !== null && data.ChallengeName !== undefined) {
        window.location.href = LOGIN_URL;
        return;
    }
    AuthHelper.store(
        data.AuthenticationResult.IdToken,
        data.AuthenticationResult.AccessToken,
        data.AuthenticationResult.RefreshToken
    );
}

onDocumentLoaded();
