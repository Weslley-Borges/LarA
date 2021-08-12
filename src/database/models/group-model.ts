import { Schema, model, Model, Document } from "mongoose"


export interface IGroup extends Document {
  group_id:Number
  group_welcome:String
  group_links:{text:String, url:String}[]
  group_tags:String[]
  group_members: {id:Number, messages_count:Number, last_update:Date}[]
  group_last_update:Date
}

const memberSchema = new Schema(
  {
    id: {type:Number, required:true, ref:"User"},
    messages_count: {types:Number, default:0},
    last_update: {type:Date, default:new Date()}
  },
  {_id: false, autoIndex: false}
)

const groupSchema = new Schema(
  {
    group_id: {type:Number, required:true},
    group_welcome: {type:String, default:"Seja bem-vindo(a), MEMBER!"},
    group_links: {type:Array, default:[{text:"Suporte do Bot", url:"https://t.me/laraSuporte"}]},
    group_tags: {type:Array, default:[], ref:"Tag"},
    group_members: [memberSchema],
    group_last_update: {type:Date, default:new Date()}
  },
  {_id: false, autoIndex: false }
)

export const Group: Model<IGroup> = model('Group', groupSchema)