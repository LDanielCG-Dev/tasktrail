import { getCookie } from './cookies.js'

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Delete the Bulma class from the <html> tag
     * so it doesn't leave an empty space at the bottom
     */
    if (getCookie("consent"))
        document.getElementsByTagName("html")[0].classList.remove("has-navbar-fixed-bottom");

    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        const $notification = $delete.parentNode;

        $delete.addEventListener('click', () => {
            $notification.parentNode.removeChild($notification);

            document.cookie = 'consent=true;'
            document.getElementsByTagName("html")[0].classList.remove("has-navbar-fixed-bottom");
        });
    });
});