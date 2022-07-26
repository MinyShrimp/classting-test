import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/apis/user/entities/user.entity';
import { SchoolNewsEntity } from 'src/apis/schoolNews/entities/schoolNews.entity';

@Entity({ name: 'school' })
export class SchoolEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    local: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(
        () => UserEntity,
        { cascade: true, onDelete: 'SET NULL' }, //
    )
    user: UserEntity;

    @Column({ name: 'userId', nullable: true })
    userID: string;

    @OneToMany(
        () => SchoolNewsEntity,
        (news) => news.school, //
    )
    news: SchoolNewsEntity[];
}
