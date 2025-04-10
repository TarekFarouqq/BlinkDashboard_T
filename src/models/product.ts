export interface Product {
    productId: number;
    productName: string;
    productDescription: string;
    productCreationDate: string;
    productModificationDate: string;
    productSupplyDate: string;
    productImages: string[];
    supplierName: string;
    brandName: string;
    categoryName: string;
    averageRate: number;
    countOfRates: number;
    isDeleted: boolean;
    productPrice:number;
    stockQuantity:number;
    discountPercentage:number;
    discountAmount:number;
}
