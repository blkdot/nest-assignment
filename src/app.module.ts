import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigurationModule } from './config/config.module';
import { User } from './database/entities/user.entity';
import { Cat } from './database/entities/cat.entity';
import { AuthMiddleware } from './common/middleware/auth.middleware';

@Module({
  imports: [
    CoreModule,
    ConfigurationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, Cat],
      synchronize: true,
    }),
    AuthModule, 
    UsersModule, 
    CatsModule, 
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('cats'); // Apply the middleware to the 'cats' controller
  }
}

