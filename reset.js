(function () {
    const form = document.querySelector('.url-form');
    const result = document.querySelector('.result-section');
    form.addEventListener('submit', event => {
        //registering event
        event.preventDefault();

        //default action is prevented

        const newpass = document.querySelector('.newpsd').value;
        const conpass = document.querySelector('.conpsd').value;
        var url = window.location.pathname;   // to get the url of reset password from browser
        var uuid = url.slice(-36);           // to extract only uuid from the url of reset password

        //ajax call
        fetch('/reset/'+uuid, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({ newpassword: newpass, confirmpassword: conpass }), // data can be `string` or {object}! 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
            .then(response => {
                window.location.href = "/login"  //'/'
            })
            .catch(error => {
                error.json().then(res => alert(res.message || res))
            });

    });

})();