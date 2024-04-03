import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('api/posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const post = await this.postsService.findOne(username);
    if (!post) {
      throw new NotFoundException(`Post with ID ${username} not found`);
    }
    return post;
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
  //
  // @Put(':id')
  // async update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
  //   return this.postsService.update(id, updatePostDto);
  // }
  //
}
