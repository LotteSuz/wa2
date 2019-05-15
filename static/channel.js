document.addEventListener('DOMContentLoaded', () => {

      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

      socket.on('connect', () => {
        // Make person leave the previous room and enter the new one
        const prevchannel = localStorage.getItem('channel')
        const person = localStorage.getItem('username')
        socket.emit('leave room', {'room': prevchannel, 'user': person})
        const newchannel = document.querySelector('#messagesubmit').dataset.message
        localStorage.setItem('channel', newchannel)
        socket.emit('join room', {'room': newchannel, 'user': person})

        // Button 'messagesubmit' should emit a new message
        document.querySelector('#messagesubmit').onclick = () => {
                const selection = document.querySelector('#message').value
                const channel = document.querySelector('#messagesubmit').dataset.message
                const user = localStorage.getItem('username')
                socket.emit('submit message', {'selection': selection, 'channel': channel, 'user': user});
                };
              });

        // When a new message is announced, add to the channel
        socket.on('announce message', data => {
            const li = document.createElement('li');
            li.innerHTML = `<div id="listinfo"> at ${data.stamp} ${data.user} said </div><br><div id="listmessage"> ${data.message}</div>`;
            document.querySelector('#history').append(li);
        });
      });
