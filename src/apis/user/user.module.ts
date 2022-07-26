import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserClassModule } from '../userClass/userClass.module';

import { UserEntity } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity, //
        ]),
        UserClassModule,
    ],
    exports: [
        UserRepository, //
    ],
    controllers: [
        UserController, //
    ],
    providers: [
        UserService,
        UserRepository, //
    ],
})
export class UserModule {}
