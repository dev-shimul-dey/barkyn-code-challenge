import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  courseUuid: string;
}
