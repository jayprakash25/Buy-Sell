import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {pool} from "../database/connection";

export const setupPassport = () => {
    passport.use(new LocalStrategy(async(username, password, done) => {
        try {
            const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = result.rows[0];
            
            if(!user){
                return done(null, false, { message: "user not found" });
            }

            //check password against hashed password in database
            const isValid = password === user.password;
            if(isValid){
                return done(null, user);
            } else {
                return done(null, false, { message: "Invalid username or password" });
            }
        } catch (error) {
            return done(error);
        }
    }
        ))
}