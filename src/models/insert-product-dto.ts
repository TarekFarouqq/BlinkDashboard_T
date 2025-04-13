import { InsertProductImagesDTO } from "./insert-product-images-dto";

export interface InsertProductDTO {
    productName:string;
    productDescription:string;
    supplierId:string;
    brandId:number;
    categoryId:number;
    productImages:InsertProductImagesDTO[];
}
