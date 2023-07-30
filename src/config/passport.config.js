import passport from "passport";
import local from "passport-local";
import bcrypt from "bcrypt";
import UserModel from "../api/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';
dotenv.config()


const LocalStrategy = local.Strategy;

const initializePassport = () => {
  /**
   * Use passport to register a new user
   */
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (request, username, password, done) => {
        const { first_name, last_name, email, age } = request.body;
        try {
          const user = await UserModel.findOne({ email: username });

          if (user) {
            console.log("User already exists");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age: parseInt(age),
            password: createHash(password),
          };
          console.log(newUser);
          if (
            newUser.email === "adminCoder@coder.com" &&
            bcrypt.compareSync("adminCod3r123", newUser.password)
          ) {
            newUser.role = "admin";
          }
          const result = await UserModel.create(newUser);
          console.log(result);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

/**
 * User passport to authenticate the user
 */
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ email: username });
        if (!user) {
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done("Something happen");
      }
    }
  )
);
/**
 * User github passport to auth user
 */
passport.use('github',
new GitHubStrategy({
  clientID: process.env.clientId,
  clientSecret: process.env.clientSecret,
  callbackUrl: 'http://localhost:8080/sessions/githubcallback',
  scope:["user:email"]
},
async(accessToken, refreshToken, profile, done) => {
  try {
    const username = profile.displayName || profile.username;
    const userEmail = profile._json.email;
    const userExists = await UserModel.findOne({email: userEmail});
    if(userExists){
      return done(null, userExists);
    }
    const newUser = {
      first_name: username,
      last_name: "",
      email: userEmail,
      age: '',
      password: ''
    };

    const result = await UserModel.create(newUser);
    return done(null, result);
  } catch (error) {
    return done(error);
  }
})
)
/**
 * Save the user id into the session file store
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Match our session ID with our session file store
 * and return our user id
 */
passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

export default initializePassport;
