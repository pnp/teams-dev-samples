import axios from 'axios';

import qs from 'qs';
import { CatalogFilter } from '../models/catalogFilter';
import { LearnCatalog, Module } from '../models/learnCatalog';



export class LearnCatalogService {

    private static baseUrl = 'https://learn.microsoft.com/api/catalog';

    public static async queryCatalog(query: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/search?q=${query}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to query the Learn Catalog API');
        }
    }

    public static async getCatalogAsync(locale?: string, filters?: CatalogFilter): Promise<any> {
        let endpoint = this.baseUrl;
        let parameters: any = {};

        if (locale) {
            parameters.locale = locale;
        }
        if (filters) {
            if (filters.Types) {
                parameters.type = filters.Types.join(',');
            }
            if (filters.Uids && filters.Uids.length > 0) {
                parameters.uid = filters.Uids.join(',');
            }
            if (filters.LastModifiedExpression) {
                parameters.last_modified = filters.LastModifiedExpression;
            }
            if (filters.PopularityExpression) {
                parameters.popularity = filters.PopularityExpression;
            }
            if (filters.Levels && filters.Levels.length > 0) {
                parameters.level = filters.Levels.join(',');
            }
            if (filters.Roles && filters.Roles.length > 0) {
                parameters.role = filters.Roles.join(',');
            }
            if (filters.Products && filters.Products.length > 0) {
                parameters.product = filters.Products.join(',');
            }
            if (filters.Subjects && filters.Subjects.length > 0) {
                parameters.subject = filters.Subjects.join(',');
            }
        }

        if (Object.keys(parameters).length > 0) {
            endpoint += '?' + qs.stringify(parameters);
        }

        try {
            const response = await axios.get(endpoint);
            if (response.status !== 200) {
                throw new Error(`Failed to retrieve catalog information - ${response.status}: ${response.statusText}`);
            }

            const catalog = response.data;
            return catalog;
        } catch (error) {
            throw new Error('Failed to retrieve the Learn Catalog');
        }
    }

    public static async getModulesAsync(locale?: string, filter?: CatalogFilter): Promise<Module[]> {
        filter = filter || new CatalogFilter();
        filter.Types = ['modules'];
        const result = await this.getCatalogAsync(locale, filter);
        const modules:Module[] = result.modules;
        // const units = result.units;
        // const roles = result.roles;

        // for (const module of modules) {
        //     const moduleUnits: string[] = [];

        //     for (const unit of module.units) {
        //         const matchingUnit = units.find(u => u.Uid === unit);
        //         if (matchingUnit) {
        //             const unitTitle = matchingUnit.Title;
        //             moduleUnits.push(unitTitle);
        //         }
        //     }
        //     module.units = moduleUnits;

        //     const moduleRoles: string[] = [];
        //     for (const role of module.roles) {
        //         const matchingRole = roles.find(r => r.Id === role);
        //         if (matchingRole) {
        //             const roleName = matchingRole.Name;
        //             moduleRoles.push(roleName);
        //         }
        //     }
        //     module.roles = moduleRoles;
        // }

        return modules;
    }

   

}