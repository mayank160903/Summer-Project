const teacherSchema = require('../models/teacher.js');
const userSchema = require('../models/user.js');
const courses = require('../models/courseModel.js');



exports.register = async (req, res, next) => {
    const full_name = req.body.full_name;
    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;
    const pno = req.body.phno

    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    
    try{
        if(role=='user'){
            const existingteacher = await teacherSchema.findOne({$or:[{email: email},{username:username}]})


            if(!existingteacher){
                const existinguser = await userSchema.findOne({$or:[{email: email},{username:username}]})
                if(!existinguser){
                    const person = new userSchema({
                        username: username,
                        fullname: full_name,
                        email: email,
                        password: password,
                        phone: pno
                      });
                      person.save();
                    return res.render('homepage');
                }
                else{

                    return res.render('register');
                }
            }
            else{
                return res.render('register');
            }





        }
        else{
            const existinguser = await userSchema.findOne({$or:[{email: email},{username:username}]});
            if(!existinguser){
                const existingteacher = teacherSchema.findOne({$or:[{email: email},{username:username}]});
                if(!existingteacher){
                    const teacher = new teacherSchema({
                        fullname: full_name,
                        username: username,
                        email: email,
                        password: password,
                        phone: pno
                      });
                      await teacher.save();
                      return res.render('homepage');
                }
                else{
                    return res.render('register');
                }
            }
            else{
                return res.render('register');
            }
        }




    }
    catch(error){
            console.log(`Error while registering The user ${error}`)
    }









}

exports.forgotPassword = async (req, res) => {
    return res.render('forgotPassword');
}

exports.Privacy = async (req, res) => {
    return res.render('Privacy');
}

exports.coursepage = async (req, res) => {
    return res.render('coursepage');
}

exports.coursedescpage = async (req, res) => {
    return res.render('coursedescpage');
}

exports.instructor = async (req, res) => {
    return res.render('instructor');
}

exports.header = async (req, res) => {
    return res.render('header');
}
exports.spotlight = async (req, res) => {
    return res.render('Spotlight');
}

exports.aboutus = async (req, res) => {
    return res.render('aboutus');
}

exports.rockcoursedesc = async (req, res) => {
    return res.render('rockcoursedesc');
}

exports.beginnercoursedesc = async (req, res) => {
    return res.render('beginnercoursedesc');
}


exports.description = async (req, res) => {
    return res.render('description');
}

exports.faq = async (req, res) => {
    return res.render('faq');
}


exports.profile = async (req, res) => {
    return res.render('profile');
}

exports.instructor2 = async (req, res) => {
    return res.render('instructor2');
}

exports.freelessons = async(req , res) =>{
    return res.render('freelessons');
}

exports.catalogue = async(req , res) =>{
    return res.render('catalogue');
}

exports.query = async(req , res) =>{
    try{
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
          await contact.save();  
          return res.render('homepage');
    }
    catch(error){
            console.log(`Error while query ${error}`)
    }
         
}

exports.uploadcourse = async(req , res) =>{

    console.log(req.body);
    const newcourse = await  new courses(req.body);
    await newcourse.save();




}

exports.homepage = async(req , res) =>{
    return res.render('homepage');
}

exports.purchasedhomepage = async(req , res) =>{
    rres.redirect("/homepage");
}




