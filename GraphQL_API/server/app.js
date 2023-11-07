const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const app = express();

//Conectandome a la base de Datos de MongoDB
const mongoDBAtlasUri = "mongodb+srv://mnlazs:SZXoel449PtcspvJ@cluster0.xgnwb1j.mongodb.net/"
mongoose.connect(mongoDBAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for request on port 4000');
});
