export interface Category {
    categoryId:number;
    categoryName:string;
    categoryDescription:string;
    categoryImage:string;
    subCategories:SubCategory[];
}
export interface SubCategory{
    categoryId:number;
    categoryName:string;
    categoryDescription:string;
    categoryImage:string;
}
