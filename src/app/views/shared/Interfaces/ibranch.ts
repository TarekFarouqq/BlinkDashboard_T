import { Inventory } from "../../../../models/inventory";

export interface Ibranch {
    branchId:      number;
    branchName:    string;
    branchAddress: string;
    phone:         string;
    inventories:   Inventory[];
}

