// (function () {
//   const form = document.querySelector('.url-form');//how to use
//   const result = document.querySelector('.result-section');
//   form.addEventListener('submit', event => {
//       //registering event
//       event.preventDefault();        //default action is prevented    
//       const email = document.querySelector('.email').value;

//         //ajax call
//       fetch('/email', {
//           method: 'POST', // or 'PUT'
//           body: JSON.stringify({ email: emailid}), // data can be `string` or {object}!
//           headers: {
//               'Content-Type': 'application/json',
//               'Custom-Header': 'ThisHeaderIsFromClient'
//           }
//       }).then(res => {
//           if (res.ok) {
//               return res.json();
//           } else {
//               throw res;
//           }
//       })
//           .then(response => {
//               window.location.href = "/reset"
//           })
//           .catch(error => {
//               error.then(res => alert(res.message || res))
//           });

//   });

// })();


