import {
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';
import { SchoolEntity } from '../../school/entities/school.entity';

@Entity({ name: 'school_news' })
export class SchoolNewsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    contents: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(
        () => SchoolEntity,
        { cascade: true, onDelete: 'SET NULL' }, //
    )
    school: SchoolEntity;

    @Column({ name: 'schoolId', nullable: true })
    schoolID: string;

    @ManyToOne(
        () => UserEntity,
        { cascade: true, onDelete: 'SET NULL' }, //
    )
    user: UserEntity;

    @Column({ name: 'userId', nullable: true })
    userID: string;
}
