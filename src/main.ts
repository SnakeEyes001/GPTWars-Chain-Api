import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GiBeeChain API - Gestion des Ruches et Transactions Blockchain')
    .setDescription(
      "Cette API permet d'interagir avec la blockchain GiBeeChain, facilitant la gestion des ruches, l'achat de tokens GiBee (GBT), les investissements dans les ruches, et la collecte de miel. En utilisant cette API, les utilisateurs peuvent créer des ruches, investir dans des ruches existantes, acheter des tokens via l'ICO et récupérer leurs parts ou miel. L'API intègre des contrats intelligents pour assurer la sécurité et la transparence des transactions.",
    )
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
