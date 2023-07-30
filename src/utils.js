import bcrypt from 'bcrypt';

/**
 * Hash the password
 */
export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
/**
 * Validate the password
 */
export const isValidPassword = (user,password) => {
    return bcrypt.compareSync(password, user.password);
}
/**
 * Validate if the user is authenticate
 */
export const isUserAuthenticate = (request, response, next) => {
    
    if(!request.session?.passport?.user){
        response.redirect('/session/login');
    } else {
        next();
    }
}
