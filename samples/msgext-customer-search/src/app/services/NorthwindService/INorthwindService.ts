import { ICustomer } from "../../model/ICustomer";

export interface INorthwindService {
    getCustomersByName(nameQuery: string): Promise<ICustomer[]>
}