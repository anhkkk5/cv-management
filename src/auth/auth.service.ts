// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MailService } from 'src/mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingRegistration } from 'src/shared/schemas/pending-registration.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(PendingRegistration)
    private pendingRepo: Repository<PendingRegistration>,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(registerDto: RegisterAuthDto) {
    const existingUser = await this.usersService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const { email, password, name, role, confirmPassword } = registerDto;

    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const passwordHash = await bcrypt.hash(password, 10);

    const existingPending = await this.pendingRepo.findOne({ where: { email } });
    if (existingPending) {
      existingPending.name = name;
      existingPending.role = role;
      existingPending.passwordHash = passwordHash;
      existingPending.otpHash = otpHash;
      existingPending.otpExpiresAt = expiresAt;
      await this.pendingRepo.save(existingPending);
    } else {
      await this.pendingRepo.save(
        this.pendingRepo.create({
          email,
          name,
          role,
          passwordHash,
          otpHash,
          otpExpiresAt: expiresAt,
        }),
      );
    }

    await this.mailService.sendMail({
      to: email,
      subject: 'Mã OTP xác thực tài khoản',
      html: `<div><p>Mã OTP của bạn là: <b>${otp}</b></p><p>Mã có hiệu lực trong 10 phút.</p></div>`,
      text: `Ma OTP cua ban la: ${otp}. Ma co hieu luc trong 10 phut.`,
    });

    return {
      email,
      otp,
      otpExpiresAt: expiresAt,
      message: 'OTP sent',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      return { message: 'Email already verified' };
    }

    const pending = await this.pendingRepo.findOne({ where: { email: dto.email } });
    if (!pending) {
      throw new UnauthorizedException('OTP không hợp lệ');
    }

    if (new Date() > new Date(pending.otpExpiresAt)) {
      throw new UnauthorizedException('OTP đã hết hạn');
    }

    const ok = await bcrypt.compare(dto.otp, pending.otpHash);
    if (!ok) {
      throw new UnauthorizedException('OTP không đúng');
    }

    await this.usersService.create({
      email: pending.email,
      password: pending.passwordHash,
      confirmPassword: pending.passwordHash,
      name: pending.name,
      role: pending.role,
      isEmailVerified: true,
      emailOtpHash: null,
      emailOtpExpiresAt: null,
    } as any);

    await this.pendingRepo.delete({ email: pending.email });
    return { message: 'Verify OTP success' };
  }

  async resendOtp(dto: ResendOtpDto) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      return { message: 'Email already verified' };
    }

    const pending = await this.pendingRepo.findOne({ where: { email: dto.email } });
    if (!pending) {
      throw new UnauthorizedException('OTP không hợp lệ');
    }

    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pending.otpHash = otpHash;
    pending.otpExpiresAt = expiresAt;
    await this.pendingRepo.save(pending);

    await this.mailService.sendMail({
      to: pending.email,
      subject: 'Mã OTP xác thực tài khoản (gửi lại)',
      html: `<div><p>Mã OTP mới của bạn là: <b>${otp}</b></p><p>Mã có hiệu lực trong 10 phút.</p></div>`,
      text: `Ma OTP moi cua ban la: ${otp}. Ma co hieu luc trong 10 phut.`,
    });

    return {
      email: pending.email,
      otp,
      otpExpiresAt: expiresAt,
      cooldownSeconds: 60,
      message: 'OTP resent',
    };
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email chưa được xác thực');
    }

    const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
