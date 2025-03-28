import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { CentersModule } from './modules/centers/centers.module';
import { SchedulesModule } from './modules/schedule/schedules.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CentersModule,
    SchedulesModule,
    OrdersModule,
    NewsModule,
  ],
  providers:[
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    },
  ]
})
export class AppModule {}
