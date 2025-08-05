// apps/api/src/auth/auth.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

 // Dentro da classe AuthService em auth.service.ts
  async register(dto: AuthDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await bcrypt.compare(dto.password, user.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(payload);

    return { access_token: accessToken };
  }
}