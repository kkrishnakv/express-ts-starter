import { find } from 'lodash';
import { IConfig, AppSetting, Environment } from '../config';
import { Api } from './api';
import { Router, Request, Response, NextFunction, Express } from 'express';
const OktaJwtVerifier = require('@okta/jwt-verifier');
const jwtWeb = require('jsonwebtoken');
export class AuthenticationModule {

    public static isExcluded(req, res) {

        let config: IConfig = AppSetting.getConfig();

        let exclude = config.appSettings['excludedUrl'];
        let result = find(exclude, (s) => {

            return req.url.startsWith(s);
        });
        // To exclude authentication for swagger in dev mode
        let ref = req.headers['referer'] ? req.headers['referer'] : '';
        let testing = AppSetting.Env === Environment.Dev && ref.indexOf('swagger') !== -1;
        return testing || result;
    }

    public static authenticate(app: Express) {
        let authenticModule = new AuthenticationModule();
        app.use(async (req, res, next) => {
            let config = AppSetting.getConfig();
            let auth = req.headers['x-access-token'] || req.query['token'];
            if (req.url === '/') {
                return res.json({
                    name: config.appConfig.name,
                    version: config.appConfig.version,
                });
            } else if (AuthenticationModule.isExcluded(req, res)) {
                next();
            } else {
                if (auth) {
                    let valid = await AuthenticationModule.validateOkta(config, auth, req, res, next);
                    if (valid) {
                        next();
                    } else {
                        return Api.unauthorized(res, res, 'Invalid Token');
                    }
                } else {
                    return Api.unauthorized(req, res, 'Invalid Token');
                }
            }
        });

    }


    public static async validateOkta(config: IConfig, token, req: Request, res: Response, next: NextFunction) {
        const oktaJwtVerifier = new OktaJwtVerifier({
            issuer: config.oktaConfig.url,
            clientId: config.oktaConfig.clientId
        });
        return new Promise((resolve, reject) => {
            oktaJwtVerifier.verifyAccessToken(token)
                .then(jwt => {
                    AuthenticationModule.setHeader(jwt.claims, req);
                    resolve(true);
                }, (error) => {
                    // Api.unauthorized(req, res, error);
                    reject(false);
                })
                .catch(err => {
                    // Api.unauthorized(req, res, err);
                    reject(false);
                });
        });

    }


    private static setHeader(claims, req) {
        if (!claims) {
            return null;
        }
        let userid = claims ? claims.preferred_username : null;
        let email = claims ? claims.email : null;
        let name = claims ? claims.name : null;
        let id = userid.split('@');
        id = id ? id[0] : null;
        req.headers['user'] = id;
        req.headers['user-email'] = email;
        req.headers['user-name'] = name;
        return id;
    }

}
