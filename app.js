"use strict";

const fs = require("fs");
var pkgcloud = require("../corsUpdater/custom_modules/pkgcloud");

// this will show the operation progress on the terminal
const cliProgress = require("cli-progress");

// create a file only file logger
const log = require("simple-node-logger").createSimpleFileLogger(
  "activity.log"
);

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

var containerName = "rackspace_container";

const MaxFileCount = 10000; // total cloud files count
var round = 1;
var totalItems = 0;
var totalImages = 0;
var failedOperation = 0;
var retryCount = 0;

var marker;

// each client is bound to a specific service and provider
var client = pkgcloud.providers.rackspace.storage.createClient({
  provider: "rackspace",
  username: "<user_name>",
  apiKey: "<api_key>",
  region: "<region>",
});

const delay = (millis) =>
  new Promise((resolve, reject) => {
    setTimeout((_) => resolve(), millis);
  });

async function updateFileMetadata(file) {
  return new Promise(function (resolve, reject) {
    // set cors policy
    var origin = "https://admin.sample_origin.com";
    file.metadata = {
      "Access-Control-Allow-Origin": origin,
    };

    file.updateMetadata(function (err) {
      if (err) {
        log.info("File:", file.name, "metadata update error occured", err);
        resolve(false);
      } else {
        log.info("File:", file.name, "metadata updated", err);
        resolve(true); // successfully fill promise
      }
    });
  });
}

async function getFiles(marker) {
  return new Promise(function (resolve, reject) {
    var options = {};
    if (marker) {
      options = { marker: marker, limit: MaxFileCount };
      log.info("Quering file set:", round, ", marker:", marker);
    } else {
      options = { limit: MaxFileCount };
      log.info("Quering file set:", round);
    }

    client.getFiles(containerName, options, function (err, files) {
      if (err) {
        log.info("Get files from container error occured. Error: ", err);
        resolve(null);
      }
      resolve(files); // successfully fill promise
    });
  });
}

async function runUpdater() {
  var filecount = MaxFileCount;

  // start the progress bar with a total value of MaxFileCount and start value of 0
  bar1.start(MaxFileCount, 0);

  while (filecount >= MaxFileCount) {
    try {
      var files = await getFiles(marker);

      if (files != null && files.length > 0) {
        retryCount = 0;

        // use your files
        log.info("", files.length, " files found!");

        files.forEach(async function (file) {
          totalItems++;

          // update the current value in your application..
          bar1.update(totalItems);

          marker = file.name;
          //log.info("", file.name, " metadata update initiated.");
          var status = await updateFileMetadata(file);
          if (status) {
            // log.info(file);
            //log.info("", file.name, " metadata updated successfully!");
          } else {
            failedOperation++;
            log.info("+++++++++++++++++++++++++++++++++++++++++++++++");
            log.info(file);
            log.info("+++++++++++++++++++++++++++++++++++++++++++++++");
            log.info("", file.name, " metadata update falied!");
            log.info("+++++++++++++++++++++++++++++++++++++++++++++++");
          }
          await delay(1000);
          totalImages++;
        });

        round++;
        filecount = files.length;
      } else {
        if (files == null) {
          if (retryCount > 9) {
            // terminate block, after 10 retry
            filecount = 0;
            log.info("Unknown error occured!!!\n");
          } else {
            // retry to get the same file set after 10 seconds
            retryCount++;
            await delay(10000);
            log.info("Unknown error occured!!! Retring.................................\n");
          }
        } else {
          // terminate block
          filecount = 0;
        }
      }
    } catch (err) {
      if (files == null) {
        if (retryCount > 9) {
          filecount = 0;
          log.info("Unknown error occured:", err, "\n");
        } else {
          retryCount++;
          await delay(10000);
          log.info(
            "Unknown error occured!!! Retring.................................\n"
          );
        }
      } else {
        // terminate block
        filecount = 0;
      }
    }
  }

  // stop the progress bar
  bar1.update(MaxFileCount);
  bar1.stop();

  log.info("Total items processed: ", totalItems);
  log.info("Total gallery images processed: ", totalImages);
  log.info("", failedOperation, " image operations failed!!!\n\n");
}

runUpdater();

/*
https://support.rackspace.com/how-to/set-up-cloud-files-and-acls/
https://support.rackspace.com/how-to/set-up-cors-on-cloud-files/
https://developer.rackspace.com/docs/cloud-files/v1/storage-api-reference/object-services-operations/#get-object-content-and-metadata
https://developer.rackspace.com/docs/cloud-files/quickstart/?lang=node.js
https://git.isi.nc/smti/pkgcloud_bis/commit/05e5bfe674683b82caac4531b7fbbfaacc5e3c10
https://git.isi.nc/smti/pkgcloud_bis/-/blob/05e5bfe674683b82caac4531b7fbbfaacc5e3c10/test/rackspace/storage/storage-object-test.js
https://git.isi.nc/smti/pkgcloud_bis/-/blob/master/lib/pkgcloud/amazon/storage/file.js
https://git.isi.nc/smti/pkgcloud_bis/-/blob/master/examples/storage/rackspace.js
https://git.isi.nc/smti/pkgcloud_bis/-/blob/master/docs/providers/hp/storage.md
https://stackabuse.com/reading-and-writing-json-files-with-node-js/
*/
