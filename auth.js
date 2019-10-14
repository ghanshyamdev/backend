var express = require('express')
var router = express.Router()
require('dotenv').config()
const request = require('request-promise')
const btoa = require('btoa')

router.post('/login',async function (req, res) {    
    try {    
        if(!req.body.email || !req.body.password){
            return res.status(422).send({msg:"email or password required"})
        }
        const { ISSUER, CLIENT_ID, SCOPE } = process.env
        const client = btoa(`${CLIENT_ID}`)  
        const auth = await request({
          uri: `${ISSUER}/v1/token`,
          json: true,
          method: 'POST',
          headers: {
            authorization: `Basic ${client}`
          },
          form: {
            grant_type: 'password',
            scope: SCOPE,
            username: req.body.email,
            password: req.body.password
          }
        })
        
        if(req.body.email === 'admin@admin.com'){
            auth.role = 'admin'
        }else{
            auth.role = 'user'
        }
        res.send(auth)
      } catch (error) {
        console.error(`Error: ${error.message}`)
        res.status(401).send(error.error)
      }
})
router.post('/signup',async function (req, res) {    
    try {    
        if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password){
            return res.status(422).send({msg:"required field missing."})
        }        
        const { OKTA_SERVER, API_TOKEN } = process.env             
        const userResponse = await request({
          uri: `${OKTA_SERVER}/api/v1/users?activate=true`,   
          json: true,       
          method: 'POST',
          headers: {
            'Authorization': `SSWS ${API_TOKEN}`,
            'Content-Type': 'application/json',
             'Accept': 'application/json'
          },
          body: {
            profile: {
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                login: req.body.email
              },
              credentials: {
                password : { value: req.body.password }
              }
          }
        })
               
        res.send(userResponse.profile)
      } catch (error) {
        console.error(`Error: ${error.message}`)
        res.status(401).send(error.error)
      }
})
module.exports = router