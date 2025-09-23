import { Allow, IsEnum } from "class-validator";
import Utility from "../../../utils/utility.js";
import { SearchQueryDto } from "./search.dto.js";
import { KVPCategory, KVP } from "../interfaces/kvp.interface.js";
import { KVPSample } from "../samples/kvp.sample.js";

export class KVPUpdateDto<TValue> implements KVP<TValue> {
  @IsEnum(KVPCategory)
  key: KVPCategory;
  @Allow()
  value: TValue;

  constructor(obj?: KVPUpdateDto<TValue>) {
    Utility.pickFieldsFromObject<KVPUpdateDto<TValue>>(obj, this, KVPSample.update as any);
  }
}

export class KVPSearchQueryDto
  extends SearchQueryDto<KVPSearchQueryDto, KVP<any>>
  implements Partial<KVP<any>>
{
  @IsEnum(KVPCategory)
  public key: KVPCategory;

  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(obj?: Partial<KVPSearchQueryDto>) {
    super(obj);
    Object.assign(this, obj || {});
  }
}
