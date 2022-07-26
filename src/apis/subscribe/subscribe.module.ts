import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribeEntity } from './entities/subscribe.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubscribeEntity, //
        ]),
    ],
    controllers: [],
    providers: [],
})
export class SubscribeModule {}
