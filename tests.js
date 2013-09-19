var docker = require('./lib')({
  host: 'http://localhost'
});
var expect = require('chai').expect;
var someContainerID = '';


describe("docker.io", function() {
    describe("#general", function() {

        describe("#build", function() {

          it("should build a new image", function(done) {
            this.timeout(50000);

            function handler(err, res) {
              expect(err).to.be.null;

              done();
            }

           docker.build('Dockerfile.tar', 'datatower_user', handler);
          });
        });
    });

  describe("#containers", function() {

    describe("#create", function() {

      it("should create a new container", function(done) {
        this.timeout(50000);

        function handler(err, res) {
          expect(err).to.be.null;

          someContainerID = res.Id;

          done();
        }

        docker.containers.create({
          Image: 'ubuntu',
          Cmd: ["bash", "-c", "while true; do echo Hello world; sleep 1; done"]
        }, handler);
      });
    });

    describe("#start", function() {

      it("should start a container", function(done) {
        this.timeout(5000000);

        function handler(err, res) {
          expect(err).to.be.null;

          done();
        }

        docker.containers.start(someContainerID, handler);
      });
    });

    describe("#list", function() {

      it("should list all active containers", function(done) {
        this.timeout(50000);

        function handler(err, res) {
          expect(err).to.be.null;

          expect(res).to.have.length.above(0);

          done();
        }

        docker.containers.list({}, handler);
      });
    });

    describe("#attach", function() {

      it("should attach to a container", function(done) {
        this.timeout(50000);
        
        var called = false;
        function handler(err, res) {
          if(!called) {
            called = true;
            expect(err).to.be.null;

            expect(res).to.have.string('Hello');

            done();
          }
        }

        docker.containers.attach(someContainerID, {logs: true, stdin: true, stream: true, stdout: true}, handler);
      });
    });

    describe("#inspect", function() {

      it("should inspect a container", function(done) {
        this.timeout(50000);

        function handler(err, res) {
          expect(err).to.be.null;

          done();
        }

        docker.containers.inspect(someContainerID, handler);
      });
    });

    describe("#inspectChanges", function() {

      it("should inspect changes in a container", function(done) {
        this.timeout(50000);

        function handler(err, res) {
          expect(err).to.be.null;

          done();
        }

        docker.containers.inspectChanges(someContainerID, handler);
      });
    });

    describe("#restart", function() {

      it("should restart a running container", function(done) {
        this.timeout(5000000);

        function handler(err, res) {
          expect(err).to.be.null;

          done();
        }

        docker.containers.restart(someContainerID, handler);
      });
    });

  describe("#runExport", function() {

    it("should export a container", function(done) {
      this.timeout(50000);

      function handler(err, res) {
        expect(err).to.be.null;

        done();
      }

      docker.containers.runExport(someContainerID, handler);
    });
  });

  describe("#info", function() {
    it("should show all docker info", function(done) {
      this.timeout(50000);

      function handler(err, res) {
        expect(err).to.be.null;

        done();
      }

      docker.info(handler);
    });
  });

  describe("#version", function() {
    it("should show all docker version", function(done) {
      this.timeout(50000);

      function handler(err, res) {
        expect(err).to.be.null;

        done();
      }

      docker.version(handler);
    });
  });

  describe("#stop", function() {

      it("should stop a running container", function(done) {
        this.timeout(5000000);

        function handler(err, res) {
          expect(err).to.be.null;

          done();
        }

        docker.containers.stop(someContainerID, handler);
      });
    });

    describe("#kill", function() {

      it("should kill a container", function(done) {
        this.timeout(5000000);

        function handler(err, res) {
          expect(err).to.be.null;

          done();
        }

        docker.containers.kill(someContainerID, handler);
      });
    });

    describe("#remove", function() {

      it("should remove a container", function(done) {
        this.timeout(50000);

        function handler(err, res) {
          expect(err).to.be.null;

          done();
        }


        // have to create a new container cus we killed the last one...
        docker.containers.create({
          Image: 'ubuntu',
          Cmd: ["bash", "-c", "while true; do echo Hello world; sleep 1; done"]
        }, function(err, res) {
          docker.containers.remove(res.Id, handler);

        });
      });
    });

  });

});