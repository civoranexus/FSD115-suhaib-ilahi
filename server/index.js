import express, { urlencoded } from 'express'

const app = express();


app.use(urlencoded({extended:true}))
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.listen("/",() => {
    console.log('====================================');
    console.log(`Server is listening on port ${PORT}`);
    console.log('====================================');
})

app.get("/healthy",()=> {
    console.log('====================================');
    console.log("Server is healthy!");
    console.log('====================================');
})