import { Product } from "./product";

 
export interface Brand {
  brandId: number;
  brandName: string;
  brandDescription: string;
  brandWebSiteURL: string;
  brandImage: string;

 // products:Product[];
 // IsDeleted: boolean;
}