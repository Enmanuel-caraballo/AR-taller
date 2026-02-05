import { Module } from '@nestjs/common';
import { EventosMoule } from './eventos/eventos.module';


@Module({
  imports: [EventosMoule],
})
export class AppModule { }
// https://www.youtube.com/watch?v=wsqcg5ZtUMM 25:12