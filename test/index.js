require("sugar");

var chai = require("chai"),
    expect = chai.expect,
    dynq = null,
    cxn = null,
    schema = null;

chai.should();

describe('Module', function() {
    
    this.timeout(10000);
    
    it("ain't broke", function() {
        dynq = require("../index");
    });
    
    it("can create a connection", function() {
        cxn = dynq.configFromPath(__dirname + "/../test.json").connect();
    });
    
    it("can define a schema", function() {
        schema = cxn.schema().define({
            test: {
                name: "TEST_test_table",
                key: { id: "S" }, 
                read: 5,
                write: 5
            }
        });
    })
    
    it("can list some tables", function(done) {
        schema.listSomeTables(function(err, result) {
            if (err) throw err;
            else {
                expect(result.tables).to.be.an("array");
                if (result.last) expect(result.last).to.be.a("string");
                done();
            }
        })
    });
    
    it("can list all tables", function(done) {
        schema.listAllTables(function(err, tables) {
            if (err) throw err;
            else expect(tables).to.be.an("array");
            done();
        })
    });
    
    it("can create a schema", function(done) {
        this.timeout(120000);
        schema.create(function(err) {
            if (err) throw err;
            else done();
        });
    });
    
    it("has a test table", function() {
        expect(schema.tables.test).to.be.ok;
    });
    
    it("can insert a record", function(done) {
        schema.tables.test.insert({ id: "1", value: "one" }, function(err) {
            if (err) throw err;
            done();
        });
    });
    
    it("cannot re-insert a record", function(done) {
        schema.tables.test.insert({ id: "1", value: "one" }, function(err) {
            err.should.be.ok;
            done();
        });
    });
    
    it("can write a record", function(done) {
        schema.tables.test.write({ id: "1", value: "two" }, function(err) {
            if (err) throw err;
            done();
        });
    });
    
    it("can confirm a record exists", function(done) {
        schema.tables.test.exists({ id: "1" }, function(err, exists) {
            if (err) throw err;
            else expect(exists).to.be.ok;
            done();
        });
    });
    
    it("can get a record", function(done) {
        schema.tables.test.get({ id: "1" }, function(err, item) {
            if (err) throw err;
            else expect(item).to.be.an("object");
            done();
        });
    });
    
    it("can get part of a record", function(done) {
        schema.tables.test.getPart({ id: "1" }, [ "id" ], function(err, item) {
            if (err) throw err;
            else {
                expect(item).to.be.an("object");
                Object.keys(item).length.should.equal(1);
            }
            done();
        });
    });
    
    it("cannot conditionally delete a record with incorrect values", function(done) {
        schema.tables.test.deleteIf({ id: "1" }, { value: "one" }, function(err, item) {
            err.should.be.ok;
            done();
        });
    });
    
    it("can conditionally delete a record with correct values", function(done) {
        schema.tables.test.deleteIf({ id: "1" }, { value: "two" }, function(err) {
            if (err) throw err;
            done();
        });
    });
    
    it("can delete a record twice", function(done) {
        schema.tables.test.delete({ id: "1" }, function(err) {
            if (err) throw err;
            done();
        });
    });
    
    it("can over-write a record", function(done) {
        schema.tables.test.write({ id: "1", value: "one" }, function(err) {
            if (err) throw err;
            done();
        });
    });
    
    it("can delete a record", function(done) {
        schema.tables.test.delete({ id: "1" }, function(err) {
            done();
        });
    });
    
    it("can confirm a record does not exists", function(done) {
        schema.tables.test.exists({ id: "1" }, function(err, exists) {
            if (err) throw err;
            else expect(exists).to.be.not.ok;
            done();
        });
    });
    
    it("can drop a schema", function(done) {
        this.timeout(120000);
        schema.drop(function(err) {
            if (err) throw err;
            else done();
        });
    });
    
});