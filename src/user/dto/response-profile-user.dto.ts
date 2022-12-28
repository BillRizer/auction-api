import { ApiProperty } from "@nestjs/swagger";

export class ResponseProfileUser {
  @ApiProperty({
    description: 'id',
  })
  id: string;
  email: string;
  name: string;
  credit: number;
  createdAt: string;
  updatedAt: string;
}
