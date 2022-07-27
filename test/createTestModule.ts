import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from '../src/commons/filter/http-exception.filter';
import { AppTestModule } from '../src/app.test.module';

export const CreateTestModule = (() => {
    let app: INestApplication;

    return app
        ? () => Promise.resolve(app)
        : async () => {
              const moduleFixture: TestingModule =
                  await Test.createTestingModule({
                      imports: [AppTestModule],
                  }).compile();

              app = moduleFixture.createNestApplication();
              app.useGlobalPipes(new ValidationPipe());
              app.useGlobalFilters(new HttpExceptionFilter());
              await app.init();

              return app;
          };
})();

export const sendRequest = (app: INestApplication) => {
    return request(app.getHttpServer());
};
