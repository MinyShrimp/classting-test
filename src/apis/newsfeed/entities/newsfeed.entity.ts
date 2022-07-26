import {
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/apis/user/entities/user.entity';
import { SchoolNewsEntity } from 'src/apis/schoolNews/entities/schoolNews.entity';

@Entity({ name: 'newsfeed' })
export class NewsfeedEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createAt: Date;

    @ManyToOne(
        () => UserEntity,
        { cascade: true, onDelete: 'CASCADE' }, //
    )
    user: UserEntity;

    @Column({ name: 'userId', nullable: true })
    userID: string;

    @ManyToOne(
        () => SchoolNewsEntity,
        { cascade: true, onDelete: 'CASCADE' }, //
    )
    news: SchoolNewsEntity;

    @Column({ name: 'newsId', nullable: true })
    newsID: string;
}
