import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pool } from "../database/connection";
import bcrypt from "bcrypt";

// export const setupPassport = () => {
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const result = await pool.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        const user = result.rows[0];

        if (!user) {
          return done(null, false, { message: "user not found" });
        }

        //check password against hashed password in database
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid username or password" });
        }
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);
// }

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  pool.query("SELECT * FROM users WHERE id = $1", [userId], (error, result) => {
    if (error) {
      return done(error);
    }
    done(null, result.rows[0]);
  });
});
