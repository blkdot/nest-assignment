import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";
import { AuthService } from "src/auth/auth.service";

// Authentication middleware
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new Error('Authorization header not found');
      }
      const token = authorizationHeader.split(' ')[1];
      // Verify credentials or decode JWT token
      const user = await this.authService.validateToken(token);
      // Attach authenticated user object to the request context
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
