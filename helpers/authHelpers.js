import bcrypt from 'bcrypt';

export const hashPassword=async(password)=>{
try{
 const saltRounds=10;   //it is cost factor the time to calculate
 const hashedPassword=await bcrypt.hash(password,saltRounds);
 return hashedPassword;
}catch(error){

}
};

export const comparePassword=async(password,hashedPassword)=>{
 return bcrypt.compare(password,hashedPassword);
};