module.exports = (req,res,next)=>{
    if(!req.user){
        req.flash('error', 'you must be logged in to access that page')
        res.redirect('/auth/login')
    } else {//someone is logged in currently
        next()
    }
}