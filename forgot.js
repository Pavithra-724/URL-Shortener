(function () {
    const form = document.querySelector('.url-form');
    const result = document.querySelector('.result-section');
    form.addEventListener('submit', event => {
        //registering event
        event.preventDefault();

        //default action is prevented

        const user = document.querySelector('.username').value;
         const email = document.querySelector('.email').value;
   

        //ajax call
        fetch('/forgot', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({ username: user, email: email }), // data can be `string` or {object}! 
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

        .then(response=> {
         window.location.href = "/link"  //'/'
        })
        .catch(error => {
            error.json().then(res => alert(res.message || res))
        });

            // .then(res => {
            //     if (res.ok) {
            //         return res.sendMessage("link is sent");
            //     }else{
            //         throw res;
            //     }
            //     //show a message - link sent. click that to reset
            // })
            // .catch(error => {
            //     error.json().then(res => alert(res.message || res))
            // });

            });

 })();