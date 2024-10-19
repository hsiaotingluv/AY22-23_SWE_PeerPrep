import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormCheckIsExistingUser as _checkIsExistingUser } from '../model/user-orm.js'
import { ormGetUserDetails as _getUserDetails } from '../model/user-orm.js'
import { ormDeleteUser as _deleteUser } from '../model/user-orm.js'
import { ormChangePassword as _changePassword } from '../model/user-orm.js'
import { generateJWT, blacklistJWT } from './jwt-controller.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const bcrypt = require('bcrypt');
const saltRounds = 10;

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            console.log(`Username and/or Password are missing from request body!`);
            return res.status(400).json({ message: 'Username and/or Password are missing from request body!' });
        }

        const userExists = await _checkIsExistingUser(username);
        if (userExists) {
            console.log(`User ${username} already exist!`);
            // Reference: https://stackoverflow.com/questions/12657493/what-http-error-code-to-return-for-name-already-taken
            return res.status(409).json({ message: `User ${username} already exist!` });
        }

        bcrypt.hash(password, saltRounds, async function (err, hash) {
            const resp = await _createUser(username, hash);
            if (resp.err) {
                console.log(`Could not create a new user! ERROR: ${resp.err}`);
                return res.status(500).json({ message: 'Could not create a new user!' });
            }

            console.log(`Created new user ${username} successfully!`);
            const token = generateJWT(username);

            return res.status(201).cookie('token', token, {sameSite: 'none', secure: true}).json({
              message: `Created new user ${username} successfully!`
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Database failure when creating new user!' })
    }
}

export async function loginUser(req, res) {
    try {
        // Check if username and password in request body
        const { username, password } = req.body;
        if (!username || !password) {
            console.log(`Username and/or Password are missing from request body!`);
            return res.status(400).json({ message: 'Username and/or Password are missing from request body!' });
        }

        // Check if user is in database
        const resp = await _getUserDetails(username);
        if (resp == null) {
            console.log(`Username does not exist.`);
            return res.status(400).json({ message: 'Username does not exist.' });
        }
        if (resp.err) {
            console.log(`Could not check if login credentials are valid! ERROR ${resp.err}`);
            return res.status(500).json({ message: 'Could not check if login credentials are valid!' });
        }

        // Check if password matches that in DB
        bcrypt.compare(password, resp.password, function (err, result) {
            if (!result) {
                console.log(`Incorrect password.`);
                return res.status(400).json({ message: 'Incorrect password.' });
            }

            console.log(`User credentials of ${username} is valid!`);
            const token = generateJWT(username);

            return res.status(200).cookie('token', token, {sameSite: 'none', secure: true}).json({
                message: `User ${username} is logged in!`
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Database failure when checking valid login credentials!' })
    }
}

export async function logoutUser(req, res) {
    try {
        const resp = await blacklistJWT(req.token);
        if (resp.err) {
            console.log('Error invalidating token.');
            return res.status(500).json({ message: 'Error invalidating token.' });
        }
        console.log('User logged out and token blacklisted.')
        return res.status(200).json({ message: 'User logged out and token blacklisted.' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Databse failure while logging user out and blacklisting token.' })
    }
}

export async function deleteUser(req, res) {
    try {
        const username = req.user;
        let resp = await blacklistJWT(req.token);
        if (resp.err) {
            console.log('Error invalidating token.');
            return res.status(500).json({ message: 'Error invalidating token.' });
        }

        resp = await _deleteUser(username);
        if (resp.err) {
            console.log(`Could not delete user!`);
            return res.status(500).json({ message: 'Could not delete user!' });
        }

        console.log(`Deleted user ${username} successfully and token blacklisted!`)
        return res.status(200).json({ message: `Deleted user ${username} successfully and token blacklisted!` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Databse failure while logging user out and blacklisting token.' });
    }
}

export async function changePassword(req, res) {
    try {
        const { newPassword } = req.body;
        const username = req.user;
        console.log(username);

        bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
            const resp = await _changePassword(username, hash);

            if (resp.err) {
                console.log(`Could not change password!`);
                return res.status(500).json({ message: 'Could not change password!' });
            }

            console.log(`Changed password for ${username} successfully!`)
            return res.status(200).json({ message: `Changed password for ${username} successfully!` });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Databse failure while logging user out and blacklisting token.' });
    }
}