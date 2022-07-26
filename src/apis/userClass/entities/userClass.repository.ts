import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserClassEntity } from './userClass.entity';

@Injectable()
export class UserClassRepository {
    constructor(
        @InjectRepository(UserClassEntity)
        private readonly userClassRepository: Repository<UserClassEntity>,
    ) {}

    async getOne(
        id: string = 'USER', //
    ): Promise<UserClassEntity> {
        return await this.userClassRepository.findOne({ id });
    }
}
