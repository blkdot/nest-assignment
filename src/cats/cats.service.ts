import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cat } from "../database/entities/cat.entity";
import { Repository } from "typeorm";
import { CreateCatDto } from "./dto/create-cat.dto";
import { UpdateCatDto } from "./dto/update-cat.dto";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const { name, age, breed } = createCatDto;

    const cat = new Cat();
    cat.name = name;
    cat.age = age;
    cat.breed = breed;

    return this.catRepository.save(cat);
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    const { name, age, breed } = updateCatDto;

    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    if(name){
      cat.name = name;
    }
    if(age){
      cat.age = age;
    }
    if(breed){
      cat.breed = breed;
    }

    return this.catRepository.save(cat);
  }

  async delete(id: number): Promise<Cat> {
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return this.catRepository.remove(cat);
  }

  async findOne(id: number): Promise<Cat> {
    return this.catRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }
}
