export interface CreatePostDTO{
    content:string;
    attachment?:any[]
    mentions?:string[]
};
export interface AddReactionDTO{
    reaction:string;
} ;
export interface UpdatePostDTO{
    content:string;
    mentions?:string[];
};