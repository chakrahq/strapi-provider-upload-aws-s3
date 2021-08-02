'use strict'

/**
 * Global References:
 * - https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#create-providers
 * - https://github.com/strapi/strapi/tree/master/packages/strapi-provider-upload-aws-s3
 */

/**
 * Module dependencies
 */

const AWS = require('aws-sdk');


/**
 * Constants
 */

/** Reference: https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl */
const ACL_WHITELIST = [
  'private',
  'public-read',
  'public-read-write',
  'authenticated-read',
  'bucket-owner-read',
  'bucket-owner-full-control',
];
const ACL_DEFAULT = 'public-read';

const getValidatedACL = (configuredACL) => {
  if (configuredACL) {
    if (ACL_WHITELIST.includes(configuredACL)) {
      return configuredACL;
    }
    throw Error(`The object ACL: ${config.ACL} is not valid. Please choose from: ${ACL_WHITELIST.join(', ')}`);
  }

  return ACL_DEFAULT;
}

module.exports = {
  init(config) {
    const {
      accessKeyId,
      secretAccessKey,
      region,
      params,

      baseUrl,
      prefix: configuredPrefix = '',
      ACL: configuredACL,
    } = config;

    const acl = getValidatedACL(configuredACL);
    const prefix = configuredPrefix.trim(); 

    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      accessKeyId,
      secretAccessKey,
      region,
      params,
    });

    return {
      upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          /** upload file on S3 bucket */
          const path = file.path ? `${file.path}/` : '';
          S3.upload(
            {
              Key: `${prefix}${path}${file.hash}${file.ext}`,
              Body: Buffer.from(file.buffer, 'binary'),
              ACL: acl,
              ContentType: file.mime,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              /** set the file url */
              file.url = baseUrl ? `${baseUrl}/${data.Key}` : data.Location;

              resolve();
            }
          );
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          /** delete file on S3 bucket */
          const path = file.path ? `${file.path}/` : '';
          S3.deleteObject(
            {
              Key: `${prefix}${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err) => {
              if (err) {
                return reject(err);
              }
              resolve();
            }
          );
        });
      },
    };
  },
};
