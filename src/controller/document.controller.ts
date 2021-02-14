import { Router, Request, Response } from "express";
import * as multer from "multer";
import { Api } from "../helpers";
import * as aws from "aws-sdk";
import { ConfigManager } from "../config/config.manager";
export class DocumentController {
  public route = "/file";
  public router: Router = Router();
  private config;
  private s3: aws.S3;
  constructor() {
    this.config = new ConfigManager().config;
    this.s3 = new aws.S3(this.config.s3);

    this.router.post("/", this.upload);
    this.router.get("/", this.download);
    this.router.delete("/", this.delete);
    this.router.get("/versions", this.getVersions);
  }

  private upload = (request: Request, response: Response) => {
    const upload = multer().single("file");
    upload(request, response, (error) => {
      if (error) {
        return Api.serverError(request, response, error);
      } else {
        const requestObject: aws.S3.Types.PutObjectRequest = {
          Bucket: this.config.s3.bucketName,
          Key: `data/${request.file.originalname}`,
          Metadata: request.body,
          Body: request.file.buffer,
          ContentType: request.file.mimetype,
        };
        this.s3.upload(requestObject, (err, data) => {
          if (err) {
            console.log(err);
            return Api.serverError(request, response, err);
          }
          Api.ok(request, response, data);
        });
      }
    });
  };

  private download = (request: Request, response: Response) => {
    const param: aws.S3.GetObjectRequest = {
      Bucket: this.config.s3.bucketName,
      Key: `data/${request.query.key}`,
      VersionId: request.query.version ? `${request.query.version}` : null,
    };
    this.s3.getObject(param, (err, data) => {
      if (err) {
        return Api.serverError(request, response, err);
      }
      Api.ok(request, response, data.Body.toString());
      // response.setHeader(
      //   "Content-disposition",
      //   `attachment; filename= ${request.query.key}`
      // );
      // response.setHeader("Content-Type", data.ContentType);
      // response.send(data.Body);
      // response.end();
    });
  };

  private getVersions = (request: Request, response: Response) => {
    const param: aws.S3.ListObjectVersionsRequest = {
      Bucket: this.config.s3.bucketName,
      Prefix: `data/${request.query.key}`,
    };

    this.s3.listObjectVersions(param, (err, data) => {
      if (err) {
        return Api.serverError(request, response, err);
      }
      Api.ok(request, response, data);
    });
  };

  private delete = (request: Request, response: Response) => {
    const param: aws.S3.DeleteObjectRequest = {
      Bucket: this.config.s3.bucketName,
      Key: `data/${request.query.key}`,
      VersionId: request.query.version ? `${request.query.version}` : null,
    };
    this.s3.deleteObject(param, (err, data) => {
      if (err) {
        return Api.serverError(request, response, err);
      }
      return Api.ok(request, response, data);
    });
  };
}
