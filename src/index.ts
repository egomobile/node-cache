import createServer, { buffer, params, query } from "@egomobile/http-server";

const values: Record<string, string> = {
    // key: 'val',
};

export interface IValue {
    key: string;
    value: string;
}

async function main() {
    const app = createServer();

    app.post("/keys", [buffer()], async (request, response) => {
        const body: IValue = JSON.parse(request.body!.toString("utf8"));
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