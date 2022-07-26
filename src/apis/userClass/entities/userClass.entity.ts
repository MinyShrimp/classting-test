import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 회원 등급 Entity
 *
 * | id        | description |
 * | --------- | ----------- |
 * | USER      | 일반 유저   |
 * | ADMIN     | 총 관리자   |
 */
@Entity({ name: 'user_class' })
export class UserClassEntity {
    @PrimaryColumn({ unique: true, nullable: false })
    id: string;

    @Column()
    description: string;
}
