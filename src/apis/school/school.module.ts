import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity } from './entities/school.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SchoolEntity, //
        ]),
    ],
    controllers: [],
    providers: [],
})
export class SchoolModule {}
