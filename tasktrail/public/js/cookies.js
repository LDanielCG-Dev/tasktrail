export function getCookie(cookieName) {
    const cookieArray = document.cookie.split('; ')
        .map(cookie => cookie.split('='))
        .find(([name]) => name === cookieName);

    if (cookieArray) {
        const [, value] = cookieArray;
        return value;
    }

    return null;
}

import './consent.js'
import './lang.js'