export declare type Config = {
    database: {
        path: string;
    };
    discord: {
        channel_id: string;
        token: string;
    };
    sender: {
        seed: string;
    };
};
export declare const readConfig: (configPath?: string) => Config;
