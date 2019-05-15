import os
import requests
from datetime import datetime

from flask import Flask, render_template, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channellist = []
messagedict = {}

@app.route("/")
def index():
    """Go to the index page of this webapplication"""
    return render_template("index.html", channellist = channellist)

@app.route("/changename")
def changename():
    """Go to the page of this webapplication where the user can change their username"""
    return render_template("changename.html")

@socketio.on("check channel")
def check(data):
    """Check if the server has been stopped since the last visit to a page"""
    result = 2
    channel = data['channel']
    if channel in channellist:
        result = 3
    emit("announce check", {"result": result, "channel": channel})

@socketio.on("submit channel")
def submit(data):
    """Add a new channel to the application"""
    selection = data["selection"]
    if selection in channellist:
        emit("announce channelname taken", {"selection": selection}, broadcast=True)
    else:
        channellist.append(selection)
        emit("announce channel", {"selection": selection}, broadcast=True)

@app.route("/channel/<string:channelname>", methods=["GET", "POST"])
def channel(channelname):
    """Go to the page of the given channel"""
    if channelname not in channellist:
        channellist.append(channelname)
    if channelname in messagedict.keys():
        messages = messagedict[channelname]
    else:
        messages = []
    return render_template("channel.html", channelname = channelname, messages = messages)

@socketio.on("submit message")
def say(data):
    """Add new message to a given channel"""
    message = data["selection"]
    channel = data['channel']
    user = data['user']
    now = datetime.now()
    stamp = str(now)
    if channel in messagedict.keys():
            if len(messagedict[channel]) == 5:
                messagedict[channel].pop(0)
                messagedict[channel].append([message, user, stamp])
            else:
                messagedict[channel].append([message, user, stamp])
    else:
        messagedict[channel] = [[message, user, stamp]]
    emit("announce message", {"message": message, "user": user, "stamp": stamp}, room=channel, broadcast=True)

@socketio.on("changed name")
def change(data):
    """Change the username"""
    newname = data["selection"]
    emit("announce new name", {"newname": newname}, broadcast=True)

@socketio.on("join room")
def join(data):
    """Lets user join a room"""
    username = data['user']
    room = data['room']
    join_room(room)
    print(f" user {username} joined room {room}")

@socketio.on("leave room")
def leave(data):
    """Lets user join a room"""
    username = data['user']
    room = data['room']
    leave_room(room)
    print(f" user {username} left room {room}")
