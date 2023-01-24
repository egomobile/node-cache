import createServer, { json, query } from "@egomobile/http-server";

const dataSets: IValue[] = [];

export interface IValue {
    key: string;
    value: string;
}

/**
 * Find a dataset by it's key and value
 *
 * @param {string} key the key
 * @param {string} value the value
 * @returns {IValue | undefined} the dataset, if it's defined
 */
function findDataSet(key: string, value: string): IValue | undefined {
    return dataSets.find(dataSet => {
        return dataSet.key === key && dataSet.value === value;
    });
}

/**
 * Find a dataset by it's key
 *
 * @param {string} key the key
 * @returns {IValue | undefined} the dataset, if it's defined
 */
function findDataSetByKey(key: string) {
    return dataSets.find(dataSet => {
        return dataSet.key === key;
    });
}

async function main() {
    const app = createServer();

    app.put("/datasets", [json()], async (request, response) => {
        const body: IValue = request.body!;
        if (body.key && body.value) {
            const dataSet: IValue | undefined = findDataSet(body.key, body.value);
            if (dataSet) {
                const dataSetIndex = dataSets.indexOf(dataSet);
                dataSets[dataSetIndex] = { "key": body.key, "value": body.value };
            }
            else {
                dataSets.push({ "key": body.key, "value": body.value });
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
            const dataSet: IValue | undefined = findDataSetByKey(key);
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
            response.write(JSON.stringify(dataSets));
        }
    });

    await app.listen();
    console.log(`service now running on port ${app.port} ...`);
}

main().catch(console.error);