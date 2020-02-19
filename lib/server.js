const express = require('express');

//create app and configure
const app = express();
app.use(express.json());
app.use(timeStamp);
app.use(logger);


//middleware
function logger(req, res, next) {
  console.log(`********  PATH:  '${req.path}'     METHOD:  '${req.method}'     REQUEST TIME:  '${req.requestTime}'`);
  next()
}

function timeStamp(req, res, next) {
  req.requestTime = Date().toLocaleString();
  next();
}

function errorHandler(req, res, error) {
  res.status(406).send(error + '  :  Unacceptable request. Sorry. ..Not Sorry.')
}


//in-memory database.
let currentCategoryId = 5;
let currentProductId = 6;
const db = {
  categories: [
    {
      name: 'food',
      id: 1,
    },
    {
      name: 'hiking',
      id: 2
    },
    {
      name: 'skiing',
      id: 3
    },
    {
      name: 'programming',
      id: 4
    }
  ],

  products: [
    {
      name: 'apple',
      category: 4,
      id: 1
    },
    {
      name: 'bent chetler 118',
      category: 3,
      id: 2
    },
    {
      name: 'asolo ascent',
      category: 2,
      id: 3
    },
    {
      name: 'piza',
      category: 1,
      id: 4
    },
    {
      name: 'apple',
      category: 1,
      id: 5
    }
  ]
}

//constructor for data entry.
function Product(data) {
  this.id = currentProductId++;
  if (data.name) this.name = data.name || null;
  if (data.category) this.category = parseInt(data.category) || null;
}

function Category(data) {
  this.id = currentCategoryId++;
  this.name = data.name;
}

//functions area!

function postHandler(type, req, res) {
  //make sure that we dont have that category already, that it is a string, and that it is truthy.
  //big, blocky, ugly, error checking block that should be abstracted... 
  //todo: abstract this error checking block.
  let error;
  //if element with that name exists.
  if (db[type].filter(el => el.name === req.body.name).length !== 0) {
    const found = db[type].find(el => el.name === req.body.name);
    error = `Did you mean to look for: '{name:${found.name}, id: ${found.id}}'?`;
    errorHandler(req, res, error);

  //if the request name is not a string or is falsy.
  } else if (typeof req.body.name !== 'string' || !req.body.name) {
    error = `${type} name not specified or bad formatting`
    errorHandler(req, res, error);

  } else {
    // run through constructor it was meant to go through, push to db, send copy to 
    let insertObj = type === 'categories' ? new Category(req.body) : new Product(req.body);
    db[type].push(insertObj);
    res.status(201).json(insertObj);

  }

}

function putHandler(type, req, res) {
  if (req.params.id && (req.body.name || req.body.category)) {

    //find the element that the user wants, and update the parameters they specified.
    const found = db[type].find(el => el.id === parseInt(req.params.id));
    if (req.body.name) found.name = parseInt(req.body.name);
    if (req.body.category) found.category = parseInt(req.body.category);
    res.status(202).json(found);
  } else {
    let error = 'Cant update: id or name missing.'
    errorHandler(req, res, error)
  }
}

function deleteHandler(type, req, res) {
  const idParam = parseInt(req.params.id) || null;

  //if it exits, filter it out and reassign main array.
  if (db[type].find(cat => cat.id === idParam)) {
    let newList = new Array();
    newList = db[type].filter(el => el.id !== idParam);
    db[type] = newList;
  } else {
    errorHandler(req, res, `Couldn't find that category`)
  }
  res.status(200).json({});
}



//routes
app.get('/categories', (req, res) => {
  const responseObj = db.categories;
  res.status(200).json(responseObj)
})

app.post('/categories', (req, res) => {
  postHandler('categories', req, res);
})

//take in the new category name, assign it to the category with Id that matches params.
//this works because objects are passed by reference.
app.put('/categories/:id', (req, res) => {
  putHandler('categories', req, res);
})

app.delete('/categories/:id', (req, res) => {
  deleteHandler('categories', req, res);
})

app.get('/products', (req, res) => {
  const responseObj = db.products;
  res.status(200).json(responseObj);
})

app.post('/products', (req, res) => {
  postHandler('products', req, res);
})

app.put('/products/:id', (req, res) => {
  putHandler('products', req, res);
})

app.delete('/products/:id', (req, res) => {
  deleteHandler('products', req, res);
})

module.exports = {
  server: app,
  start: (port) => {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, console.log(`Listening to you on port ${PORT}`));
  }
}