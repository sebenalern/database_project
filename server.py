import json
import os
# allows you to generate 128 bit unique key
import uuid
from flask import Flask, send_file, session, render_template, request 
from flask.ext.socketio import SocketIO, emit, send
import psycopg2
import psycopg2.extras
from psycopg2.extensions import adapt
import random

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
   
@socketio.on('disconnect')
def dropConnection():
    print '-----------------------------Disconnected!-------------------------------------------'

def connectToDB():
    connectionString = 'dbname = chitchat user=chitchat_role password=password host=localhost'
    try:
        return psycopg2.connect(connectionString)
    except:
        print 'Can\'t connect to the database.'

# creates a 10 digit token for the room number

# def generate_random(len):
# 	word = ''
# 	for i in range(len):
# 		word += random.choice('0123456789')
# 	print word
# 	socketio.emit("openChannel", word, namespace="/video")



@socketio.on('InsertRegistrationDetails')
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
    
    emit('RegisteredUser')




@socketio.on('RoomClicked', namespace="/iss")
def GrabRoomMessages(RoomNumber):
    print 'The room which is clicked is ?????'
    print RoomNumber;    
    try:
        print 'we are inside a try block'
        conn=connectToDB()
        print 'after db_connect method'
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        print 'After conn.cursor method'
        print(cur.mogrify("select username, messages from rooms where roomno=%s;",(RoomNumber,)))
        cur.execute("select username, messages from rooms where roomno=%s;",(RoomNumber,))
        print 'cur.execution done'
        join_room(RoomNumber)
        DBresults=cur.fetchall(); 
        print 'DBresults are :'
        print DBresults
        
        for rows in DBresults:
            print rows
            print rows[1]+rows[0]
            sendDatabaseMsg={'text':rows[1], 'name':rows[0]}
            emit('message', sendDatabaseMsg)
    except: 
        "could access database properly"
        


@socketio.on("LoginDetails")
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
            emit("receiveUserProfileData", loginQueryFetch)
        else:
            emit("notReceiveUserProfileData")
    except:
        print 'could not excess login table'
        
        
@socketio.on("getUsersToAdd")
def getUsersToAdd():
    conn=connectToDB()
    cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""select email, first_name, last_name, username from users;""")
    loginQueryFetch=cur.fetchall()
    for user in loginQueryFetch:
        print user
        emit('getAllUsers', user)  
        

@socketio.on('bringUsersFriends')
def FindUsersFriends(Useremail):
    print Useremail
    conn=connectToDB()
    cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    curFetch1=[]
    print(cur.mogrify("select users.first_name from users join friends on friends.email2=users.email where friends.email1=%s;",(Useremail,)))
    cur.execute("select users.first_name from users join friends on friends.email2=users.email where friends.email1=%s;",(Useremail,))
    curFetch=cur.fetchall()
    for rows in curFetch:
        print "printing rows"
        print rows
        curFetch1.append(rows)
            
    print curFetch1       
    emit('AllFriends', curFetch1)

        

@socketio.on("addFriend")
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
    
    # TODO send a message back to client that the friend was added and alert user

# Updates the new info of the user
@socketio.on("updateUserInfo")
def updateUserInfo(userInfo):
    print "inside updateUserInfo--------------------------------------------------------"
    print userInfo
    try:    
        conn=connectToDB()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        print(cur.mogrify("""UPDATE users SET email = %s, first_name = %s, last_name = %s, username = %s, password = crypt(%s, gen_salt('bf')) where email = %s;""", (userInfo[0], userInfo[1], userInfo[2], userInfo[3], userInfo[4], userInfo[0])))
        cur.execute("""UPDATE users SET email = %s, first_name = %s, last_name = %s, username = %s, password = crypt(%s, gen_salt('bf')) where email = %s;""", (userInfo[0], userInfo[1], userInfo[2], userInfo[3], userInfo[4], userInfo[0]))
        conn.commit()
    except:
        conn.rollback()

@app.route("/")
def index():
    return send_file("templates/index.html")
    
    
if __name__ == '__main__':
   socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)), debug=True)