var express 	= require("express"),
	app 		= express(),
	https		= require("https"),
	fs			= require("fs");
	bodyParser	= require("body-parser");
	ejs     	= require("ejs"),
	crypto		= require("crypto"),
	dotenv		= require("dotenv").config();
	  
app.use(express.static('res'));
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.disable('x-powered-by');

app.get("/", (req, res)=>{
	log(req.url)
	res.render("pages/home");
})

// app.get("/contact", (req, res)=>{
// 	log(req.url)
// 	res.render("pages/contact");
// })

// app.post("/contact", (req, res)=>{
// 	console.log("Contact Form Recieved!");
// 	console.log(req.body);
// 	res.redirect("/");
// })

let views = 1;
app.get("/viewCounter*", (req, res)=>{
	//If file exists get views from file
	if(fs.existsSync("viewCount.txt")){
		views = fs.readFileSync("viewCount.txt", "utf8");
	}
	views++;
	//Write the new value to the file
	fs.writeFile("viewCount.txt", views, (err)=>{
		if(err){
			console.log(err);
		}
	})
	//Send the view count in JSON
	res.setHeader("Content-Type", "application/text");
	res.status(200).send(views.toString());
})

app.post("/update", (req, res)=>{
	log(req.url)
	const key = process.env.GithubSecretKey;
	if(req.body != undefined && req.headers['user-agent'].includes('GitHub-Hookshot')){
		const payload = JSON.stringify(req.body);
		const mySignature = "sha1=" + crypto.createHmac("sha1", key).update(payload).digest("hex");
		const githubSignature = req.headers["x-hub-signature"];
		if(crypto.timingSafeEqual(Buffer.from(githubSignature), Buffer.from(mySignature))){
			console.log("Authenticated Github Webhook... Updating Server & Projects");
			res.status(202).send("Pulling updates from Github for Website & Projects!");
			const run = require("child_process").exec;
			run("sh update.sh", (err, stdout, stderr)=>{
				console.log(stdout);
				console.log(stderr);
				if(err != null){
					console.log("Update script run error: " + err);
				}
			})
		}else{
			console.log("Update route hit but invalid signature!")
			res.status(401).send("You do not have access to this route!");
		}
	}else{
		console.log("Update route hit but empty body or missing github header");
		res.status(401).send("You do not have access to this route!");
	}
	
})

app.get("/*", (req, res)=>{
	log(req.url)
	res.status(404).render("pages/404");
})

app.listen(8080, function(){
	console.log("Server is running on port 8080");
});

function log(msg){
	let date = new Date();
	let datestamp = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
	let timestamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	console.log(datestamp + " " + timestamp + " >> " + msg);
}