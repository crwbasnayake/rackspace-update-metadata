# RackspaceCloudFileMetadataUpdater

If content in your Cloud Files account isn’t loading on your website, it might be due to Cross-Origin Resource Sharing (CORS), a security feature designed to prevent malicious content from loading in a web page by default. If your files load Asynchronous JavaScript and XML (AJAX) or embed fonts, CORS might prevent them from loading.

You can correct this issue by using this NodeJS project to change the headers in your Cloud Files using nodejs api. I created this project to update my cloud files cors policy.

https://developer.rackspace.com/docs/cloud-files/quickstart/?lang=node.js#change-object-metadata

Important:
I had to modify pkgcloud node module to remove "x-object-meta-" prefix when setting the headers. So I have uploaded customized node_module in side the project. So you can use it.

_createHeaders: function (metadata) {
    var headers = {};
    Object.keys(metadata).forEach(function (key) {
      //I removed this "x-object-meta-" prefix to fix cors origin key issue
      var header = "x-object-meta-" + key;
      headers[header] = metadata[key];
    });

    return headers;
  }

  # CORS
  Cross-Origin Resource Sharing (CORS) is a mechanism that allows code running in a browser to make requests to a domain other than the one from which it originated by using HTTP headers, such as those assigned by Cloud Files API requests.

  Cloud Files supports CORS requests to containers and objects.

  For more information about CORS and the access control headers, see www.w3.org/TR/access-control/.
