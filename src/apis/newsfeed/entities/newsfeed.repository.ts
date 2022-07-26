import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsfeedEntity } from './newsfeed.entity';
import { CreateNewsfeedDto } from '../dto/createNewsfeed.dto';

@Injectable()
export class NewsfeedRepository {
    constructor(
        @InjectRepository(NewsfeedEntity)
        private readonly newsfeedRepository: Repository<NewsfeedEntity>,
    ) {}

    async getMyNewsfeeds(
        userID: string, //
    ): Promise<NewsfeedEntity[]> {
        return await this.newsfeedRepository
            .createQueryBuilder('feed')
            .select([
                'feed.userID',
                'news.id',
                'news.title',
                'news.contents',
                'news.createAt',
                'news.updateAt',
                'school.id',
                'school.name',
                'school.local',
                'school.createAt',
                'school.updateAt',
                'su.id',
                'su.nickName',
                'su.userClassID',
                'su.createAt',
            ])
            .leftJoin('feed.news', 'news')
            .leftJoin('news.school', 'school')
            .leftJoin('school.user', 'su')
            .where('feed.userID=:userID', { userID: userID })
            .orderBy('news.createAt', 'DESC')
            .getMany();
    }

    async bulkCreate(
        dto: CreateNewsfeedDto, //
    ): Promise<NewsfeedEntity[]> {
        return await Promise.all(
            dto.userIDs.map((userID) => {
                return this.newsfeedRepository.save({
                    userID: userID,
                    newsID: dto.newsID,
                });
            }),
        );
    }
}
