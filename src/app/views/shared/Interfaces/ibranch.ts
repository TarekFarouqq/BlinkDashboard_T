import { Inventory } from "../../../../models/inventory";

export interface Ibranch {
    branchId:      string;
    branchName:    string;
    branchAddress: string;
    phone:         string;
    inventories:   Inventory[];
}

