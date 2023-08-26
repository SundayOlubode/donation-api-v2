const mailGun = require('mailgun-js')
const appError = require('../utils/appError')
require('dotenv').config()

const mailgunAuth = {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
};

const mg = mailGun(mailgunAuth)

/**
 * Send Email To Users
 */
class EmailToUsers {
    constructor(user, url, donation=undefined) {
        this.to = user.email;
        this.firstname = user.firstname
        this.url = url
        this.from = `${process.env.EMAIL_SENDER} ${process.env.EMAIL_FROM}`;
        this.amount = donation.amount
    }

    async send(template, subject) {

        const data = {
            from: this.from,
            to: this.to,
            subject,
            template,
            'h:X-Mailgun-Variables': JSON.stringify({
                firstname: this.firstname,
                url: this.url,
                amount: this.amount
            })
        }

        try {
            // if (process.env.NODE_ENV === 'production') {
                await mg.messages().send(data)
            // }
        } catch (error) {
            throw new appError(error.message, 500)
        }

    }

    // SEND WELCOME MAIL
    async sendWelcome() {
        await this.send("test-welcome", "Welcome! Luke 6:38");
    }

    // SEND PASSWORD RESET LINK
    async sendPasswordReset() {
        await this.send("reset-password", "Your password reset link(valid for only 10 minutes)");
    }

    // SEND SUCCESFUL PASSWORD RESET MAIL
    async sendVerifiedPSWD() {
        await this.send('verified-pswd', 'You have reset your password successfully!')
    }

    async notifyDonor() {
      await this.send('notify-donor', 'Your donation has been recorded!')
    }
}

module.exports = { EmailToUsers }