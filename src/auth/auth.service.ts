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
      console.log(createUserDto, 'createUserDto');
      const { name, email, password } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.findOne({ email: email }).exec();
      console.log(user, 'user');
      if (!user) {
        const createdUser = new this.userModel({
          name,
          email,
          password: hashedPassword,
        });

        const result = createdUser.save();
        console.log(result, 'result');
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
    console.log('user', user);
    if (!user) {
      console.log('EXECUTE');
      return null;
    }
    console.log(user, email, password, bcrypt.compare(password, user.password));
    if (user && bcrypt.compare(password, user.password)) {
      const result = user.toObject();
      delete result.password;
      return result;
    }
    return null;
  }

  async login(user: Record<'email' | 'password' | 'id', string>) {
    const payload = { email: user.email, id: user.id };
    console.log('payload', payload);
    const access_token = await this.jwtService.signAsync(payload);
    console.log('access_token', access_token);
    return {
      access_token,
      status: 'success',
      email: user.email,
    };
  }
}
