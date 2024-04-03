import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateAuthDto): Promise<string> {
    try {
      const { name, email, password } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        const createdUser = new this.userModel({
          name,
          email,
          password: hashedPassword,
        });

        createdUser.save();
        return 'success';
      }

      return 'existed';
    } catch (error) {
      console.error('数据库操作错误:', error);
      // 返回适当的错误响应
      throw new BadRequestException('发生了重复键错误');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      return null;
    }
    if (user && bcrypt.compare(password, user.password)) {
      const result = user.toObject();
      delete result.password;
      return result;
    }
    return null;
  }

  async login(user: Record<'email' | 'password' | 'id', string>) {
    const payload = { email: user.email, id: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      status: 'success',
      email: user.email,
    };
  }
}
