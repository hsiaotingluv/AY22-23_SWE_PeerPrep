import { createUser, getUserDetails, deleteUser, changePassword } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({ username, password });
        await newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormCheckIsExistingUser(username) {
    try {
        const userExist = await getUserDetails({ username: username });
        return userExist != null;
    } catch (err) {
        console.log('ERROR: Could not check if user already exists');
        return { err };
    }
}

export async function ormGetUserDetails(username) {
    try {
        const user = await getUserDetails({ username: username });
        return user;
    } catch (err) {
        console.log('ERROR: Could not get user details based on username query');
        return { err };
    }
}

export async function ormDeleteUser(username) {
    try {
        await deleteUser({ username: username });
        return true;
    } catch (err) {
        console.log('ERROR: Could not delete user');
        return { err };
    }
}

export async function ormChangePassword(username, hash) {
    try {
        const filter = { username: username };
        const update = { password: hash };
        await changePassword(filter, update);
        return true;
    } catch (err) {
        console.log('ERROR: Could not delete user');
        return { err };
    }
}