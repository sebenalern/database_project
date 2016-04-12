import json
import os
# allows you to generate 128 bit unique key
import uuid
from flask import Flask, send_file, session, render_template, request 
from flask.ext.socketio import SocketIO, emit, send
import psycopg2
import psycopg2.extras
from psycopg2.extensions import adapt
from flask_socketio import leave_room, join_room

# create flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

global connected
connected = False

global GlobalRoomN
GlobalRoomN=""

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
    

@socketio.on('RoomClicked')
def GrabRoomMessages(buddyEmail, OwnerEmail):
    global GlobalRoomN
    print 'The room which is clicked is ?????'
    print buddyEmail;
    print OwnerEmail
    conn=connectToDB()
    cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    print(cur.mogrify("select message from messages where (email1=%s and email2friend=%s) or (email1=%s and email2friend=%s);",(OwnerEmail, buddyEmail, buddyEmail,OwnerEmail)))
    print 'do we come after cur.mogrify'
    cur.execute("select message, username from messages where (email1=%s and email2friend=%s) or (email1=%s and email2friend=%s);",(OwnerEmail, buddyEmail, buddyEmail,OwnerEmail))
    print 'do we come after cur.execute'
    DBresults=cur.fetchall();
    cur.execute("select sameidfriend from friends where email1=%s and email2=%s",(OwnerEmail,buddyEmail))
    DBresults1=cur.fetchone();
    GlobalRoomN=DBresults1
    join_room(DBresults1[0])
    print 'DBresults are :'
    print DBresults
    for rows in DBresults:
        sendDatabaseMsg={'text':rows[0], 'name':rows[1]}
        emit('message', sendDatabaseMsg)
        


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
    print(cur.mogrify("select users.first_name,users.email  from users join friends on friends.email2=users.email where friends.email1=%s;",(Useremail,)))
    cur.execute("select users.first_name, users.email from users join friends on friends.email2=users.email where friends.email1=%s;",(Useremail,))
    curFetch=cur.fetchall()
    for rows in curFetch:
        print "printing rows"
        print rows
        curFetch1.append(rows)
    print curFetch1       
    emit('AllFriends', curFetch1)
    
    
@socketio.on('joined')
def on_join(messageM,emailOwnerSend, emailBuddySend):
    global GlobalRoomN
    conn=connectToDB()
    cur =conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("select username from users where email=%s;",(emailOwnerSend,))
    print 'So the Global room Number is +++++++++++++++++++++++++++++++++'
    print GlobalRoomN
    room=GlobalRoomN[0]
    
    ownerNameSend=cur.fetchone()
    # room=RoomNo
    print ownerNameSend
    tmp={'text':messageM, 'name':ownerNameSend}
    try:
        cur.execute("insert into messages values(%s,%s,%s, %s);",(messageM,emailOwnerSend, ownerNameSend,emailBuddySend))
        conn.commit()
    except:
        conn.rollback()
    print (tmp)
    emit('message', tmp,room=room)        
        
        

@socketio.on("addFriend")
def addFriend(user, friend):
    print user
    print friend
    # inserting a friend relationship (1, 2)
    try:
        uuidId=uuid.uuid1()
        conn=connectToDB()
        cur=conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        print(cur.mogrify("""insert into friends (email1, email2,sameidfriend) values (%s, %s,%s);""", (user, friend,str(uuidId))))
        cur.execute("""insert into friends (email1, email2,sameidfriend) values (%s, %s,%s);""", (user, friend,str(uuidId)))
        conn.commit()
    except:
        conn.rollback()
    
    # insert the same friend relationship (2, 1)
    try:
        
        print(cur.mogrify("""insert into friends (email1, email2,sameidfriend) values (%s, %s,%s);""", (friend, user,str(uuidId))))
        cur.execute("""insert into friends (email1, email2,sameidfriend) values (%s, %s,%s);""", (friend, user,str(uuidId)))
        conn.commit()
    except:
        conn.rollback()
    
    # TODO send a message back to client that the friend was added and alert user

@app.route("/")
def index():
    return send_file("templates/index.html")
    
    
if __name__ == '__main__':
   socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)), debug=True)