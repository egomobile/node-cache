// This file is part of the @egomobile/cache distribution.
// Copyright (c) Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// @egomobile/cache is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation, version 3.
//
// @egomobile/cache is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import { createServer as createHttpServer, json, query } from "@egomobile/http-server";

const DATASETS: IDataSets = {};

interface IDataSet {
    key: string;
    value: string;
}

interface IDataSets {
    [key: string]: any;
}

/**
 * Starts a caching server using a REST based API without authentication.
 *
 * @example import { startServer } from "@egomobile/cache"; startServer();
 */
export const startServer = async (): Promise<void> => {
    const app = createHttpServer();

    app.put("/datasets", [json()], async (request, response) => {
        const body: IDataSet = request.body!;
        if (typeof body.key === "string" && typeof body.value !== "undefined") {
            DATASETS[body.key] = body.value;
            response.writeHead(204);
        }
        else {
            const errorMsg: string = "Both fields, key and value need to be passed e.g.: { 'key': 'foo', 'value': 'bar' }";
            const errorMsgBuffer: Buffer = Buffer.from(errorMsg, "utf8");
            response.writeHead(400, {
                "Content-Type": "application/json; charset=UTF-8",
                "Content-Length": errorMsgBuffer.length
            });
            response.write(errorMsgBuffer);
        }
    });

    app.get("/datasets", query(), async (request, response) => {
        const key: any = request.query!.get("key");
        if (key) {
            if (DATASETS[key]) {
                const dataSetStr: string = JSON.stringify({ "key": key, "value": DATASETS[key] });
                const dataSetBuffer: Buffer = Buffer.from(dataSetStr, "utf8");
                response.writeHead(200, {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Content-Length": dataSetBuffer.length
                });
                response.write(dataSetBuffer);
            }
            else {
                response.writeHead(404);
            }
        }
        else {
            const dataSets: IDataSet[] = Object.entries(DATASETS).map(([key, value]) => {
                return { key, value };
            });
            const dataSetsStr: string = JSON.stringify(dataSets);
            const dataSetsBuffer: Buffer = Buffer.from(dataSetsStr, "utf8");
            response.writeHead(200, {
                "Content-Type": "application/json; charset=UTF-8",
                "Content-Length": dataSetsBuffer.length
            });
            response.write(dataSetsBuffer);
        }
    });

    await app.listen();
    console.log(`service running on port ${app.port} ...`);
};
