const authAdmin = (req,res,next) => {
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized) {
        res.status(401).send("Unauthorized access")
    } else {
        next()
    }
}

const authUser = (req,res,next) => {
    const token = "xyzsd"
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized) {
        res.status(401).send("Unauthorized Access")
    } else {
        next()
    }
}


exports.modules = {
    authAdmin,
    authUser
}