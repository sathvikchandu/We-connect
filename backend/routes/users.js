const router= require("express").Router();
const User=require("../models/User");

router.put("/:id", async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if (req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json("Account updated");
        }
        catch(err){
            res.status(500).json(err);
        }

    }
    else{
        return res.status(403).json({msg:"Unauthorized"});
    }
})


router.delete("/:id", async(req,res)=>{
    if (req.body.userId===req.params.id || req.body.isAdmin){
        try{
            const user=await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted");
        }
        catch(err){
            res.status(500).json(err);
        }
    }
})


router.get("/:id",async(req,res)=>{
    try{
        const user =await User.findById(req.params.id); 
        const {password,updatedAt, ...other}=user._doc
        res.status(200).json(other);

    }catch(err){
        res.status(500).json(err);
    }
})

router.put("/:id/follow",async(req,res)=>{
    if (req.body.userId!==req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers: req.body.userId}});
                await currUser.updateOne({$push:{following: req.params.id}});
                res.status(200).json("Followed");
            }
            else{
                res.status(403).json("Already following");
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json('u cant follow yourself')
    }
})


//unfollow user
router.put("/:id/unfollow",async(req,res)=>{
    if (req.body.userId!==req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers: req.body.userId}});
                await currUser.updateOne({$pull:{following: req.params.id}});
                res.status(200).json("UnFollowed");
            }
            else{
                res.status(403).json("Already unfollowing");
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json('u cant unfollow yourself')
    }
})



module.exports=router;