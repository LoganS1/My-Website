var express 	= require("express"),
	app 		= express(),
	https		= require("https"),
	bodyParser	= require("body-parser");
	ejs     	= require("ejs"),
	crypto		= require("crypto");
	  
app.use(express.static('res'));
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.disable('x-powered-by');

app.get("/", (req, res)=>{
	console.log(req.url);
	res.render("pages/home");
})

app.get("/projects*", (req, res)=>{
	console.log(req.url);
	res.sendFile(__dirname + req.url, (err)=>{
		if(err){
			res.status(404).render("pages/404");
		}
	});
})

app.post("/update", (req, res)=>{
	console.log(req.url);
	const key = process.env.GithubSecretKey.toString();
	const payload = JSON.stringify(req.body);
	console.log(req.body);
	const mySignature = "sha1=" + crypto.createHmac("sha1", key).update(payload).digest("hex");
	const githubSignature = req.headers["x-hub-signature"];
	if(crypto.timingSafeEqual(Buffer.from(githubSignature), Buffer.from(mySignature))){
		console.log("Authenticated Github Webhook... Updating Server & Projects");
		res.status(202).send("Pulling updates from Github for Website & Projects!");
		require('child_process').exec(update.sh);
	}else{
		console.log("Invalid attempt to update server! + Signature given: " + githubSignature);
		res.status(401).send("Invalid Signature!");
	}
})

app.get("/*", (req, res)=>{
	console.log(req.url);
	res.status(404).render("pages/404");
})

app.listen(8080, function(){
	console.log("Server is running on port 8080");
});
