
import express , { Request ,Response }  from 'express' ;

import { nanoid } from 'nanoid'
import { URLcontroller } from './controller/URLcontroller';


const api = express()
api.use(express.json())

api.get('/test' , (req:Request ,res:Response)=>{

    console.log('URL:' , req.url)
    console.log('METHOD', req.method)

    res.statusCode = 200
    res.json({ 
        'success': true,
        'uid' : nanoid(10)
    })
    
    res.end('<h1> my test API<h1/>')
})

const urlcontroller = new URLcontroller

api.post('/shorten' , urlcontroller.shorten );


api.get('/:hash' , urlcontroller.redirect);

api.listen(3000, ()=> {
    console.log('server listen')
})
