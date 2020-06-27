import { find } from "lodash";
import { Request, Express } from "express";

import { IConfig, AppSetting, Environment } from "../config";

import { Api } from "./api";

import OktaJwtVerifier = require("@okta/jwt-verifier");
export class AuthenticationModule {
  public static isExcluded(request) {
    const config: IConfig = AppSetting.getConfig();

    const exclude = config.appSettings.excludedUrl;
    const result = find(exclude, (s) => {
      return request.url.startsWith(s);
    });
    // To exclude authentication for swagger in dev mode
    const reference = request.headers.referer ? request.headers.referer : "";
    const testing =
      AppSetting.Env === Environment.Development &&
      reference.includes("swagger");
    return testing || result;
  }

  public static authenticate(app: Express) {
    app.use(async (request, res, next) => {
      const config = AppSetting.getConfig();
      const auth = request.headers["x-access-token"] || request.query.token;
      if (request.url === "/") {
        return res.json({
          name: config.appConfig.name,
          version: config.appConfig.version,
        });
      } else if (AuthenticationModule.isExcluded(request)) {
        next();
      } else if (auth) {
        const result = await AuthenticationModule.validateOkta(
          config,
          auth,
          request
        );
        if (result.valid) {
          next();
        } else {
          return Api.unauthorized(res, res, result.error);
        }
      } else {
        return Api.unauthorized(request, res, "Invalid Token");
      }
    });
  }

  public static async validateOkta(
    config: IConfig,
    token,
    request: Request
  ): Promise<any> {
    const oktaJwtVerifier = new OktaJwtVerifier({
      issuer: config.oktaConfig.url,
      clientId: config.oktaConfig.clientId,
    });
    return new Promise((resolve) => {
      oktaJwtVerifier
        .verifyAccessToken(token)
        .then(
          (jwt) => {
            AuthenticationModule.setHeader(jwt.claims, request);
            resolve({ valid: true, error: "" });
          },
          (error) => {
            // Api.unauthorized(req, res, error);
            resolve({ valid: false, error });
          }
        )
        .catch((error) => {
          // Api.unauthorized(req, res, err);
          resolve({ valid: false, error: error });
        });
    });
  }

  private static setHeader(claims, request): void {
    if (!claims) {
      return;
    }
    const userid = claims ? claims.preferred_username : null;
    const email = claims ? claims.email : null;
    const name = claims ? claims.name : null;
    let id = userid.split("@");
    id = id ? id[0] : null;
    request.headers.user = id;
    request.headers["user-email"] = email;
    request.headers["user-name"] = name;
  }
}
