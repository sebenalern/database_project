import os
import uuid
from flask import Flask, session, render_template, request
from flask.ext.socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from psycopg2.extensions import adapt

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)

@app.route('/')
def mainIndex():
    print 'in hello world'
    return app.send_static_file('index.html')

# start the server
if __name__ == '__main__':
        socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 8080)), debug=True)
