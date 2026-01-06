import mongoose,{Schema} from "mongoose";  
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new Schema(
    {
        Username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        Email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,//cloudinary url
            required:true,
        },
        coverImage:{
            type:String,//cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:'Video'
            }
        ],
        password:{
            type:String,
            required:[true,'Password is required'],
        },
        refreshToken:{
            type:String,
        }
    },{
        timestamps:true
    }
)
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next(); 
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function(){
    const payload={
        _id:this._id,
        email:this.Email,
        username:this.Username,
        fullname:this.fullname
    };
    const options={ 
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    };
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,options);
}
UserSchema.methods.generateRefreshToken=function(){
    const payload={
        userId:this._id,
        username:this.Username,
    };
    const options={ 
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    };
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,options);
}
export const User=mongoose.model('User',userSchema);