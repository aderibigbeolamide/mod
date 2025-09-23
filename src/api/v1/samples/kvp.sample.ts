import { KVPSearchQueryDto, KVPUpdateDto } from "../dtos/kvp.dto.js";
import { KVPCategory } from "../interfaces/kvp.interface.js";
import { SearchSample } from "./search.sample.js";

export namespace KVPSample {
  export const searchQuery: KVPSearchQueryDto = {
    key: KVPCategory.amenity,
    ...SearchSample.searchQuery,
    sortField: "key",
  };
  export const update: KVPUpdateDto<string[]> = {
    key: KVPCategory.amenity,
    value: ["Parking Space"],
  }; 
}
