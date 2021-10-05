const {connectDb} = require('./db')

//getAllProducts
exports.getAllProducts = (req, res) =>{
  const db = connectDb()
  db.collection('clothes').get()
  .then(collection => {
    const clothes = collection.docs.map(doc =>{
      let item = doc.data()
      item.id = doc.id
      return item
    })
    res.send(clothes) // shorthand for the below
    //res.send({
    //status: '200',
    //results: clothes.length,
    //success: true,
    //message: 'clothing collection returned'
    //data: clothes
    //})
  })
  .catch(err => res.status(500).send(err))
}