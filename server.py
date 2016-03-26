import os
import uuid
from flask import Flask, session, render_template, request, send_file
from flask.ext.socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from psycopg2.extensions import adapt

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)
# renders the main page
@app.route('/')
def mainIndex():
    return render_template("index.html")
    
# renders login page   
@app.route('/login')
def renderLoginPage():
    return render_template('loginPage.html')
    
# renders registration page  
@app.route('/videos')
def renderRegistrationPage():
    return render_template('registration.html')

# start the server
if __name__ == '__main__':
        socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 8080)), debug=True)
