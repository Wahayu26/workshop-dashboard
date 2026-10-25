import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password tidak sesuai');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun Anda telah dinonaktifkan. Hubungi Owner/Admin.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password tidak sesuai');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existing) {
      throw new ConflictException('Email sudah terdaftar di sistem');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const assignedRole = registerDto.role || Role.CUSTOMER;

    const result = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: registerDto.email,
          passwordHash: hashedPassword,
          fullName: registerDto.fullName,
          phone: registerDto.phone,
          role: assignedRole,
        },
      });

      // If registered as customer, auto-create customer profile
      if (assignedRole === Role.CUSTOMER) {
        await tx.customer.create({
          data: {
            userId: newUser.id,
            fullName: newUser.fullName,
            phone: newUser.phone || '',
            email: newUser.email,
          },
        });
      }

      return newUser;
    });

    const tokens = await this.generateTokens(result.id, result.email, result.role);

    return {
      user: {
        id: result.id,
        email: result.email,
        fullName: result.fullName,
        phone: result.phone,
        role: result.role,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token tidak ditemukan');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'bengkelku_jwt_super_refresh_secret_2026_xyz456!',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Pengguna tidak valid');
      }

      // Check active tokens in DB
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: {
          userId: user.id,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
      });

      let validTokenRecord = null;
      for (const st of storedTokens) {
        const isMatching = await bcrypt.compare(refreshToken, st.tokenHash);
        if (isMatching) {
          validTokenRecord = st;
          break;
        }
      }

      if (!validTokenRecord) {
        throw new UnauthorizedException('Refresh token telah dicabut atau kadaluarsa');
      }

      // Invalidate old token (Rotation)
      await this.prisma.refreshToken.update({
        where: { id: validTokenRecord.id },
        data: { revoked: true },
      });

      // Generate new tokens
      const newTokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
        },
        ...newTokens,
      };
    } catch (err) {
      throw new UnauthorizedException('Refresh token tidak valid atau kadaluarsa');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const storedTokens = await this.prisma.refreshToken.findMany({
        where: { userId, revoked: false },
      });
      for (const st of storedTokens) {
        const match = await bcrypt.compare(refreshToken, st.tokenHash);
        if (match) {
          await this.prisma.refreshToken.update({
            where: { id: st.id },
            data: { revoked: true },
          });
          break;
        }
      }
    } else {
      // Revoke all for safety
      await this.prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      });
    }

    return { message: 'Berhasil logout dari sistem BengkelKu' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            vehicles: {
              select: {
                id: true,
                plateNumber: true,
                vehicleType: true,
                brand: true,
                model: true,
              },
            },
          },
        },
        mechanic: {
          select: {
            id: true,
            employeeId: true,
            specialization: true,
            status: true,
            rating: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan');
    }

    return user;
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    const accessSecret =
      process.env.JWT_ACCESS_SECRET ||
      'bengkelku_jwt_super_access_secret_2026_xyz123!';
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET ||
      'bengkelku_jwt_super_refresh_secret_2026_xyz456!';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    // Store hashed refresh token in database for rotation & revocation tracking
    const tokenHash = await bcrypt.hash(refreshToken, 8);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
