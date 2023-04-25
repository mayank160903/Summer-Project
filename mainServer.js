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
const user = require('./models/user.js');

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
    res.render("homepage", {error:null});
    }
    else{
        res.render("login", { error: null });
    
    }
})

app.get('/register', (req, res) => {

     
    if(req.session.isLoggedin == true){
    res.render("homepage", {user:req.session.user,auth:true});
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

app.get('/yourcourses', (req, res) => {
    if (req.session.isLoggedin == true){
        
         userSchema.findOne({username : req.session.user.username}).then( user =>  {
            
            user.populate({
                path: 'purchased',
                populate:{
                    path: 'teacher'

                }
            }).then(()=>{
                
            res.render('yourcourses',{user: user})
        })}
        )}
        
    

    else res.render("login", { error: null });
})

app.get('/instructor', async (req, res) => {
    if(req.session.isLoggedin == true){
        res.render("instructor",{user:req.session.user,auth:req.session.isLoggedin});
        }
        else{
            res.render("instructor",{auth:false})
        }
})


app.get("/add-to-wl/:course", (req, res) => {
    if(req.session.isLoggedin){
        
        courseid = req.params.course
        user2 = req.session.user
        
        wishlist = user2.wishlist
        ind = wishlist.indexOf(courseid)
        
        if(ind == -1){
            wishlist.push(courseid)
        }

        if(user2.purchased.indexOf(courseid) == -1){
        
        userSchema.findByIdAndUpdate(user2._id,{wishlist:wishlist},{new:true}).then(()=>{
                    console.log("Added To Wishlist")
                    res.redirect("/coursedescpage/"+courseid)
                }
            )}
        
        else{
            res.redirect("/coursedescpage/"+courseid)
        }
                
        

    }
    else{
        res.render('login', { error: null });
    }

})

app.get("/", (req, res) => {
    // req.session.isLoggedin
    if(req.session.isLoggedin == true){
        res.render("homepage",{user:req.session.user,auth:req.session.isLoggedin});
        }
        else{
            res.render("homepage",{auth:false})
        }
})

app.get("/contactus", (req, res) => {
    
    if(req.session.isLoggedin == true){
        res.render("contactus",{user:req.session.user,auth:req.session.isLoggedin});
        }
        else{
            res.render("contactus",{auth:false})
        }
});

app.get("/checkout", (req, res) => {
    if(req.session.isLoggedin == true){
    res.render("homepage",{user:req.session.user,auth:req.session.isLoggedin});
    }
    else
    res.render("login",{error: null})
})

app.get("/checkout/:coursename", (req, res) => {
    
    if(req.session.isLoggedin == true){
    user1 = req.session.user
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

                    userSchema.findOne({username : doc.username}).then(user =>  {
                        user.populate({
                            path: 'wishlist',
                            populate:{
                                path: 'teacher'
                            }
                        }).then(()=>{
                            
                        res.redirect('/wishlist')
                    })})
                    
                    
                })
                

                
       
            }

        })
    
})



app.get('/teacher-profile',(req, res) => {
    return res.render('teacher-profile');
})

app.get('/upload-course',(req, res) => {
    return res.render('upload-course');
})

app.get('/student-profile',(req, res) => {
    return res.render('student-profile');
})





app.get('/coursedescpage/:courseid', (req, res) => {

    
    courseid = req.params.courseid

    coursesSchema.findOne({_id: courseid}).then((course) => {
        if (!course) {
            res.render("/")  // 404 page sey replace krdena
        } else{
            course.populate('teacher').then((course)=>{
                console.log(course)
                if(req.session.isLoggedin){
                    res.render("coursedescpage",{user: req.session.user,course:course,auth:true})     
                }
                else{
                    res.render("coursedescpage",{user: null,course:course,auth:false})
                }
            }
        )}
    });
})

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

app.get("/catalogue", async (req, res) => {
    rock = []
    beginner = []
    await coursesSchema.find({}).then( async (course) => {
            
        populatedcourse = []
        for(let i = 0; i < course.length; i++){          
           await course[i].populate('teacher').then((ct)=>{
                populatedcourse.push(ct)
            })
        }

        
        rock = populatedcourse.filter(obj => {
            return obj.category === "rock"
          })
        shuffleArray(rock)

          
        beginner = populatedcourse.filter(obj => {
            return obj.category === "beginner"
          })
        shuffleArray(beginner)
        
        metal = populatedcourse.filter(obj => {
            return obj.category === "metal"
          })
        shuffleArray(metal)
        
        blues = populatedcourse.filter(obj => {
            return obj.category === "blues"
          })
          shuffleArray(blues)
        
        
        
        });

        if(req.session.isLoggedin == true){
        res.render("catalogue",{rock:rock,
                                beginner:beginner,
                                metal:metal,
                                blues:blues,
                                user:req.session.user,
                                auth:req.session.isLoggedin});
        }
        else{
            res.render("catalogue",{rock:rock,
                                    beginner:beginner,
                                    metal:metal,
                                    blues:blues,
                                    auth:false})
        }
    });

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
    res.redirect("/")


});

app.get('*', function(req, res){
    res.status(404).render('pagenotfound');
    
  });

const PORT = 8000;
app.listen(PORT, (req, res) => {
    console.log(`server is listening on PORT number ${PORT}`);
})
