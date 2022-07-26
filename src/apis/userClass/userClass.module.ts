import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClassEntity } from './entities/userClass.entity';
import { UserClassRepository } from './entities/userClass.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserClassEntity, //
        ]),
    ],
    exports: [
        UserClassRepository, //
    ],
    providers: [
        UserClassRepository, //
    ],
})
export class UserClassModule {}
