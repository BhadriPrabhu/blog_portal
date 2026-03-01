import emailjs from '@emailjs/browser';

export default async function OtpSender(item) {

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    // const currentTime = new Date().toLocaleString();

    const templateParams = {
        name: item.name,
        time: item.timing,
        otp_code: generatedOtp,
        email: item.email,
    };

    try {
        const res = await emailjs.send(
            'service_1hyssl3',
            'template_r590vqc',
            templateParams,
            'ZZjHuzZxGL3AwZON3'
        )

        console.log('SUCCESS!', res.status, res.text);
        // alert("Verification email sent!");
        return generatedOtp;
    } catch (err) {
        console.error('Email failed to send: ', err);
        throw err;
    }

};