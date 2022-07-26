import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';

import { SchoolEntity } from './entities/school.entity';
import { SchoolRepository } from './entities/school.repository';

import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SchoolEntity, //
        ]),
        UserModule,
    ],
    exports: [
        SchoolService,
        SchoolRepository, //
    ],
    controllers: [
        SchoolController, //
    ],
    providers: [
        SchoolService,
        SchoolRepository, //
    ],
})
export class SchoolModule {}
