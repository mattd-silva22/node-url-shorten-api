import { Request ,Response }  from 'express' ;
import { nanoid } from 'nanoid';
import { config } from './Consts';
import nedb from 'nedb'

const dataStorage = new nedb({
    filename: './database/urlStorage.db',
    autoload: true
});


type UrlDataType = {
    originalURL : string;
    hashCode : string; 
    shortURL : string;
}


export class URLcontroller {

    public async shorten( req:Request , res:Response):Promise<void> {
        
        const  { originalURL } = req.body;
        

        // ver se url foi enviada
        if(!originalURL) {
            res.end('URL Not found')
            return
        }


        // ver se ja existe url curta no db
        dataStorage.findOne({'originalURL': originalURL}, (err: any , urlData: null)=>{
            if(err) {
                return console.log('error');
            }

            // caso nao. add ao db
            if(urlData == null) {


                //cria hash code e url curta
                const hashCode = nanoid(8);
                const shortURL = `${config.API_URL}/${hashCode}`;


                
                

                // retornar url
                res.json({shortURL});

                //salvar hash no db
                dataStorage.insert({originalURL , hashCode , shortURL});
                
            } else { // caso sim. ler dados do db
                dataStorage.findOne({'originalURL': originalURL}, (err: any , urlData:UrlDataType)=>{
                    if(err) {
                        return console.log('error');
                    }
                    // retornar url
                    res.json(urlData.shortURL);
                    

                })
            }
        })
        

    }

    public async redirect(req:Request , res:Response):Promise<void> {

        // pegar hash

        const { hash } = req.params  // wwww.youtube.com/h1f847198

        dataStorage.findOne({'hashCode': hash}, (err: any , urlData: UrlDataType )=>{
            if(err) {
                return console.log('error');
            }

            if(urlData == null) {
            
                console.log('URL not found')
            } else {
                res.redirect(urlData.originalURL);
            }

        })

        // achar url ori epla hash no banco de dados

        //dar redirect para url original 

        
        
        




    }


    
}