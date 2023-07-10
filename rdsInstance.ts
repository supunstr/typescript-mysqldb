import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export class RDSInstance extends pulumi.ComponentResource {
    public instance: aws.rds.Instance;

    constructor(
        name: string,
        config: pulumi.Config,
        opts?: pulumi.ComponentResourceOptions,
    ) {
        super("custom:RDSInstance:Instance", name, {}, opts);

        const allocatedStorage = config.getNumber("allocatedStorage") || 10;
        const dbName = config.require("dbName");
        const engine = config.require("engine");
        const engineVersion = config.require("engineVersion");
        const instanceClass = config.require("instanceClass");
        const parameterGroupName = config.require("parameterGroupName");
        const password = config.requireSecret("password");
        const skipFinalSnapshot = config.getBoolean("skipFinalSnapshot") || true;
        const username = config.require("username");

        this.instance = new aws.rds.Instance(name, {
            allocatedStorage,
            dbName,
            engine,
            engineVersion,
            instanceClass,
            parameterGroupName,
            password,
            skipFinalSnapshot,
            username,
        }, { parent: this });
    }
}