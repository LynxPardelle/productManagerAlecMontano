import passport from "passport";
import GitHubStrategy from "passport-github2";
import config from "./config.js";
import userMongoDao from "../dao/mongo/userMongo.dao.js";

export default () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.gitHubClientId,
        clientSecret: config.gitHubClientSecret,
        callbackURL: config.origin + "/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userMongoDao.DoGetUser({
            email: profile._json.email || profile._json.html_url,
          });
          if (!user.email) {
            let newUser = {
              first_name: profile._json.name.split(" ")[0],
              last_name: profile._json.name.split(" ")[1],
              age: 18,
              email: profile._json.email || profile._json.html_url,
              password: profile._json.name,
            };
            let result = await userMongoDao.registerUser(newUser);
            if (!result) {
              throw new Error("Error creating user");
            }
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser(async (user, done) => {
    try {
      let userFromServer = await userMongoDao.getUser(user.id);
      done(null, userFromServer);
    } catch (error) {
      done(error, null);
    }
  });
};
