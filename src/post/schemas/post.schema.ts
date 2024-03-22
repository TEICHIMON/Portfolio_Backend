import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop()
  des: string;

  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  username: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
