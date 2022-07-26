import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { SchoolModule } from '../school/school.module';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { SubscribeModule } from '../subscribe/subscribe.module';

import { SchoolNewsEntity } from './entities/schoolNews.entity';
import { SchoolNewsRepository } from './entities/schoolNews.repository';

import { SchoolNewsService } from './schoolNews.service';
import { SchoolNewsController } from './schoolNews.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SchoolNewsEntity, //
        ]),
        UserModule,
        SchoolModule,
        NewsfeedModule,
        SubscribeModule,
    ],
    controllers: [
        SchoolNewsController, //
    ],
    providers: [
        SchoolNewsService,
        SchoolNewsRepository, //
    ],
})
export class SchoolNewsModule {}
