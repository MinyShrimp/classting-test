import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';
import { SchoolEntity } from '../../school/entities/school.entity';

@Entity({ name: 'subscribe' })
export class SubscribeEntity {
    @ManyToOne(
        () => SchoolEntity,
        { cascade: true, onDelete: 'CASCADE', primary: true }, //
    )
    school: SchoolEntity;

    @PrimaryColumn({ name: 'schoolId' })
    schoolID: string;

    @ManyToOne(
        () => UserEntity,
        { cascade: true, onDelete: 'CASCADE', primary: true }, //
    )
    user: UserEntity;

    @PrimaryColumn({ name: 'userId' })
    userID: string;

    @CreateDateColumn()
    createAt: Date;
}
