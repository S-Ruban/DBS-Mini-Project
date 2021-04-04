const auth = (req, res, next) => {
    if(req.session && req.session.user)
        next();
    else
        res.status(401).send("Please Sign In");
}

const unauth = (req, res, next) => {
    if(!req.session.user)
        next();
    else
        res.status(401).send("Please Sign Out First");
}

module.exports = {auth, unauth};