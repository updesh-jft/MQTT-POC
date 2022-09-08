import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "jftDatabase",
    password: "blu2@J0ck",
    database: "mqtt",
    entities: ["dist/*.js"],
    synchronize: true,
})