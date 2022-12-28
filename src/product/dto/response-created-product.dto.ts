import { ApiProperty } from "@nestjs/swagger";

export class ResponseCreatedProduct {
  @ApiProperty({
    description: 'id',
  })
  id: string;
  name: string;
  description: string;
  category: string;
  user_id: string;
  availableForAuction: boolean;
  sold: boolean;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}
