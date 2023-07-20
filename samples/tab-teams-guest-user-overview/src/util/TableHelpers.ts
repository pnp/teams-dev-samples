import { IColumn } from "@fluentui/react";

export const DefaultColumnn: (key: string) => IColumn = (key: string) => ({ key: key, fieldName: key, name: key, minWidth: 125, isResizable: true });