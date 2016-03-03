![DynQ](/bkn.jpg "DynQ")

# DynQ
AWS DynamoDB query library.  It makes data access layers based on DynamoDB easier to develop and maintain.  Call it "dink" if you like.  Amongst other things, this library features:

* Support for multi-master writes and distributed reads.
* Automatic resubmission of 'retryable' and provision throughput errors.
* Transparent encoding to and decoding from DynamoDB typed JSON.
* Schema definition and detection
* Intuitive query builder and execution API

## Get Started
```js
var dynq = require("dynq");

// Configure using object or JSON file.
dynq.config({ accessKeyId: "xxx", secretAccessKey: "yyy", maxRetries: 5 });
dynq.configFromPath("./aws.json");

// Create a simple connection
var cxn = new dynq.Connection("us-east-1");

// Create a multi-master connection with an array of AWS regions.
cxn = dynq.connect([ "us-east-1", "us-west-1" ], true);
```

## Documentation

### Configuration

Configure library with standard [AWS configuration options](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property).

* `dynq.config(config)`
* `dynq.configFromPath(path)`

### Constructors

Create connections with builder method or constructor syntax.

* `dynq.connect(regions, distributeReads)`
* `new dynq.Connection(regions, distributeReads)`

__Arguments__

* `regions` - A string or array of AWS regions (e.g. us-east-1).
* `distributeReads` - A boolean value specifying if reads should be distributed across regions.

### Key-Value Store Methods

* `cxn.write(table, item, cb)`
* `cxn.insert(table, key, item, cb)`
* `cxn.exists(table, key, cb)`
* `cxn.get(table, key, cb)`
* `cxn.getPart(table, key, attributes, cb)`
* `cxn.destroy(table, key, expected, cb)`

__Arguments__

* `table` - A string specifying the name of a DynamoDB table.
* `key` - An object specifying the unique key of the item.
* `item` - An object representing a table record.
* `attributes` - An array of strings specifying column names to be fetched.
* `expected` - An object representing a set of fields that must be matched for the operation to succeed.
* `cb` - Callback with an error and results parameters.

These methods automatically encode parameters to and decode responses from the DynamoDB typed JSON format.

### DynamoDB Native Operations

The returned connections are compatible with the [AWS DynamoDB API](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html).

* `cxn.batchGetItem(params, cb)`
* `cxn.batchWriteItem(params, cb)`
* `cxn.createTable(params, cb)`
* `cxn.deleteItem(params, cb)`
* `cxn.deleteTable(params, cb)`
* `cxn.describeTable(params, cb)`
* `cxn.getItem(params, cb)`
* `cxn.listTables(params, cb)`
* `cxn.putItem(params, cb)`
* `cxn.query(params, cb)`
* `cxn.scan(params, cb)`
* `cxn.updateItem(params, cb)`
* `cxn.updateTable(params, cb)`
* `cxn.waitFor(event, options, cb)`

__Arguments__

* `params` - An object specifying query parameters according to AWS Dynamo documentation.
* `cb` - Callback with an error and results parameters.

These methods do not automatically decode responses in the DynamoDB typed JSON format.