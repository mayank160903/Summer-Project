const userSchema = require(__dirname + "/models/user.js");
const contactSchema = require(__dirname + "/models/contact.js");
// const bcrypt = require("bcryptjs");


const express = require('express');
const path = require('path');
const app = express();
const ejs = require("ejs");
const sqlite3 = require('sqlite3');
const mongoose = require("mongoose");
const session=require("express-session");


// const { collection } = require('./models/user');
// const { collection } = require('./models/contact');

const db_name = path.join(__dirname, "data", "Music.db");

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));


app.set("view engine", "ejs");
app.set('views','./views');

app.use(session({
    secret: "Key sign",
    resave: false,
    saveUninitialized: false,
    
}))
// app.get("/", (req, res) => {
//     res.render("home");
// })
app.get("/login", (req, res) => {
    
    if(req.session.isLoggedin == true){
    res.render("homepage", { error: null });
    }
    else{
        res.render("login", { error: null });
    
    }
})
// app.get("/footer", (req, res) => {
//     res.render("footer");
// })

app.get('/register', (req, res) => {

     
    if(req.session.isLoggedin == true){
    res.render("homepage", { error: null });
    }
    else{
        res.render("Register", { user: null, error: null });
    }
    // res.redirect("/login");

})



app.get('/forgotPassword', (req, res) => {
    res.render("forgotPassword");
})
app.get('/Privacy', (req, res) => {
    res.render('Privacy');
})


app.get('/wishlist', (req, res) => {
    res.render('wishlist');
})


app.get('/coursepage', (req, res) => { 
    res.render('coursepage');
})

app.get('/coursedescpage', (req, res) => {
    res.render('coursedescpage');
})



app.get('/instructor', (req, res) => {
    res.render('instructor');
})

app.get('/header', (req, res) => {
    res.render('header');
});

app.get('/spotlight', (req, res) => {
    res.render('Spotlight')
})

app.get("/", (req, res) => {
    // req.session.isLoggedin
    console.log(req.session)
    res.render("homepage");
})


app.get("/contactus", (req, res) => {
    req.session.destroy()
    res.render("contactus");
});

app.get("/aboutus", (req, res) => {
    res.render("aboutus");
});

app.get("/rockcoursedesc", (req, res) => {
    res.render("rockcoursedesc");
});

app.get("/beginnercoursedesc", (req, res) => {
    res.render("beginnercoursedesc");
});

app.get("/description", (req, res) => {
    res.render("description");
});

app.get("/faq", (req, res) => {
    res.render("faq");
});

app.get("/profile", (req, res) => {
    res.render("profile");
})

app.get("/instructor", (req, res) => {
    res.render("instructor");
})

app.get("/instructor2", (req, res) => {
    res.render("instructor2");
})


app.get("/freelessons", (req, res) => {
    res.render("freelessons");
})

app.get("/checkout", (req, res) => {
    res.render("checkout");
})

app.get("/catalogue", (req, res) => {
    res.render("catalogue");
})

app.get("/privacy", (req, res) => {
    res.render("privacy");
})





const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.log(err.message);
    }
    console.log("FSD Database Connected")
});

const structure = `CREATE TABLE IF NOT EXISTS users(
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL,
    role  VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT  NULL,
    confirm_password VARCHAR(50) NOT NULL
    )`;

const structure2 = `CREATE TABLE IF NOT EXISTS teachers(
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL,
    role  VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT  NULL,
    confirm_password VARCHAR(50) NOT NULL
    )`;





db.run(structure, err => {
    if (err) {
        return console.log(err.message);
    }
    console.log("Table Created")
})



db.run(structure2, err => {
    if (err) {
        return console.log(err);
    }

    console.log("Teacher Table was  created");
})


// const sinsert = `INSERT INTO users (full_name, username, email, role ,password ,confirm_password ) VALUES
// (1, 'Rizwan', 'rizwan321' , 'dgdhjdh@gmail.com' , 'user' , '1234567' , '1234567')`;

// const sinsertinteacher = `INSERT INTO teachers (uid , full_name, username, email, role ,password ,confirm_password ) VALUES
// (1, 'Mayank', 'mayank123' , 'mayank@gmail.com' , 'instructor' , '1234567' , '1234567')`;

// db.run(sinsert, err => {
//     if (err) {
//         return console.log(err.message);
//     }
//     console.log("Data 1 is inserted")
// });



// db.run(sinsertinteacher, err => {
//     if (err) {
//         return console.log(err.message);
//     }
//     console.log("Data  in teacher table is inserted")
// });





const mongodbURI="mongodb://127.0.0.1:27017/MastersOfMusic"
mongoose.connect(mongodbURI).then(()=>{
    console.log("MongoDB Connected!");
})
.catch((err)=>{
    console.log("Error connecting")
})

app.post('/submit',  (req, res,next) => {
    
    const full_name = req.body.full_name;
    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;
    const pno = req.body.phno
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
   

    if (role == 'user') {    
        userSchema.findOne({$or:[{email: email},{username:username}]}).then((usercollection) => {
            if (usercollection){
                if(usercollection.email === email){
                console.log("Email Already in use")
                return res.redirect('/register')}
                
                else 
                 console.log("Username already in use")
                 return res.redirect('/register')}


            else {
                const person = new userSchema({
                    username: username,
                    fullname: full_name,
                    email: email,
                    password: password,
                    phone: pno
                  });
                  person.save();
                  res.redirect("/login");
                 
            }
        }).catch((err) => {
                console.log(err);
              }); 
        // userSchema.findOne({username:username}).then((usercollection) => {
        //     if(usercollection){
        //         console.log("Username already in use")
        //         return res.redirect("/register");
        //     }}).catch((err) => {
        //         console.log(err);
        //       });
    }

    else {

        let sql2 = `SELECT * FROM teachers WHERE username = ?`;
        console.log(username);
        db.run(sql2, [username], (err, row) => {
            console.log(row);
            if (err) {
                console.log(err.message);
                return res.render('./Register.ejs', { user: row, error: err });
            } else if (row) {
                return res.render('./Register.ejs', { user: row, error: null });
            }

            const sql = 'INSERT INTO teachers (full_name, username, email, role ,password ,confirm_password) VALUES (?, ?, ? , ? ,? ,?)';
            db.run(sql, [full_name, username, email, role, password, confirm_password], (err) => {
                if (err) {
                    return res.render('./Register.ejs', { user: null, error: err });
                }
                console.log(`Message from teachers ${full_name} ${username} : ${email} ${role}  ${password} ${confirm_password}`);
                return res.render('./login.ejs', { user: null, error: null });
            });
        });

    }

});

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


    else if(role=='admin'){
        let sql = `SELECT * FROM teachers WHERE username = $username AND password = $password`;


        db.get(sql, { $username: username, $password: password }, (err, row) => {

            console.log(row);
            if (err) {
                // console.error(err.message);
                res.render('./login.ejs', { user: null, error: err })
            }

            console.log(row);
            if (row) {
                res.render('./admin.ejs', { user: row });
            } else {

                console.log(row);
                //console.log(name);
                console.log(password);
                res.render('./login.ejs', { error: 'Invalid email or password.', user: null });
                console.log(err);
            }
        });
    }
 


    else {
        let sql = `SELECT * FROM teachers WHERE username = $username AND password = $password`;


        db.get(sql, { $username: username, $password: password }, (err, row) => {

            console.log(row);
            if (err) {
                // console.error(err.message);
                res.render('./login.ejs', { user: null, error: err })
            }

            console.log(row);
            if (row) {
                res.render('./header.ejs', { user: row });
            } else {

                console.log(row);
                //console.log(name);
                console.log(password);
                res.render('./login.ejs', { error: 'Invalid email or password.', user: null });
                console.log(err);
            }
        });
    }

});


// app.get('/abc', (req, res) => {
//     const query = `SELECT * FROM users WHERE role = 'instructor'`;
//     db.all(query, (err, rows) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(rows); // output the result to the console
//             // pass the result to the EJS template
//             res.render('abc', { users: rows });
//         }
//     });
// })




// app.post("/connect", (req, res) => {
//     req.session.destroy();
//     res.render("homepage")
// });



const PORT = 8000;
app.listen(PORT, (req, res) => {
    console.log(`server is listening on PORT number ${PORT}`);
})

    app.post('/connect', (req, res) => {
        const fname = req.body.fname;
        const lname = req.body.lname;
        const email = req.body.email;
        const message = req.body.message;

        const contact = new contactSchema({
            firstname: fname,
            lastname: lname,
            email: email,
            message: message,
          });
          contact.save();  
         res.redirect('/contactus')
    
    })
    
