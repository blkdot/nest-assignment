import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import { User } from "../database/entities/user.entity";

describe("UsersService", () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'testuser',
        password: 'password123',
      };

      const expectedResult: any = {
        id: 1,
        username: 'testuser',
        roles: ['user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(expectedResult);

      const result = await service.create(registerUserDto);

      expect(result).toEqual(expectedResult);
    });
  });
});
