import 'dotenv/config'
import { ormAddToken as _addToken } from '../model/token-orm.js';
import { ormCheckIsTokenBlacklisted as _checkIsTokenBlacklisted } from '../model/token-orm.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const jwt = require('jsonwebtoken');

export function generateJWT(username) {
    const token = jwt.sign({ username: username }, process.env.SECRET_KEY);
    return token;
}

export async function blacklistJWT(token) {
    const resp = await _addToken(token);
    return resp;
}

export async function authenticateJWT(req, res, next) {
    const token = getTokenFromReq(req);
    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    const inBlacklist = await _checkIsTokenBlacklisted(token);
    if (inBlacklist) {
        return res.status(401).send({ message: "JWT in blacklisted, rejected." });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: "JWT invalid." });
        }

        req.user = user.username;
        req.token = token;
        next();
    })
}

export function validateJWTSuccess(req, res) {
    console.log("Validated JWT Token");
    res.status(200).json({"username": req.user});
}

function getTokenFromReq(req) {
    const cookie = req.headers["cookie"];
    const token = cookie && cookie.substring(cookie.indexOf('token=') + 6).split(';')[0];
    return token;
}