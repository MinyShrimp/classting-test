///////////////////////////////////////////////////////////////////////////
// NestJS //
import { Module } from '@nestjs/common';

// TypeORM //
import { TypeOrmModule } from '@nestjs/typeorm';

// Config //
import { ConfigModule } from '@nestjs/config';

// Module //
import { SchoolModule } from './apis/school/school.module';
import { NewsfeedModule } from './apis/newsfeed/newsfeed.module';
import { SubscribeModule } from './apis/subscribe/subscribe.module';
import { SchoolNewsModule } from './apis/schoolNews/schoolNews.module';

import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { UserClassModule } from './apis/userClass/userClass.module';

///////////////////////////////////////////////////////////////////////////
@Module({
    imports: [
        ///////////////////////////////////////////////////////////////////////////
        // Enviroment Config //
        // 최상단에 위치
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),

        ///////////////////////////////////////////////////////////////////////////
        // TypeORM //
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: 3306,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [
                __dirname + '/apis/**/*.entity.*', //
            ],

            charset: 'utf8mb4',
            collaction: 'utf8mb4_general_ci',
            synchronize: true,
        }),

        ///////////////////////////////////////////////////////////////////////////
        // Module //
        SchoolModule,
        NewsfeedModule,
        SubscribeModule,
        SchoolNewsModule,

        AuthModule,
        UserModule,
        UserClassModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
