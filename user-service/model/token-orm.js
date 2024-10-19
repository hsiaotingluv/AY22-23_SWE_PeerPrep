import { addTokenToBlacklist, getToken } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormAddToken(token) {
    try {
        const newToken = await addTokenToBlacklist({ token: token });
        await newToken.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not add token to blacklist');
        return { err };
    }
}

export async function ormCheckIsTokenBlacklisted(token) {
    try {
        const tokenFromDB = await getToken({ token: token });
        return tokenFromDB != null;
    } catch (err) {
        console.log('ERROR: Could not check if token is blacklisted');
        return { err };
    }
}