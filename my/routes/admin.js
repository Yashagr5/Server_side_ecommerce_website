var express = require('express');
var router = express.Router();
var pool=require("./pool")
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
/* GET home page. */
router.get('/login', function (req, res, next) {
    try{
        var admin=localStorage.getItem('ADMIN')
    //console.log(admin)
    if(admin==null){
        res.render('loginInterface', { message: '',status:false });
      //  res.redirect('/admin/login');
    }
    res.redirect('/admin/dashboard');
   //res.render('dashboard')
    } 
    catch(e)
    {
        res.redirect('/admin/login');
    }
   // res.render('loginInterface', { message: '',status:false });
});

router.get('/adminlogout', function (req, res, next) {
localStorage.removeItem('ADMIN');
    res.redirect('/admin/login')

});
router.post('/check_admin_login', function (req, res, next) {
pool.query("select * from admin where (emailaddress=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
if (error) {
    
    //console.log("Error",error)
    res.render('loginInterface', { message: 'Server Error',status:true });
}
else{
    //console.log('result',result[0].adminname)
    if(result.length==1)
    {
        localStorage.setItem('ADMIN',JSON.stringify(result[0]))
        
        res.redirect('/admin/dashboard')
       //res.render('dashboard',{admin:result[0]})
    }
    else{
        res.render('loginInterface', { message: 'Invalid Email/Mobileno/Password' ,status:true });
    }
}
})
});
router.get('/dashboard', function (req, res, next) {
var query="select count(*) as countcategory from category;select count(*) as countproducts,sum(stock) as countstock from Products;select count(*) as countbrands from brands;"
pool.query(query,function(error,result){
if (error) {
    //console.log(error)
    res.render('dashboard',{status:true,message:'Server Error',result:[]});
}
else{
   // console.log(result)
   var admin=JSON.parse(localStorage.getItem('ADMIN'))
   console.log('ADMIN',admin)
    res.render('dashboard',{admin:admin,status:true,message:'Server Error',result:result});

}
})
  

});
module.exports = router;