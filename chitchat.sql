-- Exam 1 Restaurant comments
CREATE DATABASE chitchat;
\c chitchat

-- Creates role exam1 with a password
CREATE USER chitchat_role WITH PASSWORD 'password';

-- This is to be able to create extension for pgcrypto b/c only superuser can do it
-- Then superuser privs are taken away
ALTER ROLE chitchat_role SUPERUSER;
CREATE EXTENSION pgcrypto;
ALTER ROLE chitchat_role NOSUPERUSER;

-- Gives privs to role exam1
ALTER DEFAULT PRIVILEGES 
    FOR ROLE chitchat_role
    IN SCHEMA public
    GRANT ALL PRIVILEGES ON TABLES TO chitchat_role;
-- Set session_user and current_user to exam1
SET SESSION AUTHORIZATION 'chitchat_role';

CREATE TABLE users (
                    uuid text NOT NULL,
                    email text NOT NULL,
                    first_name text NOT NULL,
                    last_name text NOT NULL,
                    username text NOT NULL,
                    password text NOT NULL,
                    PRIMARY KEY (uuid)
                   );
                    
CREATE TABLE messages (
                        -- id serial primary key
                        uuid text NOT NULL REFERENCES users(uuid),
                        message text NOT NULL
                      );
                    
CREATE TABLE friends (
                        friends_id serial PRIMARY KEY,
                        uuid1 text REFERENCES users(uuid),
                        uuid2 text REFERENCES users(uuid)
                     );