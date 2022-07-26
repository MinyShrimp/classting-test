import {
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';

import { UserClassEntity } from 'src/apis/userClass/entities/userClass.entity';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Length(2, 10)
    @Column()
    name: string;

    @Length(2, 8)
    @Column({ unique: true })
    nickName: string;

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column()
    pwd: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(
        () => UserClassEntity,
        { eager: true, onDelete: 'SET NULL' }, //
    )
    userClass: UserClassEntity;
}
