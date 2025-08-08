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

  async register(dto: AuthDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      const { password, ...result } = user;
      return result;
    } catch (error) {
        if (error.code === 'P2002') {
        throw new ForbiddenException('Um usuário com essas credenciais já existe.');
    }
    throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Credenciais incorretas.');
    }

    const pwMatches = await bcrypt.compare(dto.password, user.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credenciais incorretas.');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(payload);

    return { access_token: accessToken };
  }
}