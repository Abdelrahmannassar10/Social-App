import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<T> {
constructor(protected model :Model<T>){}
async create(item:Partial<T>){
    const doc =new this.model(item);
    return await doc.save() ;
}
async exist(filter: RootFilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>){
    return this.model.findOne(filter ,projection ,options);
}
async getOne(filter: RootFilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>){
    return this.model.findOne(filter ,projection ,options).lean();
}
async getMany(filter: RootFilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>){
    return this.model.find(filter ,projection ,options).lean();
}
async update(filter, update, options?: MongooseUpdateQueryOptions<T>) {
  return this.model.findOneAndUpdate(filter, update, {
    new: true,
    ...options
  });
}
async delete(filter:RootFilterQuery<T>){
    return await this.model.deleteOne(filter);
};
async findOneAndDelete(filter: RootFilterQuery<T>){
   return await this.model.findOneAndDelete(filter); 
}
}
