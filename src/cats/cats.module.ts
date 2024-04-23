import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cat } from "src/database/entities/cat.entity";
import { FavoritesService } from "./favorites.service";
import { User } from "src/database/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cat, User])
  ],
  controllers: [CatsController],
  providers: [CatsService, FavoritesService],
})
export class CatsModule {}
