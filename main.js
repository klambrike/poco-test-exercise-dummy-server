var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var fs = require("fs");

app.set('port', (process.env.PORT || 8081));

app.use(bodyParser.json())

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.post('/addUser', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log('users: ' + data);
       
       // Mock server timeout so candidate would be forced to build request repeating mechanism into the app
       serverConnectionIsUp = Math.random() > 0.5;
       if(!serverConnectionIsUp) {
           res.status(408).json({ error: 'err.timeout' })
       }
       else {
           data = JSON.parse( data );
       
           if (req.body == null || req.body.email == null || req.body.password == null
                   || req.body.country == null || req.body.city == null || req.body.postal_code == null) {
               res.status(400).json({ error: 'err.missing.params' })
           }
           else if (req.body.password.length < 6) {
               res.status(400).json({ error: 'err.password.too.short' })
           }
           else {
               userExists = data[req.body.email]; 
            
               if (userExists != null) {
                   console.log('user exists');
                   res.status(400).json({ error: 'err.user.exists' })  
               }
               else {
                   console.log('user does not exist');
                   data[req.body.email] = req.body;
                        
                   fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function(err) {
                       if(err) {
                           console.log(err);
                       } else {
                           console.log("JSON saved");
                       }
                   });
                            
                   res.status(200).json({ data: 'success' })
               }
           }
       }
   });
})

app.post('/login', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       
       data = JSON.parse( data );
       
       if (req.body == null || req.body.email == null || req.body.password == null) {
           res.status(400).json({ error: 'err.missing.params' })
       }
       else {
           userExists = data[req.body.email];
           
           if (userExists == null ||  userExists.password != req.body.password) {
                res.status(400).json({ error: 'err.wrong.credentials' })  
           }
           else {
               res.status(200).json({ data: 'success' })
           }
       }
   });
})

var server = app.listen(app.get('port'), function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Poco test app is running on port', app.get('port'));

})