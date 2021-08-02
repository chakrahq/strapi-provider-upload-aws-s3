Small enhancements to [strapi-provider-upload-aws-s3](https://www.npmjs.com/package/strapi-provider-upload-aws-s3) to support some optional configurations.

Original source is [here](https://github.com/strapi/strapi/tree/master/packages/strapi-provider-upload-aws-s3).

package.json:

```
{
  //...
  "dependencies": {
    //...
    "strapi-provider-upload-aws-s3": "npm:@chakrahq/strapi-provider-upload-aws-s3@3.6.5",
    //...
  },
 // ...
}
```

config/plugins.js:

```
module.exports = ({ env }) => {
  //...
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_S3_KEY'),
      secretAccessKey: env('AWS_S3_SECRET'),
      region: env('AWS_S3_REGION'),
      params: {
        Bucket: env('AWS_S3_BUCKET'),
      },
      baseUrl: env('AWS_S3_CDN'),
      prefix: 'images/',
      ACL: 'public-read',
    },
  },
  //...
};
```

Notes:
- `baseUrl` - should be a full URL without a trailing slash. Example: `https://cdn.example.com`
- `prefix` - should have a trailing slash if it's required. Example: `images/`
- `ACL` - should be from the list of canned ACLs as described [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl). Example: `private`
