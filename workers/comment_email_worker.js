const queue=require('../config/kue');

const commentsMailer=require('../mailers/comments_mailer');

//the queue is processed i.e, the worker executes the jobs in the queue
queue.process('emailes', function(job,done){
     console.log('emails worker is processing a job', job.data);
     commentsMailer.newComment(job.data);
     done();
});