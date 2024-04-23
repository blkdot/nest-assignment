import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { JwtRefreshTokenStrategy } from "./strategy/jwt-refresh-token.strategy";
import { RefreshTokenIdsStorage } from "./storage/refresh-token-ids-storage";
import { LogInDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage
  ) {}

  async login(logInDto: LogInDto) {
    const user = await this.validateUser(logInDto.username, logInDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const payload = { sub: user.id, username: user.username, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "1d",
    });

    // Store the refresh token in redis
    await this.refreshTokenIdsStorage.insert(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateToken(token: string): Promise<any> {
    try {
      // Validate and decode the JWT token
      const decodedToken = await this.jwtService.verifyAsync(token);
      // Extract user information or permissions from the decoded token
      const user = decodedToken;
      return user;

    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ access_token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      await this.refreshTokenIdsStorage.validate(decoded.sub, refreshToken);
      const payload = { sub: decoded.sub, username: decoded.username, roles: decoded.roles };
      const accessToken = await this.jwtService.signAsync(payload);
      return { access_token: accessToken };
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async invalidateToken(accessToken: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);
      await this.refreshTokenIdsStorage.invalidate(decoded.sub);
    } catch (error) {
      throw new UnauthorizedException("Invalid access token");
    }
  }
}
