import * as pulumi from "@pulumi/pulumi";
import { RDSInstance } from "./rdsInstance";
import { PrivateZone, RdsCname } from "./route53";

const config = new pulumi.Config();

const rdsInstance = new RDSInstance("rds-instance", config);

const privateZone = new PrivateZone("private-zone", config);

const cname = config.require("cname");
const rdsCname = new RdsCname("rds-cname", {
    rdsInstanceId: rdsInstance.instance.id,
    privateZoneId: privateZone.zoneId,
    recordName: cname,
});

export const instanceId = rdsInstance.instance.id;