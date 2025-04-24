import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async(req,res) => {
  try {
    const loggedInUserId = req.user._id;

    const filterUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password"); 
    // mongodb will find all the user expect the current logged in user 

    res.status(200).json(filterUsers);

  } catch (error) {
    console.log("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
}


export const getMessages = async(req,res) => {
  try {
    const {id:userToChatId} = req.params

    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: myId}
      ]
    })


    res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
}


export const sendMessage = async(req,res) => {
  try {
    // got the text and image from the req.body
    const {text, image} = req.body;
    // request id from req.params
    const {id: receiverId} = req.params;

    // got sender id from user._id from req
    const senderId = req.user._id;

    // check if user uploading image 
    let imageUrl
    if(image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // create the message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    // save it to DB
    await newMessage.save();

    // todo: realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    // send a response back
    res.status(200).json(newMessage);

  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
}