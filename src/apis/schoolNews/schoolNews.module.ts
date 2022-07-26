import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolNewsEntity } from './entities/schoolNews.entity';
import { SchoolNewsRepository } from './entities/schoolNews.repository';

import { SchoolNewsService } from './schoolNews.service';
import { SchoolNewsController } from './schoolNews.controller';
import { SchoolModule } from '../school/school.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SchoolNewsEntity, //
        ]),
        UserModule,
        SchoolModule,
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
