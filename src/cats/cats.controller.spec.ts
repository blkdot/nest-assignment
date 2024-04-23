import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { FavoritesService } from './favorites.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

describe('CatsController', () => {
  let controller: CatsController;
  let catsService: CatsService;
  let favoritesService: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: FavoritesService,
          useValue: {
            add: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    catsService = module.get<CatsService>(CatsService);
    favoritesService = module.get<FavoritesService>(FavoritesService);
  });

  describe('create()', () => {
    it('should create a cat', async () => {
      const catDto: CreateCatDto = { name: 'Tom', age: 5, breed: 'Siamese' };
      const expectedResult: any = { id: 1, ...catDto };
      jest.spyOn(catsService, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(catDto)).toEqual(expectedResult);
    });
  });

  describe('update()', () => {
    it('should update a cat', async () => {
      const catDto: UpdateCatDto = { name: 'Tom Updated', age: 6 };
      const catId = 1;
      const expectedResult: any = { id: catId, ...catDto };

      jest.spyOn(catsService, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(catId, catDto)).toEqual(expectedResult);
    });
  });

  describe('delete()', () => {
    it('should delete a cat', async () => {
      const catId = 1;
      jest.spyOn(catsService, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete(catId)).resolves.toBeUndefined();
    });
  });

  describe('findAll()', () => {
    it('should return an array of cats', async () => {
      const expectedResult: any = [{ id: 1, name: 'Tom', age: 5, breed: 'Siamese' }];
      jest.spyOn(catsService, 'findAll').mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
    });
  });

  describe('findOne()', () => {
    it('should return a single cat', async () => {
      const catId = 1;
      const expectedResult: any = { id: catId, name: 'Tom', age: 5, breed: 'Siamese' };
      jest.spyOn(catsService, 'findOne').mockResolvedValue(expectedResult);

      expect(await controller.findOne(catId)).toBe(expectedResult);
    });
  });
});
