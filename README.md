# Rackspace Cloud File Metadata Bulk Updater

If content in your Cloud Files account isn’t loading on your website, it might be due to Cross-Origin Resource Sharing (CORS), a security feature designed to prevent malicious content from loading in a web page by default. If your files load Asynchronous JavaScript and XML (AJAX) or embed fonts, CORS might prevent them from loading.

I encountered the above issue and created this node.js project using pkgcloud rackspace node.js api.
https://developer.rackspace.com/docs/cloud-files/quickstart/?lang=node.js#change-object-metadata

Important:
I had to modify pkgcloud node module to remove "x-object-meta-" prefix when setting the headers. This project contains the customized pkgcloud node module and you wan't face the same issue.

pkgcloud/lib/pkgcloud/openstack/storage/storageClient.js
```sh
// removed this "x-object-meta-" prefix to fix cors origin key issue
// const OBJECT_META_PREFIX = 'x-object-meta-';
const OBJECT_META_PREFIX = '';
```


  # CORS
  Cross-Origin Resource Sharing (CORS) is a mechanism that allows code running in a browser to make requests to a domain other than the one from which it originated by using HTTP headers, such as those assigned by Cloud Files API requests.

  Cloud Files supports CORS requests to containers and objects.

  For more information about CORS and the access control headers, see www.w3.org/TR/access-control/.

Created by:
Charitha Basnayake
crwbasnayake@gmail.com

References: 
- https://developer.rackspace.com/docs/cloud-files/quickstart/?lang=node.js 
- https://developer.rackspace.com/docs/cloud-files/v1/storage-api-reference/object-services-operations/#get-object-content-and-metadata
- https://support.rackspace.com/how-to/set-up-cloud-files-and-acls/ https://support.rackspace.com/how-to/set-up-cors-on-cloud-files/ 
- https://git.isi.nc/smti/pkgcloud_bis/commit/05e5bfe674683b82caac4531b7fbbfaacc5e3c10 
- https://git.isi.nc/smti/pkgcloud_bis/-/blob/05e5bfe674683b82caac4531b7fbbfaacc5e3c10/test/rackspace/storage/storage-object-test.js 
- https://git.isi.nc/smti/pkgcloud_bis/-/blob/master/lib/pkgcloud/amazon/storage/file.js 
- https://git.isi.nc/smti/pkgcloud_bis/-/blob/master/examples/storage/rackspace.js 
- https://git.isi.nc/smti/pkgcloud_bis/-/blob/master/docs/providers/hp/storage.md 
- https://stackabuse.com/reading-and-writing-json-files-with-node-js/
