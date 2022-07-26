import {
    Entity,
    ManyToOne,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/apis/user/entities/user.entity';
import { SchoolEntity } from 'src/apis/school/entities/school.entity';

@Entity({ name: 'subscribe' })
export class SubscribeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createAt: Date;

    @ManyToOne(
        () => SchoolEntity,
        { onDelete: 'SET NULL' }, //
    )
    school: SchoolEntity;

    @ManyToOne(
        () => UserEntity,
        { onDelete: 'SET NULL' }, //
    )
    user: UserEntity;
}
