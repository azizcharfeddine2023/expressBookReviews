const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
let validusers = users.find((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid login" });
    }
  
    const accessToken = jwt.sign(
      { username },          // ✅ SAFE PAYLOAD
      "access",
      { expiresIn: "1h" }
    );
  
    req.session.authorization = {
      accessToken,
      username
    };
  
    return res.status(200).json({ message: "Login successful" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const review = req.query.review
  const {username} = req.user
  // get thet book
  const bookInfo = books[isbn]
  if(!bookInfo){
    return res.status(404).json({message: "book not found"});
  }
  // look at reviews key if this user all ready 
  const alreadtReviewed = bookInfo.reviews[username]
  if(alreadtReviewed){
    bookInfo.reviews[username].review=review
    return res.send(bookInfo);
  }else{
    bookInfo.reviews[username]={review:review}
    return res.send(bookInfo);
  }
  
});

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
    const {username} = req.user
    // get thet book
    const bookInfo = books[isbn]
    if(!bookInfo){
      return res.status(404).json({message: "book not found"});
    }
    // look at reviews key if this user all ready 
    const alreadtReviewed = bookInfo.reviews[username]
    if(alreadtReviewed){
        delete bookInfo.reviews[username]
        return res.status(200).json({message: "you review has been deleted successfully"});
    }
    return res.status(500).json({message: "Some tging wen wrong"});
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
