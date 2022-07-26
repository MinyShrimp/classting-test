import {
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserClassEntity } from 'src/apis/userClass/entities/userClass.entity';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    nickName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    pwd: string;

    @Column({ default: false })
    isLogin: boolean;

    @Column({ nullable: true })
    loginAt: Date;

    @Column({ nullable: true })
    logoutAt: Date;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(
        () => UserClassEntity,
        { onDelete: 'SET NULL' }, //
    )
    userClass: UserClassEntity;

    @Column({ name: 'userClassId', nullable: true })
    userClassID: string;
}
