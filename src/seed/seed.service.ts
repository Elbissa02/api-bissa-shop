import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  async runData() {
    return `seed executed`;
  }
}
