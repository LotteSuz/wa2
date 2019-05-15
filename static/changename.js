document.addEventListener('DOMContentLoaded', () => {

      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

      socket.on('connect', () => {
        localStorage.setItem('channel', 'changename')
        // Button 'namesubmit' should emit a change of username
        document.querySelector('#namesubmit').onclick = () => {
                const selection = document.querySelector('#name').value
                socket.emit('changed name', {'selection': selection});
                };
              });
        // When a username has been changed, update the localStorage
        socket.on('announce new name', data => {
          person = data["newname"]
          console.log(person)
          localStorage.setItem('username', person);
        });
      });
