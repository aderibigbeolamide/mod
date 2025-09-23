import Utility from "../../../utils/utility.js";
import { DeleteWishlist, FetchUserWishlist, Wishlist } from "../interfaces/wishlist.interface.js";

export class CreateWishListDto implements Wishlist {
  userId: string;
  propertyId: string;

  constructor(obj?: CreateWishListDto) {
    Utility.pickFieldsFromObject<CreateWishListDto>(obj, this, {
      userId: null,
      propertyId: null,
    });
  }
}

export class FetchUserWishListDto implements FetchUserWishlist {
  userId: string;

  constructor(obj?: FetchUserWishListDto) {
    Utility.pickFieldsFromObject<FetchUserWishListDto>(obj, this, {
      userId: null,
    });
  }
}

export class DeleteWishListDto implements DeleteWishlist {
  id: string;
  userId: string;
  propertyId: string;

  constructor(obj?: DeleteWishListDto) {
    Utility.pickFieldsFromObject<DeleteWishListDto>(obj, this, {
      id: null,
      userId: null,
      propertyId: null,
    });
  }
}
