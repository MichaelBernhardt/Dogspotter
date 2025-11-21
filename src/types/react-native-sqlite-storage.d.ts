declare module 'react-native-sqlite-storage' {
    export function openDatabase(params: any): Promise<SQLiteDatabase>;
    export function enablePromise(enable: boolean): void;

    export interface SQLiteDatabase {
        executeSql(sql: string, params?: any[]): Promise<[ResultSet]>;
        transaction(callback: (tx: Transaction) => Promise<void>): Promise<void>;
    }

    export interface Transaction {
        executeSql(sql: string, params?: any[]): Promise<[ResultSet]>;
    }

    export interface ResultSet {
        rows: {
            length: number;
            item(index: number): any;
        };
    }
}
