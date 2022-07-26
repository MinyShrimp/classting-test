import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { SchoolModule } from '../school/school.module';

import { SubscribeEntity } from './entities/subscribe.entity';
import { SubscribeRepository } from './entities/subscribe.repository';

import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubscribeEntity, //
        ]),
        UserModule,
        SchoolModule,
    ],
    exports: [
        SubscribeRepository, //
    ],
    controllers: [
        SubscribeController, //
    ],
    providers: [
        SubscribeService,
        SubscribeRepository, //
    ],
})
export class SubscribeModule {}
