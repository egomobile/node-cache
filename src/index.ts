import { createServer as createHttpServer, json, query } from "@egomobile/http-server";

/**
 * Find a dataset by it's key
 *
 * @param {string} key the key
 * @returns {IDataSet | undefined} the dataset, if it's defined
 */
function findDataSetByKey(key: string) {
    return DATASETS.find(dataSet => {
        return dataSet.key === key;
    });
}

const DATASETS: IDataSet[] = [];

export interface IDataSet {
    key: string;
    value: string;
}

export const createServer = async (): Promise<void> => {
    try {
        const app = createHttpServer();

        app.put("/datasets", [json()], async (request, response) => {
            const body: IDataSet = request.body!;
            if (body.key && body.value) {
                const dataSet: IDataSet | undefined = findDataSetByKey(body.key);
                if (dataSet) {
                    const dataSetIndex = DATASETS.indexOf(dataSet);
                    DATASETS[dataSetIndex] = { "key": body.key, "value": body.value };
                }
                else {
                    DATASETS.push({ "key": body.key, "value": body.value });
                }
                response.writeHead(200);
            }
            else {
                const errorMsg: string = "Both fields, key and value need to be passed e.g.: { 'key': 'foo', 'value': 'bar' }";
                response.writeHead(400, {
                    "Content-Length": errorMsg.length
                });
                response.write(errorMsg);
            }
        });

        app.get("/datasets", query(), async (request, response) => {
            const key: any = request.query!.get("key");
            if (key) {
                const dataSet: IDataSet | undefined = findDataSetByKey(key);
                if (dataSet) {
                    response.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    response.write(JSON.stringify(dataSet));
                }
                else {
                    response.writeHead(404);
                }
            }
            else {
                response.writeHead(200, {
                    "Content-Type": "application/json"
                });
                response.write(JSON.stringify(DATASETS));
            }
        });

        await app.listen();
        console.log(`service running on port ${app.port} ...`);
    }
    catch (error) {
        console.log(error);
    }
};
