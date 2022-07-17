const router=require("express").Router()
const Post=require("../models/Post")
//create post
router.post('/',async (req,res)=>{
    const newpost=new Post(req.body)
    try{
        const savedpost=await newpost.save()
        res.status(200).json(savedpost)
    }catch{
        res.status(500).json(err)
    }
})
//update post
router.put("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if (post.userId===req.body.userId){
            await post.updateOne({$set: req.body})
            res.status(200).json("post updated")
        }else{
            res.status(403).json("You are not authorized to edit this post")
        }
    }catch(err){
        res.status(500).json(err)
    }

})


//delete post
router.delete("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if (post.userId===req.body.userId){
            await post.deleteOne()
            res.status(200).json("post deleted")
        }else{
            res.status(403).json("You are not authorized to delete this post")
        }
    }catch(err){
        res.status(500).json(err)
    }

})

//get post

router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch{
        res.status(500).json(err)
    }
})
//like post

router.put("/:id/like", async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("post liked")
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("post unliked")
        }
    }catch(err){
        res.status(500).json(err)
    }
}
)
//get all posts
//get timeline posts
router.get("/timeline/all",async (req,res)=>{
    
    try{
        const currUser=await User.findById(req.body.userId)
        const userPosts=await post.find({userId:currUser._id})
        const friendPosts=await Promise.all(
            currUser.following.map((friendId)=>{
                return Post.find({userId:friendId})
            })
        )
        res.json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports=router