(function () {
	const form = document.querySelector('.url-form');
	const result = document.querySelector('.result-section');
	const logoutbtn = document.getElementById("logout");
	form.addEventListener('submit', event => {           //registering event
		event.preventDefault();  //default action is prevented

		const input = document.querySelector('.url-input');

		// setting cookies
		//  document.cookie = "name=value";
		//  document.cookie = 'lastlogin=Mar 5 2019';

		fetch('/new', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',

				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				url: input.value,
			})
		})
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();  //raw response
			})
			.then(data => {                  //in data it stores moified response
				while (result.hasChildNodes()) {
					result.removeChild(result.lastChild);   //to clear
				}


				//append the shortened url
				result.insertAdjacentHTML('afterbegin', `   
        <div class="result">
          <a target="_blank" class="short-url" rel="noopener" href="/short/${data.short_id}">
            ${location.origin}/short/${data.short_id}
          </a>
        </div>
      `)
			})
			.catch(console.error)
	});

	logoutbtn.addEventListener("click", function logout() {
		console.log("logout");

		fetch('/logout', {
			method: 'delete'
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
					error.then(res => alert(res.message || res))
			});

	})
})();