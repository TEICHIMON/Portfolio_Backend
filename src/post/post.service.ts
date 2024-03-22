import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async findAll(): Promise<Post[]> {
    console.log('PostService:findAll');
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }
  //
  // async update(id: string, updatePostDto: CreatePostDto): Promise<Post> {
  //   return this.postModel
  //     .findByIdAndUpdate(id, updatePostDto, { new: true })
  //     .exec();
  // }
  //
  async remove(id: string): Promise<void> {
    await this.postModel.deleteOne({ id: id }).exec();
  }
}
