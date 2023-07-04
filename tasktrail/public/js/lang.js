import { getCookie } from './cookies.js'

document.addEventListener('DOMContentLoaded', () => {
    const LANGUAGES = {
        'English': 'en',
        'Español': 'es',
    }

    const $langs = document.querySelectorAll('.lang-dropdown .navbar-item')

    $langs.forEach($lang => {
        $lang.addEventListener('click', () => {
            const selectedLang = $lang.innerText

            if (LANGUAGES[selectedLang] === getCookie('lang')) return

            document.cookie = `lang=${LANGUAGES[selectedLang]};`

            window.location.reload()
        })
    })
});