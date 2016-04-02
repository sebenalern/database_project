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
@app.route('/login', methods=['GET','POST'])
def renderLoginPage():
    if request.method=="POST":
        print 'helooooooo we are in login page------------'
        try:
            conn=connectToDB()
            cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            print request.form['inputEmail']
            print request.form['inputPassword']
            print(cur.mogrify("select email, first_name,last_name,username from users where email=%s AND password=crypt(%s, password);",(request.form['inputEmail'], request.form['inputPassword'])))
            cur.execute("select email, first_name, last_name, username from users where email=%s AND password=crypt(%s, password);",(request.form['inputEmail'], request.form['inputPassword']))
            print 'we have reached here'
            # loginQueryFetch=cur.fetchone()
            # if loginQueryFetch is none:
            # else:
        except:    
            print 'could not excess login table'
        return render_template('profile.html')
    return render_template('loginPage.html')
    
# renders registration page  
@app.route('/register', methods=['GET', 'POST'])
def renderRegistrationPage():

    return render_template('registration.html')
    
# gets profile page url
@app.route('/profile', methods=['GET', 'POST'])
def renderProfile(): 
    if request.method == 'POST':
        conn=connectToDB()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        try:
            print 'hello'
            uuid=uuid.uuid1()
            print(cur.mogrify("insert into users values(%s,%s,%s,%s,%s,crypt(%s, gen_salt('bf')));",(str(uuid), request.form['email'],request.form['firstname'], request.form['lastname'],request.form['username'],request.form['password'])))
            cur.execute("insert into users values(%s,%s,%s,%s,%s,crypt(%s,gen_salt('bf')));",(str(uuid),request.form['email'],request.form['firstname'], request.form['lastname'],request.form['username'],request.form['password']))
            conn.commit()
        except:
            conn.rollback()
    #socketio.emit('receiveUserProfileData', {"username": "Nick"})
    return render_template("profile.html")
    
@app.route('/edit_profile')
def renderEditProfile():
    return render_template('edit_profile.html')

# start the server
if __name__ == '__main__':
        socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 8080)), debug=True)
