'use strict';
const mongodb = require('mongodb');
const mongoose = require('mongoose');

module.exports = function (app) {

  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })

  let replySchema = new mongoose.Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    created_on: {type: Date, required: true},
    reported: {type: Boolean, required: true}
  })

  let threadSchema = new mongoose.Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    board: {type: String, required: true},
    created_on: {type: Date, required: true},
    bumped_on: {type: Date, required: true},
    reported: {type: Boolean, required: true},
    replies: [replySchema]
  })

  let Reply = mongoose.model('Reply', replySchema);
  let Thread = mongoose.model("Thread", threadSchema);

  
  
  app.route('/api/threads/:board').post((req, res) => {
    let newThread = new Thread(req.body)
    if(!newThread.board || newThread.board === ''){
      newThread.board = req.params.board
    }
    newThread.bumped_on = new Date().toUTCString()
    newThread.created_on = new Date().toUTCString()
    newThread.reported = false
    newThread.replies = []
    newThread.save((error, savedThread) => {
      if(!error && savedThread){
        res.redirect('/b/' + savedThread.board)
      }
    })
  }).get((req, res) => {
    Thread.find({board: req.params.board})
      .sort({bumped_on: 'desc'})
      .limit(10)
      .select('-delete_password -reported')
      .lean()
      .exec((error, arrayOfThreads) => {
        if(!error && arrayOfThreads){
          arrayOfThreads.forEach((thread) => {
            thread.replies.sort((thread1, thread2) => {
              return thread2.created_on - thread1.created_on
            })
            thread.replies = thread.replies.slice(0, 3)
            thread.replies.forEach((reply) => {
              reply.delete_password = undefined
              reply.reported = undefined
            })
          })
          res.json(arrayOfThreads)
        }
      })
  }).delete((req, res) => {
    Thread.findById(req.body.thread_id, (error, threadToDelete) => {
      if(!error && threadToDelete){
        if(threadToDelete.delete_password === req.body.delete_password){
          Thread.findByIdAndRemove(req.body.thread_id, (error, deletedThread) => {
            if(!error && deletedThread){
              res.send('success')
            }
          })
        }else{
          res.send('incorrect password')
        }
      }
    })
  }).put((req, res) => {
    Thread.findByIdAndUpdate(
      req.body.thread_id,
      {reported: true},
      {new: true},
      (error, updatedThread) => {
        if(!error && updatedThread){
          res.send('reported')
        }
      }
    )
  })

  
  app.route('/api/replies/:board').post((req, res) => {
    let newReply = new Reply(req.body)
    newReply.created_on = new Date().toUTCString()
    newReply.reported = false
    Thread.findByIdAndUpdate(
      req.body.thread_id,
      {$push: {replies: newReply}, bumped_on: new Date().toUTCString()},
      {new: true, useFindAndModify: false},
      (error, updatedThread) => {
        if(!error && updatedThread){
          res.redirect('/b/' + updatedThread.board)
        }
      }
    )
  }).get((req, res) => {
    Thread.findById(req.query.thread_id)
      .select('-delete_password -reported')
      .lean()
      .exec((error, thread) => {
        if(!error && thread){
          thread.replies.sort((thread1, thread2) => {
            return thread2.created_on - thread1.created_on
          })
          thread.replies.forEach((reply) => {
            reply.delete_password = undefined
            reply.reported = undefined
          })
          res.json(thread)
        }
      })
  }).delete((req, res) => {
    Thread.findById(req.body.thread_id, (error, threadToDelete) => {
      if(!error && threadToDelete){
        let replyToDelete = threadToDelete.replies.id(req.body.reply_id)
        if(replyToDelete.delete_password === req.body.delete_password){
          replyToDelete.text = '[deleted]'
          threadToDelete.save((error, updatedThread) => {
            if(!error && updatedThread){
              res.send('success')
            }
          })
        }else{
          res.send('incorrect password')
        }
      }
    })
  }).put((req, res) => {
    Thread.findByIdAndUpdate(
      req.body.thread_id,
      {$set: {replies: {$elemMatch: {reply_id: req.body.reply_id}, reported: true}}},
      {new: true, useFindAndModify: false},
      (error, updatedThread) => {
        if(!error && updatedThread){
          res.send('reported')
        }
      }
    )
  })



  
};
