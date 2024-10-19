import express from 'express';
import cors from 'cors';

import { createUser, loginUser, logoutUser, deleteUser, changePassword } from './controller/user-controller.js';
import { authenticateJWT, validateJWTSuccess } from './controller/jwt-controller.js'

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ // config cors so that front-end can use
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: true
}));
app.options('*', cors());

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'));
router.post('/signup/', createUser);
router.post('/login/', loginUser);
router.delete('/logout/', authenticateJWT, logoutUser);
router.delete('/delete/', authenticateJWT, deleteUser);
router.post('/change-password/', authenticateJWT, changePassword);
router.post('/validate-jwt', authenticateJWT, validateJWTSuccess);

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
})

app.listen(process.env.PORT || 8000, () => console.log('user-service listening on port 8000'));