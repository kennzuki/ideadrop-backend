import express from 'express';
const router=express.Router();

router.get('/',(req,res)=>{
    const ideas=[
        {
            id:1,
            title:"title1",
            description:"description1"
        },
        {
            id:2,
            title:"title2",
            description:"description2"
        },
        {
            id:3,
            title:"title3",
            description:"description3"
        }
    ]
    res.status(400)
    throw new Error("error")
})

router.post('/',(req,res)=>{
    const {title}=req.body
    
    res.send(title)
})


export default router