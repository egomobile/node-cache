import createServer, { json, query } from "@egomobile/http-server";

const dataSets: Record<string, string> = {
    // key: 'val',
};

export interface IValue {
    key: string;
    value: string;
}

async function main() {
    const app = createServer();

    app.put("/datasets", [json()], async (request, response) => {
        const body: IValue = request.body!;
        if (body.key && body.value) {
            dataSets[body.key] = body.value;
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
            const value: any = dataSets[key];
            if (value) {
                response.writeHead(200, {
                    "Content-Type": "application/json"
                });
                response.write(JSON.stringify({
                    "key": key,
                    "value": value
                }));
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