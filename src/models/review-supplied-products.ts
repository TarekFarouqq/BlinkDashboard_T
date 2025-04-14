export interface ReviewSuppliedProducts {
    requestId:number;
    requestDate:Date;
    requestStatus:boolean | null;
    productName:string;
    productDescription:string;
    brandId:number;
    brandName:string;
    categoryId:number;
    categoryName:string;
    supplierId:string;
    supplierName:string;
    inventoryId:number;
    inventoryName:string;
    productPrice:number;
    productQuantity:number;
    productImages:ReviewProductImages[];


}
export interface ReviewProductImages{
    requestId:number;
    imageUrl:string;
}

