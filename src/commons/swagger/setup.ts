import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger 세팅
 */
export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('클래스팅 API Docs')
        .setDescription('클래스팅 사전 테스트 API Description')
        .setVersion('1.0.0')
        .addBasicAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'jwt',
                name: 'jwt',
                description: 'Access Token 입력',
                in: 'header',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
}
