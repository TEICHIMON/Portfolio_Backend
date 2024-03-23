import { Injectable } from '@nestjs/common';
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

  async register(createUserDto: CreateAuthDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();

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
    };
  }
}
