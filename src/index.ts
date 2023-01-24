import createServer, { json, params, query } from "@egomobile/http-server";

const values: Record<string, string> = {
    // key: 'val',
};

export interface IValue {
    key: string;
    value: string;
}

async function main() {
    const app = createServer();

    app.post("/keys", [json()], async (request, response) => {
        const body: IValue = request.body!;
        if (body.key && body.value) {
            values[body.key] = body.value;
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

    app.get(params("/keys/:key"), async (request, response) => {
        const key: any = request.params!.key;
        const value: any = values[key];
        if (key && value) {
            response.write(value);
        }
        else {
            response.writeHead(404);
        }
    });

    app.get("/keys", [query()], async (request, response) => {
        response.write(JSON.stringify(values));
    });

    await app.listen();
    console.log(`Server now running on port ${app.port} ...`);
}

main().catch(console.error);