import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export class PrivateZone extends pulumi.ComponentResource {
    public zoneId: pulumi.Output<string>;

    constructor(
        name: string,
        config: pulumi.Config,
        opts?: pulumi.ComponentResourceOptions,
    ) {
        super("custom:route53:PrivateZone", name, {}, opts);

        const zoneName = config.require("privateZoneName");

        const privateZone = new aws.route53.Zone(name, {
            name: zoneName,
            vpcs: [{ vpcId: aws.ec2.getVpc().then(vpc => vpc.id) }],
        }, { parent: this });

        this.zoneId = privateZone.zoneId;
    }
}

export class RdsCname extends pulumi.ComponentResource {
    constructor(
        name: string,
        args: {
            rdsInstanceId: pulumi.Input<string>,
            privateZoneId: pulumi.Input<string>,
            recordName: string,
        },
        opts?: pulumi.ComponentResourceOptions,
    ) {
        super("custom:route53:RdsCname", name, {}, opts);

        const rdsCname = new aws.route53.Record(name, {
            name: args.recordName,
            zoneId: args.privateZoneId,
            type: "CNAME",
            ttl: 300,
            records: [args.rdsInstanceId],
        }, { parent: this });
    }
}