(function () {
    const form = document.querySelector('.url-form');//how to use
    const result = document.querySelector('.result-section');
    form.addEventListener('submit', event => {
        //registering event
        event.preventDefault();

        //default action is prevented

        const user = document.querySelector('.username').value;
        const pwd = document.querySelector('.password').value;

        // setting cookies
        document.cookie = "name=value";
        document.cookie = 'lastlogin=Mar 5 2019';

        //sending header to server
        //ajax call
        fetch('/login', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({ username: user, password: pwd }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json',
                'Custom-Header': 'ThisHeaderIsFromClient'
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
            .then(response => {
                window.location.href = "/"
            })
            .catch(error => {
                error.json().then(res => alert(res.message || res))
            });

    });

})();