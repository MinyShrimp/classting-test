import { Injectable } from '@nestjs/common';
import { CreateNewsfeedDto } from './dto/createNewsfeed.dto';
import { NewsfeedEntity } from './entities/newsfeed.entity';
import { NewsfeedRepository } from './entities/newsfeed.repository';

@Injectable()
export class NewsfeedService {
    constructor(
        private readonly newsfeedRepository: NewsfeedRepository, //
    ) {}

    /**
     * 구독자들에게 새로운 게시글 전달하기
     */
    async giveNewsToSubs(
        dto: CreateNewsfeedDto, //
    ): Promise<NewsfeedEntity[]> {
        const entites = await this.newsfeedRepository.bulkCreate(dto);
        return entites;
    }
}
