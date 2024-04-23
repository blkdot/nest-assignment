import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "../users/dto/register-user.dto";
import { LogInDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    // Mock AuthService and UsersService
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            refreshAccessToken: jest.fn(),
            invalidateToken: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe("register", () => {
    it("should return the created user", async () => {
      const registerDto: RegisterUserDto = {
        username: "test",
        password: "test123",
      };
      const expectedResult: any = {
        id: 1,
        username: "testuser",
        roles: ["user"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, "create").mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);
      expect(result).toEqual(expectedResult);
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe("login", () => {
    it("should return authentication token", async () => {
      const logInDto: LogInDto = { username: "user-3", password: "12345" };
      const expectedResult: any = {
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoidXNlci0zIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MTM4NTYwOTgsImV4cCI6MTcxMzg1OTY5OH0.2EnCMBdCg1Ty-zdJSoo_SYLAlcoArdTvAZ5hSvTBnY0",
        refresh_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInVzZXJuYW1lIjoidXNlci0zIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MTM4NTYwOTgsImV4cCI6MTcxMzk0MjQ5OH0.LyJ20zNWrwxQ3WqdPhfmhKSz5mOpWmDz0vDTQNUU9s8",
      };
      jest.spyOn(authService, "login").mockResolvedValue(expectedResult);

      const result = await controller.login(logInDto);
      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(logInDto);
    });
  });
});
