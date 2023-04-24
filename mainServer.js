const userSchema = require(__dirname + "/models/user.js");
const contactSchema = require(__dirname + "/models/contact.js");
const teacherSchema = require(__dirname + "/models/teacher.js");
const coursesSchema = require(__dirname + "/models/course.js");
const userRoute = require('./routes/userRoutes.js');
const bodyParser = require("body-parser");

const express = require('express');
const path = require('path');
const app = express();
const ejs = require("ejs");

const mongoose = require("mongoose");
const connectDb = require('./data/db.js');
const session=require("express-session");

const { homedir } = require('os');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));



app.set("view engine", "ejs");
app.set('views','./views');
connectDb();
app.use(session({
    secret: "Key sign",
    resave: false,
    saveUninitialized: false,
    
}))


app.get("/login", (req, res) => {
    
    if(req.session.isLoggedin == true){
    res.render("homepage", { error: null });
    }
    else{
        res.render("login", { error: null });
    
    }
})

app.get('/register', (req, res) => {

     
    if(req.session.isLoggedin == true){
    res.render("homepage", { error: null });
    }
    else{
        res.render("Register", { user: null, error: null });
    }
    

})

app.get('/wishlist', (req, res) => {
    if (req.session.isLoggedin == true){
         userSchema.findOne({username : req.session.user.username}).then( user =>  {
            user.populate({
                path: 'wishlist',
                populate:{
                    path: 'teacher'

                }
            }).then(()=>{
            res.render('wishlist',{user: user})
        })}
        )}
        
    

    else res.render("login", { error: null });
})


app.get("/", (req, res) => {
    // req.session.isLoggedin
    res.render("homepage");
})

app.get("/contactus", (req, res) => {
    req.session.destroy()
    res.render("contactus");
});

app.get("/checkout", (req, res) => {
    if(req.session.isLoggedin == true){
    res.render("homepage");
    }
    else
    res.render("login",{error: "You must be logged in"})
})

app.get("/checkout/:coursename", (req, res) => {
    
    if(req.session.isLoggedin == true){

    courseid = req.params.coursename

    coursesSchema.findOne({_id: courseid}).then((doc) => {
        if (!doc) {
            res.render("/")  // 404 page sey replace krdena
        } else{
            doc.populate('teacher','fullname').then((fin1)=>{
            res.render("checkout",{user: req.session.user,course:fin1})     
        })}
    });     
}

    else
    res.render("login",{error: "You must be logged in"})
})

app.post("/remove-wishlist/:Id",async (req,res)=>{
    
    
    cid = req.params.Id
    
    await coursesSchema.findOne({_id : cid}).then((purchased_course)=>{
        if(!purchased_course){
                res.render("homepage",{error: "Course Doesn't Exist"})
            }
            else{
                doc = req.session.user
                let wishlist = doc.wishlist
                console.log(wishlist)
                console.log(purchased_course._id)
                
                    let index = wishlist.indexOf(purchased_course._id);
                    wl1 = wishlist.splice(index, 1);
                    
                    userSchema.findByIdAndUpdate(doc._id,{wishlist:wishlist},{new:true}).then(()=>{
                    console.log("Removed From Wishlist")
                    res.render("privacy")
                })
                

                
       
            }

        })
    
})

app.post("/purchase/:coursename",(req,res) =>{
    
    cuser = req.session.user
    cid = req.params.coursename
    console.log(typeof(cid))
    

userSchema.findOne({username: cuser.username}).then((doc) => {
   if(!doc){       
       res.render("homepage",{error: "You must be logged in"})
    } 
    
    else {
        
        coursesSchema.findOne({_id : cid}).then((purchased_course)=>{
            if(!purchased_course){
                    res.render("homepage",{error: "Course Doesn't Exist"})
                }
                else{
                    let purchased_arr = doc.purchased
                    let wishlist = doc.wishlist

                    if(wishlist.includes(purchased_course._id)){
                        let index = wishlist.indexOf(purchased_course._id);
                        wl1 = wishlist.splice(index, 1);
                        console.log(wl1)
                        userSchema.findByIdAndUpdate(doc._id,{wishlist:wishlist},{new:true}).then(()=>{
                        console.log("Removed From Wishlist")
                        })
                    }

                    if (purchased_arr.includes(purchased_course._id)){
                        console.log('Already Purchased The Course');
                        return res.redirect("homepage")
                      }

                   

                    purchased_arr.push(purchased_course._id)
                    userSchema.findByIdAndUpdate(doc._id, {purchased: purchased_arr},{new:true}).then((rslt) => {
                    console.log(purchased_arr)
                    return res.redirect("homepage")           
                })}

            })}

     
   })
})

app.use("/", userRoute);

app.post('/login', (req, res) => {
    
    const username = req.body.name;
    const password = req.body.password;
    const role = req.body.role;

    if (role == 'user') {
        userSchema.findOne({username: username}).then((usercollection) => {
            if (!usercollection) {
                console.log("Invalid Username")
            } else {
                
                if(usercollection.password === password) {
                
                req.session.isLoggedin = true;
                req.session.role = "user"
                req.session.user = usercollection;
                

                console.log(req.session)
                return req.session.save((err) => {
                console.log(err);
            
                return res.redirect("/");
                  });
            
                }
                else{
                    console.log("Wrong Password");
                    return res.render('./login.ejs', { error: 'Wrong Password.', user: null });

                }
            }

            res.render('./login.ejs', { error: 'Invalid Username.', user: null });
        })
    
    }

    else {

        teacherSchema.findOne({username: username}).then((teachercollection) => {
            if (!teachercollection) {
                console.log("Invalid Username")
            } else {
                
                if(teachercollection.password === password) {
                req.session.isLoggedin = true;
                req.session.role = "teacher" 
                req.session.user = teachercollection;
                
                console.log(req.session)
                return req.session.save((err) => {
                console.log(err);
                return res.redirect("/");
                  });
            
                }
                else{
                    console.log("Wrong Password");
                    return res.render('./login.ejs', { error: 'Wrong Password.', user: null });

                }
            }

            res.render('./login.ejs', { error: 'Invalid Username.', user: null });
        })
        

    }

});

app.get("/logout", (req, res) => {
    req.session.destroy();
    console.log('over')
    res.render("homepage")


});

const PORT = 8000;
app.listen(PORT, (req, res) => {
    console.log(`server is listening on PORT number ${PORT}`);
})


    
