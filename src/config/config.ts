export interface Config {
  port: number;
  NODE_ENV: string;
  info: any;
  basePath: string;
  databases: any;
  s3: S3Config;
}

export interface S3Config {
  bucketName?: string;
  path?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region: string;
}
