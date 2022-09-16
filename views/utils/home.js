const homeUtil = (() => {
    'use strict'

    function onPasswordFieldChange() {
        console.log("Password changed");
        const password1 = document.getElementById('password1');
        const password2 = document.getElementById('password2');

        if (password1.value !== password2.value) {
            password2.setCustomValidity('Passwords do not match.');
        }
    }

    return {
        onPasswordFieldChange
    }
})();