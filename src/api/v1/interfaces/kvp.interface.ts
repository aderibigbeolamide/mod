export interface KVP<TValue> {
  value: TValue;
  key: KVPCategory;
}

export const KVPCategory = {
  amenity: "AMENITY",
};
export type KVPCategory = (typeof KVPCategory)[keyof typeof KVPCategory];
