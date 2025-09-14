import bycrpt from "bcryptjs";
export const generateHash = async (plainText :string)=>{
    return await bycrpt.hash(plainText,10);
} ;
export const   compareHash =async (plaintext: string, hash: string)=> {
    return await bycrpt.compare(plaintext, hash);
}