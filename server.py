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



def connectToDB():
    connectionString = 'dbname = chitchat user=chitchat_role password=password host=localhost'
    try:
        return psycopg2.connect(connectionString)
    except:
        print 'Can\'t connect to the database.'


#create socketio app
socketio = SocketIO(app)


@app.route('/profile', methods=['GET', 'POST'])
def renderProfile(): 
    if request.method == 'POST':
        conn=connectToDB()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        try:
            print 'hello'
            myUuid=uuid.uuid1()
            print(cur.mogrify("insert into users values(%s,%s,%s,%s,%s,crypt(%s, gen_salt('bf')));",(str(myUuid), request.form['email'],request.form['firstname'], request.form['lastname'],request.form['username'],request.form['password'])))
            cur.execute("insert into users values(%s,%s,%s,%s,%s,crypt(%s,gen_salt('bf')));",(str(myUuid),request.form['email'],request.form['firstname'], request.form['lastname'],request.form['username'],request.form['password']))
            conn.commit()
        except:
            conn.rollback()
    #socketio.emit('receiveUserProfileData', {"username": "Nick"})
    



@socketio.on("LoginDetails", namespace="/chitchat")
def renderLoginPage(UserDetails):
    print 'helooooooo we are in login page------------'
    try:
        conn=connectToDB()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        print(cur.mogrify("select email, first_name,last_name,username from users where email=%s AND password=crypt(%s, password);",(UserDetails[0],UserDetails[1])))
        cur.execute("select email, first_name, last_name, username from users where email=%s AND password=crypt(%s, password);",(UserDetails[0],UserDetails[1]))
        print 'we have reached here'
        loginQueryFetch=cur.fetchone()
        print loginQueryFetch
        if loginQueryFetch is not None:
            emit("receiveUserProfileData", loginQueryFetch, namespace = '/chitchat')
            
        else:
            emit("notReceiveUserProfileData", namespace = '/chitchat')
    except:
        print 'could not excess login table'


@app.route("/")
def index():
    return send_file("templates/index.html")
    
    
if __name__ == '__main__':
   socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)), debug=True)