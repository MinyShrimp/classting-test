import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolNewsEntity } from './entities/schoolNews.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SchoolNewsEntity, //
        ]),
    ],
    controllers: [],
    providers: [],
})
export class SchoolNewsModule {}
