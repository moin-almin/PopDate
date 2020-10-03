const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const app=express();
const port=process.env.PORT||8000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


// Connect app to mongoDB, change the url from that of local to cloud's mongoDB
mongoose.connect('mongodb://localhost:27017/usersDB',{useNewUrlParser:true,useUnifiedTopology:true})

// Schema

// const genreSchema=new mongoose.Schema({name:String})

const userSchema=new mongoose.Schema({
	username:String,
	password:String,
	gender:String,
	// genre:[genreSchema]
	genre:[{name:String}]
})

// Model

const User=mongoose.model('User',userSchema)


// Routes

	// login

app.get('/login',function(req,res){
	res.sendFile(__dirname+'/login.htm')
})

app.post('/login',function(req,res){
	const username=req.body.username;
	const password=req.body.password;

	User.find({username:username},function(err,user){
		if(err)
			res.send(err)
		else{
			if(user.password===password){
				// res.send(`Welcome ${user}`)
				// res.redirect('/match/:user')
				res.redirect('/match/'+username);
			}
			else
				res.send('Password is incorrect')
		}
	})
})

	// signup

app.get('/signup',function(req,res){
	res.sendFile(__dirname+'/signup.htm')
})

app.post('/signup',function(req,res){

	User.find({username:req.body.username},function(err,user){
		if(err)
			res.send(err)
		if(user){
			res.send(`Username already taken`);
		}
		else{

		}

	})

	const user=new User({
		username:req.body.username,
		password:req.body.password,
		gender:req.body.gender

		// genre.push(req.body.genre)
	})
	user.genre.push(req.body.genre)
	user.save();
})

app.get('/match/:user'){
	console.log(req.params);

}


app.listen(port,function(){
	console.log(`Server is online on port ${port}`);
})