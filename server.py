import os
import uuid
from flask import Flask, session, render_template, request, send_file, send_from_directory, redirect, url_for
from flask.ext.socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from psycopg2.extensions import adapt

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)

# connects to the database
def connectToDB():
    connectionString = 'dbname = chitchat user=chitchat_role password=password host=localhost'
    try:
        return psycopg2.connect(connectionString)
    except:
        print 'Can\'t connect to the database.'

# renders the main page
@app.route('/')
def mainIndex():
    return render_template("index.html")
    
# renders login page   
@app.route('/login')
def renderLoginPage():
    return render_template('loginPage.html')
    
# renders registration page  
@app.route('/register', methods=['GET', 'POST'])
def renderRegistrationPage():

    return render_template('registration.html')
    
# gets profile page url
@app.route('/profile', methods=['GET', 'POST'])
def renderProfile(): 
    socketio.emit('receiveUserProfileData', {"username": "Nick"})
    return render_template("profile.html")
    
@app.route('/edit_profile')
def renderEditProfile():
    return render_template('edit_profile.html')

# start the server
if __name__ == '__main__':
        socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 8080)), debug=True)
