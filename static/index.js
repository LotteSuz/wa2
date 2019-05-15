document.addEventListener('DOMContentLoaded', () => {

      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

      socket.on('connect', () => {

          // Check last visited channel
          if (!localStorage.getItem('channel')){
            localStorage.setItem('channel', 'index')
          }
          else{
            var channel = localStorage.getItem('channel')
            socket.emit('check channel', {'channel': channel});
          }

          // Welcome the user, ask for a username if needed
          var txt;
          if (!localStorage.getItem('username')){
              var person = prompt("Please enter your name:", "name");
              if (person == null || person == "") {
                txt = "User cancelled the prompt.";
              } else {
                localStorage.setItem('username', person);
                txt = "Hello " + person + "! ";
              }}
          else {
              txt = "Hello " + localStorage.getItem('username') + "!"
            }
          document.getElementById("welcome").innerHTML = txt;

          // Button 'channelsubmit' should emit a new channel
          document.querySelector('#channelsubmit').onclick = () => {
                  const selection = document.querySelector('#name').value
                  socket.emit('submit channel', {'selection': selection});
                  };
              });

      // Navigate to the last-visited page if needed
      socket.on('announce check', data => {
        console.log(data)
        if (data["result"] == 3){
          var channel = data["channel"]
          if (channel == 'changename'){
            window.location.replace(`/changename`);
          }
          else {
            window.location.replace(`/channel/${channel}`);
          }
        }
        else {
          localStorage.setItem('channel', 'index')
      }
    });

      // When a new vote channel is announced, add to the index page
      socket.on('announce channel', data => {
          const li = document.createElement('li');
          li.innerHTML = `New Channel: <a href="/channel/${data.selection}">${data.selection}`;
          document.querySelector('#channels').append(li);
      });

      // Make sure username is unique
      socket.on('announce channelname taken', data => {
          alert("Pick another channelname")
      });
    });
