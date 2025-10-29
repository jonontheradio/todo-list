import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new ResponseInterceptor());

  
  // Enable CORS
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('Todo List API')
    .setDescription('The Todo List API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Listen on all network interfaces
  await app.listen(3000, '0.0.0.0');
}
// ...existing code...
bootstrap();