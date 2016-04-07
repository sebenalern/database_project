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


global connected
connected = False

#create socketio app
socketio = SocketIO(app)

#
# Called when the socket connects
#
@socketio.on('connect')
def makeConnection():
    print '-----------------------------Connection made!----------------------------------------'
    # global connected
    # if not connected:
    #         conn=connectToDB()
    #         cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    #         print(cur.mogrify("select email, first_name,last_name,username from users;"))
    #         cur.execute("""select email, first_name, last_name, username from users;""")
    #         loginQueryFetch=cur.fetchall()
    #         for user in loginQueryFetch:
    #             print user
    #             connected = True
    #             emit('getAllUsers', user, namespace = '/chitchat')

@socketio.on('disconnect')
def dropConnection():
    print '-----------------------------Disconnected!-------------------------------------------'

def connectToDB():
    connectionString = 'dbname = chitchat user=chitchat_role password=password host=localhost'
    try:
        return psycopg2.connect(connectionString)
    except:
        print 'Can\'t connect to the database.'
        



@socketio.on('InsertRegistrationDetails', namespace="/chitchat")
def renderProfile(dataToBeRegistered):
    print 'Data to be registered-----???????'
    print dataToBeRegistered
    try:    
        conn=connectToDB()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        print(cur.mogrify("insert into users values(%s,%s,%s,%s,crypt(%s, gen_salt('bf')));", (dataToBeRegistered[3],dataToBeRegistered[1],dataToBeRegistered[2],dataToBeRegistered[0],dataToBeRegistered[4])))
        cur.execute("insert into users values(%s,%s,%s,%s,crypt(%s,gen_salt('bf')));", (dataToBeRegistered[3],dataToBeRegistered[1],dataToBeRegistered[2],dataToBeRegistered[0],dataToBeRegistered[4]))
        conn.commit()
    except:
        conn.rollback()
    
    emit('RegisteredUser', namespace="/chitchat")



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
        
        
@socketio.on("getUsersToAdd", namespace = "/chitchat")
def getUsersToAdd():
    conn=connectToDB()
    cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""select email, first_name, last_name, username from users;""")
    loginQueryFetch=cur.fetchall()
    for user in loginQueryFetch:
        print user
        emit('getAllUsers', user, namespace = '/chitchat')  
        
@socketio.on("addFriend", namespace = "/chitchat")
def addFriend(user, friend):
    print user
    print friend
    # inserting a friend relationship (1, 2)
    try:    
        conn=connectToDB()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        print(cur.mogrify("""insert into friends (email1, email2) values (%s, %s);""", (user, friend)))
        cur.execute("""insert into friends (email1, email2) values (%s, %s);""", (user, friend))
        conn.commit()
    except:
        conn.rollback()
    
    # insert the same friend relationship (2, 1)
    try:    
        print(cur.mogrify("""insert into friends (email1, email2) values (%s, %s);""", (friend, user)))
        cur.execute("""insert into friends (email1, email2) values (%s, %s);""", (friend, user))
        conn.commit()
    except:
        conn.rollback()
    

@app.route("/")
def index():
    return send_file("templates/index.html")
    
    
if __name__ == '__main__':
   socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)), debug=True)