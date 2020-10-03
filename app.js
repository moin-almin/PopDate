const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const ejs=require('ejs')
const app=express();
const port=process.env.PORT||8000;

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


// Connect app to mongoDB, change the url from that of local to cloud's mongoDB
mongoose.connect('mongodb://localhost:27017/usersDB',{useNewUrlParser:true,useUnifiedTopology:true})

// Schema

// const genreSchema=new mongoose.Schema({name:String})

const userSchema=new mongoose.Schema({
	username:String,
	email:String,
	password:String,
	gender:String,
	// genre:[genreSchema]
	genre:[String]
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
		if(user.length>=1){
			res.send(`Username already taken`);
		}
		// else{

		// }

	})

	User.find({email:req.body.email},function(err,user){
		if(err)
			res.send(err)
		if(user.length>=1){
			res.send(`Email already registered`);
		}
		// else{

		// }

	})

	const user=new User({
		username:req.body.username,
		email:req.body.email,
		password:req.body.password,
		gender:req.body.gender,
		genre:[]
	})
	// user.genre.push(req.body.genre)
	// user.genre=req.body.genre;
	// console.log(user)
	// console.log('now the req object')
	// console.log(req.body);
	// console.log(req.body.genre);

	for(let i=0;i<req.body.genre.length;i++){
		user.genre[i]=req.body.genre[i];
	}
	// console.log('now logging the user again')
	// console.log(user)
	user.save();
})

	// Root route

app.get('/',function(req,res){
	res.sendFile(__dirname+"/index.html")
})
	
	// Dynamic Route for user

app.get('/match/:user',function(req,res){
	// console.log(req.params);
	// res.send('hello '+req.params.user)

	let user;
	let match=[];
	let result=[];
	User.find({username:user},function(err,user){
		console.log(user.genre);
		// List of all the genre prefered by the user

	})
	if(user.gender=='Male'){
		User.find({gender:'Female'},function(err,match){
			console.log(match);
			// List of all females for our user
		})
	}
	else{
		User.find({gender:'Male'},function(err,match){
			console.log(match);
			// List of all males for our user
		})
	}

})


app.listen(port,function(){
	console.log(`Server is online on port ${port}`);
})