const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const UserModel = require('../models/UserModel');
const getUserDetailsFromToken = require('../helper/getUserDetailsFromToken');
const {ConversationModel , MessageModel} = require('../models/ConversationModel');

const app = express();

/** socket connection */

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:process.env.FRONTENED_URL,
        credentials:true    
    }
});

// online user
const onlineUser = new Set();


io.on('connection', async(socket) => {
    console.log("connect User", socket.id);

    const token  = socket.handshake.auth.token;

    // current user details
    const user = await getUserDetailsFromToken(token);
    // console.log("user", user);

    // create room 
    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());

    io.emit('onlineUser', Array.from(onlineUser));

    socket.on('message-page',async(userId)=>{
        console.log("userId", userId);
        const userDetails = await UserModel.findById(userId).select("-password");
        console.log("user details ", userDetails)

        const payload = {
            _id: userDetails?._id,
            name : userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }

        socket.emit('message-user', payload);
    })

    // new message
    socket.on('new-message',async(data)=>{

        // check conversation is available both user
        let conversation = await ConversationModel.findOne({
            "$or":[
                { sender:data?.sender, receiver:data?.receiver},
                { sender:data?.receiver, receiver:data?.sender}
            ]
        });
        // console.log(" before conversation", conversation);


        // if conversatiobn not available then create new conversation

        if(!conversation){
            const createConversation = await ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver,
            });
            conversation = await createConversation.save();

        }

        // console.log("new message", data);
        // console.log(" after conversation", conversation);

        const message = new MessageModel({
            text : data.text,
            imageUrl : data.imageUrl,
            videoUrl : data.videoUrl,
            msgByUserId : data?.msgByUserId

        });

        const saveMessage = await message.save();

        const updateConversation = await ConversationModel.updateOne({_id : conversation?._id}, {
            $push:{
                messages: saveMessage?._id
            }
        })

        const getConversationMessage= await ConversationModel.findOne({
            "$or":[
                { sender:data?.sender, receiver:data?.receiver},
                { sender:data?.receiver, receiver:data?.sender}
            ]
        }).populate("messages").sort({updatedAt:-1});

        // console.log("get conversation", getConversation);

        io.to(data?.sender).emit('message', getConversationMessage.messages);
        io.to(data?.receiver).emit('message', getConversationMessage.messages);

    })
    // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id);
        console.log('user disconnected', socket.id);
    });
});



module.exports= {
    app,
    server
}


