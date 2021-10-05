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

//getProductById
exports.getProductById = (req, res) =>{
  //connect to database
  const db = connectDb()
  //get productId from the req.param
  //const productId = req.params.productId
  const { productId } = req.params
  //get document from collection
  db.collection('clothes').doc(productId).get()
  .then(doc => {
    let item = doc.data()
    item.id = doc.id
    res.send(item)
  })
  .catch(err => res.status(500).send(err))
  //return document

}

exports.createProduct = (req, res) => {
  //check that all required fields are present
  if(!req.body.sku || !req.body.type || !req.body.price){
    res.status(401).send({ message: 'Invalid Request'})
    return //exits the function
  }
  //construct new clothing from .body
  let newItem = {
    sku: req.body.sku,
    type: req.body.type,
    price: Number(req.body.price.toFixed(2)),
    graphic: (req.body.graphic) ? true : false,
  }
  if(req.body.sizes) newItem.sizes = req.body.sizes

  if(req.body.brand) newItem.brand = req.body.brand

  if(req.body.style) newItem.style = req.body.style

  if(req.body.color) newItem.color = req.body.color

  const db = connectDb()
    db.collection('clothes').add(newItem)
    .then(docRef => res.status(201).send({ id: docRef.id }))
    .catch(err => res.status(201).send(err))
  
}

exports.updateProduct = (req, res) => {
  const { productId } = req.params
  let newUpdates = {}
  if(req.body.type) newUpdates.type = req.body.type
  if(req.body.sizes) newUpdates.sizes = req.body.sizes
  if(req.body.price) newUpdates.price = req.price = Number(req.body.price.toFixed(2))
  if(req.body.brand) newUpdates.brand = req.body.brand
  if(req.body.style) newUpdates.style = req.body.style
  if(req.body.color) newUpdates.color = req.body.color
  if(req.body.sku) newUpdates.sku = req.body.sku

  
  const db = connectDb()
  db.collection('clothes').doc(productId).update(req.body)
  .then(() => res.status(201).send({message: 'updated'}))
  .catch(err => res.status(500).send(err))
}

exports.deleteProduct = (req, res) => {
  const { productId } = req.params
  const db = connectDb()
  db.collection('clothes').doc(productId).delete()
    .then(()=> res.status(202).send({message: 'deleted'}))
    .catch(err => res.status(500).send(err))
}