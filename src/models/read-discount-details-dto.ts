export interface ReadDiscountDetailsDTO {
    discountId:number;
    discountPercentage:number;
    discountFromDate:Date;
    discountEndDate:Date;
    readProductsDiscountDTOs:ReadProductsDiscountDTO[];
}
export interface ReadProductsDiscountDTO {
    discountId:number;
    productId:number;
    productName:string;
    subCategoryName:string;
    parentCategoryName:string;
    brandName:string;
    productPrice:number;
    discountAmount:number;
}