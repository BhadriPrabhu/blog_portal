const AuthSchemaModel = require("../models/authSchema.js")

const authController = async (req,res) => {
    try{
        const { email, password } = req.body;
        const result = await AuthSchemaModel.findOne({ email })

        console.log(result)

        if(result){
            if(result.password === password){
                res.status(200).json(result);
            }else{
                res.status(404).json({ message: "Invalid Ceredentials"})
            }
        }else{
            res.status(404).json({ message: "User not found"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error."})
    }
    
        
}

module.exports = authController;