const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const multipart=require('connect-multiparty');
const PORT = 3000;

const multiPartMiddleware=multipart({
    uploadDir:'./subidas'
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extented:true
}));
//endpoint para subir archivos

app.post('./api/subir', multiPartMiddleware,(req,res)=>{
res.json({
    'message':'Fichero subido correctamente'
});

});

app.get('/',(req,res)=>{
res.send('Hola mundo');
});


app.listen(PORT,()=>console.log(`App running on port: ${PORT}`))
