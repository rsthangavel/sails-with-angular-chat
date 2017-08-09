/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    login : function( req,res){
        var username = req.query.name;
        var building = req.query.building;
      
         var socketid = sails.sockets.getId(req);
           var session;
  var io= sails.io;

    // Create the session.users hash if it doesn't exist already
    User.create({
             name: username,
             buildingNumber : building,
             socketId : socketid
         }).exec(function(err,user){
             if(err){
                 return res.send(err);
             }
             req.session.user = user;
                session= user;
               // console.log(user);
               //  req.session.user = user.id;
                 User.subscribe(req, user);
                 User.watch(req);
                 Room.watch(req);
                 User.publishCreate(user);
                   sails.sockets.join(user, user.buildingNumber);
                 return res.json(user);
             

         })
    },
    destroy : function(req,res){
       var  user = req.session.user;
     
        console.log(req.session.user);
        if(req.session.user){
              User.findOne(req.session.user.id).exec(function(err, user){ 
            User.destroy(req.session.user.id).exec(function(err){
            if(err) return res.badRequest();

            User.publishDestroy(user.id, req, {previous:user});
        });
            
        })  
        }
            
      
         
                return res.ok(user);
    },
    private : function(req,res){
        var socketId =  sails.sockets.getId(req);
        console.log(req.param('msg'));
        console.log(req.session.user.id);
        User.findOne(req.session.user.id).exec(function(err,sender){
            User.message(req.param('to'),{
                from : sender,
                msg  :  req.param('msg')
            });
            return res.ok();
        })
        io.sockets.emit(req.param('to'),  { from: req.session.user.id, msg: req.param('msg')});
        // User.findOne(req.session.users[socketId].id).exec(fucnction(err,sender){
                  
        // })
    },
    test : function(req,res){
        var io= sails.io;
        var socketId = req.param('to');
        console.log(socketId);
        sails.sockets.join(socketId, socketId);
         io.sockets.emit(socketId, { from: req.session.user, msg:req.param('msg'), sender: true});
         return res.json({ from: req.session.user, msg:req.param('msg')});
    },
    group : function(req,res){
        var io = sails.io;
        var buildingNumber = req.param('to');
        console.log(req.param('msg'));
        console.log(buildingNumber);
        io.sockets.emit(buildingNumber, { from: req.session.user, msg: req.param('msg'), sender:false});
          return res.json({ from: req.session.user, msg:req.param('msg')});
    }
};

