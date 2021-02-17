const nodemailer = require("nodemailer");
const pug = require('pug')
const juice = require('juice')
const util = require('util');
const { htmlToText } = require("html-to-text");

let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f681341344dfa5",
      pass: "65401b460612fc"
    }
  });

  // generar HTML
  const generateHTML = (archivo, opciones={}) => {
      const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
      return juice(html)
  }

 // send mail with defined transport object
 exports.enviar = async (opt) => {
    const html = generateHTML(opt.archivo, opt)
    const text = htmlToText(html)
    let info = await transport.sendMail({
        from: '"Up-task" <no-reply@upTask.com>', // sender address
        to: opt.usuario.email, // list of receivers
        subject: opt.subject, // Subject line
        text, // plain text body
        html // html body
    });
 }
