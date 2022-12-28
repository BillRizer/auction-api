import { ApiProperty } from "@nestjs/swagger";

export class ResponseUpdatedProduct {
  @ApiProperty({
    description: 'id',
  })
  id: string;
  name: string;
  description: string;
  category: string;
  availableForAuction: boolean;
  sold: boolean;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}
