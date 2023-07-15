const Note = require('../models/note-model')
const User = require('../models/user-model')
const AppError = require('../utils/appError');
const util = require('util')
const formidable = require('formidable')
const fs = require('fs')
const sendEmail = require('./../utils/email');
const path = require('path')
const factory = require('./factoryHandler');

/** get the data by created by and active and not deleted note */
const uploadPath = path.join(process.cwd(), 'public', 'uploads/')

getNoteFactory = factory.getOne(User,{path: '_id'});

getNotes = async (req, res) => {
    try {
        const note = await Note.find({
            $and: [
                { 'created_by': req.JWTObject.id },
                { 'deleted_at': null }
            ]
        })
        res.status(200).json({
            status: true,
            data: {
                note
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

/** delete the note by created by */
deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate({ "_id": req.body.id, "created_by": req.JWTObject.id },
            {
                "$set":
                {
                    "deleted_at": Date.now()
                }
            });
        if (!note) {
            throw new Error();
        }
        res.status(200).json({
            status: true,
            data: {
                message: 'Note deleted successfully!'
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Sorry! this note can not be deleted'
        });
    }
};

/** Max size for file */
const maxSize = 2 * 1024 * 1024; // for 2MB

/** update the data by id */
updateNote = async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            Note.findOne({ _id: fields.id }, (err, Note) => {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: 'Note not found!',
                    })
                }
                
                /////       updated fields          ////
                Note.title = fields.title,
                    Note.description = fields.description,
                    Note.type = fields.type,
                    Note.status = fields.status,
                    Note.created_by = req.JWTObject.id,
                    //Note.attachment = fields.attachment,
                    Note.updated_at = Date.now()
                if (typeof files.attachment !== 'undefined' && files.attachment.length != 0 ) {
                    /** Temporary location of our uploaded file */
                    var temp_path = files.attachment.path;
                    /** The file name of the uploaded file */
                    const file_name = Date.now() + '-' + files.attachment.name;
                    var image_size = files.attachment.size;
                    /** check the file extension */
                    var fileExt = files.attachment.name.split('.').pop();
                    /** check the allowed extension */
                    const allowed_extensions = ['docx', 'doc', 'csv', 'jpeg', 'jpg', 'png','pdf'];
                    if (image_size > maxSize)
                        return res.status(400).json({
                            success: false,
                            errorcode : 1,
                            message: 'Oops!File size should be less than 2mb',
                        })
                    if (!allowed_extensions.includes(fileExt))
                        return res.status(400).json({
                            success: false,
                            errorcode : 2,
                            message: 'Oops!File extension is not supported',
                        })
    
                    fs.readFile(temp_path, function(err, data) {
                        fs.writeFile(uploadPath + file_name, data, function(err) {
                            fs.unlink(temp_path, function(err) {
                                if (err) {
                                    return res.status(400).json({
                                        success: false,
                                        message: 'Something went wrong!.',
                                    })
                                    } else {
                                        Note.attachment = file_name
                                        Note.save()
                                                .then(() => {
                                                    /// send mail to the users if the type is public ////
                                                    // if (fields.type == 1) {
                                                    //     User.find({}, function (err, users) {
    
                                                    //         users.forEach(user => {
                                                    //             const message = `New public note is added.`;
                                                    //             if (user.email)
                                                    //                 sendEmail({
                                                    //                     email: user.email,
                                                    //                     subject: 'New note is added.',
                                                    //                     message
                                                    //                 });
                                                    //         });
                                                    //     });
                                                    // }
                                                    // return res.status(200).json({
                                                    //     success: true,
                                                    //     message: 'Note is updated successfully!.',
                                                    // })
                                                })
                                                .catch(error => {
                                                    return res.status(500).json({
                                                        message: error.message
                                                    })
                                                })
                                        
                                }
                            });
                        });
                    });
                }
                Note
                    .save()
                    .then(() => {
                        ///// send mail to the users if the type is public ////
                        // if (fields.type == 1) {
                        //     User.find({}, function (err, users) {

                        //         users.forEach(user => {
                        //             const message = `New public note is added.`;
                        //             if (user.email)
                        //                 sendEmail({
                        //                     email: user.email,
                        //                     subject: 'New note is added.',
                        //                     message
                        //                 });
                        //         });
                        //     });
                        // }
                        return res.status(200).json({
                            success: true,
                            message: 'Note is updated successfully!.',
                        })
                    })
                    .catch(error => {
                        return res.status(404).json({
                            success: false,
                            message: 'Note not updated!',
                        })
                    })
            })
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message: 'Something went wrong'
        })
    }    
}
newNoteId = null;
// create new note//
createNote = async (req, res) => {
    try {console.log('form try');
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {console.log(fields);
            var note = new Note({ created_by: req.JWTObject.id });console.log(note);
            note.set('title', fields.title);
            note.set('description', fields.description);
            note.set('type', fields.type);
            note.set('attachment', null);
            note.set('status', fields.status);
            if (typeof files.attachment !== 'undefined' && files.attachment.length != 0 ) {
                /** Temporary location of our uploaded file */
                var temp_path = files.attachment.path;
                /** The file name of the uploaded file */
                const file_name = Date.now() + '-' + files.attachment.name;
                var image_size = files.attachment.size;
                /** check the file extension */
                var fileExt = files.attachment.name.split('.').pop();
                /** check the allowed extension */
                const allowed_extensions = ['docx', 'doc', 'csv', 'jpeg', 'jpg', 'png','pdf'];
                if (image_size > maxSize)
                    return res.status(400).json({
                        success: false,
                        errorcode : 1,
                        message: 'Oops!File size should be less than 2mb',
                    })
                if (!allowed_extensions.includes(fileExt))
                    return res.status(400).json({
                        success: false,
                        errorcode : 2,
                        message: 'Oops!FIle extension is not supported',
                    })

                fs.readFile(temp_path, function(err, data) {
                    fs.writeFile(uploadPath + file_name, data, function(err) {
                        fs.unlink(temp_path, function(err) {
                            if (err) {
                                return res.status(400).json({
                                    success: false,
                                    message: 'Something went wrong!.',
                                })
                                } else {
                                    note.attachment = file_name
                                    note.save()
                                            .then(() => {
                                                ///// send mail to the users if the type is public ////
                                                if (fields.type == 1) {
                                                    User.find({}, function (err, users) {

                                                        users.forEach(user => {
                                                            const message = `New public note is added.`;
                                                            if (user.email)
                                                                sendEmail({
                                                                    email: user.email,
                                                                    subject: 'New note is added.',
                                                                    message
                                                                });
                                                        });
                                                    });
                                                }
                                                return res.status(200).json({
                                                    success: true,
                                                    message: 'Note is added successfully!.',
                                                })
                                            })
                                            .catch(error => {
                                                return res.status(500).json({
                                                    message: error.message
                                                })
                                            })
                                    
                            }
                        });
                    });
                });
            }
            else
            {
                return res.status(400).json({
                    success: false,
                    errorcode : 3,
                    message: 'Oops!Image is not present.',
                })
            }
        })    
        
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message: 'Something went wrong!'
        })
    }
}



module.exports = {
    updateNote,
    deleteNote,
    getNotes,
    createNote,
    getNoteFactory,
}