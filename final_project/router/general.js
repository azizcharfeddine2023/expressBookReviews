const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const {password , username} = req.body
  if(!password || !username){
    return res.status(403).json({message: "user name and password are required"});
  }
  for(user in users){
    if (user.username === username){
        return res.status(403).json({message: "user name all ready exist"});
    }
  }
  users.push({password, username})
 return res.status(200).json({ message: "successful registration" })
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

const getAllBooks = async () => {
    try{
   const response =  await axios.get('http://localhost:5000/')
   return response.data
    }catch(err){
     throw err
   }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const bookToReturn = books[isbn]
  if(bookToReturn)
  return res.send(bookToReturn);
  else return res.status(404).json({message: "isbn not found"});
 });
 const getByIsbn = async (isbn) => {
    const response =  await axios.get(`http://localhost:5000/isbn/${isbn}`)
    return response
 }
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
   const author = req.params.author
   let booksByAuthor = {}
  for (book in books){
    
    const booksInfo = books[book]
    if(booksInfo?.author === author) {
      
        booksByAuthor = {...booksByAuthor, [book]:booksInfo}
    }
  }
  if(Object.values(booksByAuthor).length>0){
    return res.send(JSON.stringify(booksByAuthor,null,4));
  }
  return res.status(404).json({message: "author not found"});
});
const getByAuthor = async (author) => {
    try{
    const response =  await axios.get(`http://localhost:5000/author/${author}`)
    return response.data  
        }catch(err){
        throw err
      }
 }
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  for (book in books){
    const booksInfo = books[book]
    console.log('booksInfo?.title === title',booksInfo?.title , title)
    if(booksInfo?.title === title) {
        return res.send(booksInfo); 
    }
  }
  return res.status(404).json({message: "title not found"});
});
const getByTitle = async (title) => {
    try{
    const response =  await axios.get(`http://localhost:5000/title/${title}`)
    return response
    }catch(err){
    throw err
  }
 }
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const bookToReturn = books[isbn]
    if(bookToReturn)
    
    if(Object.values(bookToReturn.reviews).length > 0){
        return res.send(bookToReturn.reviews); 
    }else{
        return res.status(404).json({"message":"No reviews found for this book."} );   
    }
  
else return res.status(404).json({message: "isbn not found"});
});

module.exports.general = public_users;
