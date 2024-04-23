import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { ParseIntPipe } from "../common/pipes/parse-int.pipe";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";
import { Cat } from "./interfaces/cat.interface";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { FavoritesService } from "./favorites.service";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { UserDto } from "../users/dto/user.dto";
@UseGuards(RolesGuard)
@Controller("cats")
@UseInterceptors(TransformInterceptor)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly favoritesService: FavoritesService
  ) {}

  @Post()
  @Roles(["admin"])
  @HttpCode(HttpStatus.OK)
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Put(":id")
  @Roles(["admin"])
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id", new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto
  ) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(":id")
  @Roles(["admin"])
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", new ParseIntPipe()) id: number) {
    await this.catsService.delete(id);
    return;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param("id", new ParseIntPipe()) id: number) {
    return this.catsService.findOne(id);
  }

  @Post(":catId/favorite")
  async favorite(
    @Body() userDto: UserDto,
    @Param("catId", new ParseIntPipe()) catId: number
  ) {
    const { userId } = userDto;
    return this.favoritesService.add(userId, catId);
  }

  @Delete(":catId/favorite")
  async unFavorite(
    @Body() userDto: UserDto,
    @Param("catId", new ParseIntPipe()) catId: number
  ) {
    const { userId } = userDto;
    return this.favoritesService.remove(userId, catId);
  }
}
