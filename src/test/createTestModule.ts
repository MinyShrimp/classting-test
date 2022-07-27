import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from '../commons/filter/http-exception.filter';
import { AppTestModule } from '../app.test.module';

export const CreateTestModule = (() => {
    let app: INestApplication;
    let module: TestingModule;

    return app
        ? () => Promise.resolve({ app, module })
        : async () => {
              module = await Test.createTestingModule({
                  imports: [AppTestModule],
              }).compile();

              app = module.createNestApplication();
              app.useGlobalPipes(new ValidationPipe());
              app.useGlobalFilters(new HttpExceptionFilter());
              await app.init();

              return { app, module };
          };
})();

export const sendRequest = (app: INestApplication) => {
    return request(app.getHttpServer());
};
