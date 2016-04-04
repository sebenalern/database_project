import json
import os
# allows you to generate 128 bit unique key
import uuid
from flask import Flask, send_file, session, render_template, request 
from flask.ext.socketio import SocketIO, emit, send
import psycopg2
import psycopg2.extras
from psycopg2.extensions import adapt

# create flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

#create socketio app
socketio = SocketIO(app)

@app.route("/")
def index():
    return send_file("templates/index.html")
    
if __name__ == '__main__':
   socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)), debug=True)