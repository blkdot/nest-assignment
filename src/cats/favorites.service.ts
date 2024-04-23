import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cat } from "../database/entities/cat.entity";
import { Repository } from "typeorm";
import { User } from "../database/entities/user.entity";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>
  ) {}

  async add(userId: number, catId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites']
    });
    const cat = await this.catRepository.findOneBy({ id: catId });

    if (!user || !cat) {
      throw new NotFoundException('User or Cat not found');
    }

    if (user.favorites.find(favCat => favCat.id === catId)) {
      throw new BadRequestException('Favorite already exists');
    }

    user.favorites.push(cat);
    return this.userRepository.save(user);
  }

  async remove(userId: number, catId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.favorites = user.favorites.filter(favCat => favCat.id !== catId);
    return this.userRepository.save(user);
  }
}
