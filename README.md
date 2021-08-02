Small modification to [strapi-provider-upload-aws-s3](https://www.npmjs.com/package/strapi-provider-upload-aws-s3) to support an optional baseUrl configuration.
If `baseUrl` is not specified, it works the same as the official aws-s3 plugin.

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
      baseUrl: env('AWS_S3_CDN')
    },
  },
  //...
};
```

Note:
`baseUrl` param should be a full URL without a trailing slash.
Example: `https://cdn.example.com`
