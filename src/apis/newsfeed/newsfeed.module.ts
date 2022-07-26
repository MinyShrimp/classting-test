import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NewsfeedEntity } from './entities/newsfeed.entity';
import { NewsfeedRepository } from './entities/newsfeed.repository';

import { NewsfeedService } from './newsfeed.service';
import { NewsfeedController } from './newsfeed.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            NewsfeedEntity, //
        ]),
    ],
    exports: [
        NewsfeedService, //
    ],
    controllers: [
        NewsfeedController, //
    ],
    providers: [
        NewsfeedService,
        NewsfeedRepository, //
    ],
})
export class NewsfeedModule {}
