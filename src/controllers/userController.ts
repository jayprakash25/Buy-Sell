import express from 'express';
import { pool } from '../database/connection';
import bcrypt from 'bcrypt';
import passport from 'passport';

export const handleRegister = async(req: express.Request, res: express.Response) => {
    const { username, password } = req.body; 
    //check if username already exists
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if(user.rows[0]){
        return res.status(400).json({ message: "Username already exists" });
    }
    if(!username || !password){
        return res.status(400).json({ message: "Username and password are required" });
    }

    const hash = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username, hash]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }   
}
export const handleLogin = passport.authenticate("local", {
    successRedirect: "/users/login-success",
    failureRedirect: "/users/login",
    // failureFlash: true,
});



// export const handleLogin = async(req: express.Request, res: express.Response) => {
//     const { username, password } = req.body;
//     const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//     if(!user.rows[0]){
//         return res.status(400).json({ message: "User not found" });
//     }

//     if(isValid){
//         return res.json({ message: "Login successful" });
//     } else {
   