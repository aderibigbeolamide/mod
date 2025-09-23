export interface Wishlist {
  userId: string;
  propertyId: string;
}

export interface FetchUserWishlist {
  userId: string;
}


export interface DeleteWishlist {
  id: string;
  userId: string;
  propertyId: string;
}
