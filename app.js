const express = require('express')
const bodyParser = require('body-parser');
const request = require('request')

const app = express()
const port = 3000


//para levantar archivos estáticos, uso la funcion de express llamada static
//le digo a nuestra app que "lo use"
app.use(express.static('public'));

//cada vez que necesito usar body parser debo escribir un código como éste,
//que solo cambia por si es text, json o urlencoded(cuando uso form)
app.use(bodyParser.urlencoded({ extended: true }))

//requiero el método nativo de node para hacer consultas
const https = require('https');
const { options } = require('request');
const { response } = require('express');
const req = require('express/lib/request');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const name = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: name,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data)
    const url = 'https://us18.api.mailchimp.com/3.0/lists/b0cad3663'
    const options = {
        method: 'POST',
        auth: 'victor:97518cf597c66459b279d1756dc17db9-us18'
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/succes.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end();

})

app.post('/failure', (req, res) => {
    res.redirect('/')
    // otra opción de esta
    // res.sendFile(__dirname + '/signup.html')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`)
})

//api key
// 97518cf597c66459b279d1756dc17db9-us18
// b0cad36634