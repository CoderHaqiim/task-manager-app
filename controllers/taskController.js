const Tasks = require('../models/task')

const getAllTasks = async(req,res)=>{
    try{
        const {userId} = req
        const tasks = await Tasks.find({userId}).select('_id title description status priority dueDate')

        if(!tasks) return res.status(404).json({message: "Couldn't retrieve any task"})
        res.status(200).json({message:'successfully retrieved tasks', tasks})
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const createNewTask = async(req,res)=>{
    try{
        const {body,userId} = req
        const newTask = new Tasks({...body, userId})
        const task = await newTask.save()
        const myTask = await Tasks.findById(task._id).select('title _id priority description status dueDate')
        res.status(201).json({message:"task succesfully created", myTask})
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const deleteSingleTask = async(req,res)=>{
    try{
        const {id} = req.params
        const {userId}  = req
        const result = await Tasks.findOneAndDelete({userId, _id:id})
    
        if (result) {
            res.status(200).json({message:'task sucessfully deleted'})
          } else {
            res.status(404).json({message: 'task not found'})
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

//deletes all tasks available
const deleteAllTasks = async(req, res)=>{
    try{
        const {userId} = req
        const result =  await Tasks.deleteMany({userId:userId})
        res.status(200).json({message:'all tasks deleted', count: result.count})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateProperty = async(req, res)=> {
    try{
        const {body, userId} = req
        const {id} = req.params
        const item = await Tasks.findOneAndUpdate({userId, _id: id},{$set:{...body}},{new: true})
        if(!item) return res.status(404).json({message:'task not found'})
        res.status(200).json({message:'update successful', item})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
}

 module.exports = {createNewTask, getAllTasks, deleteAllTasks, updateProperty, deleteSingleTask}