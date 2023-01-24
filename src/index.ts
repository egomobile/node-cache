import createServer, { json, params, query, validateWithSwagger } from "@egomobile/http-server";
import type { OpenAPIV3.OperationObject } from 'openapi-types';

const values: Record<string, string> = {
    // key: 'val',
};

export interface IValue {
    key: string;
    value: string;
}

const postKeys: OpenAPIV3.OperationObject = {
    "parameters": [
        {
            in: 'body',
            name: 'key',
            required: true
        }
    ],
    "responses": {}
}

async function main() {
    const app = createServer();

    app.post("/keys", [json(64), validateWithSwagger(postKeys)], async (request, response) => {
        const body: IValue = request.body!;
        if (body.key && body.value) {
            values[body.key] = body.value;
            response.writeHead(200);
        }
        else {
            response.writeHead(400);
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